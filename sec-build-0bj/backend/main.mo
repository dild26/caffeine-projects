import AccessControl "authorization/access-control";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

actor EthereumVisualSandbox {

  // Initialize the access control system
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside AccessControl.assignRole
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Management
  public type UserProfile = {
    name : Text;
    email : ?Text;
    preferences : ?Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can access profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Workspace and Custom Block Management
  transient let workspaceMap = OrderedMap.Make<Text>(Text.compare);
  transient let customBlockMap = OrderedMap.Make<Text>(Text.compare);

  var workspaces : OrderedMap.Map<Text, Workspace> = workspaceMap.empty();
  var customBlocks : OrderedMap.Map<Text, CustomBlock> = customBlockMap.empty();

  public type BlockPosition = {
    x : Int;
    y : Int;
  };

  public type BlockConfig = {
    id : Text;
    blockType : Text;
    position : BlockPosition;
    config : ?Text;
  };

  public type Connection = {
    fromBlockId : Text;
    fromPort : Text;
    toBlockId : Text;
    toPort : Text;
  };

  public type WorkspaceData = {
    blocks : [BlockConfig];
    connections : [Connection];
  };

  public type Workspace = {
    id : Text;
    name : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int;
    data : WorkspaceData;
    version : Nat;
    owner : Principal;
  };

  public type CustomBlock = {
    id : Text;
    name : Text;
    description : Text;
    blockType : Text;
    inputPorts : [Text];
    outputPorts : [Text];
    logic : Text;
    createdAt : Int;
    updatedAt : Int;
    version : Nat;
    owner : Principal;
  };

  // Helper function to check workspace ownership
  func isWorkspaceOwner(caller : Principal, workspaceId : Text) : Bool {
    switch (workspaceMap.get(workspaces, workspaceId)) {
      case (?workspace) {
        workspace.owner == caller or AccessControl.isAdmin(accessControlState, caller);
      };
      case null { false };
    };
  };

  // Helper function to check custom block ownership
  func isCustomBlockOwner(caller : Principal, blockId : Text) : Bool {
    switch (customBlockMap.get(customBlocks, blockId)) {
      case (?block) {
        block.owner == caller or AccessControl.isAdmin(accessControlState, caller);
      };
      case null { false };
    };
  };

  public shared ({ caller }) func saveWorkspace(id : Text, name : Text, description : Text, data : WorkspaceData, version : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save workspaces");
    };

    let now = Time.now();
    let workspace : Workspace = {
      id;
      name;
      description;
      createdAt = now;
      updatedAt = now;
      data;
      version;
      owner = caller;
    };
    workspaces := workspaceMap.put(workspaces, id, workspace);
  };

  public query ({ caller }) func loadWorkspace(id : Text) : async ?Workspace {
    // Allow guests to load workspaces for public browsing
    switch (workspaceMap.get(workspaces, id)) {
      case (?workspace) {
        // Users can only load their own workspaces, admins can load any
        if (AccessControl.hasPermission(accessControlState, caller, #user)) {
          if (workspace.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
            ?workspace;
          } else {
            Debug.trap("Unauthorized: Can only load your own workspaces");
          };
        } else {
          // Guests can view workspaces in read-only mode
          ?workspace;
        };
      };
      case null { null };
    };
  };

  public query ({ caller }) func listWorkspaces() : async [Workspace] {
    // Allow guests to list all workspaces for public browsing
    let allWorkspaces = Iter.toArray(workspaceMap.vals(workspaces));
    
    if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      // Authenticated users see only their own workspaces (or all if admin)
      if (AccessControl.isAdmin(accessControlState, caller)) {
        allWorkspaces;
      } else {
        Array.filter<Workspace>(allWorkspaces, func(w) { w.owner == caller });
      };
    } else {
      // Guests can see all workspaces for public browsing
      allWorkspaces;
    };
  };

  public shared ({ caller }) func deleteWorkspace(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete workspaces");
    };

    if (not isWorkspaceOwner(caller, id)) {
      Debug.trap("Unauthorized: Can only delete your own workspaces");
    };

    workspaces := workspaceMap.delete(workspaces, id);
  };

  public query ({ caller }) func getWorkspaceMetadata() : async [{
    id : Text;
    name : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int;
    version : Nat;
    owner : Principal;
  }] {
    // Allow guests to view workspace metadata for public browsing
    let allWorkspaces = Iter.toArray(workspaceMap.vals(workspaces));
    
    let filteredWorkspaces = if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      // Authenticated users see only their own workspaces (or all if admin)
      if (AccessControl.isAdmin(accessControlState, caller)) {
        allWorkspaces;
      } else {
        Array.filter<Workspace>(allWorkspaces, func(w) { w.owner == caller });
      };
    } else {
      // Guests can see all workspace metadata
      allWorkspaces;
    };

    Array.map<Workspace, {
      id : Text;
      name : Text;
      description : Text;
      createdAt : Int;
      updatedAt : Int;
      version : Nat;
      owner : Principal;
    }>(filteredWorkspaces, func(w) { 
      { 
        id = w.id; 
        name = w.name; 
        description = w.description; 
        createdAt = w.createdAt; 
        updatedAt = w.updatedAt; 
        version = w.version;
        owner = w.owner;
      } 
    });
  };

  public shared ({ caller }) func saveCustomBlock(id : Text, name : Text, description : Text, blockType : Text, inputPorts : [Text], outputPorts : [Text], logic : Text, version : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save custom blocks");
    };

    let now = Time.now();
    let customBlock : CustomBlock = {
      id;
      name;
      description;
      blockType;
      inputPorts;
      outputPorts;
      logic;
      createdAt = now;
      updatedAt = now;
      version;
      owner = caller;
    };
    customBlocks := customBlockMap.put(customBlocks, id, customBlock);
  };

  public query ({ caller }) func loadCustomBlock(id : Text) : async ?CustomBlock {
    // Allow guests to load custom blocks for public browsing
    switch (customBlockMap.get(customBlocks, id)) {
      case (?block) {
        if (AccessControl.hasPermission(accessControlState, caller, #user)) {
          // Authenticated users can only load their own blocks (or any if admin)
          if (block.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
            ?block;
          } else {
            Debug.trap("Unauthorized: Can only load your own custom blocks");
          };
        } else {
          // Guests can view custom blocks in read-only mode
          ?block;
        };
      };
      case null { null };
    };
  };

  public query ({ caller }) func listCustomBlocks() : async [CustomBlock] {
    // Allow guests to list all custom blocks for public browsing
    let allCustomBlocks = Iter.toArray(customBlockMap.vals(customBlocks));
    
    if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      // Authenticated users see only their own blocks (or all if admin)
      if (AccessControl.isAdmin(accessControlState, caller)) {
        allCustomBlocks;
      } else {
        Array.filter<CustomBlock>(allCustomBlocks, func(cb) { cb.owner == caller });
      };
    } else {
      // Guests can see all custom blocks for public browsing
      allCustomBlocks;
    };
  };

  public shared ({ caller }) func deleteCustomBlock(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete custom blocks");
    };

    if (not isCustomBlockOwner(caller, id)) {
      Debug.trap("Unauthorized: Can only delete your own custom blocks");
    };

    customBlocks := customBlockMap.delete(customBlocks, id);
  };

  public query ({ caller }) func getCustomBlockMetadata() : async [{
    id : Text;
    name : Text;
    description : Text;
    blockType : Text;
    createdAt : Int;
    updatedAt : Int;
    version : Nat;
    owner : Principal;
  }] {
    // Allow guests to view custom block metadata for public browsing
    let allCustomBlocks = Iter.toArray(customBlockMap.vals(customBlocks));
    
    let filteredBlocks = if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      // Authenticated users see only their own blocks (or all if admin)
      if (AccessControl.isAdmin(accessControlState, caller)) {
        allCustomBlocks;
      } else {
        Array.filter<CustomBlock>(allCustomBlocks, func(cb) { cb.owner == caller });
      };
    } else {
      // Guests can see all custom block metadata
      allCustomBlocks;
    };

    Array.map<CustomBlock, {
      id : Text;
      name : Text;
      description : Text;
      blockType : Text;
      createdAt : Int;
      updatedAt : Int;
      version : Nat;
      owner : Principal;
    }>(filteredBlocks, func(cb) { 
      { 
        id = cb.id; 
        name = cb.name; 
        description = cb.description; 
        blockType = cb.blockType; 
        createdAt = cb.createdAt; 
        updatedAt = cb.updatedAt; 
        version = cb.version;
        owner = cb.owner;
      } 
    });
  };

  public shared ({ caller }) func compareWorkspaces(id1 : Text, id2 : Text) : async {
    id1 : Text;
    id2 : Text;
    differences : [Text];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can compare workspaces");
    };

    switch (workspaceMap.get(workspaces, id1), workspaceMap.get(workspaces, id2)) {
      case (?ws1, ?ws2) {
        // Check ownership for both workspaces
        if ((ws1.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) or
            (ws2.owner != caller and not AccessControl.isAdmin(accessControlState, caller))) {
          Debug.trap("Unauthorized: Can only compare your own workspaces");
        };

        let differences = Array.tabulate<Text>(0, func _ { "" });
        {
          id1;
          id2;
          differences;
        };
      };
      case _ {
        Debug.trap("One or both workspaces not found");
      };
    };
  };

  public shared ({ caller }) func resolveWorkspaceConflict(id : Text, resolvedData : WorkspaceData, version : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can resolve workspace conflicts");
    };

    if (not isWorkspaceOwner(caller, id)) {
      Debug.trap("Unauthorized: Can only resolve conflicts for your own workspaces");
    };

    switch (workspaceMap.get(workspaces, id)) {
      case (?existingWorkspace) {
        let now = Time.now();
        let resolvedWorkspace : Workspace = {
          id = existingWorkspace.id;
          name = existingWorkspace.name;
          description = existingWorkspace.description;
          createdAt = existingWorkspace.createdAt;
          updatedAt = now;
          data = resolvedData;
          version;
          owner = existingWorkspace.owner;
        };
        workspaces := workspaceMap.put(workspaces, id, resolvedWorkspace);
      };
      case null {
        Debug.trap("Workspace not found");
      };
    };
  };

  public shared ({ caller }) func importWorkspace(id : Text, name : Text, description : Text, data : WorkspaceData, version : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can import workspaces");
    };

    let now = Time.now();
    let workspace : Workspace = {
      id;
      name;
      description;
      createdAt = now;
      updatedAt = now;
      data;
      version;
      owner = caller;
    };
    workspaces := workspaceMap.put(workspaces, id, workspace);
  };

  public query ({ caller }) func exportWorkspace(id : Text) : async ?Workspace {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can export workspaces");
    };

    switch (workspaceMap.get(workspaces, id)) {
      case (?workspace) {
        if (workspace.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?workspace;
        } else {
          Debug.trap("Unauthorized: Can only export your own workspaces");
        };
      };
      case null { null };
    };
  };

  public shared ({ caller }) func updateWorkspace(id : Text, data : WorkspaceData, version : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update workspaces");
    };

    if (not isWorkspaceOwner(caller, id)) {
      Debug.trap("Unauthorized: Can only update your own workspaces");
    };

    switch (workspaceMap.get(workspaces, id)) {
      case (?existingWorkspace) {
        let now = Time.now();
        let updatedWorkspace : Workspace = {
          id = existingWorkspace.id;
          name = existingWorkspace.name;
          description = existingWorkspace.description;
          createdAt = existingWorkspace.createdAt;
          updatedAt = now;
          data;
          version;
          owner = existingWorkspace.owner;
        };
        workspaces := workspaceMap.put(workspaces, id, updatedWorkspace);
      };
      case null {
        Debug.trap("Workspace not found");
      };
    };
  };

  public shared ({ caller }) func updateCustomBlock(id : Text, name : Text, description : Text, blockType : Text, inputPorts : [Text], outputPorts : [Text], logic : Text, version : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update custom blocks");
    };

    if (not isCustomBlockOwner(caller, id)) {
      Debug.trap("Unauthorized: Can only update your own custom blocks");
    };

    switch (customBlockMap.get(customBlocks, id)) {
      case (?existingBlock) {
        let now = Time.now();
        let updatedBlock : CustomBlock = {
          id = existingBlock.id;
          name;
          description;
          blockType;
          inputPorts;
          outputPorts;
          logic;
          createdAt = existingBlock.createdAt;
          updatedAt = now;
          version;
          owner = existingBlock.owner;
        };
        customBlocks := customBlockMap.put(customBlocks, id, updatedBlock);
      };
      case null {
        Debug.trap("Custom block not found");
      };
    };
  };

  // Stripe Payment Integration Types
  public type SubscriptionPlan = {
    #basic;    // $9/month
    #pro;      // $45/month
    #enterprise; // $99/month
  };

  public type UserSubscription = {
    plan : SubscriptionPlan;
    executionQuota : Nat;
    executionsUsed : Nat;
    subscriptionId : Text;
    startDate : Int;
    endDate : Int;
    active : Bool;
  };

  public type PaymentTransaction = {
    id : Text;
    userId : Principal;
    amount : Nat;
    transactionType : {
      #subscription : SubscriptionPlan;
      #executionBatch : Nat;
      #refund;
      #upgrade;
      #downgrade;
    };
    timestamp : Int;
    stripeSessionId : Text;
    status : Text;
  };

  public type ExecutionRecord = {
    userId : Principal;
    timestamp : Int;
    workspaceId : Text;
  };

  // Stripe Payment State
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;
  var userSubscriptions = principalMap.empty<UserSubscription>();
  transient let transactionMap = OrderedMap.Make<Text>(Text.compare);
  var paymentTransactions : OrderedMap.Map<Text, PaymentTransaction> = transactionMap.empty();
  var executionRecords : [ExecutionRecord] = [];

  // Stripe Configuration (Admin-only)
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Debug.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  // Subscription Management (User-only)
  public query ({ caller }) func getCallerSubscription() : async ?UserSubscription {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view subscriptions");
    };
    principalMap.get(userSubscriptions, caller);
  };

  public query ({ caller }) func getUserSubscription(user : Principal) : async ?UserSubscription {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view other users' subscriptions");
    };
    principalMap.get(userSubscriptions, user);
  };

  func updateUserSubscription(user : Principal, subscription : UserSubscription) {
    userSubscriptions := principalMap.put(userSubscriptions, user, subscription);
  };

  // Execution Tracking (User-only, Admin bypass)
  public shared ({ caller }) func trackExecution(workspaceId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can execute workspaces");
    };

    // Admin users bypass quota checks but still track for analytics
    if (AccessControl.isAdmin(accessControlState, caller)) {
      let record : ExecutionRecord = {
        userId = caller;
        timestamp = Time.now();
        workspaceId;
      };
      executionRecords := Array.append(executionRecords, [record]);
      return true;
    };

    // Check user subscription and quota
    switch (principalMap.get(userSubscriptions, caller)) {
      case (?subscription) {
        if (not subscription.active) {
          Debug.trap("Subscription inactive: Please renew your subscription");
        };
        if (subscription.executionsUsed >= subscription.executionQuota) {
          Debug.trap("Execution quota exceeded: Please purchase more executions or upgrade your plan");
        };

        // Update execution count
        let updatedSubscription : UserSubscription = {
          plan = subscription.plan;
          executionQuota = subscription.executionQuota;
          executionsUsed = subscription.executionsUsed + 1;
          subscriptionId = subscription.subscriptionId;
          startDate = subscription.startDate;
          endDate = subscription.endDate;
          active = subscription.active;
        };
        updateUserSubscription(caller, updatedSubscription);

        // Record execution for analytics
        let record : ExecutionRecord = {
          userId = caller;
          timestamp = Time.now();
          workspaceId;
        };
        executionRecords := Array.append(executionRecords, [record]);
        true;
      };
      case null {
        Debug.trap("No active subscription: Please subscribe to execute workspaces");
      };
    };
  };

  // Checkout Session Creation (User-only)
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Session Status (User-only for own sessions, Admin for all)
  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can check session status");
    };
    // Additional ownership check could be added here if session tracking is implemented
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // Payment Validation and Entitlement Update (Admin-only, typically called by webhook handler)
  public shared ({ caller }) func validatePaymentAndUpdateEntitlement(
    sessionId : Text,
    userId : Principal,
    plan : SubscriptionPlan,
    executionQuota : Nat
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can validate payments");
    };

    let now = Time.now();
    let oneMonth : Int = 30 * 24 * 60 * 60 * 1_000_000_000; // 30 days in nanoseconds

    let subscription : UserSubscription = {
      plan;
      executionQuota;
      executionsUsed = 0;
      subscriptionId = sessionId;
      startDate = now;
      endDate = now + oneMonth;
      active = true;
    };
    updateUserSubscription(userId, subscription);

    // Log transaction
    let transaction : PaymentTransaction = {
      id = sessionId;
      userId;
      amount = switch (plan) {
        case (#basic) { 9 };
        case (#pro) { 45 };
        case (#enterprise) { 99 };
      };
      transactionType = #subscription(plan);
      timestamp = now;
      stripeSessionId = sessionId;
      status = "completed";
    };
    paymentTransactions := transactionMap.put(paymentTransactions, sessionId, transaction);
  };

  // Purchase Execution Batch (Admin-only for validation)
  public shared ({ caller }) func purchaseExecutionBatch(
    sessionId : Text,
    userId : Principal,
    batchSize : Nat
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can process execution batch purchases");
    };

    switch (principalMap.get(userSubscriptions, userId)) {
      case (?subscription) {
        let updatedSubscription : UserSubscription = {
          plan = subscription.plan;
          executionQuota = subscription.executionQuota + batchSize;
          executionsUsed = subscription.executionsUsed;
          subscriptionId = subscription.subscriptionId;
          startDate = subscription.startDate;
          endDate = subscription.endDate;
          active = subscription.active;
        };
        updateUserSubscription(userId, updatedSubscription);

        // Log transaction
        let transaction : PaymentTransaction = {
          id = sessionId;
          userId;
          amount = batchSize; // Simplified, should calculate based on batch pricing
          transactionType = #executionBatch(batchSize);
          timestamp = Time.now();
          stripeSessionId = sessionId;
          status = "completed";
        };
        paymentTransactions := transactionMap.put(paymentTransactions, sessionId, transaction);
      };
      case null {
        Debug.trap("User has no subscription");
      };
    };
  };

  // Payment History (User for own, Admin for all)
  public query ({ caller }) func getCallerPaymentHistory() : async [PaymentTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view payment history");
    };

    let allTransactions = Iter.toArray(transactionMap.vals(paymentTransactions));
    Array.filter<PaymentTransaction>(allTransactions, func(t) { t.userId == caller });
  };

  public query ({ caller }) func getUserPaymentHistory(user : Principal) : async [PaymentTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view other users' payment history");
    };

    let allTransactions = Iter.toArray(transactionMap.vals(paymentTransactions));
    Array.filter<PaymentTransaction>(allTransactions, func(t) { t.userId == user });
  };

  // Subscription Management Operations (Admin-only)
  public shared ({ caller }) func cancelSubscription(userId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can cancel subscriptions");
    };

    switch (principalMap.get(userSubscriptions, userId)) {
      case (?subscription) {
        let cancelledSubscription : UserSubscription = {
          plan = subscription.plan;
          executionQuota = subscription.executionQuota;
          executionsUsed = subscription.executionsUsed;
          subscriptionId = subscription.subscriptionId;
          startDate = subscription.startDate;
          endDate = subscription.endDate;
          active = false;
        };
        updateUserSubscription(userId, cancelledSubscription);
      };
      case null {
        Debug.trap("User has no subscription to cancel");
      };
    };
  };

  public shared ({ caller }) func upgradeSubscription(
    userId : Principal,
    newPlan : SubscriptionPlan,
    newQuota : Nat
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can upgrade subscriptions");
    };

    switch (principalMap.get(userSubscriptions, userId)) {
      case (?subscription) {
        let upgradedSubscription : UserSubscription = {
          plan = newPlan;
          executionQuota = newQuota;
          executionsUsed = subscription.executionsUsed;
          subscriptionId = subscription.subscriptionId;
          startDate = subscription.startDate;
          endDate = subscription.endDate;
          active = subscription.active;
        };
        updateUserSubscription(userId, upgradedSubscription);
      };
      case null {
        Debug.trap("User has no subscription to upgrade");
      };
    };
  };

  // Admin Analytics (Admin-only)
  public query ({ caller }) func getAllPaymentTransactions() : async [PaymentTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all payment transactions");
    };
    Iter.toArray(transactionMap.vals(paymentTransactions));
  };

  public query ({ caller }) func getAllUserSubscriptions() : async [(Principal, UserSubscription)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all user subscriptions");
    };
    Iter.toArray(principalMap.entries(userSubscriptions));
  };

  public query ({ caller }) func getExecutionAnalytics() : async {
    totalExecutions : Nat;
    executionsByUser : [(Principal, Nat)];
    recentExecutions : [ExecutionRecord];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view execution analytics");
    };

    // Count executions by user
    var userExecutionCounts : [(Principal, Nat)] = [];
    for (record in executionRecords.vals()) {
      // Simple aggregation (could be optimized with a map)
      let found = Array.find<(Principal, Nat)>(userExecutionCounts, func(entry) {
        entry.0 == record.userId;
      });
      switch (found) {
        case (?existing) {
          userExecutionCounts := Array.map<(Principal, Nat), (Principal, Nat)>(
            userExecutionCounts,
            func(entry) {
              if (entry.0 == record.userId) {
                (entry.0, entry.1 + 1);
              } else {
                entry;
              };
            }
          );
        };
        case null {
          userExecutionCounts := Array.append(userExecutionCounts, [(record.userId, 1)]);
        };
      };
    };

    {
      totalExecutions = executionRecords.size();
      executionsByUser = userExecutionCounts;
      recentExecutions = if (executionRecords.size() > 100) {
        Array.subArray(executionRecords, Int.abs(executionRecords.size() - 100), 100);
      } else {
        executionRecords;
      };
    };
  };

  // CLI Command Management
  public type CLICommand = {
    command : Text;
    timestamp : Int;
    userId : Principal;
  };

  public type CLICommandBookmark = {
    id : Text;
    command : Text;
    description : Text;
    createdAt : Int;
    userId : Principal;
  };

  var cliCommands : [CLICommand] = [];
  var cliBookmarks : [CLICommandBookmark] = [];

  // Save CLI Command (User-only)
  public shared ({ caller }) func saveCLICommand(command : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save CLI commands");
    };

    let cliCommand : CLICommand = {
      command;
      timestamp = Time.now();
      userId = caller;
    };
    cliCommands := Array.append(cliCommands, [cliCommand]);
  };

  // Get CLI Command History (User for own, Admin for all)
  public query ({ caller }) func getCLICommandHistory() : async [CLICommand] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view CLI command history");
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      cliCommands;
    } else {
      Array.filter<CLICommand>(cliCommands, func(cmd) { cmd.userId == caller });
    };
  };

  // Save CLI Command Bookmark (User-only)
  public shared ({ caller }) func saveCLICommandBookmark(command : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save CLI command bookmarks");
    };

    let bookmark : CLICommandBookmark = {
      id = Text.concat(command, Int.toText(Time.now()));
      command;
      description;
      createdAt = Time.now();
      userId = caller;
    };
    cliBookmarks := Array.append(cliBookmarks, [bookmark]);
  };

  // Get CLI Command Bookmarks (User for own, Admin for all)
  public query ({ caller }) func getCLICommandBookmarks() : async [CLICommandBookmark] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view CLI command bookmarks");
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      cliBookmarks;
    } else {
      Array.filter<CLICommandBookmark>(cliBookmarks, func(bm) { bm.userId == caller });
    };
  };

  // Delete CLI Command Bookmark (User-only)
  public shared ({ caller }) func deleteCLICommandBookmark(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete CLI command bookmarks");
    };

    cliBookmarks := Array.filter<CLICommandBookmark>(cliBookmarks, func(bm) {
      if (bm.id == id) {
        if (bm.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only delete your own bookmarks");
        };
        false;
      } else {
        true;
      };
    });
  };

  // Admin Analytics for CLI Commands (Admin-only)
  public query ({ caller }) func getCLIAnalytics() : async {
    totalCommands : Nat;
    commandsByUser : [(Principal, Nat)];
    recentCommands : [CLICommand];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view CLI analytics");
    };

    // Count commands by user
    var userCommandCounts : [(Principal, Nat)] = [];
    for (cmd in cliCommands.vals()) {
      let found = Array.find<(Principal, Nat)>(userCommandCounts, func(entry) {
        entry.0 == cmd.userId;
      });
      switch (found) {
        case (?existing) {
          userCommandCounts := Array.map<(Principal, Nat), (Principal, Nat)>(
            userCommandCounts,
            func(entry) {
              if (entry.0 == cmd.userId) {
                (entry.0, entry.1 + 1);
              } else {
                entry;
              };
            }
          );
        };
        case null {
          userCommandCounts := Array.append(userCommandCounts, [(cmd.userId, 1)]);
        };
      };
    };

    {
      totalCommands = cliCommands.size();
      commandsByUser = userCommandCounts;
      recentCommands = if (cliCommands.size() > 100) {
        Array.subArray(cliCommands, Int.abs(cliCommands.size() - 100), 100);
      } else {
        cliCommands;
      };
    };
  };

  // New Sitemap Management System

  // 1. Auto-generated routes (original system, assumed empty for now)
  public type AutoRoute = {
    path : Text;
    // Additional fields as needed: name, metadata, etc.
  };
  var autoRoutes : [AutoRoute] = [];

  // 2. Admin-priority pages (new system)
  public type AdminPage = {
    slug : Text; // Using "slug" for admin-defined routes
    // Additional fields as needed: name, description, etc.
  };

  var adminPriorityPages : [AdminPage] = [
    // Updated Text comparison for strict equality and validation
    {
      slug = "about";
    },
    {
      slug = "admin";
    },
    {
      slug = "apps";
    },
    {
      slug = "angel-vc";
    },
    {
      slug = "blog";
    },
    {
      slug = "block";
    },
    {
      slug = "broadcast";
    },
    {
      slug = "compare";
    },
    {
      slug = "contact";
    },
    {
      slug = "dash";
    },
    {
      slug = "dex";
    },
    {
      slug = "e-com";
    },
    {
      slug = "faq";
    },
    {
      slug = "finance";
    },
    {
      slug = "fix";
    },
    {
      slug = "fixture";
    },
    {
      slug = "footstep";
    },
    {
      slug = "lang";
    },
    {
      slug = "leader";
    },
    {
      slug = "live";
    },
    {
      slug = "main";
    },
    {
      slug = "map";
    },
    {
      slug = "milestone";
    },
    {
      slug = "pages";
    },
    {
      slug = "payments";
    },
    {
      slug = "pros";
    },
    {
      slug = "rank";
    },
    {
      slug = "referral";
    },
    {
      slug = "remote";
    },
    {
      slug = "resource";
    },
    {
      slug = "routes";
    },
    {
      slug = "secure";
    },
    {
      slug = "sitemap";
    },
    {
      slug = "terms";
    },
    {
      slug = "trust";
    },
    {
      slug = "what";
    },
    {
      slug = "verifySig";
    },
    {
      slug = "when";
    },
    {
      slug = "where";
    },
    {
      slug = "who";
    },
    {
      slug = "why";
    },
    {
      slug = "ZKProof";
    },
  ];

  // 3. Controlled app routes (Secoinfi-App system)
  public type ControlledRoute = {
    path : Text;
    delegatedTo : Text; // Added field for delegation info
  };

  var controlledRoutes : [ControlledRoute] = [
    {
      path = "broadcast";
      delegatedTo = "Secoinfi-App";
    },
    {
      path = "remote";
      delegatedTo = "Secoinfi-App";
    },
    {
      path = "live";
      delegatedTo = "Secoinfi-App";
    },
  ];

  // 4. Page metadata (added functionality)
  public type PageMetadata = {
    page : Text; // Updated field name for consistency
    hash : Text;
    adminSignature : Text;
    timestamp : Int;
  };

  var pageMetadata : [PageMetadata] = [];

  // Function to add new admin priority page (admin-only)
  public shared ({ caller }) func addAdminPage(slug : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add pages");
    };

    // Validate slug (uniqueness, format, etc.)
    if (Text.contains(slug, #char ' ')) {
      Debug.trap("Slug must not contain spaces");
    };
    if (Text.contains(slug, #char '/')) {
      Debug.trap("Slug must not contain slashes");
    };

    // Check for duplicates across autoRoutes, adminPriorityPages, and controlledRoutes
    if (Array.find<AutoRoute>(autoRoutes, func(route) { route.path == slug }) != null or
        Array.find<AdminPage>(adminPriorityPages, func(page) { page.slug == slug }) != null or
        Array.find<ControlledRoute>(controlledRoutes, func(route) { route.path == slug }) != null) {
      Debug.trap("Route already exists");
    };

    // Add new page to adminPriorityPages
    adminPriorityPages := Array.append<AdminPage>(adminPriorityPages, [ { slug } ]);
  };

  // Function to get all admin priority pages (public)
  public query func getAdminPages() : async [AdminPage] {
    adminPriorityPages;
  };

  // Function to get all controlled routes (public)
  public query func getControlledRoutes() : async [ControlledRoute] {
    controlledRoutes;
  };

  // Function to get all routes (public)
  public query func getAllRoutes() : async {
    autoRoutes : [AutoRoute];
    adminPriorityPages : [AdminPage];
    controlledRoutes : [ControlledRoute];
    pageMetadata : [PageMetadata];
  } {
    {
      autoRoutes;
      adminPriorityPages;
      controlledRoutes;
      pageMetadata;
    };
  };

  // Function to get page metadata (public)
  public query func getPageMetadata() : async [PageMetadata] {
    pageMetadata;
  };

  // Function to add page metadata (admin-only)
  public shared ({ caller }) func addPageMetadata(page : Text, hash : Text, adminSignature : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add page metadata");
    };

    let metadata : PageMetadata = {
      page;
      hash;
      adminSignature;
      timestamp = Time.now();
    };
    pageMetadata := Array.append<PageMetadata>(pageMetadata, [metadata]);
  };

  // Function to resolve route (public)
  public query func resolveRoute(route : Text) : async {
    autoMatch : ?AutoRoute;
    adminPriorityMatch : ?AdminPage;
    controlledMatch : ?ControlledRoute;
    fallback : Text;
  } {
    let autoMatch = Array.find<AutoRoute>(autoRoutes, func(r) { r.path == route });
    let adminPriorityMatch = Array.find<AdminPage>(adminPriorityPages, func(p) { p.slug == route });
    let controlledMatch = Array.find<ControlledRoute>(controlledRoutes, func(r) { r.path == route });
    let fallback = route;

    // 4. Route not found in any list, return route as fallback (Text type)
    {
      autoMatch;
      adminPriorityMatch;
      controlledMatch;
      fallback;
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};


