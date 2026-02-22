// No backend changes needed. All access control and subscription logic is already correct.

import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Array "mo:core/Array";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor InfiLoop {
  let accessControlState = AccessControl.initState();
  let storage = Storage.new();
  include MixinStorage(storage);

  type DomainEntry = {
    domain : Text;
    source : Text;
    timestamp : Time.Time;
    isActive : Bool;
  };

  type URLTemplate = {
    id : Text;
    baseDomain : Text;
    pattern : Text;
    variables : [Text];
    createdBy : Principal;
    timestamp : Time.Time;
    isPinned : Bool;
    maxValue : Nat;
  };

  type IngestionLog = {
    id : Text;
    source : Text;
    status : Text;
    timestamp : Time.Time;
    processedCount : Nat;
    duplicateCount : Nat;
  };

  type ProvenanceRecord = {
    id : Text;
    dataHash : Text;
    timestamp : Time.Time;
    source : Text;
    updateType : Text;
  };

  type PageContent = {
    url : Text;
    content : Text;
    lastFetched : Time.Time;
    merkleHash : Text;
  };

  type ContactInfo = {
    name : Text;
    title : Text;
    email : Text;
    phone : Text;
    website : Text;
    address : Text;
    paypal : Text;
    upi : Text;
    eth : Text;
    socialLinks : [Text];
    verified : Bool;
  };

  type FeatureChecklist = {
    feature : Text;
    completed : Bool;
    adminVerified : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  type DynamicLink = {
    url : Text;
    displayText : Text;
    createdAt : Time.Time;
    expiresAt : Time.Time;
  };

  type SessionLinks = {
    links : [DynamicLink];
    createdAt : Time.Time;
    expiresAt : Time.Time;
    rows : Nat;
    columns : Nat;
    publisherId : Principal;
    isPublic : Bool;
    isPinned : Bool;
    merkleRoot : Text;
  };

  type PublisherStats = {
    publisherId : Principal;
    linksShared : Nat;
    backlinks : Nat;
    clicks : Nat;
    popularityScore : Nat;
    lastShared : Time.Time;
    avgSessionDuration : Nat;
    engagementScore : Nat;
    responseSpeed : Nat;
    uptime : Nat;
    bounceRate : Nat;
    httpErrors : Nat;
    rankingScore : Nat;
  };

  type Fixture = {
    id : Text;
    templateIds : [Text];
    merkleRoot : Text;
    createdAt : Time.Time;
    createdBy : Principal;
  };

  type PlanetaryPreview = {
    samples : [Text];
    totalCombinations : Nat;
    previewHash : Text;
    base62Level : Nat;
    warning : ?Text;
  };

  type PlanetaryPage = {
    pageNumber : Nat;
    totalPages : Nat;
    rows : [[Text]];
    totalCombinations : Nat;
    base62Level : Nat;
    warning : ?Text;
  };

  type PinnedPlanetaryPreview = {
    id : Text;
    preview : PlanetaryPreview;
    createdBy : Principal;
    timestamp : Time.Time;
    isPinned : Bool;
    merkleRoot : Text;
  };

  type ProgressBarData = {
    pattern : Text;
    currentValue : Nat;
    maxValue : Nat;
    percentage : Nat;
  };

  type GridCell = {
    value : Text;
    isEnabled : Bool;
  };

  type GridConfig = {
    id : Text;
    rows : Nat;
    columns : Nat;
    cells : [[GridCell]];
    formInputs : [GridCell];
    patternSettings : Text;
    createdBy : Principal;
    timestamp : Time.Time;
    isPinned : Bool;
  };

  type LinkGenerationResult = {
    links : [Text];
    pattern : Text;
    generatedAt : Time.Time;
  };

  type GridPreview = {
    id : Text;
    links : [Text];
    rows : Nat;
    columns : Nat;
    createdBy : Principal;
    timestamp : Time.Time;
    isPinned : Bool;
    merkleRoot : Text;
  };

  type RangeDimension = {
    start : Nat;
    end : Nat;
  };

  type MultiDimensionalRange = {
    dimensions : [RangeDimension];
    totalCombinations : Nat;
    maxRange : Nat;
  };

  type MultiDimensionalTemplate = {
    id : Text;
    baseUrl : Text;
    rangeInput : Text;
    multiRange : MultiDimensionalRange;
    createdBy : Principal;
    timestamp : Time.Time;
    isPinned : Bool;
  };

  type GenerationSession = {
    id : Text;
    templateId : Text;
    createdBy : Principal;
    startedAt : Time.Time;
    lastAccessedAt : Time.Time;
    currentPosition : Nat;
    isComplete : Bool;
  };

  type InstructionStats = {
    cycles_used : Nat;
    memory_used : Nat;
    calls_made : Nat;
  };

  type BulkDeleteResult = {
    urlTemplatesDeleted : Nat;
    multiDimensionalTemplatesDeleted : Nat;
    sessionLinksDeleted : Nat;
    gridPreviewsDeleted : Nat;
    planetaryPreviewsDeleted : Nat;
    totalDeleted : Nat;
    timestamp : Time.Time;
  };

  type SubscriptionStatus = {
    #active;
    #expired;
    #suspended;
    #cancelled;
  };

  type PaymentRecord = {
    id : Text;
    userId : Principal;
    amount : Nat;
    timestamp : Time.Time;
    expiresAt : Time.Time;
    verified : Bool;
  };

  type Subscription = {
    userId : Principal;
    status : SubscriptionStatus;
    createdAt : Time.Time;
    lastPayment : ?PaymentRecord;
    isVerified : Bool;
  };

  type MemoStatus = {
    #pending;
    #inProgress;
    #completed;
    #failed;
  };

  type Memo = {
    id : Text;
    content : Text;
    createdBy : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    status : MemoStatus;
    tags : [Text];
    isPublic : Bool;
  };

  type MemoChain = {
    id : Text;
    memos : [Memo];
    createdBy : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    isPublic : Bool;
  };

  type MemoRefreshEvent = {
    eventId : Text;
    timestamp : Time.Time;
    eventType : Text;
    affectedChainIds : [Text];
  };

  type HoverEvent = {
    target : Text;
    timestamp : Time.Time;
  };

  type ThemePreference = {
    theme : Text;
    lastUpdated : Time.Time;
  };

  // ============================================================================
  // IPCAMERA TYPES
  // ============================================================================

  type StreamProtocol = {
    #MJPEG;
    #HLS;
    #DASH;
    #RTSPWebRTC;
    #WebSocket;
  };

  type CameraStatus = {
    #online;
    #offline;
    #error;
    #unauthorized;
  };

  type IPCamera = {
    id : Text;
    name : Text;
    ipAddress : Text;
    port : Nat;
    protocol : StreamProtocol;
    username : Text;
    encryptedPassword : Text;
    createdBy : Principal;
    createdAt : Time.Time;
    lastAccessed : Time.Time;
    status : CameraStatus;
    isActive : Bool;
    streamUrl : Text;
    thumbnailUrl : ?Text;
  };

  type CameraAccessLog = {
    id : Text;
    cameraId : Text;
    userId : Principal;
    timestamp : Time.Time;
    action : Text;
    ipAddress : Text;
    userAgent : Text;
    success : Bool;
  };

  type StreamSession = {
    id : Text;
    cameraId : Text;
    userId : Principal;
    startedAt : Time.Time;
    lastActivity : Time.Time;
    expiresAt : Time.Time;
    isActive : Bool;
    bandwidth : Nat;
  };

  type APIKey = {
    id : Text;
    key : Text;
    userId : Principal;
    createdAt : Time.Time;
    expiresAt : Time.Time;
    isActive : Bool;
    permissions : [Text];
  };

  type RateLimitEntry = {
    userId : Principal;
    endpoint : Text;
    count : Nat;
    windowStart : Time.Time;
  };

  type AuditLogEntry = {
    id : Text;
    userId : Principal;
    action : Text;
    resource : Text;
    timestamp : Time.Time;
    success : Bool;
    details : Text;
  };

  var domains = Map.empty<Text, DomainEntry>();
  var urlTemplates = Map.empty<Text, URLTemplate>();
  var ingestionLogs = Map.empty<Text, IngestionLog>();
  var provenanceRecords = Map.empty<Text, ProvenanceRecord>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var pageContents = Map.empty<Text, PageContent>();
  var contactInfo : ?ContactInfo = null;
  var featureChecklist = Map.empty<Text, FeatureChecklist>();
  var sessionLinks = Map.empty<Text, SessionLinks>();
  var publisherStats = Map.empty<Text, PublisherStats>();
  var fixtures = Map.empty<Text, Fixture>();
  var pinnedPlanetaryPreviews = Map.empty<Text, PinnedPlanetaryPreview>();
  var gridConfigs = Map.empty<Text, GridConfig>();
  var gridPreviews = Map.empty<Text, GridPreview>();
  var multiDimensionalTemplates = Map.empty<Text, MultiDimensionalTemplate>();
  var generationSessions = Map.empty<Text, GenerationSession>();
  var instructionStats = Map.empty<Text, InstructionStats>();

  var subscriptions = Map.empty<Principal, Subscription>();
  var paymentRecords = Map.empty<Text, PaymentRecord>();

  var memoChains = Map.empty<Text, MemoChain>();
  var memos = Map.empty<Text, Memo>();
  var memoRefreshEvents = Map.empty<Text, MemoRefreshEvent>();
  var lastRefreshTimestamp : Time.Time = 0;

  var hoverEvents = Map.empty<Text, HoverEvent>();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  var themePreferences = Map.empty<Principal, ThemePreference>();

  // IPCamera storage
  var ipCameras = Map.empty<Text, IPCamera>();
  var cameraAccessLogs = Map.empty<Text, CameraAccessLog>();
  var streamSessions = Map.empty<Text, StreamSession>();
  var apiKeys = Map.empty<Text, APIKey>();
  var rateLimits = Map.empty<Text, RateLimitEntry>();
  var auditLogs = Map.empty<Text, AuditLogEntry>();
  var auditLogCount : Nat = 0;
  let MAX_AUDIT_LOGS : Nat = 1000;

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  func isVerifiedSubscriber(userId : Principal) : Bool {
    switch (subscriptions.get(userId)) {
      case (null) { false };
      case (?subscription) {
        if (not subscription.isVerified) { return false };

        switch (subscription.status) {
          case (#active) {
            switch (subscription.lastPayment) {
              case (null) { false };
              case (?payment) {
                let now = Time.now();
                payment.verified and now <= payment.expiresAt;
              };
            };
          };
          case (_) { false };
        };
      };
    };
  };

  func hasIPCameraAccess(caller : Principal) : Bool {
    let anon = Principal.fromText("2vxsx-fae");
    if (caller == anon) { return false };
    
    AccessControl.isAdmin(accessControlState, caller) or isVerifiedSubscriber(caller);
  };

  func addAuditLog(userId : Principal, action : Text, resource : Text, success : Bool, details : Text) : () {
    let timestamp = Time.now();
    let id = "audit-" # debug_show (timestamp) # "-" # userId.toText();

    let entry : AuditLogEntry = {
      id;
      userId;
      action;
      resource;
      timestamp;
      success;
      details;
    };

    auditLogs.add(id, entry);
    auditLogCount += 1;

    // Keep only last 1000 entries
    if (auditLogCount > MAX_AUDIT_LOGS) {
      var oldestId : ?Text = null;
      var oldestTime : Time.Time = Time.now();
      
      for ((logId, log) in auditLogs.entries()) {
        if (log.timestamp < oldestTime) {
          oldestTime := log.timestamp;
          oldestId := ?logId;
        };
      };

      switch (oldestId) {
        case (?id) { 
          auditLogs.remove(id);
          auditLogCount -= 1;
        };
        case (null) {};
      };
    };
  };

  func checkRateLimit(userId : Principal, endpoint : Text, maxRequests : Nat, windowSeconds : Nat) : Bool {
    let now = Time.now();
    let key = userId.toText() # "-" # endpoint;
    let windowNanos : Int = windowSeconds * 1_000_000_000;

    switch (rateLimits.get(key)) {
      case (null) {
        let entry : RateLimitEntry = {
          userId;
          endpoint;
          count = 1;
          windowStart = now;
        };
        rateLimits.add(key, entry);
        true;
      };
      case (?entry) {
        if (now - entry.windowStart > windowNanos) {
          // New window
          let newEntry : RateLimitEntry = {
            userId;
            endpoint;
            count = 1;
            windowStart = now;
          };
          rateLimits.add(key, newEntry);
          true;
        } else {
          // Within window
          if (entry.count >= maxRequests) {
            false;
          } else {
            let updatedEntry : RateLimitEntry = {
              userId = entry.userId;
              endpoint = entry.endpoint;
              count = entry.count + 1;
              windowStart = entry.windowStart;
            };
            rateLimits.add(key, updatedEntry);
            true;
          };
        };
      };
    };
  };

  // ============================================================================
  // THEME PREFERENCE FUNCTIONS
  // ============================================================================

  public shared ({ caller }) func setThemePreference(theme : Text) : async () {
    let timestamp = Time.now();
    let preference : ThemePreference = {
      theme;
      lastUpdated = timestamp;
    };
    themePreferences.add(caller, preference);
  };

  public query ({ caller }) func getThemePreference() : async Text {
    switch (themePreferences.get(caller)) {
      case (null) { "light" };
      case (?preference) { preference.theme };
    };
  };

  public query func getThemePreferenceForUser(user : Principal) : async Text {
    switch (themePreferences.get(user)) {
      case (null) { "light" };
      case (?preference) { preference.theme };
    };
  };

  public query func getAllThemePreferences() : async [(Principal, ThemePreference)] {
    themePreferences.toArray();
  };

  // ============================================================================
  // STRIPE PAYMENT INTEGRATION
  // ============================================================================

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ============================================================================
  // ACCESS CONTROL FUNCTIONS
  // ============================================================================

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // ============================================================================
  // PAGE ACCESS CONTROL FUNCTIONS
  // ============================================================================

  public query ({ caller }) func canAccessAdminPages() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin);
  };

  public query ({ caller }) func canAccessFeaturesPage() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin);
  };

  // ============================================================================
  // SUBSCRIPTION & PAYMENT MANAGEMENT FOR /gods-eye-net AND /advanced-gods-eye
  // ============================================================================

  public shared ({ caller }) func createSubscription(userId : Principal) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create subscriptions");
    };

    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only create subscription for yourself");
    };

    let timestamp = Time.now();
    let subscriptionId = "sub-" # debug_show (timestamp) # "-" # userId.toText();

    let subscription : Subscription = {
      userId;
      status = #active;
      createdAt = timestamp;
      lastPayment = null;
      isVerified = false;
    };

    subscriptions.add(userId, subscription);

    subscriptionId;
  };

  public shared ({ caller }) func verifySubscription(userId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify subscriptions");
    };

    switch (subscriptions.get(userId)) {
      case (null) { Runtime.trap("Subscription not found") };
      case (?subscription) {
        let updatedSubscription : Subscription = {
          userId = subscription.userId;
          status = subscription.status;
          createdAt = subscription.createdAt;
          lastPayment = subscription.lastPayment;
          isVerified = true;
        };
        subscriptions.add(userId, updatedSubscription);
      };
    };
  };

  public shared ({ caller }) func recordPayment(userId : Principal, amount : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record payments");
    };

    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only record payment for yourself");
    };

    if (amount != 1) {
      Runtime.trap("Invalid payment amount: Must be exactly $0.01 (1 cent)");
    };

    let timestamp = Time.now();
    let oneHourInNanos : Int = 3_600_000_000_000;
    let expiresAt = timestamp + oneHourInNanos;
    let paymentId = "pay-" # debug_show (timestamp) # "-" # userId.toText();

    let payment : PaymentRecord = {
      id = paymentId;
      userId;
      amount;
      timestamp;
      expiresAt;
      verified = true;
    };

    paymentRecords.add(paymentId, payment);

    switch (subscriptions.get(userId)) {
      case (null) {
        let subscription : Subscription = {
          userId;
          status = #active;
          createdAt = timestamp;
          lastPayment = ?payment;
          isVerified = false;
        };
        subscriptions.add(userId, subscription);
      };
      case (?subscription) {
        let updatedSubscription : Subscription = {
          userId = subscription.userId;
          status = #active;
          createdAt = subscription.createdAt;
          lastPayment = ?payment;
          isVerified = subscription.isVerified;
        };
        subscriptions.add(userId, updatedSubscription);
      };
    };

    paymentId;
  };

  public shared ({ caller }) func checkGodsEyeNetAccess() : async {
    hasAccess : Bool;
    reason : Text;
  } {
    let anon = Principal.fromText("2vxsx-fae");
    if (caller == anon) {
      return {
        hasAccess = false;
        reason = "Authentication required. Please log in.";
      };
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      return {
        hasAccess = true;
        reason = "Admin access granted";
      };
    };

    if (isVerifiedSubscriber(caller)) {
      return {
        hasAccess = true;
        reason = "Verified subscriber with valid payment";
      };
    };

    switch (subscriptions.get(caller)) {
      case (null) {
        return {
          hasAccess = false;
          reason = "No subscription found. Please subscribe to access this content.";
        };
      };
      case (?subscription) {
        if (not subscription.isVerified) {
          return {
            hasAccess = false;
            reason = "Subscription pending verification. Please contact admin.";
          };
        };

        switch (subscription.lastPayment) {
          case (null) {
            return {
              hasAccess = false;
              reason = "No payment recorded. Please pay $0.01 for hourly access.";
            };
          };
          case (?payment) {
            let now = Time.now();
            if (now > payment.expiresAt) {
              return {
                hasAccess = false;
                reason = "Payment expired. Please pay $0.01 to renew hourly access.";
              };
            } else {
              return {
                hasAccess = false;
                reason = "Payment verification failed. Please contact support.";
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func checkAdvancedGodsEyeAccess() : async {
    hasAccess : Bool;
    reason : Text;
  } {
    await checkGodsEyeNetAccess();
  };

  public query ({ caller }) func getSubscriptionStatus(userId : Principal) : async ?Subscription {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own subscription");
    };

    subscriptions.get(userId);
  };

  public query ({ caller }) func getPaymentHistory(userId : Principal) : async [PaymentRecord] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own payment history");
    };

    var payments = List.empty<PaymentRecord>();
    for ((_, payment) in paymentRecords.entries()) {
      if (payment.userId == userId) {
        payments.add(payment);
      };
    };

    let paymentsArray = payments.toArray();
    paymentsArray.sort(
      func(a, b) {
        if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) {
          #greater;
        } else { #equal };
      }
    );
  };

  public query ({ caller }) func getAllSubscriptions() : async [Subscription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all subscriptions");
    };

    var subs = List.empty<Subscription>();
    for ((_, subscription) in subscriptions.entries()) {
      subs.add(subscription);
    };

    subs.toArray();
  };

  public shared ({ caller }) func cancelSubscription(userId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can cancel subscriptions");
    };

    switch (subscriptions.get(userId)) {
      case (null) { Runtime.trap("Subscription not found") };
      case (?subscription) {
        let updatedSubscription : Subscription = {
          userId = subscription.userId;
          status = #cancelled;
          createdAt = subscription.createdAt;
          lastPayment = subscription.lastPayment;
          isVerified = subscription.isVerified;
        };
        subscriptions.add(userId, updatedSubscription);
      };
    };
  };

  // ============================================================================
  // IPCAMERA ACCESS CONTROL FUNCTIONS
  // ============================================================================

  public shared ({ caller }) func checkIPCameraAccess() : async {
    hasAccess : Bool;
    reason : Text;
  } {
    let anon = Principal.fromText("2vxsx-fae");
    if (caller == anon) {
      addAuditLog(caller, "ACCESS_CHECK", "/IPCams-IPv4", false, "Anonymous access denied");
      return {
        hasAccess = false;
        reason = "Authentication required. Please log in.";
      };
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      addAuditLog(caller, "ACCESS_CHECK", "/IPCams-IPv4", true, "Admin access granted");
      return {
        hasAccess = true;
        reason = "Admin access granted";
      };
    };

    if (isVerifiedSubscriber(caller)) {
      addAuditLog(caller, "ACCESS_CHECK", "/IPCams-IPv4", true, "Verified subscriber access granted");
      return {
        hasAccess = true;
        reason = "Verified subscriber with valid payment";
      };
    };

    switch (subscriptions.get(caller)) {
      case (null) {
        addAuditLog(caller, "ACCESS_CHECK", "/IPCams-IPv4", false, "No subscription found");
        return {
          hasAccess = false;
          reason = "No subscription found. Please subscribe to access this content.";
        };
      };
      case (?subscription) {
        if (not subscription.isVerified) {
          addAuditLog(caller, "ACCESS_CHECK", "/IPCams-IPv4", false, "Subscription not verified");
          return {
            hasAccess = false;
            reason = "Subscription pending verification. Please contact admin.";
          };
        };

        switch (subscription.lastPayment) {
          case (null) {
            addAuditLog(caller, "ACCESS_CHECK", "/IPCams-IPv4", false, "No payment recorded");
            return {
              hasAccess = false;
              reason = "No payment recorded. Please pay $0.01 for hourly access.";
            };
          };
          case (?payment) {
            let now = Time.now();
            if (now > payment.expiresAt) {
              addAuditLog(caller, "ACCESS_CHECK", "/IPCams-IPv4", false, "Payment expired");
              return {
                hasAccess = false;
                reason = "Payment expired. Please pay $0.01 to renew hourly access.";
              };
            } else {
              addAuditLog(caller, "ACCESS_CHECK", "/IPCams-IPv4", false, "Payment verification failed");
              return {
                hasAccess = false;
                reason = "Payment verification failed. Please contact support.";
              };
            };
          };
        };
      };
    };
  };

  // ============================================================================
  // IPCAMERA MANAGEMENT FUNCTIONS (Admin or Verified Subscriber Access)
  // ============================================================================

  public shared ({ caller }) func registerIPCamera(
    name : Text,
    ipAddress : Text,
    port : Nat,
    protocol : StreamProtocol,
    username : Text,
    encryptedPassword : Text,
    streamUrl : Text,
    thumbnailUrl : ?Text
  ) : async Text {
    if (not hasIPCameraAccess(caller)) {
      addAuditLog(caller, "REGISTER_CAMERA", "IPCamera", false, "Access denied");
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    if (not checkRateLimit(caller, "registerIPCamera", 10, 60)) {
      addAuditLog(caller, "REGISTER_CAMERA", "IPCamera", false, "Rate limit exceeded");
      Runtime.trap("Rate limit exceeded: Maximum 10 camera registrations per minute");
    };

    let timestamp = Time.now();
    let cameraId = "cam-" # debug_show (timestamp) # "-" # caller.toText();

    let camera : IPCamera = {
      id = cameraId;
      name;
      ipAddress;
      port;
      protocol;
      username;
      encryptedPassword;
      createdBy = caller;
      createdAt = timestamp;
      lastAccessed = timestamp;
      status = #offline;
      isActive = true;
      streamUrl;
      thumbnailUrl;
    };

    ipCameras.add(cameraId, camera);
    addAuditLog(caller, "REGISTER_CAMERA", cameraId, true, "Camera registered: " # name);

    cameraId;
  };

  public shared ({ caller }) func updateIPCamera(
    cameraId : Text,
    name : Text,
    ipAddress : Text,
    port : Nat,
    protocol : StreamProtocol,
    username : Text,
    encryptedPassword : Text,
    streamUrl : Text,
    thumbnailUrl : ?Text,
    status : CameraStatus,
    isActive : Bool
  ) : async () {
    if (not hasIPCameraAccess(caller)) {
      addAuditLog(caller, "UPDATE_CAMERA", cameraId, false, "Access denied");
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    switch (ipCameras.get(cameraId)) {
      case (null) {
        addAuditLog(caller, "UPDATE_CAMERA", cameraId, false, "Camera not found");
        Runtime.trap("Camera not found");
      };
      case (?camera) {
        if (camera.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          addAuditLog(caller, "UPDATE_CAMERA", cameraId, false, "Not camera owner");
          Runtime.trap("Unauthorized: Can only update your own cameras");
        };

        let updatedCamera : IPCamera = {
          id = camera.id;
          name;
          ipAddress;
          port;
          protocol;
          username;
          encryptedPassword;
          createdBy = camera.createdBy;
          createdAt = camera.createdAt;
          lastAccessed = Time.now();
          status;
          isActive;
          streamUrl;
          thumbnailUrl;
        };

        ipCameras.add(cameraId, updatedCamera);
        addAuditLog(caller, "UPDATE_CAMERA", cameraId, true, "Camera updated: " # name);
      };
    };
  };

  public shared ({ caller }) func deleteIPCamera(cameraId : Text) : async () {
    if (not hasIPCameraAccess(caller)) {
      addAuditLog(caller, "DELETE_CAMERA", cameraId, false, "Access denied");
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    switch (ipCameras.get(cameraId)) {
      case (null) {
        addAuditLog(caller, "DELETE_CAMERA", cameraId, false, "Camera not found");
        Runtime.trap("Camera not found");
      };
      case (?camera) {
        if (camera.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          addAuditLog(caller, "DELETE_CAMERA", cameraId, false, "Not camera owner");
          Runtime.trap("Unauthorized: Can only delete your own cameras");
        };

        ipCameras.remove(cameraId);
        addAuditLog(caller, "DELETE_CAMERA", cameraId, true, "Camera deleted: " # camera.name);
      };
    };
  };

  public query ({ caller }) func getIPCamera(cameraId : Text) : async ?IPCamera {
    if (not hasIPCameraAccess(caller)) {
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    switch (ipCameras.get(cameraId)) {
      case (null) { null };
      case (?camera) {
        if (camera.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own cameras");
        };
        ?camera;
      };
    };
  };

  public query ({ caller }) func listIPCameras() : async [IPCamera] {
    if (not hasIPCameraAccess(caller)) {
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    var cameras = List.empty<IPCamera>();
    for ((_, camera) in ipCameras.entries()) {
      if (camera.createdBy == caller or AccessControl.isAdmin(accessControlState, caller)) {
        cameras.add(camera);
      };
    };

    cameras.toArray();
  };

  public query ({ caller }) func getAllIPCameras() : async [IPCamera] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all cameras");
    };

    var cameras = List.empty<IPCamera>();
    for ((_, camera) in ipCameras.entries()) {
      cameras.add(camera);
    };

    cameras.toArray();
  };

  // ============================================================================
  // STREAM SESSION MANAGEMENT (Admin or Verified Subscriber Access)
  // ============================================================================

  public shared ({ caller }) func createStreamSession(cameraId : Text, bandwidth : Nat) : async Text {
    if (not hasIPCameraAccess(caller)) {
      addAuditLog(caller, "CREATE_STREAM", cameraId, false, "Access denied");
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    if (not checkRateLimit(caller, "createStreamSession", 20, 60)) {
      addAuditLog(caller, "CREATE_STREAM", cameraId, false, "Rate limit exceeded");
      Runtime.trap("Rate limit exceeded: Maximum 20 stream sessions per minute");
    };

    switch (ipCameras.get(cameraId)) {
      case (null) {
        addAuditLog(caller, "CREATE_STREAM", cameraId, false, "Camera not found");
        Runtime.trap("Camera not found");
      };
      case (?camera) {
        if (camera.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          addAuditLog(caller, "CREATE_STREAM", cameraId, false, "Not camera owner");
          Runtime.trap("Unauthorized: Can only stream your own cameras");
        };

        let timestamp = Time.now();
        let oneHourInNanos : Int = 3_600_000_000_000;
        let expiresAt = timestamp + oneHourInNanos;
        let sessionId = "stream-" # debug_show (timestamp) # "-" # caller.toText();

        let session : StreamSession = {
          id = sessionId;
          cameraId;
          userId = caller;
          startedAt = timestamp;
          lastActivity = timestamp;
          expiresAt;
          isActive = true;
          bandwidth;
        };

        streamSessions.add(sessionId, session);
        addAuditLog(caller, "CREATE_STREAM", cameraId, true, "Stream session created: " # sessionId);

        sessionId;
      };
    };
  };

  public shared ({ caller }) func endStreamSession(sessionId : Text) : async () {
    if (not hasIPCameraAccess(caller)) {
      addAuditLog(caller, "END_STREAM", sessionId, false, "Access denied");
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    switch (streamSessions.get(sessionId)) {
      case (null) {
        addAuditLog(caller, "END_STREAM", sessionId, false, "Session not found");
        Runtime.trap("Stream session not found");
      };
      case (?session) {
        if (session.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          addAuditLog(caller, "END_STREAM", sessionId, false, "Not session owner");
          Runtime.trap("Unauthorized: Can only end your own stream sessions");
        };

        let updatedSession : StreamSession = {
          id = session.id;
          cameraId = session.cameraId;
          userId = session.userId;
          startedAt = session.startedAt;
          lastActivity = Time.now();
          expiresAt = session.expiresAt;
          isActive = false;
          bandwidth = session.bandwidth;
        };

        streamSessions.add(sessionId, updatedSession);
        addAuditLog(caller, "END_STREAM", sessionId, true, "Stream session ended");
      };
    };
  };

  public query ({ caller }) func getStreamSession(sessionId : Text) : async ?StreamSession {
    if (not hasIPCameraAccess(caller)) {
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    switch (streamSessions.get(sessionId)) {
      case (null) { null };
      case (?session) {
        if (session.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own stream sessions");
        };
        ?session;
      };
    };
  };

  public query ({ caller }) func listStreamSessions() : async [StreamSession] {
    if (not hasIPCameraAccess(caller)) {
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    var sessions = List.empty<StreamSession>();
    for ((_, session) in streamSessions.entries()) {
      if (session.userId == caller or AccessControl.isAdmin(accessControlState, caller)) {
        sessions.add(session);
      };
    };

    sessions.toArray();
  };

  // ============================================================================
  // API KEY MANAGEMENT (Admin or Verified Subscriber Access)
  // ============================================================================

  public shared ({ caller }) func generateAPIKey(permissions : [Text], expiresInDays : Nat) : async Text {
    if (not hasIPCameraAccess(caller)) {
      addAuditLog(caller, "GENERATE_API_KEY", "APIKey", false, "Access denied");
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    let timestamp = Time.now();
    let oneDayInNanos : Int = 86_400_000_000_000;
    let expiresAt = timestamp + (oneDayInNanos * expiresInDays);
    let keyId = "key-" # debug_show (timestamp) # "-" # caller.toText();
    let key = "sk_" # debug_show (timestamp) # "_" # caller.toText();

    let apiKey : APIKey = {
      id = keyId;
      key;
      userId = caller;
      createdAt = timestamp;
      expiresAt;
      isActive = true;
      permissions;
    };

    apiKeys.add(keyId, apiKey);
    addAuditLog(caller, "GENERATE_API_KEY", keyId, true, "API key generated");

    key;
  };

  public shared ({ caller }) func revokeAPIKey(keyId : Text) : async () {
    if (not hasIPCameraAccess(caller)) {
      addAuditLog(caller, "REVOKE_API_KEY", keyId, false, "Access denied");
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    switch (apiKeys.get(keyId)) {
      case (null) {
        addAuditLog(caller, "REVOKE_API_KEY", keyId, false, "API key not found");
        Runtime.trap("API key not found");
      };
      case (?apiKey) {
        if (apiKey.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          addAuditLog(caller, "REVOKE_API_KEY", keyId, false, "Not key owner");
          Runtime.trap("Unauthorized: Can only revoke your own API keys");
        };

        let updatedKey : APIKey = {
          id = apiKey.id;
          key = apiKey.key;
          userId = apiKey.userId;
          createdAt = apiKey.createdAt;
          expiresAt = apiKey.expiresAt;
          isActive = false;
          permissions = apiKey.permissions;
        };

        apiKeys.add(keyId, updatedKey);
        addAuditLog(caller, "REVOKE_API_KEY", keyId, true, "API key revoked");
      };
    };
  };

  public query ({ caller }) func listAPIKeys() : async [APIKey] {
    if (not hasIPCameraAccess(caller)) {
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    var keys = List.empty<APIKey>();
    for ((_, apiKey) in apiKeys.entries()) {
      if (apiKey.userId == caller or AccessControl.isAdmin(accessControlState, caller)) {
        keys.add(apiKey);
      };
    };

    keys.toArray();
  };

  // ============================================================================
  // ACCESS LOG FUNCTIONS (Admin or Owner Access)
  // ============================================================================

  public shared ({ caller }) func logCameraAccess(
    cameraId : Text,
    action : Text,
    ipAddress : Text,
    userAgent : Text,
    success : Bool
  ) : async () {
    if (not hasIPCameraAccess(caller)) {
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    let timestamp = Time.now();
    let logId = "log-" # debug_show (timestamp) # "-" # caller.toText();

    let log : CameraAccessLog = {
      id = logId;
      cameraId;
      userId = caller;
      timestamp;
      action;
      ipAddress;
      userAgent;
      success;
    };

    cameraAccessLogs.add(logId, log);
  };

  public query ({ caller }) func getCameraAccessLogs(cameraId : Text) : async [CameraAccessLog] {
    if (not hasIPCameraAccess(caller)) {
      Runtime.trap("Unauthorized: Admin or verified subscriber access required");
    };

    switch (ipCameras.get(cameraId)) {
      case (null) { Runtime.trap("Camera not found") };
      case (?camera) {
        if (camera.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view logs for your own cameras");
        };

        var logs = List.empty<CameraAccessLog>();
        for ((_, log) in cameraAccessLogs.entries()) {
          if (log.cameraId == cameraId) {
            logs.add(log);
          };
        };

        logs.toArray();
      };
    };
  };

  public query ({ caller }) func getAllAccessLogs() : async [CameraAccessLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all access logs");
    };

    var logs = List.empty<CameraAccessLog>();
    for ((_, log) in cameraAccessLogs.entries()) {
      logs.add(log);
    };

    logs.toArray();
  };

  // ============================================================================
  // AUDIT LOG FUNCTIONS (Admin Only)
  // ============================================================================

  public query ({ caller }) func getAuditLogs() : async [AuditLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };

    var logs = List.empty<AuditLogEntry>();
    for ((_, log) in auditLogs.entries()) {
      logs.add(log);
    };

    logs.toArray();
  };

  public query ({ caller }) func getAuditLogsForUser(userId : Principal) : async [AuditLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };

    var logs = List.empty<AuditLogEntry>();
    for ((_, log) in auditLogs.entries()) {
      if (log.userId == userId) {
        logs.add(log);
      };
    };

    logs.toArray();
  };

  // ============================================================================
  // USER PROFILE FUNCTIONS
  // ============================================================================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};

