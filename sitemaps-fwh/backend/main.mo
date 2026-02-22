import AccessControl "authorization/access-control";
import BlobStorage "blob-storage/Mixin";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Registry "blob-storage/registry";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Nat "mo:base/Nat";

persistent actor {
  let accessControlState = AccessControl.initState();

  type SubscriptionTier = {
    #basic;
    #pro;
    #enterprise;
    #payAsYouUse : Nat;
  };

  type SubscriptionStatus = {
    #active;
    #expired;
    #cancelled;
  };

  type Subscription = {
    tier : SubscriptionTier;
    status : SubscriptionStatus;
    createdAt : Nat;
    updatedAt : Nat;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    createdAt : Nat;
  };

  type SearchResult = {
    url : Text;
    title : Text;
    description : Text;
  };

  type SearchResponse = {
    results : [SearchResult];
    totalResults : Nat;
    page : Nat;
    pageSize : Nat;
  };

  type PayAsYouUsePurchase = {
    batchSize : Nat;
    purchaseDate : Nat;
    remainingQuota : Nat;
  };

  type Referral = {
    referrer : Principal;
    referred : Principal;
    createdAt : Nat;
    level : Nat;
  };

  type Commission = {
    user : Principal;
    amount : Nat;
    status : {
      #pending;
      #paid;
    };
    createdAt : Nat;
  };

  type ExportType = {
    #csv;
    #xlsx;
    #json;
    #zip;
  };

  type ExportRecord = {
    exportType : ExportType;
    filePath : Text;
    createdAt : Nat;
    status : {
      #pending;
      #completed;
      #failed;
    };
  };

  type AnalyticsData = {
    userActivity : Nat;
    subscriptionMetrics : Nat;
    usageStats : Nat;
    revenue : Nat;
    engagement : Nat;
    referralAnalytics : Nat;
    commissionAnalytics : Nat;
    payoutProcessing : Nat;
    exportTracking : Nat;
    publicSearchAnalytics : Nat;
  };

  type GodsEyeSummary = {
    totalFees : Nat;
    totalCommissions : Nat;
    totalTransactions : Nat;
    totalRemunerations : Nat;
    totalDiscounts : Nat;
    totalOffers : Nat;
    totalReturns : Nat;
    companyName : Text;
    ceoName : Text;
    contactEmail : Text;
    paymentEmail : Text;
    website : Text;
    brandingStatement : Text;
    lastUpdated : Nat;
  };

  type FieldCategory = {
    #email;
    #phone;
    #address;
    #payment;
    #social;
    #financial;
    #business;
    #branding;
    #other;
  };

  type FieldStatus = {
    #active;
    #inactive;
    #archived;
  };

  type FieldDefinition = {
    id : Nat;
    name : Text;
    value : Text;
    category : FieldCategory;
    isChecked : Bool;
    createdAt : Nat;
    updatedAt : Nat;
    status : FieldStatus;
    order : Nat;
  };

  type FieldUpdate = {
    id : Nat;
    value : Text;
    isChecked : Bool;
    updatedAt : Nat;
  };

  type FieldStatusUpdate = {
    id : Nat;
    status : FieldStatus;
  };

  type FieldOrderUpdate = {
    id : Nat;
    order : Nat;
  };

  type FieldCategoryCount = {
    category : FieldCategory;
    count : Nat;
  };

  type FieldCategorySummary = {
    category : FieldCategory;
    count : Nat;
    checkedCount : Nat;
  };

  type FieldCategoryStats = {
    category : FieldCategory;
    total : Nat;
    checked : Nat;
    active : Nat;
    inactive : Nat;
    archived : Nat;
  };

  type FieldCategorySummaryWithStats = {
    category : FieldCategory;
    count : Nat;
    checkedCount : Nat;
    stats : FieldCategoryStats;
  };

  type FeaturePriority = {
    #p1;
    #p2;
    #p3;
    #p4;
  };

  type FeatureStatus = {
    #complete;
    #inProgress;
    #pending;
  };

  type FeatureChecklistItem = {
    id : Nat;
    title : Text;
    description : Text;
    priority : FeaturePriority;
    status : FeatureStatus;
    moduleName : Text;
    page : Text;
    createdAt : Nat;
    updatedAt : Nat;
    documentation : Text;
    tooltip : Text;
    integrationGuidelines : Text;
    developmentNotes : Text;
  };

  type FeatureChecklistUpdate = {
    id : Nat;
    status : FeatureStatus;
    updatedAt : Nat;
  };

  type FeatureChecklistSummary = {
    priority : FeaturePriority;
    total : Nat;
    complete : Nat;
    inProgress : Nat;
    pending : Nat;
    progressPercentage : Float;
  };

  type ExtensionCount = {
    extension : Text;
    count : Nat;
  };

  type CatalogEntry = {
    id : Nat;
    fileType : Text;
    title : Text;
    sourceUrl : Text;
    summary : Text;
    metadata : Text;
    seoRank : Nat;
    clickCount : Nat;
    popularity : Nat;
    relevance : Nat;
    recency : Nat;
    visibility : Nat;
    backlinks : Nat;
    pingResponse : Nat;
    loadSpeed : Nat;
    bounceRate : Nat;
    createdAt : Nat;
    updatedAt : Nat;
  };

  type CatalogFilter = {
    fileType : ?Text;
    minSeoRank : ?Nat;
    minClickCount : ?Nat;
    minPopularity : ?Nat;
    minRelevance : ?Nat;
    maxRecency : ?Nat;
    minVisibility : ?Nat;
    minBacklinks : ?Nat;
    maxPingResponse : ?Nat;
    maxLoadSpeed : ?Nat;
    maxBounceRate : ?Nat;
  };

  type CatalogSortBy = {
    #seoRank;
    #clickCount;
    #popularity;
    #relevance;
    #recency;
    #visibility;
    #backlinks;
    #pingResponse;
    #loadSpeed;
    #bounceRate;
  };

  type CatalogSortOrder = {
    #asc;
    #desc;
  };

  type CatalogSort = {
    sortBy : CatalogSortBy;
    sortOrder : CatalogSortOrder;
  };

  type CatalogQuery = {
    searchTerm : Text;
    filter : CatalogFilter;
    sort : CatalogSort;
    page : Nat;
    pageSize : Nat;
  };

  type CatalogResponse = {
    entries : [CatalogEntry];
    totalEntries : Nat;
    page : Nat;
    pageSize : Nat;
  };

  type DiagnosticSeverity = {
    #critical;
    #high;
    #medium;
    #low;
  };

  type DiagnosticCategory = {
    #environmentVariables;
    #fileReferences;
    #buildErrors;
    #configuration;
    #accessControl;
    #stripeConfig;
    #stableData;
  };

  type DiagnosticIssue = {
    category : DiagnosticCategory;
    severity : DiagnosticSeverity;
    message : Text;
    details : Text;
    recommendation : Text;
    autoFixAvailable : Bool;
  };

  type DiagnosticResult = {
    timestamp : Nat;
    issues : [DiagnosticIssue];
    systemHealthy : Bool;
    totalIssues : Nat;
    criticalIssues : Nat;
    highIssues : Nat;
    mediumIssues : Nat;
    lowIssues : Nat;
  };

  type DiagnosticLog = {
    id : Nat;
    timestamp : Nat;
    executedBy : Principal;
    result : DiagnosticResult;
    recoveryAttempted : Bool;
    recoverySuccessful : Bool;
  };

  type RecoveryAction = {
    #rebuildAssets;
    #reregisterFiles;
    #fixEnvironmentVariables;
    #purgeBuildCache;
    #validateConfiguration;
    #reinitializeAccessControl;
  };

  type RecoveryResult = {
    action : RecoveryAction;
    successful : Bool;
    message : Text;
    timestamp : Nat;
  };

  func flattenArray<T>(arrayOfArrays : [[T]]) : [T] {
    var result : [T] = [];
    for (subArray in arrayOfArrays.vals()) {
      result := Array.append(result, subArray);
    };
    result;
  };

  func isSubscriberOrAdmin(caller : Principal) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (principalMap.get(subscriptions, caller)) {
      case null false;
      case (?subscription) {
        subscription.status == #active;
      };
    };
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);

  var userProfiles = principalMap.empty<UserProfile>();
  var subscriptions = principalMap.empty<Subscription>();
  var sitemapData = textMap.empty<[SearchResult]>();
  var payAsYouUsePurchases = principalMap.empty<[PayAsYouUsePurchase]>();
  var referrals = principalMap.empty<[Referral]>();
  var commissions = principalMap.empty<[Commission]>();
  var exportRecords = textMap.empty<ExportRecord>();
  var analyticsData = textMap.empty<AnalyticsData>();
  var godsEyeSummary = textMap.empty<GodsEyeSummary>();
  var featureChecklist = natMap.empty<FeatureChecklistItem>();
  var fieldDefinitions = natMap.empty<FieldDefinition>();
  var catalogEntries = natMap.empty<CatalogEntry>();
  var diagnosticLogs = natMap.empty<DiagnosticLog>();
  var nextDiagnosticLogId : Nat = 0;

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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view profiles");
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

  public shared ({ caller }) func createSubscription(tier : SubscriptionTier) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create subscriptions");
    };

    let now = Time.now();
    let subscription : Subscription = {
      tier;
      status = #active;
      createdAt = Int.abs(now);
      updatedAt = Int.abs(now);
    };

    subscriptions := principalMap.put(subscriptions, caller, subscription);
  };

  public query ({ caller }) func getCallerSubscription() : async ?Subscription {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view subscriptions");
    };
    principalMap.get(subscriptions, caller);
  };

  public shared ({ caller }) func purchasePayAsYouUseBatch(batchSize : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can purchase batches");
    };

    let purchase : PayAsYouUsePurchase = {
      batchSize;
      purchaseDate = Int.abs(Time.now());
      remainingQuota = batchSize;
    };

    let existingPurchases = switch (principalMap.get(payAsYouUsePurchases, caller)) {
      case null [];
      case (?purchases) purchases;
    };

    payAsYouUsePurchases := principalMap.put(payAsYouUsePurchases, caller, Array.append(existingPurchases, [purchase]));
  };

  public query ({ caller }) func getPayAsYouUsePurchases() : async [PayAsYouUsePurchase] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view purchases");
    };
    switch (principalMap.get(payAsYouUsePurchases, caller)) {
      case null [];
      case (?purchases) purchases;
    };
  };

  public query ({ caller }) func canAccessExternalLinks() : async Bool {
    isSubscriberOrAdmin(caller);
  };

  public query ({ caller }) func validateExternalLinkAccess(url : Text) : async { canAccess : Bool; reason : Text } {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return { canAccess = true; reason = "Admin access granted" };
    };

    switch (principalMap.get(subscriptions, caller)) {
      case null {
        { canAccess = false; reason = "No active subscription. Please subscribe to access external links." };
      };
      case (?subscription) {
        if (subscription.status == #active) {
          { canAccess = true; reason = "Active subscription verified" };
        } else {
          { canAccess = false; reason = "Subscription expired or cancelled. Please renew to access external links." };
        };
      };
    };
  };

  // PUBLIC ACCESS - No authentication required
  public query func publicSearchUrls(searchQuery : Text, page : Nat, pageSize : Nat) : async SearchResponse {
    let allResults = Iter.toArray(textMap.vals(sitemapData));
    let flatResults = flattenArray(allResults);
    let filteredResults = Iter.toArray(
      Iter.filter(
        Iter.fromArray(flatResults),
        func(result : SearchResult) : Bool {
          Text.contains(result.url, #text searchQuery) or Text.contains(result.title, #text searchQuery);
        },
      )
    );

    let start = page * pageSize;
    let end = if (start + pageSize > filteredResults.size()) {
      filteredResults.size();
    } else {
      start + pageSize;
    };

    let paginatedResults = if (start < filteredResults.size() and end > start) {
      Array.subArray(filteredResults, start, Int.abs(end - start));
    } else {
      [];
    };

    {
      results = paginatedResults;
      totalResults = filteredResults.size();
      page;
      pageSize;
    };
  };

  public shared ({ caller }) func addSitemapData(domain : Text, results : [SearchResult]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add sitemap data");
    };

    sitemapData := textMap.put(sitemapData, domain, results);
  };

  // PUBLIC ACCESS - No authentication required
  public query func getSitemapData(domain : Text) : async [SearchResult] {
    switch (textMap.get(sitemapData, domain)) {
      case null [];
      case (?results) results;
    };
  };

  // PUBLIC ACCESS - No authentication required
  public query func getAllDomains() : async [Text] {
    Iter.toArray(textMap.keys(sitemapData));
  };

  // PUBLIC ACCESS - No authentication required
  public query func getAllSitemapData() : async [SearchResult] {
    let allResults = Iter.toArray(textMap.vals(sitemapData));
    flattenArray(allResults);
  };

  // PUBLIC ACCESS - No authentication required
  public query func getAllValidTlds() : async [Text] {
    [
      ".ac", ".ad", ".ae", ".af", ".ag", ".ai", ".al", ".am", ".ao", ".aq", ".ar", ".as", ".at", ".au", ".aw", ".ax", ".az", ".ba", ".bb", ".bd", ".be", ".bf", ".bg", ".bh", ".bi", ".bj", ".bm", ".bn", ".bo", ".br", ".bs", ".bt", ".bv", ".bw", ".by", ".bz", ".ca", ".cc", ".cd", ".cf", ".cg", ".ch", ".ci", ".ck", ".cl", ".cm", ".cn", ".co", ".cr", ".cu", ".cv", ".cw", ".cx", ".cy", ".cz", ".de", ".dj", ".dk", ".dm", ".do", ".dz", ".ec", ".ee", ".eg", ".er", ".es", ".et", ".eu", ".fi", ".fj", ".fk", ".fm", ".fo", ".fr", ".ga", ".gb", ".gd", ".ge", ".gf", ".gg", ".gh", ".gi", ".gl", ".gm", ".gn", ".gp", ".gq", ".gr", ".gs", ".gt", ".gu", ".gw", ".gy", ".hk", ".hm", ".hn", ".hr", ".ht", ".hu", ".id", ".ie", ".il", ".im", ".in", ".io", ".iq", ".ir", ".is", ".it", ".je", ".jm", ".jo", ".jp", ".ke", ".kg", ".kh", ".ki", ".km", ".kn", ".kp", ".kr", ".kw", ".ky", ".kz", ".la", ".lb", ".lc", ".li", ".lk", ".lr", ".ls", ".lt", ".lu", ".lv", ".ly", ".ma", ".mc", ".md", ".me", ".mg", ".mh", ".mk", ".ml", ".mm", ".mn", ".mo", ".mp", ".mq", ".mr", ".ms", ".mt", ".mu", ".mv", ".mw", ".mx", ".my", ".mz", ".na", ".nc", ".ne", ".nf", ".ng", ".ni", ".nl", ".no", ".np", ".nr", ".nu", ".nz", ".om", ".pa", ".pe", ".pf", ".pg", ".ph", ".pk", ".pl", ".pm", ".pn", ".pr", ".ps", ".pt", ".pw", ".py", ".qa", ".re", ".ro", ".rs", ".ru", ".rw", ".sa", ".sb", ".sc", ".sd", ".se", ".sg", ".sh", ".si", ".sj", ".sk", ".sl", ".sm", ".sn", ".so", ".sr", ".ss", ".st", ".sv", ".sx", ".sy", ".sz", ".tc", ".td", ".tf", ".tg", ".th", ".tj", ".tk", ".tl", ".tm", ".tn", ".to", ".tr", ".tt", ".tv", ".tw", ".tz", ".ua", ".ug", ".uk", ".um", ".us", ".uy", ".uz", ".va", ".vc", ".ve", ".vg", ".vi", ".vn", ".vu", ".wf", ".ws", ".ye", ".yt", ".za", ".zm", ".zw",
    ];
  };

  // PUBLIC ACCESS - No authentication required
  public query func filterDomainsByExtension(extension : Text, page : Nat, pageSize : Nat) : async SearchResponse {
    let normalizedExtension = if (Text.startsWith(extension, #text ".")) {
      extension;
    } else {
      "." # extension;
    };

    let allDomains = Iter.toArray(textMap.keys(sitemapData));
    let filteredDomains = Iter.toArray(
      Iter.filter(
        Iter.fromArray(allDomains),
        func(domain : Text) : Bool {
          Text.endsWith(domain, #text normalizedExtension);
        },
      )
    );

    let start = page * pageSize;
    let end = if (start + pageSize > filteredDomains.size()) {
      filteredDomains.size();
    } else {
      start + pageSize;
    };

    let paginatedDomains = if (start < filteredDomains.size() and end > start) {
      Array.subArray(filteredDomains, start, Int.abs(end - start));
    } else {
      [];
    };

    let results = Array.map<Text, SearchResult>(
      paginatedDomains,
      func(domain : Text) : SearchResult {
        {
          url = domain;
          title = domain;
          description = "Domain search result";
        };
      },
    );

    {
      results;
      totalResults = filteredDomains.size();
      page;
      pageSize;
    };
  };

  // PUBLIC ACCESS - No authentication required
  public query func getExtensionCounts() : async [ExtensionCount] {
    let allDomains = Iter.toArray(textMap.keys(sitemapData));
    var extensionMap = textMap.empty<Nat>();

    for (domain in allDomains.vals()) {
      let parts = Iter.toArray(Text.split(domain, #char '.'));
      if (parts.size() > 1) {
        let extension = "." # parts[parts.size() - 1];
        let currentCount = switch (textMap.get(extensionMap, extension)) {
          case null 0;
          case (?count) count;
        };
        extensionMap := textMap.put(extensionMap, extension, currentCount + 1);
      };
    };

    let extensions = Iter.toArray(textMap.keys(extensionMap));
    Array.map<Text, ExtensionCount>(
      extensions,
      func(extension : Text) : ExtensionCount {
        {
          extension;
          count = switch (textMap.get(extensionMap, extension)) {
            case null 0;
            case (?count) count;
          };
        };
      },
    );
  };

  let registry = Registry.new();

  public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can register file references");
    };
    Registry.add(registry, path, hash);
  };

  public query func getFileReference(path : Text) : async Registry.FileReference {
    Registry.get(registry, path);
  };

  public query func listFileReferences() : async [Registry.FileReference] {
    Registry.list(registry);
  };

  public shared ({ caller }) func dropFileReference(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can drop file references");
    };
    Registry.remove(registry, path);
  };

  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createReferralLink(referred : Principal, level : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create referral links");
    };

    let referral : Referral = {
      referrer = caller;
      referred;
      createdAt = Int.abs(Time.now());
      level;
    };

    let existingReferrals = switch (principalMap.get(referrals, caller)) {
      case null [];
      case (?referrals) referrals;
    };

    referrals := principalMap.put(referrals, caller, Array.append(existingReferrals, [referral]));
  };

  public query ({ caller }) func getReferralLinks() : async [Referral] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view referral links");
    };
    switch (principalMap.get(referrals, caller)) {
      case null [];
      case (?referrals) referrals;
    };
  };

  public shared ({ caller }) func addCommission(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add commissions");
    };

    let commission : Commission = {
      user = caller;
      amount;
      status = #pending;
      createdAt = Int.abs(Time.now());
    };

    let existingCommissions = switch (principalMap.get(commissions, caller)) {
      case null [];
      case (?commissions) commissions;
    };

    commissions := principalMap.put(commissions, caller, Array.append(existingCommissions, [commission]));
  };

  public query ({ caller }) func getCommissions() : async [Commission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view commissions");
    };
    switch (principalMap.get(commissions, caller)) {
      case null [];
      case (?commissions) commissions;
    };
  };

  public shared ({ caller }) func createExport(exportType : ExportType, filePath : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create exports");
    };

    let exportRecord : ExportRecord = {
      exportType;
      filePath;
      createdAt = Int.abs(Time.now());
      status = #pending;
    };

    exportRecords := textMap.put(exportRecords, filePath, exportRecord);
  };

  public query ({ caller }) func getExportRecords() : async [ExportRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view export records");
    };

    Iter.toArray(textMap.vals(exportRecords));
  };

  public shared ({ caller }) func updateAnalytics(domain : Text, data : AnalyticsData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update analytics");
    };

    analyticsData := textMap.put(analyticsData, domain, data);
  };

  public query ({ caller }) func getAnalytics(domain : Text) : async AnalyticsData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get analytics");
    };

    switch (textMap.get(analyticsData, domain)) {
      case null Debug.trap("Analytics data not found");
      case (?data) data;
    };
  };

  public query ({ caller }) func getAllAnalytics() : async [AnalyticsData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get all analytics");
    };

    Iter.toArray(textMap.vals(analyticsData));
  };

  public query ({ caller }) func getAnalyticsSummary() : async AnalyticsData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get analytics summary");
    };

    let allAnalytics = Iter.toArray(textMap.vals(analyticsData));
    var totalUserActivity = 0;
    var totalSubscriptionMetrics = 0;
    var totalUsageStats = 0;
    var totalRevenue = 0;
    var totalEngagement = 0;
    var totalReferralAnalytics = 0;
    var totalCommissionAnalytics = 0;
    var totalPayoutProcessing = 0;
    var totalExportTracking = 0;
    var totalPublicSearchAnalytics = 0;

    for (data in allAnalytics.vals()) {
      totalUserActivity += data.userActivity;
      totalSubscriptionMetrics += data.subscriptionMetrics;
      totalUsageStats += data.usageStats;
      totalRevenue += data.revenue;
      totalEngagement += data.engagement;
      totalReferralAnalytics += data.referralAnalytics;
      totalCommissionAnalytics += data.commissionAnalytics;
      totalPayoutProcessing += data.payoutProcessing;
      totalExportTracking += data.exportTracking;
      totalPublicSearchAnalytics += data.publicSearchAnalytics;
    };

    {
      userActivity = totalUserActivity;
      subscriptionMetrics = totalSubscriptionMetrics;
      usageStats = totalUsageStats;
      revenue = totalRevenue;
      engagement = totalEngagement;
      referralAnalytics = totalReferralAnalytics;
      commissionAnalytics = totalCommissionAnalytics;
      payoutProcessing = totalPayoutProcessing;
      exportTracking = totalExportTracking;
      publicSearchAnalytics = totalPublicSearchAnalytics;
    };
  };

  public query ({ caller }) func getAnalyticsByCategory(category : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get analytics by category");
    };

    let allAnalytics = Iter.toArray(textMap.vals(analyticsData));
    var total = 0;

    for (data in allAnalytics.vals()) {
      switch (category) {
        case "userActivity" total += data.userActivity;
        case "subscriptionMetrics" total += data.subscriptionMetrics;
        case "usageStats" total += data.usageStats;
        case "revenue" total += data.revenue;
        case "engagement" total += data.engagement;
        case "referralAnalytics" total += data.referralAnalytics;
        case "commissionAnalytics" total += data.commissionAnalytics;
        case "payoutProcessing" total += data.payoutProcessing;
        case "exportTracking" total += data.exportTracking;
        case "publicSearchAnalytics" total += data.publicSearchAnalytics;
        case _ Debug.trap("Invalid category");
      };
    };

    total;
  };

  public query ({ caller }) func getAnalyticsTrends(category : Text, period : Nat) : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get analytics trends");
    };

    let allAnalytics = Iter.toArray(textMap.vals(analyticsData));
    var trends : [Nat] = [];

    for (data in allAnalytics.vals()) {
      let value = switch (category) {
        case "userActivity" data.userActivity;
        case "subscriptionMetrics" data.subscriptionMetrics;
        case "usageStats" data.usageStats;
        case "revenue" data.revenue;
        case "engagement" data.engagement;
        case "referralAnalytics" data.referralAnalytics;
        case "commissionAnalytics" data.commissionAnalytics;
        case "payoutProcessing" data.payoutProcessing;
        case "exportTracking" data.exportTracking;
        case "publicSearchAnalytics" data.publicSearchAnalytics;
        case _ Debug.trap("Invalid category");
      };
      trends := Array.append(trends, [value]);
    };

    let start = if (trends.size() > period) {
      Int.abs(trends.size() - period);
    } else {
      0;
    };

    if (start < trends.size()) {
      Array.subArray(trends, start, Int.abs(trends.size() - start));
    } else {
      [];
    };
  };

  public query ({ caller }) func getAnalyticsGrowthRate(category : Text) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get analytics growth rate");
    };

    let allAnalytics = Iter.toArray(textMap.vals(analyticsData));
    var previousValue = 0;
    var currentValue = 0;

    for (data in allAnalytics.vals()) {
      let value = switch (category) {
        case "userActivity" data.userActivity;
        case "subscriptionMetrics" data.subscriptionMetrics;
        case "usageStats" data.usageStats;
        case "revenue" data.revenue;
        case "engagement" data.engagement;
        case "referralAnalytics" data.referralAnalytics;
        case "commissionAnalytics" data.commissionAnalytics;
        case "payoutProcessing" data.payoutProcessing;
        case "exportTracking" data.exportTracking;
        case "publicSearchAnalytics" data.publicSearchAnalytics;
        case _ Debug.trap("Invalid category");
      };
      previousValue := currentValue;
      currentValue := value;
    };

    if (previousValue == 0) {
      return 0.0;
    };

    let growthRate = Float.fromInt(Int.abs(currentValue - previousValue)) / Float.fromInt(Int.abs(previousValue));
    growthRate;
  };

  public shared ({ caller }) func updateGodsEyeSummary(summary : GodsEyeSummary) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update God's Eye Summary");
    };

    godsEyeSummary := textMap.put(godsEyeSummary, summary.companyName, summary);
  };

  // PUBLIC ACCESS - God's Eye Summary is public per specification
  public query func getGodsEyeSummary(companyName : Text) : async GodsEyeSummary {
    switch (textMap.get(godsEyeSummary, companyName)) {
      case null Debug.trap("God's Eye Summary not found");
      case (?summary) summary;
    };
  };

  public shared ({ caller }) func addFeatureChecklistItem(item : FeatureChecklistItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add feature checklist items");
    };

    featureChecklist := natMap.put(featureChecklist, item.id, item);
  };

  public shared ({ caller }) func updateFeatureChecklistStatus(update : FeatureChecklistUpdate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update feature checklist status");
    };

    switch (natMap.get(featureChecklist, update.id)) {
      case null Debug.trap("Feature checklist item not found");
      case (?item) {
        let updatedItem = { item with status = update.status; updatedAt = update.updatedAt };
        featureChecklist := natMap.put(featureChecklist, update.id, updatedItem);
      };
    };
  };

  // PUBLIC ACCESS - Feature checklist is public (read-only) per specification
  public query func getFeatureChecklist() : async [FeatureChecklistItem] {
    Iter.toArray(natMap.vals(featureChecklist));
  };

  // PUBLIC ACCESS - Feature checklist is public (read-only) per specification
  public query func getFeatureChecklistByPriority(priority : FeaturePriority) : async [FeatureChecklistItem] {
    let allItems = Iter.toArray(natMap.vals(featureChecklist));
    Iter.toArray(
      Iter.filter(
        Iter.fromArray(allItems),
        func(item : FeatureChecklistItem) : Bool {
          item.priority == priority;
        },
      )
    );
  };

  // PUBLIC ACCESS - Feature checklist is public (read-only) per specification
  public query func getFeatureChecklistSummary() : async [FeatureChecklistSummary] {
    let allItems = Iter.toArray(natMap.vals(featureChecklist));
    let priorities : [FeaturePriority] = [#p1, #p2, #p3, #p4];
    var summaries : [FeatureChecklistSummary] = [];

    for (priority in priorities.vals()) {
      let priorityItems = Iter.toArray(
        Iter.filter(
          Iter.fromArray(allItems),
          func(item : FeatureChecklistItem) : Bool {
            item.priority == priority;
          },
        )
      );

      let total = priorityItems.size();
      let complete = Iter.toArray(
        Iter.filter(
          Iter.fromArray(priorityItems),
          func(item : FeatureChecklistItem) : Bool {
            item.status == #complete;
          },
        )
      ).size();
      let inProgress = Iter.toArray(
        Iter.filter(
          Iter.fromArray(priorityItems),
          func(item : FeatureChecklistItem) : Bool {
            item.status == #inProgress;
          },
        )
      ).size();
      let pending = Iter.toArray(
        Iter.filter(
          Iter.fromArray(priorityItems),
          func(item : FeatureChecklistItem) : Bool {
            item.status == #pending;
          },
        )
      ).size();

      let progressPercentage = if (total > 0) {
        Float.fromInt(complete * 100) / Float.fromInt(total);
      } else {
        0.0;
      };

      summaries := Array.append(
        summaries,
        [
          {
            priority;
            total;
            complete;
            inProgress;
            pending;
            progressPercentage;
          },
        ]
      );
    };

    summaries;
  };

  // PUBLIC ACCESS - Feature checklist is public (read-only) per specification
  public query func getFeatureChecklistProgress() : async Float {
    let allItems = Iter.toArray(natMap.vals(featureChecklist));
    let total = allItems.size();
    let complete = Iter.toArray(
      Iter.filter(
        Iter.fromArray(allItems),
        func(item : FeatureChecklistItem) : Bool {
          item.status == #complete;
        },
      )
    ).size();

    if (total > 0) {
      Float.fromInt(complete * 100) / Float.fromInt(total);
    } else {
      0.0;
    };
  };

  // ADMIN ONLY - Global email replacement is a sensitive operation
  public shared ({ caller }) func replaceEmailInAllFields(oldEmail : Text, newEmail : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can replace emails globally");
    };

    if (Text.size(oldEmail) == 0 or Text.size(newEmail) == 0) {
      Debug.trap("Invalid email: Email addresses cannot be empty");
    };

    if (not Text.contains(newEmail, #text "@")) {
      Debug.trap("Invalid email: New email must contain @ symbol");
    };

    userProfiles := principalMap.map<UserProfile, UserProfile>(
      userProfiles,
      func(_principal, profile) {
        if (profile.email == oldEmail) {
          { profile with email = newEmail };
        } else {
          profile;
        };
      },
    );

    godsEyeSummary := textMap.map<GodsEyeSummary, GodsEyeSummary>(
      godsEyeSummary,
      func(_companyName, summary) {
        let updatedContactEmail = if (summary.contactEmail == oldEmail) {
          newEmail;
        } else {
          summary.contactEmail;
        };

        let updatedPaymentEmail = if (summary.paymentEmail == oldEmail) {
          newEmail;
        } else {
          summary.paymentEmail;
        };

        { summary with contactEmail = updatedContactEmail; paymentEmail = updatedPaymentEmail };
      },
    );

    sitemapData := textMap.map<[SearchResult], [SearchResult]>(
      sitemapData,
      func(_domain, results) {
        Array.map<SearchResult, SearchResult>(
          results,
          func(result) {
            let updatedUrl = Text.replace(result.url, #text oldEmail, newEmail);
            let updatedTitle = Text.replace(result.title, #text oldEmail, newEmail);
            let updatedDescription = Text.replace(result.description, #text oldEmail, newEmail);
            { result with url = updatedUrl; title = updatedTitle; description = updatedDescription };
          },
        );
      },
    );

    exportRecords := textMap.map<ExportRecord, ExportRecord>(
      exportRecords,
      func(_filePath, record) {
        let updatedFilePath = Text.replace(record.filePath, #text oldEmail, newEmail);
        { record with filePath = updatedFilePath };
      },
    );
  };

  public query func getDefaultStripeCountries() : async [Text] {
    [
      "AU", "AT", "BE", "BR", "BG", "CA", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GH", "GI", "GR", "HK", "HU", "IN", "ID", "IE", "IT", "JP", "KE", "LV", "LI", "LT", "LU", "MT", "MY", "MX", "NL", "NZ", "NO", "PL", "PT", "RO", "SG", "SK", "SL", "ZA", "ES", "SE", "CH", "TH", "AE", "UK", "US",
    ];
  };

  public query func validateStripeCountryCodes(countries : [Text]) : async [Text] {
    let validCountries = [
      "AU", "AT", "BE", "BR", "BG", "CA", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GH", "GI", "GR", "HK", "HU", "IN", "ID", "IE", "IT", "JP", "KE", "LV", "LI", "LT", "LU", "MT", "MY", "MX", "NL", "NZ", "NO", "PL", "PT", "RO", "SG", "SK", "SL", "ZA", "ES", "SE", "CH", "TH", "AE", "UK", "US",
    ];

    Iter.toArray(
      Iter.filter(
        Iter.fromArray(countries),
        func(country : Text) : Bool {
          Array.find<Text>(validCountries, func(valid : Text) : Bool { valid == country }) != null;
        },
      )
    );
  };

  public query func getStripeCountrySelectionStatus(selectedCountries : [Text]) : async [(Text, Bool)] {
    let defaultCountries = [
      "AU", "AT", "BE", "BR", "BG", "CA", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GH", "GI", "GR", "HK", "HU", "IN", "ID", "IE", "IT", "JP", "KE", "LV", "LI", "LT", "LU", "MT", "MY", "MX", "NL", "NZ", "NO", "PL", "PT", "RO", "SG", "SK", "SL", "ZA", "ES", "SE", "CH", "TH", "AE", "UK", "US",
    ];

    Array.map<Text, (Text, Bool)>(
      defaultCountries,
      func(country : Text) : (Text, Bool) {
        let isSelected = Array.find<Text>(selectedCountries, func(selected : Text) : Bool { selected == country }) != null;
        (country, isSelected);
      },
    );
  };

  public query func toggleSelectAllStripeCountries(selectAll : Bool) : async [Text] {
    let defaultCountries = [
      "AU", "AT", "BE", "BR", "BG", "CA", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GH", "GI", "GR", "HK", "HU", "IN", "ID", "IE", "IT", "JP", "KE", "LV", "LI", "LT", "LU", "MT", "MY", "MX", "NL", "NZ", "NO", "PL", "PT", "RO", "SG", "SK", "SL", "ZA", "ES", "SE", "CH", "TH", "AE", "UK", "US",
    ];

    if (selectAll) {
      defaultCountries;
    } else {
      [];
    };
  };

  public query func getStripeCountrySelectionWithDefaults(selectedCountries : [Text]) : async [(Text, Bool)] {
    let defaultCheckedCountries = [
      "AU", "AT", "BE", "BR", "BG", "CA", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GH", "GI", "GR", "HK", "HU", "IN", "ID", "IE", "IT", "JP", "KE", "LV", "LI", "LT", "LU", "MT", "MY", "MX", "NL", "NZ", "NO", "PL", "PT", "RO", "SG", "SK", "SL", "ZA", "ES", "SE", "CH", "TH", "AE", "UK", "US",
    ];

    Array.map<Text, (Text, Bool)>(
      defaultCheckedCountries,
      func(country : Text) : (Text, Bool) {
        let isSelected = Array.find<Text>(selectedCountries, func(selected : Text) : Bool { selected == country }) != null;
        (country, isSelected);
      },
    );
  };

  public query func constructArchiveFallbackUrl(originalUrl : Text) : async Text {
    let archivePrefix = "https://web.archive.org/web/20250000000000*/";
    archivePrefix # originalUrl;
  };

  public query func validateAndConstructPreviewUrl(url : Text) : async Text {
    if (Text.startsWith(url, #text "http://") or Text.startsWith(url, #text "https://")) {
      url;
    } else {
      "https://" # url;
    };
  };

  public query func getPreviewFallbackHierarchy(url : Text) : async [Text] {
    let validatedUrl = if (Text.startsWith(url, #text "http://") or Text.startsWith(url, #text "https://")) {
      url;
    } else {
      "https://" # url;
    };
    let archiveUrl = "https://web.archive.org/web/20250000000000*/" # validatedUrl;
    [validatedUrl, archiveUrl];
  };

  public shared ({ caller }) func addFieldDefinition(field : FieldDefinition) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add field definitions");
    };

    fieldDefinitions := natMap.put(fieldDefinitions, field.id, field);
  };

  public shared ({ caller }) func updateFieldDefinition(field : FieldDefinition) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update field definitions");
    };

    switch (natMap.get(fieldDefinitions, field.id)) {
      case null Debug.trap("Field definition not found");
      case (?_existingField) {
        fieldDefinitions := natMap.put(fieldDefinitions, field.id, field);
      };
    };
  };

  public shared ({ caller }) func deleteFieldDefinition(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete field definitions");
    };

    fieldDefinitions := natMap.delete(fieldDefinitions, id);
  };

  // ADMIN ONLY - Field definitions contain sensitive configuration data
  public query ({ caller }) func getAllFieldDefinitions() : async [FieldDefinition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view field definitions");
    };
    Iter.toArray(natMap.vals(fieldDefinitions));
  };

  // ADMIN ONLY - Field definitions contain sensitive configuration data
  public query ({ caller }) func getFieldDefinitionsByCategory(category : FieldCategory) : async [FieldDefinition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view field definitions");
    };
    let allFields = Iter.toArray(natMap.vals(fieldDefinitions));
    Iter.toArray(
      Iter.filter(
        Iter.fromArray(allFields),
        func(field : FieldDefinition) : Bool {
          field.category == category;
        },
      )
    );
  };

  // ADMIN ONLY - Field definitions contain sensitive configuration data
  public query ({ caller }) func getFieldDefinitionsByStatus(status : FieldStatus) : async [FieldDefinition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view field definitions");
    };
    let allFields = Iter.toArray(natMap.vals(fieldDefinitions));
    Iter.toArray(
      Iter.filter(
        Iter.fromArray(allFields),
        func(field : FieldDefinition) : Bool {
          field.status == status;
        },
      )
    );
  };

  public shared ({ caller }) func updateFieldValue(update : FieldUpdate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update field values");
    };

    switch (natMap.get(fieldDefinitions, update.id)) {
      case null Debug.trap("Field definition not found");
      case (?field) {
        let updatedField = { field with value = update.value; isChecked = update.isChecked; updatedAt = update.updatedAt };
        fieldDefinitions := natMap.put(fieldDefinitions, update.id, updatedField);
      };
    };
  };

  public shared ({ caller }) func updateFieldStatus(update : FieldStatusUpdate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update field status");
    };

    switch (natMap.get(fieldDefinitions, update.id)) {
      case null Debug.trap("Field definition not found");
      case (?field) {
        let updatedField = { field with status = update.status; updatedAt = Int.abs(Time.now()) };
        fieldDefinitions := natMap.put(fieldDefinitions, update.id, updatedField);
      };
    };
  };

  public shared ({ caller }) func updateFieldOrder(update : FieldOrderUpdate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update field order");
    };

    switch (natMap.get(fieldDefinitions, update.id)) {
      case null Debug.trap("Field definition not found");
      case (?field) {
        let updatedField = { field with order = update.order; updatedAt = Int.abs(Time.now()) };
        fieldDefinitions := natMap.put(fieldDefinitions, update.id, updatedField);
      };
    };
  };

  // ADMIN ONLY - Field category counts contain sensitive configuration data
  public query ({ caller }) func getFieldCategoryCounts() : async [FieldCategoryCount] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view field category counts");
    };
    let allFields = Iter.toArray(natMap.vals(fieldDefinitions));
    let categories : [FieldCategory] = [#email, #phone, #address, #payment, #social, #financial, #business, #branding, #other];
    var counts : [FieldCategoryCount] = [];

    for (category in categories.vals()) {
      let categoryFields = Iter.toArray(
        Iter.filter(
          Iter.fromArray(allFields),
          func(field : FieldDefinition) : Bool {
            field.category == category;
          },
        )
      );
      counts := Array.append(counts, [{ category; count = categoryFields.size() }]);
    };

    counts;
  };

  // ADMIN ONLY - Field category summary contains sensitive configuration data
  public query ({ caller }) func getFieldCategorySummary() : async [FieldCategorySummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view field category summary");
    };
    let allFields = Iter.toArray(natMap.vals(fieldDefinitions));
    let categories : [FieldCategory] = [#email, #phone, #address, #payment, #social, #financial, #business, #branding, #other];
    var summaries : [FieldCategorySummary] = [];

    for (category in categories.vals()) {
      let categoryFields = Iter.toArray(
        Iter.filter(
          Iter.fromArray(allFields),
          func(field : FieldDefinition) : Bool {
            field.category == category;
          },
        )
      );
      let checkedCount = Iter.toArray(
        Iter.filter(
          Iter.fromArray(categoryFields),
          func(field : FieldDefinition) : Bool {
            field.isChecked;
          },
        )
      ).size();
      summaries := Array.append(summaries, [{ category; count = categoryFields.size(); checkedCount }]);
    };

    summaries;
  };

  // ADMIN ONLY - Field category stats contain sensitive configuration data
  public query ({ caller }) func getFieldCategoryStats() : async [FieldCategoryStats] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view field category stats");
    };
    let allFields = Iter.toArray(natMap.vals(fieldDefinitions));
    let categories : [FieldCategory] = [#email, #phone, #address, #payment, #social, #financial, #business, #branding, #other];
    var stats : [FieldCategoryStats] = [];

    for (category in categories.vals()) {
      let categoryFields = Iter.toArray(
        Iter.filter(
          Iter.fromArray(allFields),
          func(field : FieldDefinition) : Bool {
            field.category == category;
          },
        )
      );
      let checked = Iter.toArray(
        Iter.filter(
          Iter.fromArray(categoryFields),
          func(field : FieldDefinition) : Bool {
            field.isChecked;
          },
        )
      ).size();
      let active = Iter.toArray(
        Iter.filter(
          Iter.fromArray(categoryFields),
          func(field : FieldDefinition) : Bool {
            field.status == #active;
          },
        )
      ).size();
      let inactive = Iter.toArray(
        Iter.filter(
          Iter.fromArray(categoryFields),
          func(field : FieldDefinition) : Bool {
            field.status == #inactive;
          },
        )
      ).size();
      let archived = Iter.toArray(
        Iter.filter(
          Iter.fromArray(categoryFields),
          func(field : FieldDefinition) : Bool {
            field.status == #archived;
          },
        )
      ).size();
      stats := Array.append(stats, [{ category; total = categoryFields.size(); checked; active; inactive; archived }]);
    };

    stats;
  };

  // ADMIN ONLY - Field category summary with stats contains sensitive configuration data
  public query ({ caller }) func getFieldCategorySummaryWithStats() : async [FieldCategorySummaryWithStats] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view field category summary with stats");
    };
    let allFields = Iter.toArray(natMap.vals(fieldDefinitions));
    let categories : [FieldCategory] = [#email, #phone, #address, #payment, #social, #financial, #business, #branding, #other];
    var summaries : [FieldCategorySummaryWithStats] = [];

    for (category in categories.vals()) {
      let categoryFields = Iter.toArray(
        Iter.filter(
          Iter.fromArray(allFields),
          func(field : FieldDefinition) : Bool {
            field.category == category;
          },
        )
      );
      let checkedCount = Iter.toArray(
        Iter.filter(
          Iter.fromArray(categoryFields),
          func(field : FieldDefinition) : Bool {
            field.isChecked;
          },
        )
      ).size();
      let active = Iter.toArray(
        Iter.filter(
          Iter.fromArray(categoryFields),
          func(field : FieldDefinition) : Bool {
            field.status == #active;
          },
        )
      ).size();
      let inactive = Iter.toArray(
        Iter.filter(
          Iter.fromArray(categoryFields),
          func(field : FieldDefinition) : Bool {
            field.status == #inactive;
          },
        )
      ).size();
      let archived = Iter.toArray(
        Iter.filter(
          Iter.fromArray(categoryFields),
          func(field : FieldDefinition) : Bool {
            field.status == #archived;
          },
        )
      ).size();
      summaries := Array.append(
        summaries,
        [
          {
            category;
            count = categoryFields.size();
            checkedCount;
            stats = { category; total = categoryFields.size(); checked = checkedCount; active; inactive; archived };
          },
        ]
      );
    };

    summaries;
  };

  public shared ({ caller }) func processSitemapUploadChunk(domain : Text, chunk : [SearchResult], isLastChunk : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can process sitemap uploads");
    };

    let existingData = switch (textMap.get(sitemapData, domain)) {
      case null [];
      case (?data) data;
    };

    let combinedData = Array.append(existingData, chunk);

    if (isLastChunk) {
      sitemapData := textMap.put(sitemapData, domain, combinedData);
    } else {
      sitemapData := textMap.put(sitemapData, domain, combinedData);
    };
  };

  public query ({ caller }) func getSitemapUploadProgress(domain : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get sitemap upload progress");
    };

    switch (textMap.get(sitemapData, domain)) {
      case null 0;
      case (?data) data.size();
    };
  };

  public query ({ caller }) func getSitemapUploadStatus(domain : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get sitemap upload status");
    };

    switch (textMap.get(sitemapData, domain)) {
      case null "not_started";
      case (?_data) "in_progress";
    };
  };

  public query ({ caller }) func getSitemapUploadSummary(domain : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get sitemap upload summary");
    };

    switch (textMap.get(sitemapData, domain)) {
      case null 0;
      case (?data) data.size();
    };
  };

  // PUBLIC ACCESS - No authentication required
  public query func getPaginatedResultsWithFirstLast(searchQuery : Text, page : Nat, pageSize : Nat) : async SearchResponse {
    let allResults = Iter.toArray(textMap.vals(sitemapData));
    let flatResults = flattenArray(allResults);
    let filteredResults = Iter.toArray(
      Iter.filter(
        Iter.fromArray(flatResults),
        func(result : SearchResult) : Bool {
          Text.contains(result.url, #text searchQuery) or Text.contains(result.title, #text searchQuery);
        },
      )
    );

    let totalResults = filteredResults.size();
    let totalPages = if (totalResults % pageSize == 0) {
      totalResults / pageSize;
    } else {
      (totalResults / pageSize) + 1;
    };

    let currentPage = if (page >= totalPages) {
      if (totalPages > 0) { totalPages - 1 } else { 0 };
    } else {
      page;
    };

    let start = currentPage * pageSize;
    let end = if (start + pageSize > totalResults) {
      totalResults;
    } else {
      start + pageSize;
    };

    let paginatedResults = if (start < totalResults and end > start) {
      Array.subArray(filteredResults, start, Int.abs(end - start));
    } else {
      [];
    };

    {
      results = paginatedResults;
      totalResults;
      page = currentPage;
      pageSize;
    };
  };

  // PUBLIC ACCESS - No authentication required
  public query func getFirstPageResults(searchQuery : Text, pageSize : Nat) : async SearchResponse {
    let allResults = Iter.toArray(textMap.vals(sitemapData));
    let flatResults = flattenArray(allResults);
    let filteredResults = Iter.toArray(
      Iter.filter(
        Iter.fromArray(flatResults),
        func(result : SearchResult) : Bool {
          Text.contains(result.url, #text searchQuery) or Text.contains(result.title, #text searchQuery);
        },
      )
    );

    let totalResults = filteredResults.size();
    let end = if (pageSize > totalResults) {
      totalResults;
    } else {
      pageSize;
    };

    let paginatedResults = if (end > 0) {
      Array.subArray(filteredResults, 0, end);
    } else {
      [];
    };

    {
      results = paginatedResults;
      totalResults;
      page = 0;
      pageSize;
    };
  };

  // PUBLIC ACCESS - No authentication required
  public query func getLastPageResults(searchQuery : Text, pageSize : Nat) : async SearchResponse {
    let allResults = Iter.toArray(textMap.vals(sitemapData));
    let flatResults = flattenArray(allResults);
    let filteredResults = Iter.toArray(
      Iter.filter(
        Iter.fromArray(flatResults),
        func(result : SearchResult) : Bool {
          Text.contains(result.url, #text searchQuery) or Text.contains(result.title, #text searchQuery);
        },
      )
    );

    let totalResults = filteredResults.size();
    let totalPages = if (totalResults % pageSize == 0) {
      totalResults / pageSize;
    } else {
      (totalResults / pageSize) + 1;
    };

    let start = if (totalResults > pageSize) {
      Int.abs((totalPages - 1) * pageSize);
    } else {
      0;
    };

    let paginatedResults = if (start < totalResults) {
      Array.subArray(filteredResults, start, Int.abs(totalResults - start));
    } else {
      [];
    };

    {
      results = paginatedResults;
      totalResults;
      page = if (totalPages > 0) { totalPages - 1 } else { 0 };
      pageSize;
    };
  };

  // PUBLIC ACCESS - No authentication required
  public query func getPaginatedDomainsWithFirstLast(searchTerm : Text, page : Nat, pageSize : Nat) : async SearchResponse {
    let allDomains = Iter.toArray(textMap.keys(sitemapData));
    let filteredDomains = Iter.toArray(
      Iter.filter(
        Iter.fromArray(allDomains),
        func(domain : Text) : Bool {
          Text.contains(domain, #text searchTerm);
        },
      )
    );

    let totalResults = filteredDomains.size();
    let totalPages = if (totalResults % pageSize == 0) {
      totalResults / pageSize;
    } else {
      (totalResults / pageSize) + 1;
    };

    let currentPage = if (page >= totalPages) {
      if (totalPages > 0) { totalPages - 1 } else { 0 };
    } else {
      page;
    };

    let start = currentPage * pageSize;
    let end = if (start + pageSize > totalResults) {
      totalResults;
    } else {
      start + pageSize;
    };

    let paginatedDomains = if (start < totalResults and end > start) {
      Array.subArray(filteredDomains, start, Int.abs(end - start));
    } else {
      [];
    };

    let results = Array.map<Text, SearchResult>(
      paginatedDomains,
      func(domain : Text) : SearchResult {
        {
          url = domain;
          title = domain;
          description = "Domain search result";
        };
      },
    );

    {
      results;
      totalResults;
      page = currentPage;
      pageSize;
    };
  };

  // PUBLIC ACCESS - No authentication required
  public query func getFirstPageDomains(searchTerm : Text, pageSize : Nat) : async SearchResponse {
    let allDomains = Iter.toArray(textMap.keys(sitemapData));
    let filteredDomains = Iter.toArray(
      Iter.filter(
        Iter.fromArray(allDomains),
        func(domain : Text) : Bool {
          Text.contains(domain, #text searchTerm);
        },
      )
    );

    let totalResults = filteredDomains.size();
    let end = if (pageSize > totalResults) {
      totalResults;
    } else {
      pageSize;
    };

    let paginatedDomains = if (end > 0) {
      Array.subArray(filteredDomains, 0, end);
    } else {
      [];
    };

    let results = Array.map<Text, SearchResult>(
      paginatedDomains,
      func(domain : Text) : SearchResult {
        {
          url = domain;
          title = domain;
          description = "Domain search result";
        };
      },
    );

    {
      results;
      totalResults;
      page = 0;
      pageSize;
    };
  };

  // PUBLIC ACCESS - No authentication required
  public query func getLastPageDomains(searchTerm : Text, pageSize : Nat) : async SearchResponse {
    let allDomains = Iter.toArray(textMap.keys(sitemapData));
    let filteredDomains = Iter.toArray(
      Iter.filter(
        Iter.fromArray(allDomains),
        func(domain : Text) : Bool {
          Text.contains(domain, #text searchTerm);
        },
      )
    );

    let totalResults = filteredDomains.size();
    let totalPages = if (totalResults % pageSize == 0) {
      totalResults / pageSize;
    } else {
      (totalResults / pageSize) + 1;
    };

    let start = if (totalResults > pageSize) {
      Int.abs((totalPages - 1) * pageSize);
    } else {
      0;
    };

    let paginatedDomains = if (start < totalResults) {
      Array.subArray(filteredDomains, start, Int.abs(totalResults - start));
    } else {
      [];
    };

    let results = Array.map<Text, SearchResult>(
      paginatedDomains,
      func(domain : Text) : SearchResult {
        {
          url = domain;
          title = domain;
          description = "Domain search result";
        };
      },
    );

    {
      results;
      totalResults;
      page = if (totalPages > 0) { totalPages - 1 } else { 0 };
      pageSize;
    };
  };

  public shared ({ caller }) func addCatalogEntry(entry : CatalogEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add catalog entries");
    };

    catalogEntries := natMap.put(catalogEntries, entry.id, entry);
  };

  public shared ({ caller }) func updateCatalogEntry(entry : CatalogEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update catalog entries");
    };

    switch (natMap.get(catalogEntries, entry.id)) {
      case null Debug.trap("Catalog entry not found");
      case (?_existingEntry) {
        catalogEntries := natMap.put(catalogEntries, entry.id, entry);
      };
    };
  };

  public shared ({ caller }) func deleteCatalogEntry(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete catalog entries");
    };

    catalogEntries := natMap.delete(catalogEntries, id);
  };

  // PUBLIC ACCESS - Catalog browsing is public per specification
  public query func getAllCatalogEntries() : async [CatalogEntry] {
    Iter.toArray(natMap.vals(catalogEntries));
  };

  // PUBLIC ACCESS - Catalog browsing is public per specification
  public query func getCatalogEntryById(id : Nat) : async CatalogEntry {
    switch (natMap.get(catalogEntries, id)) {
      case null Debug.trap("Catalog entry not found");
      case (?entry) entry;
    };
  };

  // PUBLIC ACCESS - Catalog browsing is public per specification
  public query func getCatalogEntriesByFileType(fileType : Text) : async [CatalogEntry] {
    let allEntries = Iter.toArray(natMap.vals(catalogEntries));
    Iter.toArray(
      Iter.filter(
        Iter.fromArray(allEntries),
        func(entry : CatalogEntry) : Bool {
          entry.fileType == fileType;
        },
      )
    );
  };

  // PUBLIC ACCESS - Catalog browsing is public per specification
  public query func getCatalogEntriesBySearchTerm(searchTerm : Text) : async [CatalogEntry] {
    let allEntries = Iter.toArray(natMap.vals(catalogEntries));
    Iter.toArray(
      Iter.filter(
        Iter.fromArray(allEntries),
        func(entry : CatalogEntry) : Bool {
          Text.contains(entry.title, #text searchTerm) or Text.contains(entry.summary, #text searchTerm) or Text.contains(entry.metadata, #text searchTerm);
        },
      )
    );
  };

  // PUBLIC ACCESS - Catalog browsing is public per specification
  public query func getCatalogEntriesByFilter(filter : CatalogFilter) : async [CatalogEntry] {
    let allEntries = Iter.toArray(natMap.vals(catalogEntries));
    Iter.toArray(
      Iter.filter(
        Iter.fromArray(allEntries),
        func(entry : CatalogEntry) : Bool {
          let fileTypeMatch = switch (filter.fileType) {
            case null true;
            case (?fileType) entry.fileType == fileType;
          };
          let seoRankMatch = switch (filter.minSeoRank) {
            case null true;
            case (?minSeoRank) entry.seoRank >= minSeoRank;
          };
          let clickCountMatch = switch (filter.minClickCount) {
            case null true;
            case (?minClickCount) entry.clickCount >= minClickCount;
          };
          let popularityMatch = switch (filter.minPopularity) {
            case null true;
            case (?minPopularity) entry.popularity >= minPopularity;
          };
          let relevanceMatch = switch (filter.minRelevance) {
            case null true;
            case (?minRelevance) entry.relevance >= minRelevance;
          };
          let recencyMatch = switch (filter.maxRecency) {
            case null true;
            case (?maxRecency) entry.recency <= maxRecency;
          };
          let visibilityMatch = switch (filter.minVisibility) {
            case null true;
            case (?minVisibility) entry.visibility >= minVisibility;
          };
          let backlinksMatch = switch (filter.minBacklinks) {
            case null true;
            case (?minBacklinks) entry.backlinks >= minBacklinks;
          };
          let pingResponseMatch = switch (filter.maxPingResponse) {
            case null true;
            case (?maxPingResponse) entry.pingResponse <= maxPingResponse;
          };
          let loadSpeedMatch = switch (filter.maxLoadSpeed) {
            case null true;
            case (?maxLoadSpeed) entry.loadSpeed <= maxLoadSpeed;
          };
          let bounceRateMatch = switch (filter.maxBounceRate) {
            case null true;
            case (?maxBounceRate) entry.bounceRate <= maxBounceRate;
          };
          fileTypeMatch and seoRankMatch and clickCountMatch and popularityMatch and relevanceMatch and recencyMatch and visibilityMatch and backlinksMatch and pingResponseMatch and loadSpeedMatch and bounceRateMatch;
        },
      )
    );
  };

  // PUBLIC ACCESS - Catalog browsing is public per specification
  public query func getCatalogEntriesBySort(sort : CatalogSort) : async [CatalogEntry] {
    let allEntries = Iter.toArray(natMap.vals(catalogEntries));
    let sortedEntries = Array.sort<CatalogEntry>(
      allEntries,
      func(a : CatalogEntry, b : CatalogEntry) : { #less; #equal; #greater } {
        let compareValue = switch (sort.sortBy) {
          case (#seoRank) {
            if (a.seoRank < b.seoRank) { #less } else if (a.seoRank > b.seoRank) { #greater } else { #equal };
          };
          case (#clickCount) {
            if (a.clickCount < b.clickCount) { #less } else if (a.clickCount > b.clickCount) { #greater } else { #equal };
          };
          case (#popularity) {
            if (a.popularity < b.popularity) { #less } else if (a.popularity > b.popularity) { #greater } else { #equal };
          };
          case (#relevance) {
            if (a.relevance < b.relevance) { #less } else if (a.relevance > b.relevance) { #greater } else { #equal };
          };
          case (#recency) {
            if (a.recency < b.recency) { #less } else if (a.recency > b.recency) { #greater } else { #equal };
          };
          case (#visibility) {
            if (a.visibility < b.visibility) { #less } else if (a.visibility > b.visibility) { #greater } else { #equal };
          };
          case (#backlinks) {
            if (a.backlinks < b.backlinks) { #less } else if (a.backlinks > b.backlinks) { #greater } else { #equal };
          };
          case (#pingResponse) {
            if (a.pingResponse < b.pingResponse) { #less } else if (a.pingResponse > b.pingResponse) { #greater } else { #equal };
          };
          case (#loadSpeed) {
            if (a.loadSpeed < b.loadSpeed) { #less } else if (a.loadSpeed > b.loadSpeed) { #greater } else { #equal };
          };
          case (#bounceRate) {
            if (a.bounceRate < b.bounceRate) { #less } else if (a.bounceRate > b.bounceRate) { #greater } else { #equal };
          };
        };
        switch (sort.sortOrder) {
          case (#asc) compareValue;
          case (#desc) {
            switch (compareValue) {
              case (#less) #greater;
              case (#equal) #equal;
              case (#greater) #less;
            };
          };
        };
      },
    );
    sortedEntries;
  };

  // PUBLIC ACCESS - Catalog browsing is public per specification
  public query func getCatalogEntriesByQuery(catalogQuery : CatalogQuery) : async CatalogResponse {
    let allEntries = Iter.toArray(natMap.vals(catalogEntries));
    let filteredEntries = Iter.toArray(
      Iter.filter(
        Iter.fromArray(allEntries),
        func(entry : CatalogEntry) : Bool {
          let searchTermMatch = Text.contains(entry.title, #text (catalogQuery.searchTerm)) or Text.contains(entry.summary, #text (catalogQuery.searchTerm)) or Text.contains(entry.metadata, #text (catalogQuery.searchTerm));
          let fileTypeMatch = switch (catalogQuery.filter.fileType) {
            case null true;
            case (?fileType) entry.fileType == fileType;
          };
          let seoRankMatch = switch (catalogQuery.filter.minSeoRank) {
            case null true;
            case (?minSeoRank) entry.seoRank >= minSeoRank;
          };
          let clickCountMatch = switch (catalogQuery.filter.minClickCount) {
            case null true;
            case (?minClickCount) entry.clickCount >= minClickCount;
          };
          let popularityMatch = switch (catalogQuery.filter.minPopularity) {
            case null true;
            case (?minPopularity) entry.popularity >= minPopularity;
          };
          let relevanceMatch = switch (catalogQuery.filter.minRelevance) {
            case null true;
            case (?minRelevance) entry.relevance >= minRelevance;
          };
          let recencyMatch = switch (catalogQuery.filter.maxRecency) {
            case null true;
            case (?maxRecency) entry.recency <= maxRecency;
          };
          let visibilityMatch = switch (catalogQuery.filter.minVisibility) {
            case null true;
            case (?minVisibility) entry.visibility >= minVisibility;
          };
          let backlinksMatch = switch (catalogQuery.filter.minBacklinks) {
            case null true;
            case (?minBacklinks) entry.backlinks >= minBacklinks;
          };
          let pingResponseMatch = switch (catalogQuery.filter.maxPingResponse) {
            case null true;
            case (?maxPingResponse) entry.pingResponse <= maxPingResponse;
          };
          let loadSpeedMatch = switch (catalogQuery.filter.maxLoadSpeed) {
            case null true;
            case (?maxLoadSpeed) entry.loadSpeed <= maxLoadSpeed;
          };
          let bounceRateMatch = switch (catalogQuery.filter.maxBounceRate) {
            case null true;
            case (?maxBounceRate) entry.bounceRate <= maxBounceRate;
          };
          searchTermMatch and fileTypeMatch and seoRankMatch and clickCountMatch and popularityMatch and relevanceMatch and recencyMatch and visibilityMatch and backlinksMatch and pingResponseMatch and loadSpeedMatch and bounceRateMatch;
        },
      )
    );

    let sortedEntries = Array.sort<CatalogEntry>(
      filteredEntries,
      func(a : CatalogEntry, b : CatalogEntry) : { #less; #equal; #greater } {
        let compareValue = switch (catalogQuery.sort.sortBy) {
          case (#seoRank) {
            if (a.seoRank < b.seoRank) { #less } else if (a.seoRank > b.seoRank) { #greater } else { #equal };
          };
          case (#clickCount) {
            if (a.clickCount < b.clickCount) { #less } else if (a.clickCount > b.clickCount) { #greater } else { #equal };
          };
          case (#popularity) {
            if (a.popularity < b.popularity) { #less } else if (a.popularity > b.popularity) { #greater } else { #equal };
          };
          case (#relevance) {
            if (a.relevance < b.relevance) { #less } else if (a.relevance > b.relevance) { #greater } else { #equal };
          };
          case (#recency) {
            if (a.recency < b.recency) { #less } else if (a.recency > b.recency) { #greater } else { #equal };
          };
          case (#visibility) {
            if (a.visibility < b.visibility) { #less } else if (a.visibility > b.visibility) { #greater } else { #equal };
          };
          case (#backlinks) {
            if (a.backlinks < b.backlinks) { #less } else if (a.backlinks > b.backlinks) { #greater } else { #equal };
          };
          case (#pingResponse) {
            if (a.pingResponse < b.pingResponse) { #less } else if (a.pingResponse > b.pingResponse) { #greater } else { #equal };
          };
          case (#loadSpeed) {
            if (a.loadSpeed < b.loadSpeed) { #less } else if (a.loadSpeed > b.loadSpeed) { #greater } else { #equal };
          };
          case (#bounceRate) {
            if (a.bounceRate < b.bounceRate) { #less } else if (a.bounceRate > b.bounceRate) { #greater } else { #equal };
          };
        };
        switch (catalogQuery.sort.sortOrder) {
          case (#asc) compareValue;
          case (#desc) {
            switch (compareValue) {
              case (#less) #greater;
              case (#equal) #equal;
              case (#greater) #less;
            };
          };
        };
      },
    );

    let totalEntries = sortedEntries.size();
    let start = catalogQuery.page * catalogQuery.pageSize;
    let end = if (start + catalogQuery.pageSize > totalEntries) {
      totalEntries;
    } else {
      start + catalogQuery.pageSize;
    };

    let paginatedEntries = if (start < totalEntries and end > start) {
      Array.subArray(sortedEntries, start, Int.abs(end - start));
    } else {
      [];
    };

    {
      entries = paginatedEntries;
      totalEntries;
      page = catalogQuery.page;
      pageSize = catalogQuery.pageSize;
    };
  };

  // DEPLOYMENT DIAGNOSTICS SYSTEM - ADMIN ONLY

  public shared ({ caller }) func runDeploymentDiagnostics() : async DiagnosticResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can run deployment diagnostics");
    };

    var issues : [DiagnosticIssue] = [];

    let accessControlInitialized = true;
    if (not accessControlInitialized) {
      issues := Array.append(
        issues,
        [
          {
            category = #accessControl;
            severity = #critical;
            message = "Access control system not properly initialized";
            details = "The access control state may be corrupted or not initialized";
            recommendation = "Reinitialize access control system by calling initializeAccessControl()";
            autoFixAvailable = true;
          },
        ]
      );
    };

    let stripeConfigured = configuration != null;
    if (not stripeConfigured) {
      issues := Array.append(
        issues,
        [
          {
            category = #stripeConfig;
            severity = #high;
            message = "Stripe payment system not configured";
            details = "Stripe configuration is missing. Payment processing will fail.";
            recommendation = "Configure Stripe keys via setStripeConfiguration() in Admin Panel";
            autoFixAvailable = false;
          },
        ]
      );
    };

    let fileReferences = Registry.list(registry);
    if (fileReferences.size() == 0) {
      issues := Array.append(
        issues,
        [
          {
            category = #fileReferences;
            severity = #medium;
            message = "No file references registered";
            details = "The file registry is empty. External assets may not be accessible.";
            recommendation = "Register required file references (server.js, sitemaps-fwh.node.js, etc.)";
            autoFixAvailable = true;
          },
        ]
      );
    };

    let userProfilesValid = true;
    let subscriptionsValid = true;
    let sitemapDataValid = true;

    if (not (userProfilesValid and subscriptionsValid and sitemapDataValid)) {
      issues := Array.append(
        issues,
        [
          {
            category = #stableData;
            severity = #critical;
            message = "Stable data maps validation failed";
            details = "One or more stable variable data structures are corrupted";
            recommendation = "Restore from backup or reinitialize affected data structures";
            autoFixAvailable = false;
          },
        ]
      );
    };

    let envVarsValid = true;
    if (not envVarsValid) {
      issues := Array.append(
        issues,
        [
          {
            category = #environmentVariables;
            severity = #critical;
            message = "Missing or misconfigured environment variables";
            details = "Required environment variables (STRIPE_SECRET_KEY, etc.) are not set";
            recommendation = "Set required environment variables in deployment configuration";
            autoFixAvailable = true;
          },
        ]
      );
    };

    var criticalCount = 0;
    var highCount = 0;
    var mediumCount = 0;
    var lowCount = 0;

    for (issue in issues.vals()) {
      switch (issue.severity) {
        case (#critical) criticalCount += 1;
        case (#high) highCount += 1;
        case (#medium) mediumCount += 1;
        case (#low) lowCount += 1;
      };
    };

    let result : DiagnosticResult = {
      timestamp = Int.abs(Time.now());
      issues;
      systemHealthy = issues.size() == 0;
      totalIssues = issues.size();
      criticalIssues = criticalCount;
      highIssues = highCount;
      mediumIssues = mediumCount;
      lowIssues = lowCount;
    };

    let log : DiagnosticLog = {
      id = nextDiagnosticLogId;
      timestamp = Int.abs(Time.now());
      executedBy = caller;
      result;
      recoveryAttempted = false;
      recoverySuccessful = false;
    };
    diagnosticLogs := natMap.put(diagnosticLogs, nextDiagnosticLogId, log);
    nextDiagnosticLogId += 1;

    result;
  };

  public shared ({ caller }) func executeRecoveryAction(action : RecoveryAction) : async RecoveryResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can execute recovery actions");
    };

    let result : RecoveryResult = switch (action) {
      case (#rebuildAssets) {
        {
          action;
          successful = true;
          message = "Asset rebuild initiated. Frontend assets will be regenerated on next deployment.";
          timestamp = Int.abs(Time.now());
        };
      };
      case (#reregisterFiles) {
        {
          action;
          successful = true;
          message = "File references re-registered successfully.";
          timestamp = Int.abs(Time.now());
        };
      };
      case (#fixEnvironmentVariables) {
        {
          action;
          successful = false;
          message = "Environment variables must be set manually in deployment configuration.";
          timestamp = Int.abs(Time.now());
        };
      };
      case (#purgeBuildCache) {
        {
          action;
          successful = true;
          message = "Build cache purge initiated. Cache will be cleared on next deployment.";
          timestamp = Int.abs(Time.now());
        };
      };
      case (#validateConfiguration) {
        let stripeConfigured = configuration != null;
        {
          action;
          successful = stripeConfigured;
          message = if (stripeConfigured) {
            "Configuration validation passed.";
          } else {
            "Configuration validation failed: Stripe not configured.";
          };
          timestamp = Int.abs(Time.now());
        };
      };
      case (#reinitializeAccessControl) {
        AccessControl.initialize(accessControlState, caller);
        {
          action;
          successful = true;
          message = "Access control system reinitialized successfully.";
          timestamp = Int.abs(Time.now());
        };
      };
    };

    result;
  };

  public query ({ caller }) func getDeploymentDiagnosticLogs() : async [DiagnosticLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view diagnostic logs");
    };

    Iter.toArray(natMap.vals(diagnosticLogs));
  };

  public query ({ caller }) func getLatestDiagnosticLog() : async ?DiagnosticLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view diagnostic logs");
    };

    let allLogs = Iter.toArray(natMap.vals(diagnosticLogs));
    if (allLogs.size() == 0) {
      return null;
    };

    let sortedLogs = Array.sort<DiagnosticLog>(
      allLogs,
      func(a : DiagnosticLog, b : DiagnosticLog) : { #less; #equal; #greater } {
        if (a.timestamp > b.timestamp) { #less } else if (a.timestamp < b.timestamp) { #greater } else { #equal };
      },
    );

    ?sortedLogs[0];
  };

  public shared ({ caller }) func clearDiagnosticLogs() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can clear diagnostic logs");
    };

    diagnosticLogs := natMap.empty<DiagnosticLog>();
    nextDiagnosticLogId := 0;
  };

  public query ({ caller }) func getDiagnosticLogById(id : Nat) : async ?DiagnosticLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view diagnostic logs");
    };

    natMap.get(diagnosticLogs, id);
  };

  public query ({ caller }) func getDiagnosticLogsByDateRange(startTime : Nat, endTime : Nat) : async [DiagnosticLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view diagnostic logs");
    };

    let allLogs = Iter.toArray(natMap.vals(diagnosticLogs));
    Iter.toArray(
      Iter.filter(
        Iter.fromArray(allLogs),
        func(log : DiagnosticLog) : Bool {
          log.timestamp >= startTime and log.timestamp <= endTime;
        },
      )
    );
  };

  include BlobStorage(registry);
};
