import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Char "mo:base/Char";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Access control
  let accessControlState = AccessControl.initState();

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

  public type UserProfile = {
    name : Text;
    stripeCustomerId : ?Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

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

  // Storage
  let storage = Storage.new();
  include MixinStorage(storage);

  // Workflow types
  public type WorkflowMetadata = {
    id : Text;
    title : Text;
    category : Text;
    description : Text;
    tags : [Text];
    triggerType : Text;
    accessType : {
      #payPerRun;
      #subscription;
    };
    priceInCents : Nat;
    version : Nat;
    creator : Principal;
  };

  public type Workflow = {
    metadata : WorkflowMetadata;
    json : Text;
  };

  // Data storage
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var workflows = textMap.empty<Workflow>();

  // Workflow management - Admin only for uploads
  public shared ({ caller }) func uploadWorkflow(metadata : WorkflowMetadata, json : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can upload workflows");
    };
    let workflow : Workflow = {
      metadata;
      json;
    };
    workflows := textMap.put(workflows, metadata.id, workflow);
  };

  // Public access - anyone can browse workflow metadata
  public query func getWorkflow(id : Text) : async ?Workflow {
    textMap.get(workflows, id);
  };

  // Public access - anyone can search workflows
  public query func searchWorkflows(searchTerm : Text) : async [WorkflowMetadata] {
    let results = Iter.toArray(textMap.vals(workflows));
    let filtered = Array.filter<WorkflowMetadata>(
      Array.map<Workflow, WorkflowMetadata>(results, func(w) { w.metadata }),
      func(meta) {
        Text.contains(Text.toLowercase(meta.title), #text(Text.toLowercase(searchTerm))) or Text.contains(Text.toLowercase(meta.description), #text(Text.toLowercase(searchTerm)));
      },
    );
    filtered;
  };

  // Public access - anyone can filter by category
  public query func filterWorkflowsByCategory(category : Text) : async [WorkflowMetadata] {
    let results = Iter.toArray(textMap.vals(workflows));
    let filtered = Array.filter<WorkflowMetadata>(
      Array.map<Workflow, WorkflowMetadata>(results, func(w) { w.metadata }),
      func(meta) { meta.category == category },
    );
    filtered;
  };

  // Public access - pagination for browsing
  public query func getWorkflowsPaginated(page : Nat, pageSize : Nat) : async {
    workflows : [WorkflowMetadata];
    totalPages : Nat;
    currentPage : Nat;
  } {
    let allWorkflows = Iter.toArray(textMap.vals(workflows));
    let totalWorkflows = allWorkflows.size();
    let totalPages = if (totalWorkflows % pageSize == 0) {
      totalWorkflows / pageSize;
    } else {
      (totalWorkflows / pageSize) + 1;
    };

    let start = page * pageSize;
    let end = if (start + pageSize > totalWorkflows) {
      totalWorkflows;
    } else {
      start + pageSize;
    };

    let paginated = Array.tabulate<WorkflowMetadata>(
      end - start,
      func(i) {
        allWorkflows[start + i].metadata;
      },
    );

    {
      workflows = paginated;
      totalPages;
      currentPage = page;
    };
  };

  // Public access - total count for pagination
  public query func getTotalWorkflowCount() : async Nat {
    textMap.size(workflows);
  };

  // Stripe integration - Admin only for configuration
  let allowedCountries : [Text] = [
    "AU", "AT", "BE", "BR", "BG", "CA", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GI", "GR", "HK", "HU", "IE", "IT", "JP", "LV", "LI", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NO", "PL", "PT", "RO", "SG", "SK", "SI", "ES", "SE", "CH", "TH", "AE", "GB", "US",
  ];

  var stripeConfigured = false;
  var stripeSecretKey : ?Text = null;
  var stripePublicKey : ?Text = null;

  // Public query - anyone can check if Stripe is configured
  public query func isStripeConfigured() : async Bool {
    stripeConfigured;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set Stripe configuration");
    };

    if (config.secretKey == "") {
      Debug.trap("Secret key must be provided");
    };

    stripeSecretKey := ?config.secretKey;
    stripeConfigured := true;
  };

  public shared ({ caller }) func setStripeKeys(secretKey : Text, publicKey : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set Stripe keys");
    };

    if (secretKey == "" or publicKey == "") {
      Debug.trap("Both secret and public keys must be provided");
    };

    stripeSecretKey := ?secretKey;
    stripePublicKey := ?publicKey;
    stripeConfigured := true;
  };

  public query ({ caller }) func getStripeKeys() : async {
    publicKey : Text;
    secretKey : Text;
    isMasked : Bool;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can access Stripe keys");
    };

    switch (stripePublicKey, stripeSecretKey) {
      case (null, _) { Debug.trap("Stripe public key not set") };
      case (_, null) { Debug.trap("Stripe secret key not set") };
      case (?publicKey, ?_secretKey) {
        {
          publicKey;
          secretKey = "****";
          isMasked = true;
        };
      };
    };
  };

  public shared ({ caller }) func updateStripeKeys(secretKey : Text, publicKey : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update Stripe keys");
    };

    if (secretKey == "" or publicKey == "") {
      Debug.trap("Both secret and public keys must be provided");
    };

    stripeSecretKey := ?secretKey;
    stripePublicKey := ?publicKey;
    stripeConfigured := true;
  };

  public shared ({ caller }) func revealStripeSecretKey() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can reveal Stripe secret key");
    };

    switch (stripeSecretKey) {
      case (null) { Debug.trap("Stripe secret key not set") };
      case (?secretKey) { secretKey };
    };
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeSecretKey) {
      case (null) { Debug.trap("Stripe secret key not set") };
      case (?secretKey) {
        {
          secretKey;
          allowedCountries;
        };
      };
    };
  };

  // User access - authenticated users can check session status
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // User access - only authenticated users can create checkout sessions
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create checkout sessions");
    };

    if (items.size() == 0) {
      Debug.trap("No items provided for checkout");
    };

    for (item in items.vals()) {
      if (item.priceInCents < 10) {
        Debug.trap("Item price must be at least $0.10");
      };
    };

    let sessionUrl = await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);

    if (sessionUrl == "") {
      Debug.trap("Failed to create Stripe checkout session");
    };

    sessionUrl;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Static page content types
  public type PageContent = {
    title : Text;
    content : Text;
    lastUpdated : Int;
  };

  public type FaqEntry = {
    question : Text;
    answer : Text;
  };

  // Static page storage
  var homePage : ?PageContent = null;
  var blogPage : ?PageContent = null;
  var aboutPage : ?PageContent = null;
  var prosPage : ?PageContent = null;
  var whatWeDoPage : ?PageContent = null;
  var whyUsPage : ?PageContent = null;
  var termsPage : ?PageContent = null;
  var referralPage : ?PageContent = null;
  var trustPage : ?PageContent = null;
  var sitemapPage : ?PageContent = null;
  var adminPage : ?PageContent = null;
  var dashboardPage : ?PageContent = null;
  var featuresPage : ?PageContent = null;
  var subscribersPage : ?PageContent = null;
  var contactPage : ?PageContent = null;

  var faqEntries : [FaqEntry] = [];

  // Admin only - update page content
  public shared ({ caller }) func updatePage(pageName : Text, content : PageContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update pages");
    };

    switch (pageName) {
      case ("home") { homePage := ?content };
      case ("blog") { blogPage := ?content };
      case ("about") { aboutPage := ?content };
      case ("pros") { prosPage := ?content };
      case ("whatWeDo") { whatWeDoPage := ?content };
      case ("whyUs") { whyUsPage := ?content };
      case ("terms") { termsPage := ?content };
      case ("referral") { referralPage := ?content };
      case ("trust") { trustPage := ?content };
      case ("sitemap") { sitemapPage := ?content };
      case ("admin") { adminPage := ?content };
      case ("dashboard") { dashboardPage := ?content };
      case ("features") { featuresPage := ?content };
      case ("subscribers") { subscribersPage := ?content };
      case ("contact") { contactPage := ?content };
      case (_) { Debug.trap("Invalid page name") };
    };
  };

  // Public access - anyone can view public page content
  public query func getPage(pageName : Text) : async ?PageContent {
    switch (pageName) {
      case ("home") { homePage };
      case ("blog") { blogPage };
      case ("about") { aboutPage };
      case ("pros") { prosPage };
      case ("whatWeDo") { whatWeDoPage };
      case ("whyUs") { whyUsPage };
      case ("terms") { termsPage };
      case ("referral") { referralPage };
      case ("trust") { trustPage };
      case ("sitemap") { sitemapPage };
      case ("admin") { adminPage };
      case ("dashboard") { dashboardPage };
      case ("features") { featuresPage };
      case ("subscribers") { subscribersPage };
      case ("contact") { contactPage };
      case (_) { null };
    };
  };

  public shared ({ caller }) func addFaqEntry(entry : FaqEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add FAQ entries");
    };
    faqEntries := Array.append(faqEntries, [entry]);
  };

  // Public access - anyone can view FAQ entries
  public query func getFaqEntries() : async [FaqEntry] {
    faqEntries;
  };

  // Referral system types
  public type ReferralRecord = {
    referrer : Principal;
    referral : Principal;
    campaignId : Text;
    timestamp : Int;
  };

  public type MerkleRoot = {
    rootHash : Text;
    campaignId : Text;
    timestamp : Int;
  };

  // Referral system storage
  var referralRecords : [ReferralRecord] = [];
  var merkleRoots : [MerkleRoot] = [];

  // Admin only - add referral records
  public shared ({ caller }) func addReferralRecord(record : ReferralRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add referral records");
    };
    referralRecords := Array.append(referralRecords, [record]);
  };

  public shared ({ caller }) func addMerkleRoot(root : MerkleRoot) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add Merkle roots");
    };
    merkleRoots := Array.append(merkleRoots, [root]);
  };

  // Admin only - view detailed referral records
  public query ({ caller }) func getReferralRecords() : async [ReferralRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view referral records");
    };
    referralRecords;
  };

  public query ({ caller }) func getMerkleRoots() : async [MerkleRoot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view Merkle roots");
    };
    merkleRoots;
  };

  // Trust verification types
  public type TrustProof = {
    user : Principal;
    workflowId : Text;
    proofData : Text;
    timestamp : Int;
    verified : Bool;
  };

  // Trust verification storage
  var trustProofs : [TrustProof] = [];

  // User access - authenticated users can submit trust proofs
  public shared ({ caller }) func submitTrustProof(proof : TrustProof) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can submit trust proofs");
    };
    trustProofs := Array.append(trustProofs, [proof]);
  };

  // Admin only - view all trust proofs
  public query ({ caller }) func getTrustProofs() : async [TrustProof] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view trust proofs");
    };
    trustProofs;
  };

  // Company information type
  public type CompanyInfo = {
    name : Text;
    ceo : Text;
    email : Text;
    phone : Text;
    website : Text;
    whatsapp : Text;
    address : Text;
    paypal : Text;
    upi : Text;
    eth : Text;
    socialLinks : {
      facebook : Text;
      linkedin : Text;
      telegram : Text;
      discord : Text;
      blog : Text;
      instagram : Text;
      twitter : Text;
      youtube : Text;
    };
    lastUpdated : Int;
  };

  // Company information storage
  var companyInfo : ?CompanyInfo = ?{
    name = "SECOINFI";
    ceo = "DILEEP KUMAR D";
    email = "dild26@gmail.com";
    phone = "+91-962-005-8644";
    website = "www.seco.in.net";
    whatsapp = "+91-962-005-8644";
    address = "Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097";
    paypal = "newgoldenjewel@gmail.com";
    upi = "secoin@uboi";
    eth = "0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7";
    socialLinks = {
      facebook = "https://facebook.com/dild26";
      linkedin = "https://www.linkedin.com/in/dild26";
      telegram = "https://t.me/dilee";
      discord = "https://discord.com/users/dild26";
      blog = "https://dildiva.blogspot.com";
      instagram = "https://instagram.com/newgoldenjewel";
      twitter = "https://twitter.com/dil_sec";
      youtube = "https://m.youtube.com/@dileepkumard4484/videos";
    };
    lastUpdated = 1718000000;
  };

  // Admin only - update company info
  public shared ({ caller }) func updateCompanyInfo(info : CompanyInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update company info");
    };
    companyInfo := ?info;
  };

  // Public access - anyone can view company info
  public query func getCompanyInfo() : async ?CompanyInfo {
    companyInfo;
  };

  // Processed file types
  public type ProcessedFile = {
    filename : Text;
    content : Text;
    fields : [(Text, Text)];
    status : {
      #success;
      #error : Text;
    };
    timestamp : Int;
  };

  // Processed file storage
  var processedFiles : [ProcessedFile] = [];

  // Admin only - add processed files
  public shared ({ caller }) func addProcessedFile(file : ProcessedFile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add processed files");
    };
    processedFiles := Array.append(processedFiles, [file]);
  };

  // Admin only - view processed files
  public query ({ caller }) func getProcessedFiles() : async [ProcessedFile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view processed files");
    };
    processedFiles;
  };

  // Form template types
  public type FormTemplate = {
    id : Text;
    name : Text;
    fields : [(Text, Text)];
    category : Text;
    status : {
      #parsed;
      #pending;
      #error : Text;
    };
    timestamp : Int;
  };

  // Form template storage
  var formTemplates : [FormTemplate] = [];

  // Admin only - add form templates
  public shared ({ caller }) func addFormTemplate(template : FormTemplate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add form templates");
    };
    formTemplates := Array.append(formTemplates, [template]);
  };

  // Public access - anyone can view form template previews (browsing)
  // Filling and submission requires user authentication (handled in frontend/separate functions)
  public query func getFormTemplates() : async [FormTemplate] {
    formTemplates;
  };

  // User access - only authenticated users can fill/submit forms
  public shared ({ caller }) func submitFormTemplate(templateId : Text, filledData : [(Text, Text)]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can submit form templates");
    };
    // Form submission logic here
  };

  // Error log types
  public type ErrorLog = {
    message : Text;
    file : ?Text;
    timestamp : Int;
    resolved : Bool;
  };

  // Error log storage
  var errorLogs : [ErrorLog] = [];

  // Admin only - error log management
  public shared ({ caller }) func addErrorLog(log : ErrorLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add error logs");
    };
    errorLogs := Array.append(errorLogs, [log]);
  };

  public query ({ caller }) func getErrorLogs() : async [ErrorLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view error logs");
    };
    errorLogs;
  };

  // Theme preference types
  public type ThemePreference = {
    user : Principal;
    theme : {
      #default;
      #vibgyor;
    };
    timestamp : Int;
  };

  // Theme preference storage
  var themePreferences : [ThemePreference] = [];

  // User access - authenticated users can set theme preferences
  public shared ({ caller }) func setThemePreference(preference : ThemePreference) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can set theme preferences");
    };
    themePreferences := Array.append(themePreferences, [preference]);
  };

  public query ({ caller }) func getThemePreference() : async ?ThemePreference {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view theme preferences");
    };
    Array.find<ThemePreference>(themePreferences, func(p) { p.user == caller });
  };

  // Admin only - file processing
  public shared ({ caller }) func processFiles(files : [ProcessedFile]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can process files");
    };

    for (file in files.vals()) {
      switch (file.status) {
        case (#success) {
          let template : FormTemplate = {
            id = file.filename;
            name = file.filename;
            fields = file.fields;
            category = "Automation";
            status = #parsed;
            timestamp = file.timestamp;
          };
          formTemplates := Array.append(formTemplates, [template]);
        };
        case (#error(_)) {
          errorLogs := Array.append(errorLogs, [{
            message = "File processing error";
            file = ?file.filename;
            timestamp = file.timestamp;
            resolved = false;
          }]);
        };
      };
    };
  };

  // Admin only - save all forms
  public shared ({ caller }) func saveAllForms() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can save forms");
    };

    for (template in formTemplates.vals()) {
      if (template.status == #parsed) {
        processedFiles := Array.append(processedFiles, [{
          filename = template.name;
          content = "";
          fields = template.fields;
          status = #success;
          timestamp = template.timestamp;
        }]);
      };
    };
  };

  // Feature report types
  public type FeatureReport = {
    featureName : Text;
    implemented : Bool;
    description : Text;
    timestamp : Int;
  };

  // Feature report storage
  var featureReports : [FeatureReport] = [];

  // Admin only - add feature reports
  public shared ({ caller }) func addFeatureReport(report : FeatureReport) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add feature reports");
    };
    featureReports := Array.append(featureReports, [report]);
  };

  // Public access - anyone can view feature reports
  public query func getFeatureReports() : async [FeatureReport] {
    featureReports;
  };

  // Fixture section types
  public type FixtureSection = {
    topic : Text;
    features : [FeatureReport];
    lastUpdated : Int;
  };

  // Fixture section storage
  var fixtureSections : [FixtureSection] = [];

  // Admin only - add fixture sections
  public shared ({ caller }) func addFixtureSection(section : FixtureSection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add fixture sections");
    };
    fixtureSections := Array.append(fixtureSections, [section]);
  };

  // Public access - anyone can view fixture sections
  public query func getFixtureSections() : async [FixtureSection] {
    fixtureSections;
  };

  // PAYU fee structure types
  public type PayuFeeStructure = {
    top10 : Nat;
    top100 : Nat;
    top1000 : Nat;
    lastUpdated : Int;
  };

  // PAYU fee structure storage
  var payuFeeStructure : ?PayuFeeStructure = ?{
    top10 = 100;
    top100 = 1000;
    top1000 = 10000;
    lastUpdated = 1718000000;
  };

  // Admin only - update PAYU fee structure
  public shared ({ caller }) func updatePayuFeeStructure(feeStructure : PayuFeeStructure) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update PAYU fee structure");
    };
    payuFeeStructure := ?feeStructure;
  };

  // Public access - anyone can view PAYU fee structure
  public query func getPayuFeeStructure() : async ?PayuFeeStructure {
    payuFeeStructure;
  };

  // Referrer earnings types
  public type ReferrerEarnings = {
    referrer : Principal;
    earnings : Nat;
    tier : {
      #top10;
      #top100;
      #top1000;
    };
    timestamp : Int;
  };

  // Referrer earnings storage
  var referrerEarnings : [ReferrerEarnings] = [];

  // Admin only - add referrer earnings
  public shared ({ caller }) func addReferrerEarnings(earnings : ReferrerEarnings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add referrer earnings");
    };
    referrerEarnings := Array.append(referrerEarnings, [earnings]);
  };

  // Admin only - view referrer earnings
  public query ({ caller }) func getReferrerEarnings() : async [ReferrerEarnings] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view referrer earnings");
    };
    referrerEarnings;
  };

  // 12-month income projection types
  public type IncomeProjection = {
    referrer : Principal;
    month : Nat;
    projectedEarnings : Nat;
    timestamp : Int;
  };

  // Income projection storage
  var incomeProjections : [IncomeProjection] = [];

  // Admin only - add income projections
  public shared ({ caller }) func addIncomeProjection(projection : IncomeProjection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add income projections");
    };
    incomeProjections := Array.append(incomeProjections, [projection]);
  };

  // Admin only - view income projections
  public query ({ caller }) func getIncomeProjections() : async [IncomeProjection] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view income projections");
    };
    incomeProjections;
  };

  // Referral banner types
  public type ReferralBanner = {
    id : Text;
    referrer : Principal;
    campaignId : Text;
    trackingCode : Text;
    permalink : Text;
    timestamp : Int;
  };

  // Referral banner storage
  var referralBanners : [ReferralBanner] = [];

  // Admin only - add referral banners
  public shared ({ caller }) func addReferralBanner(banner : ReferralBanner) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add referral banners");
    };
    referralBanners := Array.append(referralBanners, [banner]);
  };

  // User access - authenticated users can view referral banners
  public query ({ caller }) func getReferralBanners() : async [ReferralBanner] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view referral banners");
    };
    referralBanners;
  };

  // UID, Nonce, and UserID types
  public type TransactionId = {
    uid : Text;
    nonce : Nat;
    userId : Principal;
    timestamp : Int;
  };

  // Transaction ID storage
  var transactionIds : [TransactionId] = [];

  // Admin only - transaction ID management
  public shared ({ caller }) func addTransactionId(transactionId : TransactionId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add transaction IDs");
    };
    transactionIds := Array.append(transactionIds, [transactionId]);
  };

  public query ({ caller }) func getTransactionIds() : async [TransactionId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view transaction IDs");
    };
    transactionIds;
  };

  // Backup system types
  public type BackupSnapshot = {
    id : Text;
    timestamp : Int;
    data : Text;
    description : Text;
  };

  // Backup system storage
  var backupSnapshots : [BackupSnapshot] = [];

  // Admin only - backup system management
  public shared ({ caller }) func createBackupSnapshot(snapshot : BackupSnapshot) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create backup snapshots");
    };
    backupSnapshots := Array.append(backupSnapshots, [snapshot]);
  };

  public query ({ caller }) func getBackupSnapshots() : async [BackupSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view backup snapshots");
    };
    backupSnapshots;
  };

  public shared ({ caller }) func restoreFromBackup(snapshotId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can restore from backup");
    };

    let snapshot = Array.find<BackupSnapshot>(backupSnapshots, func(s) { s.id == snapshotId });
    switch (snapshot) {
      case (null) { Debug.trap("Backup snapshot not found") };
      case (?_s) {
        // Restore logic would go here
      };
    };
  };

  // Activity log types
  public type ActivityLog = {
    id : Text;
    action : Text;
    timestamp : Int;
    user : Principal;
    details : Text;
  };

  // Activity log storage
  var activityLogs : [ActivityLog] = [];

  // Admin only - activity log management
  public shared ({ caller }) func addActivityLog(log : ActivityLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add activity logs");
    };
    activityLogs := Array.append(activityLogs, [log]);
  };

  public query ({ caller }) func getActivityLogs() : async [ActivityLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view activity logs");
    };
    activityLogs;
  };

  // Workflow item pricing types
  public type WorkflowPricing = {
    workflowId : Text;
    basePriceInCents : Nat;
    userMultiplier : Nat;
    totalUnitsOrdered : Nat;
    priceHistory : [Nat];
    lastUpdated : Int;
  };

  // Workflow pricing storage
  var workflowPricing : [WorkflowPricing] = [];

  // Admin only - set workflow pricing
  public shared ({ caller }) func setWorkflowPricing(pricing : WorkflowPricing) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set workflow pricing");
    };

    if (pricing.basePriceInCents < 10) {
      Debug.trap("Base price must be at least $0.10");
    };

    if (pricing.userMultiplier == 0) {
      Debug.trap("User multiplier must be at least 1");
    };

    workflowPricing := Array.append(workflowPricing, [pricing]);
  };

  // Public access - anyone can view workflow pricing
  public query func getWorkflowPricing(workflowId : Text) : async ?WorkflowPricing {
    Array.find<WorkflowPricing>(workflowPricing, func(p) { p.workflowId == workflowId });
  };

  // Public access - anyone can calculate final price
  public query func calculateFinalPrice(workflowId : Text, userMultiplier : Nat) : async Nat {
    switch (Array.find<WorkflowPricing>(workflowPricing, func(p) { p.workflowId == workflowId })) {
      case (null) { Debug.trap("Workflow pricing not found") };
      case (?pricing) {
        if (userMultiplier == 0) {
          Debug.trap("User multiplier must be at least 1");
        };

        let basePrice = pricing.basePriceInCents;
        let totalUnits = pricing.totalUnitsOrdered;
        let automaticIncrements = totalUnits / 10;
        let finalPrice = basePrice * userMultiplier + (automaticIncrements * 10);

        if (finalPrice > 1000000) {
          Debug.trap("Final price exceeds maximum allowed value");
        };

        finalPrice;
      };
    };
  };

  // Admin only - update total units ordered
  public shared ({ caller }) func updateTotalUnitsOrdered(workflowId : Text, units : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update total units ordered");
    };

    if (units == 0) {
      Debug.trap("Units must be at least 1");
    };

    let updatedPricing = Array.map<WorkflowPricing, WorkflowPricing>(
      workflowPricing,
      func(p) {
        if (p.workflowId == workflowId) {
          {
            p with
            totalUnitsOrdered = p.totalUnitsOrdered + units;
            priceHistory = Array.append(p.priceHistory, [p.basePriceInCents]);
          };
        } else {
          p;
        };
      },
    );

    workflowPricing := updatedPricing;
  };

  // Public access - anyone can view all workflow pricing
  public query func getAllWorkflowPricing() : async [WorkflowPricing] {
    workflowPricing;
  };

  // JSON error handling types
  public type JsonError = {
    message : Text;
    file : ?Text;
    timestamp : Int;
    resolved : Bool;
    errorType : Text;
    suggestedFix : ?Text;
  };

  // JSON error storage
  var jsonErrors : [JsonError] = [];

  // Admin only - JSON error management
  public shared ({ caller }) func addJsonError(error : JsonError) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add JSON errors");
    };
    jsonErrors := Array.append(jsonErrors, [error]);
  };

  public query ({ caller }) func getJsonErrors() : async [JsonError] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view JSON errors");
    };
    jsonErrors;
  };

  public shared ({ caller }) func handleJsonError(message : Text, file : ?Text, errorType : Text, suggestedFix : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can handle JSON errors");
    };

    let error : JsonError = {
      message;
      file;
      timestamp = Int.abs(Time.now());
      resolved = false;
      errorType;
      suggestedFix;
    };

    jsonErrors := Array.append(jsonErrors, [error]);
  };

  public shared ({ caller }) func resolveJsonError(errorIndex : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can resolve JSON errors");
    };

    if (errorIndex >= jsonErrors.size()) {
      Debug.trap("Invalid error index");
    };

    let updatedErrors = Array.tabulate<JsonError>(
      jsonErrors.size(),
      func(i) {
        if (i == errorIndex) {
          {
            jsonErrors[i] with
            resolved = true;
          };
        } else {
          jsonErrors[i];
        };
      },
    );

    jsonErrors := updatedErrors;
  };

  public query ({ caller }) func getJsonErrorReport() : async {
    totalErrors : Nat;
    unresolvedErrors : Nat;
    errorTypes : [(Text, Nat)];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view JSON error reports");
    };

    let totalErrors = jsonErrors.size();
    let unresolvedErrors = Array.filter<JsonError>(jsonErrors, func(e) { not e.resolved }).size();

    let errorTypeMap = textMap.empty<Nat>();
    let errorTypeMapUpdated = Array.foldLeft<JsonError, OrderedMap.Map<Text, Nat>>(
      jsonErrors,
      errorTypeMap,
      func(map, error) {
        switch (textMap.get(map, error.errorType)) {
          case (null) {
            textMap.put(map, error.errorType, 1);
          };
          case (?count) {
            textMap.put(map, error.errorType, count + 1);
          };
        };
      },
    );

    let errorTypes = Iter.toArray(textMap.entries(errorTypeMapUpdated));

    {
      totalErrors;
      unresolvedErrors;
      errorTypes;
    };
  };

  public query ({ caller }) func getJsonErrorFixSuggestions() : async [(Text, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view JSON error fix suggestions");
    };

    let suggestions = Array.map<JsonError, (Text, Text)>(
      Array.filter<JsonError>(jsonErrors, func(e) { not e.resolved and e.suggestedFix != null }),
      func(error) {
        switch (error.suggestedFix) {
          case (null) { (error.errorType, "No suggestion available") };
          case (?fix) { (error.errorType, fix) };
        };
      },
    );
    suggestions;
  };

  public shared ({ caller }) func applyJsonErrorFix(errorType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can apply JSON error fixes");
    };

    let errorsOfType = Array.filter<JsonError>(jsonErrors, func(e) { e.errorType == errorType and not e.resolved });

    if (errorsOfType.size() == 0) {
      Debug.trap("No unresolved errors of this type found");
    };

    let updatedErrors = Array.map<JsonError, JsonError>(
      jsonErrors,
      func(error) {
        if (error.errorType == errorType) {
          {
            error with
            resolved = true;
          };
        } else {
          error;
        };
      },
    );

    jsonErrors := updatedErrors;
  };

  public shared ({ caller }) func validateJsonErrorFix(errorType : Text, isValid : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can validate JSON error fixes");
    };

    let errorsOfType = Array.filter<JsonError>(jsonErrors, func(e) { e.errorType == errorType and not e.resolved });

    if (errorsOfType.size() == 0) {
      Debug.trap("No unresolved errors of this type found");
    };

    if (not isValid) {
      let updatedErrors = Array.map<JsonError, JsonError>(
        jsonErrors,
        func(error) {
          if (error.errorType == errorType) {
            {
              error with
              resolved = false;
            };
          } else {
            error;
          };
        },
      );

      jsonErrors := updatedErrors;
    };
  };

  public shared ({ caller }) func promoteJsonErrorFix(errorType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can promote JSON error fixes");
    };

    let errorsOfType = Array.filter<JsonError>(jsonErrors, func(e) { e.errorType == errorType and not e.resolved });

    if (errorsOfType.size() == 0) {
      Debug.trap("No unresolved errors of this type found");
    };

    let updatedErrors = Array.map<JsonError, JsonError>(
      jsonErrors,
      func(error) {
        if (error.errorType == errorType) {
          {
            error with
            resolved = true;
          };
        } else {
          error;
        };
      },
    );

    jsonErrors := updatedErrors;
  };

  // Spec conversion types
  public type SpecConversionStatus = {
    workflowId : Text;
    specMdExists : Bool;
    specMlExists : Bool;
    yamlExists : Bool;
    conversionStatus : {
      #pending;
      #success;
      #error : Text;
    };
    lastUpdated : Int;
  };

  // Spec conversion storage
  var specConversions : [SpecConversionStatus] = [];

  // Admin only - spec conversion management
  public shared ({ caller }) func addSpecConversionStatus(status : SpecConversionStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add spec conversion status");
    };
    specConversions := Array.append(specConversions, [status]);
  };

  public query ({ caller }) func getSpecConversionStatus(workflowId : Text) : async ?SpecConversionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view spec conversion status");
    };
    Array.find<SpecConversionStatus>(specConversions, func(s) { s.workflowId == workflowId });
  };

  public query ({ caller }) func getAllSpecConversions() : async [SpecConversionStatus] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all spec conversions");
    };
    specConversions;
  };

  public shared ({ caller }) func updateSpecConversionStatus(workflowId : Text, status : SpecConversionStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update spec conversion status");
    };

    let updatedConversions = Array.map<SpecConversionStatus, SpecConversionStatus>(
      specConversions,
      func(s) {
        if (s.workflowId == workflowId) {
          status;
        } else {
          s;
        };
      },
    );

    specConversions := updatedConversions;
  };

  public shared ({ caller }) func handleSpecConversionError(workflowId : Text, errorMessage : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can handle spec conversion errors");
    };

    let errorStatus : SpecConversionStatus = {
      workflowId;
      specMdExists = true;
      specMlExists = false;
      yamlExists = false;
      conversionStatus = #error(errorMessage);
      lastUpdated = Int.abs(Time.now());
    };

    specConversions := Array.append(specConversions, [errorStatus]);
  };

  public shared ({ caller }) func retrySpecConversion(workflowId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can retry spec conversion");
    };
    let updatedSpecConversions = Array.filter<SpecConversionStatus>(
      specConversions,
      func(specConversion) {
        not (specConversion.workflowId == workflowId and (
          switch (specConversion.conversionStatus) {
            case (#error(_)) { true };
            case (_) { false };
          }
        ));
      },
    );

    let pendingConversion : SpecConversionStatus = {
      workflowId;
      specMdExists = true;
      specMlExists = false;
      yamlExists = false;
      conversionStatus = #pending;
      lastUpdated = Int.abs(Time.now());
    };

    specConversions := Array.append(updatedSpecConversions, [pendingConversion]);
  };

  public query ({ caller }) func getSpecConversionReport() : async {
    totalConversions : Nat;
    successfulConversions : Nat;
    pendingConversions : Nat;
    errorConversions : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view spec conversion reports");
    };

    let totalConversions = specConversions.size();
    let successfulConversions = Array.filter<SpecConversionStatus>(specConversions, func(s) { s.conversionStatus == #success }).size();
    let pendingConversions = Array.filter<SpecConversionStatus>(specConversions, func(s) { s.conversionStatus == #pending }).size();
    let errorConversions = Array.filter<SpecConversionStatus>(specConversions, func(s) {
      switch (s.conversionStatus) {
        case (#error(_)) { true };
        case (_) { false };
      };
    }).size();

    {
      totalConversions;
      successfulConversions;
      pendingConversions;
      errorConversions;
    };
  };

  // Deduplication system
  public type DeduplicationResult = {
    removedDuplicates : [Text];
    affectedFilePaths : [Text];
    canonicalSpecs : [Text];
    storageReclaimed : Nat;
    timestamp : Int;
  };
  var deduplicationResults : [DeduplicationResult] = [];

  // Admin only - deduplication management
  public shared ({ caller }) func addDeduplicationResult(result : DeduplicationResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add deduplication results");
    };
    deduplicationResults := Array.append(deduplicationResults, [result]);
  };

  public query ({ caller }) func getDeduplicationResults() : async [DeduplicationResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view deduplication results");
    };
    deduplicationResults;
  };

  // Sitemap management types
  public type SitemapEntry = {
    slug : Text;
    routeType : {
      #manual;
      #appControlled;
      #systemPreset;
    };
    timestamp : Int;
    createdBy : ?Principal;
    status : {
      #active;
      #deleted;
      #pendingApproval;
    };
    hash : Text;
    version : Nat;
    approvedBy : ?Principal;
  };

  public type SitemapSnapshot = {
    id : Text;
    entries : [SitemapEntry];
    timestamp : Int;
    createdBy : Principal;
    description : Text;
  };

  public type AppControlledRouteRequest = {
    appId : Text;
    route : Text;
    requestedBy : Principal;
    timestamp : Int;
    status : {
      #pending;
      #approved;
      #rejected;
    };
  };

  // Sitemap storage
  var sitemapEntries : [SitemapEntry] = [];
  var sitemapSnapshots : [SitemapSnapshot] = [];
  var whitelistedApps : [Text] = [];
  var appRouteRequests : [AppControlledRouteRequest] = [];

  // Pages array initialization with system presets
  var pages : [Text] = [
    "about", "admin", "apps", "angel-vc", "blog", "block", "broadcast", "compare", "contact", "dash", "dex", "e-com", "faq", "finance", "fix", "fixture", "footstep", "lang", "leader", "live", "main", "map", "milestone", "pages", "payments", "pros", "rank", "referral", "remote", "resource", "routes", "secure", "sitemap", "terms", "trust", "what", "verifySig", "when", "where", "who", "why", "ZKProof",
  ];

  // System preset routes that cannot be deleted
  let systemPresetRoutes : [Text] = [
    "about", "admin", "apps", "blog", "contact", "faq", "sitemap", "terms", "trust",
  ];

  // App-controlled routes
  let appControlledRoutes : [Text] = ["broadcast", "remote", "live"];

  // Helper function for slug validation
  func validateSlug(slug : Text) : Bool {
    let lowercased = Text.toLowercase(slug);

    // Check for spaces
    if (Text.contains(lowercased, #text(" "))) { return false };

    // Check for lowercase only (a-z and hyphens allowed)
    for (char in lowercased.chars()) {
      if (char != '-' and (char < 'a' or char > 'z')) {
        return false;
      };
    };

    // Check if already exists
    switch (Array.find<Text>(pages, func(p) { p == lowercased })) {
      case (?_) { return false };
      case (null) {};
    };

    // Check reserved keywords (system presets)
    switch (Array.find<Text>(systemPresetRoutes, func(r) { r == lowercased })) {
      case (?_) { return false };
      case (null) {};
    };

    true;
  };

  // Helper function to check if route is system preset
  func isSystemPreset(slug : Text) : Bool {
    switch (Array.find<Text>(systemPresetRoutes, func(r) { r == slug })) {
      case (?_) { true };
      case (null) { false };
    };
  };

  // Helper function to check if route is app-controlled
  func isAppControlled(slug : Text) : Bool {
    switch (Array.find<Text>(appControlledRoutes, func(r) { r == slug })) {
      case (?_) { true };
      case (null) { false };
    };
  };

  // Helper function to generate page hash (Merkle root truncated to last 4 chars)
  func generatePageHash(slug : Text) : Text {
    let fullHash = Text.toLowercase(slug);
    let charArray = Iter.toArray(fullHash.chars());
    let len = charArray.size();
    if (len >= 4) {
      let lastFour = Array.tabulate<Char>(
        4,
        func(i) {
          charArray[len - 4 + i];
        },
      );
      Text.fromIter(Iter.fromArray(lastFour));
    } else {
      fullHash;
    };
  };

  // Admin only - add page to manual pages array
  public shared ({ caller }) func addPage(page : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add pages");
    };

    let lowercasedPage = Text.toLowercase(page);

    if (not validateSlug(lowercasedPage)) {
      Debug.trap("Invalid page slug. Must be lowercase, no spaces, unique, and not a reserved keyword.");
    };

    pages := Array.append(pages, [lowercasedPage]);

    let newEntry : SitemapEntry = {
      slug = lowercasedPage;
      routeType = #manual;
      timestamp = Int.abs(Time.now());
      createdBy = ?caller;
      status = #active;
      hash = generatePageHash(lowercasedPage);
      version = 1;
      approvedBy = ?caller;
    };
    sitemapEntries := Array.append(sitemapEntries, [newEntry]);
  };

  // Admin only - delete page (with system preset protection)
  public shared ({ caller }) func deletePage(page : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete pages");
    };

    if (isSystemPreset(page)) {
      Debug.trap("Cannot delete system preset page");
    };

    if (isAppControlled(page)) {
      Debug.trap("Cannot delete app-controlled route. Use removeAppControlledRoute instead.");
    };

    pages := Array.filter<Text>(pages, func(p) { p != page });

    let updatedEntries = Array.map<SitemapEntry, SitemapEntry>(
      sitemapEntries,
      func(entry) {
        if (entry.slug == page) {
          {
            entry with
            status = #deleted;
          };
        } else {
          entry;
        };
      },
    );
    sitemapEntries := updatedEntries;
  };

  // Public access - anyone can get all pages for sitemap display
  public query func getAllPages() : async [Text] {
    pages;
  };

  // Admin only - get all sitemap entries (contains audit data)
  public query ({ caller }) func getAllSitemapEntries() : async [SitemapEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view sitemap entries");
    };
    sitemapEntries;
  };

  // Admin only - add whitelisted app
  public shared ({ caller }) func addWhitelistedApp(appId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add whitelisted apps");
    };

    switch (Array.find<Text>(whitelistedApps, func(a) { a == appId })) {
      case (?_) { Debug.trap("App already whitelisted") };
      case (null) {
        whitelistedApps := Array.append(whitelistedApps, [appId]);
      };
    };
  };

  // Admin only - remove whitelisted app
  public shared ({ caller }) func removeWhitelistedApp(appId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove whitelisted apps");
    };

    whitelistedApps := Array.filter<Text>(whitelistedApps, func(a) { a != appId });
  };

  // Admin only - get whitelisted apps
  public query ({ caller }) func getWhitelistedApps() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view whitelisted apps");
    };
    whitelistedApps;
  };

  // Whitelisted apps can request app-controlled routes
  public shared ({ caller }) func requestAppControlledRoute(appId : Text, route : Text) : async () {
    // Verify app is whitelisted
    switch (Array.find<Text>(whitelistedApps, func(a) { a == appId })) {
      case (null) { Debug.trap("App not whitelisted") };
      case (?_) {};
    };

    // Verify route is an app-controlled route
    if (not isAppControlled(route)) {
      Debug.trap("Route is not an app-controlled route. Only /broadcast, /remote, /live are allowed.");
    };

    let request : AppControlledRouteRequest = {
      appId;
      route;
      requestedBy = caller;
      timestamp = Int.abs(Time.now());
      status = #pending;
    };

    appRouteRequests := Array.append(appRouteRequests, [request]);
  };

  // Admin only - approve app-controlled route request
  public shared ({ caller }) func approveAppControlledRoute(appId : Text, route : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can approve app-controlled routes");
    };

    // Update request status
    let updatedRequests = Array.map<AppControlledRouteRequest, AppControlledRouteRequest>(
      appRouteRequests,
      func(req) {
        if (req.appId == appId and req.route == route and req.status == #pending) {
          { req with status = #approved };
        } else {
          req;
        };
      },
    );
    appRouteRequests := updatedRequests;

    // Add to pages if not already present
    switch (Array.find<Text>(pages, func(p) { p == route })) {
      case (?_) {};
      case (null) {
        pages := Array.append(pages, [route]);

        let newEntry : SitemapEntry = {
          slug = route;
          routeType = #appControlled;
          timestamp = Int.abs(Time.now());
          createdBy = null;
          status = #active;
          hash = generatePageHash(route);
          version = 1;
          approvedBy = ?caller;
        };
        sitemapEntries := Array.append(sitemapEntries, [newEntry]);
      };
    };
  };

  // Admin only - reject app-controlled route request
  public shared ({ caller }) func rejectAppControlledRoute(appId : Text, route : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can reject app-controlled routes");
    };

    let updatedRequests = Array.map<AppControlledRouteRequest, AppControlledRouteRequest>(
      appRouteRequests,
      func(req) {
        if (req.appId == appId and req.route == route and req.status == #pending) {
          { req with status = #rejected };
        } else {
          req;
        };
      },
    );
    appRouteRequests := updatedRequests;
  };

  // Admin only - get all app route requests
  public query ({ caller }) func getAppRouteRequests() : async [AppControlledRouteRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view app route requests");
    };
    appRouteRequests;
  };

  // Admin only - create sitemap snapshot
  public shared ({ caller }) func createSitemapSnapshot(description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create sitemap snapshots");
    };

    let snapshot : SitemapSnapshot = {
      id = Int.toText(Int.abs(Time.now()));
      entries = sitemapEntries;
      timestamp = Int.abs(Time.now());
      createdBy = caller;
      description;
    };

    sitemapSnapshots := Array.append(sitemapSnapshots, [snapshot]);
  };

  // Admin only - get all sitemap snapshots
  public query ({ caller }) func getSitemapSnapshots() : async [SitemapSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view sitemap snapshots");
    };
    sitemapSnapshots;
  };

  // Admin only - restore from sitemap snapshot
  public shared ({ caller }) func restoreFromSitemapSnapshot(snapshotId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can restore from sitemap snapshots");
    };

    switch (Array.find<SitemapSnapshot>(sitemapSnapshots, func(s) { s.id == snapshotId })) {
      case (null) { Debug.trap("Snapshot not found") };
      case (?snapshot) {
        sitemapEntries := snapshot.entries;
        pages := Array.map<SitemapEntry, Text>(
          Array.filter<SitemapEntry>(snapshot.entries, func(e) { e.status == #active }),
          func(e) { e.slug },
        );
      };
    };
  };

  // Admin only - legacy function for backward compatibility
  public query ({ caller }) func getAllAdminEntries() : async [SitemapEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view admin entries");
    };
    Array.filter<SitemapEntry>(sitemapEntries, func(entry) { entry.routeType == #manual or entry.routeType == #systemPreset });
  };
};
