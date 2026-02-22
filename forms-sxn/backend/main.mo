import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import OutCall "http-outcalls/outcall";
import Array "mo:base/Array";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

// Apply migration in with clause
(with migration = Migration.run)
actor FormsBackend {
  let accessControlState = AccessControl.initState();

  var blobData : [(Text, Blob)] = [];
  let storage = Storage.new();
  include MixinStorage(storage);

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);

  var userProfiles = principalMap.empty<UserProfile>();
  var formSchemas = textMap.empty<FormSchema>();
  var formSubmissions = textMap.empty<FormSubmission>();
  var auditLogs = natMap.empty<AuditLogEntry>();
  var themePreferences = principalMap.empty<ThemePreference>();
  var tabStates = textMap.empty<TabState>();
  var testDataFixtures = textMap.empty<TestDataFixture>();
  var nextAuditLogId = 0;

  // Access Control Functions
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

  // User Profile Functions - Admin and Subscriber only
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

  // Form Schema Functions - Admin only for write, public for read
  public shared ({ caller }) func createFormSchema(schema : FormSchema) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create form schemas");
    };
    formSchemas := textMap.put(formSchemas, schema.id, schema);
    await logAuditEvent("CREATE_SCHEMA", schema.id, caller);
  };

  // Public read access - no authentication required
  public query func getFormSchema(id : Text) : async ?FormSchema {
    textMap.get(formSchemas, id);
  };

  public shared ({ caller }) func updateFormSchema(schema : FormSchema) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update form schemas");
    };
    formSchemas := textMap.put(formSchemas, schema.id, schema);
    await logAuditEvent("UPDATE_SCHEMA", schema.id, caller);
  };

  public shared ({ caller }) func deleteFormSchema(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete form schemas");
    };
    formSchemas := textMap.remove(formSchemas, id).0;
    await logAuditEvent("DELETE_SCHEMA", id, caller);
  };

  // Public read access - no authentication required
  public query func getAllFormSchemas() : async [FormSchema] {
    Iter.toArray(textMap.vals(formSchemas));
  };

  // Form Submission Functions - Public submission allowed, restricted read
  // Public users can submit forms anonymously
  public shared ({ caller }) func submitForm(submission : FormSubmission) : async () {
    formSubmissions := textMap.put(formSubmissions, submission.id, submission);
    await logAuditEvent("SUBMIT_FORM", submission.id, caller);
  };

  // Users can only view their own submissions, admins can view all
  public query ({ caller }) func getFormSubmission(id : Text) : async ?FormSubmission {
    switch (textMap.get(formSubmissions, id)) {
      case null { null };
      case (?submission) {
        if (submission.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only view your own form submissions");
        };
        ?submission;
      };
    };
  };

  // Admin only - subscription/admin area
  public query ({ caller }) func getAllFormSubmissions() : async [FormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can access all form submissions");
    };
    Iter.toArray(textMap.vals(formSubmissions));
  };

  // Authenticated users only - subscription area
  public query ({ caller }) func getCallerFormSubmissions() : async [FormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can access form submissions");
    };
    let allSubmissions = Iter.toArray(textMap.vals(formSubmissions));
    Iter.toArray(
      Iter.filter<FormSubmission>(
        allSubmissions.vals(),
        func(s) { s.user == caller },
      )
    );
  };

  // Audit Log Functions - Admin only
  public query ({ caller }) func getAuditLogs() : async [AuditLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can access audit logs");
    };
    Iter.toArray(natMap.vals(auditLogs));
  };

  // Schema Import Functions - Admin only
  public shared ({ caller }) func importJsonSchema(url : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can import JSON schemas");
    };
    await OutCall.httpGetRequest(url, [], transform);
  };

  // Blob Storage Functions - Authenticated users can store, public can read
  public shared ({ caller }) func storeBlob(key : Text, data : Blob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can store blobs");
    };
    blobData := Array.append(blobData, [(key, data)]);
    await logAuditEvent("STORE_BLOB", key, caller);
  };

  // Public read access - no authentication required
  public query func getBlob(key : Text) : async ?Blob {
    for ((k, v) in blobData.vals()) {
      if (k == key) {
        return ?v;
      };
    };
    null;
  };

  public shared ({ caller }) func deleteBlob(key : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete blobs");
    };
    blobData := Array.filter<(Text, Blob)>(blobData, func((k, _)) { k != key });
    await logAuditEvent("DELETE_BLOB", key, caller);
  };

  // Theme Preference Functions - Authenticated users only (stored server-side)
  public shared ({ caller }) func setThemePreference(theme : ThemePreference) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can set theme preferences");
    };
    themePreferences := principalMap.put(themePreferences, caller, theme);
  };

  public query ({ caller }) func getThemePreference() : async ?ThemePreference {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can access theme preferences");
    };
    principalMap.get(themePreferences, caller);
  };

  // Tab Management Functions - Authenticated users only
  public shared ({ caller }) func createTab(tab : TabState) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can create tabs");
    };
    tabStates := textMap.put(tabStates, tab.id, tab);
    await logAuditEvent("CREATE_TAB", tab.id, caller);
  };

  public shared ({ caller }) func updateTab(tab : TabState) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can update tabs");
    };
    tabStates := textMap.put(tabStates, tab.id, tab);
    await logAuditEvent("UPDATE_TAB", tab.id, caller);
  };

  public shared ({ caller }) func deleteTab(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can delete tabs");
    };
    tabStates := textMap.remove(tabStates, id).0;
    await logAuditEvent("DELETE_TAB", id, caller);
  };

  public query ({ caller }) func getAllTabs() : async [TabState] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can access tabs");
    };
    Iter.toArray(textMap.vals(tabStates));
  };

  // Test Data Fixture Functions - Admin only for write, public for read
  public shared ({ caller }) func createTestDataFixture(fixture : TestDataFixture) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create test data fixtures");
    };
    testDataFixtures := textMap.put(testDataFixtures, fixture.id, fixture);
  };

  // Public read access - no authentication required
  public query func getTestDataFixtures() : async [TestDataFixture] {
    Iter.toArray(textMap.vals(testDataFixtures));
  };

  public shared ({ caller }) func deleteTestDataFixture(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete test data fixtures");
    };
    testDataFixtures := textMap.remove(testDataFixtures, id).0;
  };

  // Helper Functions
  func logAuditEvent(eventType : Text, targetId : Text, user : Principal) : async () {
    let logEntry : AuditLogEntry = {
      id = nextAuditLogId;
      timestamp = Time.now();
      eventType;
      targetId;
      user;
    };
    auditLogs := natMap.put(auditLogs, nextAuditLogId, logEntry);
    nextAuditLogId += 1;
  };

  // HTTP Outcall Transform Function (must be public for IC system)
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Type Definitions
  public type UserProfile = {
    name : Text;
    email : Text;
    organization : ?Text;
    role : Text;
  };

  public type FormSchema = {
    id : Text;
    name : Text;
    description : Text;
    fields : [FormField];
    validations : [ValidationRule];
    calculations : [CalculationRule];
    visibilityRules : [VisibilityRule];
    createdBy : Principal;
    createdAt : Int;
  };

  public type FormField = {
    id : Text;
    fieldLabel : Text;
    fieldType : FieldType;
    helpText : ?Text;
    defaultValue : ?FieldValue;
    options : ?[FieldOption];
    arrayCount : ?Nat;
    required : Bool;
    pattern : ?Text;
    min : ?Float;
    max : ?Float;
    enumValues : ?[Text];
    units : ?Text;
    rounding : ?Nat;
  };

  public type FieldType = {
    #text;
    #number;
    #email;
    #checkbox;
    #radio;
    #toggle;
    #select;
    #array;
  };

  public type FieldValue = {
    #text : Text;
    #number : Float;
    #boolean : Bool;
    #array : [FieldValue];
  };

  public type FieldOption = {
    value : Text;
    optionLabel : Text;
  };

  public type ValidationRule = {
    fieldId : Text;
    ruleType : ValidationRuleType;
    message : Text;
  };

  public type ValidationRuleType = {
    #required;
    #pattern : Text;
    #min : Float;
    #max : Float;
    #enum : [Text];
    #unique;
    #crossField : CrossFieldValidation;
  };

  public type CrossFieldValidation = {
    fieldIds : [Text];
    validationType : Text;
  };

  public type CalculationRule = {
    fieldId : Text;
    formula : Text;
    dependencies : [Text];
    resultType : FieldType;
    units : ?Text;
    rounding : ?Nat;
  };

  public type VisibilityRule = {
    fieldId : Text;
    condition : Text;
    dependencies : [Text];
  };

  public type FormSubmission = {
    id : Text;
    schemaId : Text;
    values : [FieldValueEntry];
    manifestHash : Blob;
    merkleRoot : Blob;
    nonces : [FieldNonce];
    timestamp : Int;
    user : Principal;
    signature : Blob;
    adminCounterSign : ?Blob;
    merkleProofs : [MerkleProof];
  };

  public type FieldValueEntry = {
    fieldId : Text;
    value : FieldValue;
    nonce : Blob;
  };

  public type FieldNonce = {
    fieldId : Text;
    nonce : Blob;
  };

  public type MerkleProof = {
    fieldId : Text;
    proofPath : [Blob];
    root : Blob;
  };

  public type AuditLogEntry = {
    id : Nat;
    timestamp : Int;
    eventType : Text;
    targetId : Text;
    user : Principal;
  };

  public type ThemePreference = {
    #light;
    #dark;
    #vibgyor;
  };

  public type TabState = {
    id : Text;
    tabLabel : Text;
    contentId : Text;
    isActive : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type PortalPage = {
    id : Text;
    title : Text;
    url : Text;
    createdAt : Int;
    contentHash : Blob;
    nonce : Blob;
    merkleLeaf : Blob;
    verificationStatus : Text;
  };

  public type TestDataFixture = {
    id : Text;
    app : Text;
    template : Text;
    title : Text;
    url : Text;
    createdAt : Int;
    contentHash : Blob;
    nonce : Blob;
    merkleLeaf : Blob;
    verificationStatus : Text;
  };

  public type SchemaImportResult = {
    id : Text;
    name : Text;
    fields : [FormField];
    validations : [ValidationRule];
    calculations : [CalculationRule];
    visibilityRules : [VisibilityRule];
  };

  public type PaginatedResult<T> = {
    items : [T];
    totalCount : Nat;
    pageSize : Nat;
    currentPage : Nat;
    totalPages : Nat;
  };
};

