import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

actor SecoinfiEpay {
  // Initialize access control and user approval states
  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  // OrderedMap operations
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);

  // Data structures
  public type UserProfile = {
    name : Text;
    upiId : Text;
    mobileNumber : Text;
    accountType : {
      #individual;
      #business;
    };
    registrationTime : Int;
  };

  public type Transaction = {
    id : Nat;
    user : Principal;
    amount : Nat;
    currency : {
      #inr;
      #usd;
    };
    type_ : {
      #payIn;
      #payOut;
    };
    status : {
      #ok;
      #pending;
      #rejected;
    };
    timestamp : Int;
    merkleRoot : Text;
  };

  public type Subscription = {
    user : Principal;
    qrc : Text;
    startTime : Int;
    endTime : Int;
    fee : Nat;
    status : {
      #active;
      #paused;
      #expired;
    };
  };

  public type LeaderboardEntry = {
    user : Principal;
    totalAmount : Nat;
    duration : Nat;
    rank : Nat;
    timestamp : Int;
  };

  public type AdminSettings = {
    conversionRate : Nat;
    subscriptionFee : Nat;
    rotationCycle : Nat;
  };

  public type ContactInfo = {
    ceo : Text;
    email : Text;
    phone : Text;
    website : Text;
    whatsapp : Text;
    address : Text;
    paypal : Text;
    upiId : Text;
    ethId : Text;
    facebook : Text;
    linkedin : Text;
    telegram : Text;
    discord : Text;
    blog : Text;
    instagram : Text;
    twitter : Text;
    youtube : Text;
    mapLink : Text;
    googleMapsLink : Text;
  };

  public type FeatureStatus = {
    featureName : Text;
    isCompleted : Bool;
    isAdminValidated : Bool;
    lastUpdated : Int;
  };

  public type ThemeMode = {
    #light;
    #dark;
    #vibgyor;
  };

  public type SystemComparison = {
    imageUrl : Text;
    description : Text;
    comparisonTable : Text;
    conversionRate : Text;
    uspSection : Text;
  };

  // Terms of Service Management
  public type TermsVersion = {
    id : Nat;
    slug : Text;
    version : Nat;
    title : Text;
    effectiveDate : Int;
    content : Text;
    changelog : Text;
    isPublic : Bool;
    criticalUpdate : Bool;
    createdByAdmin : Principal;
  };

  public type UserTermsAcceptance = {
    userPrincipal : Principal;
    termsVersionId : Nat;
    acceptedAt : Int;
    metadata : Text;
  };

  public type AdminNotice = {
    id : Nat;
    title : Text;
    body : Text;
    noticeType : {
      #info;
      #critical;
      #legal;
    };
    effectiveDate : Int;
    requiresAcceptance : Bool;
    linkedTermsVersionId : ?Nat;
  };

  // Sitemap Extension Types
  public type ControlledRoute = {
    routeName : Text;
    delegatedApp : Text;
  };

  public type SitemapEntry = {
    slug : Text;
    pageType : {
      #auto;
      #manual;
      #controlled;
    };
    createdBy : Principal;
    createdAt : Int;
    lastModified : Int;
  };

  public type SitemapState = {
    auto : [Text];
    manualPages : [SitemapEntry];
    controlledRoutes : [ControlledRoute];
    version : Nat;
    merkleHash : Text;
    createdBy : Principal;
    createdAt : Int;
    lastModified : Int;
  };

  // State variables
  var userProfiles = principalMap.empty<UserProfile>();
  var transactions = natMap.empty<Transaction>();
  var subscriptions = principalMap.empty<Subscription>();
  var leaderboard = principalMap.empty<LeaderboardEntry>();
  var adminSettings : AdminSettings = {
    conversionRate = 90;
    subscriptionFee = 1000;
    rotationCycle = 3600;
  };
  var nextTransactionId = 0;
  var contactInfo : ContactInfo = {
    ceo = "DILEEP KUMAR D, CEO of SECOINFI";
    email = "dild26@gmail.com";
    phone = "+91-962-005-8644";
    website = "www.seco.in.net";
    whatsapp = "+91-962-005-8644";
    address = "Sudha Enterprises, No. 157, V R Vihar, Varadaraj Nagar, Vidyaranyapura PO, Bangalore-560097";
    paypal = "newgoldenjewel@gmail.com";
    upiId = "secoin@uboi";
    ethId = "0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7";
    facebook = "https://facebook.com/dild26";
    linkedin = "https://www.linkedin.com/in/dild26";
    telegram = "https://t.me/dilee";
    discord = "https://discord.com/users/dild26";
    blog = "https://dildiva.blogspot.com";
    instagram = "https://instagram.com/newgoldenjewel";
    twitter = "https://twitter.com/dil_sec";
    youtube = "https://m.youtube.com/@dileepkumard4484/videos";
    mapLink = "https://maps.google.com/?q=Sudha+Enterprises,+No.+157,+V+R+Vihar,+Varadaraj+Nagar,+Vidyaranyapura+PO,+Bangalore-560097";
    googleMapsLink = "https://www.google.com/maps/dir/?api=1&destination=Sudha+Enterprises,+No.+157,+V+R+Vihar,+Varadaraj+Nagar,+Vidyaranyapura+PO,+Bangalore-560097";
  };
  var featureStatuses = textMap.empty<FeatureStatus>();
  var userThemes = principalMap.empty<ThemeMode>();
  var systemComparison : SystemComparison = {
    imageUrl = "/images/Sec-ePay.png";
    description = "The Secoinfi System Comparison illustrates the advantages of our blockchain-based financial platform. The comparison chart shows how user payer deposits, running totals, and sorted pay-outs are managed transparently. With a conversion rate of 1 USD = 90 INR, Secoinfi offers competitive rates and secure transactions.";
    comparisonTable = "Sl./User Payer | Deposit/Fee | Running Total | Sorted Pay-Outs | Conversion rate\n--- | --- | --- | --- | ---\n1 | 1000 | 1000 | 1000 | 1 USD = 90 INR\n2 | 1000 | 2000 | 1000 | 1 USD = 90 INR\n3 | 1000 | 3000 | 1000 | 1 USD = 90 INR\n4 | 1000 | 4000 | 1000 | 1 USD = 90 INR";
    conversionRate = "1 USD = 90 INR";
    uspSection = "Secoinfi offers unique advantages:\n- Transparency through blockchain-based verification\n- Merkle-root traceability for complete audit trails\n- Protection from fake e-chit operators\n- Automated transaction processing\n- Decentralized financial operations\n- Financial inclusivity and accessibility\n\nTrust, automation, and decentralization are at the core of Secoinfi's mission to provide secure and reliable financial services.";
  };

  // Terms of Service state
  var termsVersions = natMap.empty<TermsVersion>();
  var userTermsAcceptances = natMap.empty<UserTermsAcceptance>();
  var adminNotices = natMap.empty<AdminNotice>();
  var nextTermsVersionId = 0;
  var nextAdminNoticeId = 0;
  var nextAcceptanceId = 0;

  // Sitemap state
  var sitemapState : SitemapState = {
    auto = [
      "home",
      "dashboard",
      "about",
      "faq",
      "contact",
      "terms",
      "admin",
      "sitemap",
      "calc",
      "features",
      "main-form",
    ];
    manualPages = [];
    controlledRoutes = [
      {
        routeName = "broadcast";
        delegatedApp = "";
      },
      {
        routeName = "remote";
        delegatedApp = "";
      },
      {
        routeName = "live";
        delegatedApp = "";
      },
    ];
    version = 1;
    merkleHash = "";
    createdBy = Principal.fromText("2vxsx-fae");
    createdAt = Time.now();
    lastModified = Time.now();
  };

  // Access control functions
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

  // User approval functions
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // User profile functions - Require authentication for profile management
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

  // Transaction functions - Creating requires approval, viewing is public for transparency
  public shared ({ caller }) func createTransaction(amount : Nat, currency : { #inr; #usd }, type_ : { #payIn; #payOut }) : async Nat {
    // Only approved users or admins can create transactions
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only approved users can create transactions");
    };

    let transaction : Transaction = {
      id = nextTransactionId;
      user = caller;
      amount;
      currency;
      type_;
      status = #pending;
      timestamp = Time.now();
      merkleRoot = "";
    };

    transactions := natMap.put(transactions, nextTransactionId, transaction);
    nextTransactionId += 1;
    transaction.id;
  };

  // Public: Anyone can view individual transactions for transparency
  public query func getTransaction(id : Nat) : async ?Transaction {
    natMap.get(transactions, id);
  };

  // Public: Anyone can view user transactions for transparency (e.g., on /calc page)
  public query func getUserTransactions(user : Principal) : async [Transaction] {
    var userTransactions = List.nil<Transaction>();
    for ((id, transaction) in natMap.entries(transactions)) {
      if (transaction.user == user) {
        userTransactions := List.push(transaction, userTransactions);
      };
    };
    List.toArray(userTransactions);
  };

  // Subscription functions - Require approval (subscription-related)
  public shared ({ caller }) func createSubscription(qrc : Text, duration : Nat) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only approved users can create subscriptions");
    };

    let subscription : Subscription = {
      user = caller;
      qrc;
      startTime = Time.now();
      endTime = Time.now() + (duration * 1_000_000_000);
      fee = adminSettings.subscriptionFee;
      status = #active;
    };

    subscriptions := principalMap.put(subscriptions, caller, subscription);
  };

  // Subscription viewing requires approval (subscription-related)
  public query ({ caller }) func getSubscription(user : Principal) : async ?Subscription {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only approved users can view subscriptions");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own subscription");
    };
    principalMap.get(subscriptions, user);
  };

  // Leaderboard functions - Update requires approval (subscription-related)
  public shared ({ caller }) func updateLeaderboard(totalAmount : Nat, duration : Nat) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only approved users can update leaderboard");
    };

    let entry : LeaderboardEntry = {
      user = caller;
      totalAmount;
      duration;
      rank = 0;
      timestamp = Time.now();
    };

    leaderboard := principalMap.put(leaderboard, caller, entry);
  };

  // Public: Anyone can view leaderboard for transparency
  public query func getLeaderboard() : async [LeaderboardEntry] {
    var entries = List.nil<LeaderboardEntry>();
    for ((user, entry) in principalMap.entries(leaderboard)) {
      entries := List.push(entry, entries);
    };
    List.toArray(entries);
  };

  // Admin functions - All require admin permission
  public shared ({ caller }) func updateAdminSettings(conversionRate : Nat, subscriptionFee : Nat, rotationCycle : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };

    adminSettings := {
      conversionRate;
      subscriptionFee;
      rotationCycle;
    };
  };

  public query ({ caller }) func getAdminSettings() : async AdminSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    adminSettings;
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };

    var allTransactions = List.nil<Transaction>();
    for ((id, transaction) in natMap.entries(transactions)) {
      allTransactions := List.push(transaction, allTransactions);
    };
    List.toArray(allTransactions);
  };

  public query ({ caller }) func getAllSubscriptions() : async [Subscription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };

    var allSubscriptions = List.nil<Subscription>();
    for ((user, subscription) in principalMap.entries(subscriptions)) {
      allSubscriptions := List.push(subscription, allSubscriptions);
    };
    List.toArray(allSubscriptions);
  };

  // Contact info functions - Public viewing, admin-only updates
  public query func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  public shared ({ caller }) func updateContactInfo(newContactInfo : ContactInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    contactInfo := newContactInfo;
  };

  // Feature status functions - Public viewing, admin-only updates
  public query func getFeatureStatus(featureName : Text) : async ?FeatureStatus {
    textMap.get(featureStatuses, featureName);
  };

  public query func getAllFeatureStatuses() : async [FeatureStatus] {
    var allStatuses = List.nil<FeatureStatus>();
    for ((featureName, status) in textMap.entries(featureStatuses)) {
      allStatuses := List.push(status, allStatuses);
    };
    List.toArray(allStatuses);
  };

  public shared ({ caller }) func updateFeatureStatus(featureName : Text, isCompleted : Bool, isAdminValidated : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };

    let status : FeatureStatus = {
      featureName;
      isCompleted;
      isAdminValidated;
      lastUpdated = Time.now();
    };

    featureStatuses := textMap.put(featureStatuses, featureName, status);
  };

  // Theme functions - Public access for all users including guests
  public shared ({ caller }) func setTheme(theme : ThemeMode) : async () {
    userThemes := principalMap.put(userThemes, caller, theme);
  };

  public query ({ caller }) func getTheme() : async ThemeMode {
    switch (principalMap.get(userThemes, caller)) {
      case null { #vibgyor }; // Default to VIBGYOR for new users
      case (?theme) { theme };
    };
  };

  // System comparison functions - Public viewing, admin-only updates
  public query func getSystemComparison() : async SystemComparison {
    systemComparison;
  };

  public shared ({ caller }) func updateSystemComparison(newComparison : SystemComparison) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    systemComparison := newComparison;
  };

  // Terms of Service Management
  // Admin-only: Publish new terms version
  public shared ({ caller }) func publishTermsVersion(terms : TermsVersion) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };

    let termsVersion : TermsVersion = {
      terms with id = nextTermsVersionId;
    };

    termsVersions := natMap.put(termsVersions, nextTermsVersionId, termsVersion);
    nextTermsVersionId += 1;
    termsVersion.id;
  };

  // Authenticated users only (blocks anonymous principals)
  // Users must authenticate before accepting terms
  public shared ({ caller }) func acceptTerms(termsVersionId : Nat, metadata : Text) : async () {
    // Block anonymous principals - users must be authenticated
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Unauthorized: Anonymous users cannot accept terms");
    };

    let acceptance : UserTermsAcceptance = {
      userPrincipal = caller;
      termsVersionId;
      acceptedAt = Time.now();
      metadata;
    };

    // Store with unique key combining user and terms version
    userTermsAcceptances := natMap.put(userTermsAcceptances, nextAcceptanceId, acceptance);
    nextAcceptanceId += 1;
  };

  // Public: Anyone can view current terms (required for legal compliance)
  public query func getCurrentTermsVersion() : async ?TermsVersion {
    if (natMap.size(termsVersions) == 0) {
      return null;
    };

    // Find the latest public terms version
    var latestPublicTerms : ?TermsVersion = null;
    var latestId : Nat = 0;

    for ((id, terms) in natMap.entries(termsVersions)) {
      if (terms.isPublic and id >= latestId) {
        latestPublicTerms := ?terms;
        latestId := id;
      };
    };

    latestPublicTerms;
  };

  // Public: Anyone can view specific terms version (required for legal compliance)
  public query func getTermsVersion(versionId : Nat) : async ?TermsVersion {
    switch (natMap.get(termsVersions, versionId)) {
      case null { null };
      case (?terms) {
        // Only return if public
        if (terms.isPublic) {
          ?terms;
        } else {
          null;
        };
      };
    };
  };

  // Public: Anyone can view all public terms versions (required for transparency)
  public query func getAllTermsVersions() : async [TermsVersion] {
    var publicTerms = List.nil<TermsVersion>();
    for ((id, terms) in natMap.entries(termsVersions)) {
      if (terms.isPublic) {
        publicTerms := List.push(terms, publicTerms);
      };
    };
    List.toArray(publicTerms);
  };

  // Users can check their own acceptance, admins can check any user
  public query ({ caller }) func hasUserAcceptedTerms(user : Principal, termsVersionId : Nat) : async Bool {
    // Users can check their own status, admins can check anyone
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only check your own acceptance status");
    };

    let acceptancesArray = Iter.toArray(natMap.vals(userTermsAcceptances));
    for (acceptance in acceptancesArray.vals()) {
      if (acceptance.userPrincipal == user and acceptance.termsVersionId == termsVersionId) {
        return true;
      };
    };
    false;
  };

  // Users can view their own acceptance, admins can view any user's acceptance
  public query ({ caller }) func getUserTermsAcceptance(user : Principal, termsVersionId : Nat) : async ?UserTermsAcceptance {
    // Users can check their own status, admins can check anyone
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own acceptance record");
    };

    let acceptancesArray = Iter.toArray(natMap.vals(userTermsAcceptances));
    for (acceptance in acceptancesArray.vals()) {
      if (acceptance.userPrincipal == user and acceptance.termsVersionId == termsVersionId) {
        return ?acceptance;
      };
    };
    null;
  };

  // Admin-only: Create admin notice
  public shared ({ caller }) func createAdminNotice(notice : AdminNotice) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };

    let newNotice : AdminNotice = {
      notice with id = nextAdminNoticeId;
    };

    adminNotices := natMap.put(adminNotices, nextAdminNoticeId, newNotice);
    nextAdminNoticeId += 1;
    newNotice.id;
  };

  // Public: Anyone can view admin notices (required for transparency)
  public query func getAdminNotice(noticeId : Nat) : async ?AdminNotice {
    natMap.get(adminNotices, noticeId);
  };

  // Public: Anyone can view all admin notices (required for transparency)
  public query func getAllAdminNotices() : async [AdminNotice] {
    Iter.toArray(natMap.vals(adminNotices));
  };

  // Public: Anyone can view active admin notices (required for transparency)
  public query func getActiveAdminNotices() : async [AdminNotice] {
    let now = Time.now();
    var activeNotices = List.nil<AdminNotice>();
    for (notice in natMap.vals(adminNotices)) {
      if (notice.effectiveDate <= now) {
        activeNotices := List.push(notice, activeNotices);
      };
    };
    List.toArray(activeNotices);
  };

  // Public: Anyone can check if critical update is required (needed for login flow)
  public shared func isCriticalUpdateRequired() : async Bool {
    switch (await getCurrentTermsVersion()) {
      case null { false };
      case (?terms) { terms.criticalUpdate };
    };
  };

  // Sitemap Functions
  // Admin-only: Add manual page
  public shared ({ caller }) func addManualPage(slug : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add manual pages");
    };

    // Validate slug
    let lowerSlug = Text.toLowercase(slug);
    if (not validateSlug(lowerSlug)) {
      Debug.trap("Invalid slug format. Must be lowercase and contain only letters, numbers, and hyphens.");
    };

    // Check for uniqueness
    if (pageExists(lowerSlug)) {
      Debug.trap("Page with slug " # lowerSlug # " already exists.");
    };

    let newPage : SitemapEntry = {
      slug = lowerSlug;
      pageType = #manual;
      createdBy = caller;
      createdAt = Time.now();
      lastModified = Time.now();
    };

    sitemapState := {
      sitemapState with
      manualPages = Array.append(sitemapState.manualPages, [newPage]);
      version = sitemapState.version + 1;
      lastModified = Time.now();
    };
  };

  // Admin-only: Delegate controlled route
  public shared ({ caller }) func delegateControlledRoute(routeName : Text, delegatedApp : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delegate controlled routes");
    };

    // Validate routeName
    let validRoutes = ["broadcast", "remote", "live"];
    if (not List.some(List.fromArray(validRoutes), func(route) { route == routeName })) {
      Debug.trap("Invalid route name: " # routeName);
    };

    let updatedControlledRoutes = Array.map<ControlledRoute, ControlledRoute>(
      sitemapState.controlledRoutes,
      func(cr) {
        if (cr.routeName == routeName) {
          {
            routeName = cr.routeName;
            delegatedApp;
          };
        } else {
          cr;
        };
      },
    );

    sitemapState := {
      sitemapState with
      controlledRoutes = updatedControlledRoutes;
      version = sitemapState.version + 1;
      lastModified = Time.now();
    };
  };

  // Public: Get sitemap state
  public query func getSitemapState() : async SitemapState {
    sitemapState;
  };

  // Public: Get all pages (auto + manual)
  public query func getAllPages() : async [SitemapEntry] {
    var pages = List.nil<SitemapEntry>();

    // Convert auto pages to SitemapEntry
    for (autoPage in sitemapState.auto.vals()) {
      pages := List.push(
        {
          slug = autoPage;
          pageType = #auto;
          createdBy = Principal.fromText("2vxsx-fae");
          createdAt = 0;
          lastModified = 0;
        },
        pages,
      );
    };

    // Add manual pages
    for (manualPage in sitemapState.manualPages.vals()) {
      pages := List.push(manualPage, pages);
    };

    List.toArray(pages);
  };

  // Helper functions
  func validateSlug(slug : Text) : Bool {
    // Must be lowercase letters, numbers, and hyphens
    for (char in Text.toIter(slug)) {
      if (
        not (
          (char >= 'a' and char <= 'z') // 'a' to 'z'
          or (char >= '0' and char <= '9') // '0' to '9'
          or char == '-'
        )
      ) {
        return false;
      };
    };
    true;
  };

  func pageExists(slug : Text) : Bool {
    for (autoPage in sitemapState.auto.vals()) {
      if (autoPage == slug) {
        return true;
      };
    };
    for (manualPage in sitemapState.manualPages.vals()) {
      if (manualPage.slug == slug) {
        return true;
      };
    };
    false;
  };
};
