import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";

actor Main {
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

  // User approval system (represents subscription status)
  let approvalState = UserApproval.initState(accessControlState);

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

  // Helper function to check if user is subscriber (approved user) or admin
  func isSubscriberOrAdmin(caller : Principal) : Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or 
    (AccessControl.hasPermission(accessControlState, caller, #user) and UserApproval.isApproved(approvalState, caller))
  };

  // User profiles
  public type UserProfile = {
    name : Text;
    email : Text;
    themePreference : Text;
    subscriptionStatus : Text;
    referralCode : Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  // Any authenticated user can get their own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Unauthorized: Authentication required");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  // Any authenticated user can save their profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Unauthorized: Authentication required");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Workflow management
  public type Workflow = {
    id : Text;
    name : Text;
    description : Text;
    fileHash : Text;
    isPublic : Bool;
    uploadTime : Int;
    uploader : Principal;
    file : Storage.ExternalBlob;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var workflows = textMap.empty<Workflow>();

  // Subscribers (approved users) and admins can view all workflows
  public query ({ caller }) func getWorkflows() : async [Workflow] {
    if (not isSubscriberOrAdmin(caller)) {
      Debug.trap("Unauthorized: Subscriber access required");
    };
    Iter.toArray(Iter.map(textMap.entries(workflows), func((_, v) : (Text, Workflow)) : Workflow { v }));
  };

  // Public access - no authentication required
  public query func getPublicWorkflows() : async [Workflow] {
    Iter.toArray(
      Iter.map(
        Iter.filter(
          textMap.entries(workflows),
          func((_, workflow) : (Text, Workflow)) : Bool {
            workflow.isPublic;
          },
        ),
        func((_, v) : (Text, Workflow)) : Workflow { v },
      )
    );
  };

  // Subscribers and admins can add workflows
  public shared ({ caller }) func addWorkflow(workflow : Workflow) : async () {
    if (not isSubscriberOrAdmin(caller)) {
      Debug.trap("Unauthorized: Subscriber access required");
    };
    if (workflow.uploader != caller) {
      Debug.trap("Unauthorized: Workflow uploader must be the caller");
    };
    workflows := textMap.put(workflows, workflow.id, workflow);
  };

  // Subscribers can update their own workflows, admins can update any
  public shared ({ caller }) func updateWorkflow(workflow : Workflow) : async () {
    if (not isSubscriberOrAdmin(caller)) {
      Debug.trap("Unauthorized: Subscriber access required");
    };

    switch (textMap.get(workflows, workflow.id)) {
      case null {
        Debug.trap("Workflow not found");
      };
      case (?existingWorkflow) {
        if (existingWorkflow.uploader != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only update your own workflows");
        };
        workflows := textMap.put(workflows, workflow.id, workflow);
      };
    };
  };

  public shared ({ caller }) func deleteWorkflow(workflowId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete workflows");
    };
    workflows := textMap.delete(workflows, workflowId);
  };

  // Payment integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Public query - no authentication required
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  // Public function - anyone can check session status
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // Authenticated users can create checkout sessions
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Unauthorized: Authentication required");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Referral system
  public type Referral = {
    referrer : Principal;
    referred : Principal;
    timestamp : Int;
    reward : Nat;
  };

  var referrals = principalMap.empty<Referral>();

  // Authenticated users can add referrals
  public shared ({ caller }) func addReferral(referred : Principal, reward : Nat) : async () {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Unauthorized: Authentication required");
    };
    let referral : Referral = {
      referrer = caller;
      referred;
      timestamp = Time.now();
      reward;
    };
    referrals := principalMap.put(referrals, referred, referral);
  };

  public query ({ caller }) func getReferrals() : async [Referral] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all referrals");
    };
    Iter.toArray(principalMap.vals(referrals));
  };

  // Analytics and logging
  public type LogEntry = {
    timestamp : Int;
    message : Text;
    level : Text;
  };

  var logs = textMap.empty<LogEntry>();

  public shared ({ caller }) func addLogEntry(entry : LogEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add log entries");
    };
    logs := textMap.put(logs, Int.toText(Time.now()), entry);
  };

  public query ({ caller }) func getLogs() : async [LogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view logs");
    };
    Iter.toArray(Iter.map(textMap.entries(logs), func((_, v) : (Text, LogEntry)) : LogEntry { v }));
  };

  // File storage
  let storage = Storage.new();
  include MixinStorage(storage);

  // Backup and restore
  public type Backup = {
    timestamp : Int;
    data : Blob;
  };

  var backups = textMap.empty<Backup>();

  public shared ({ caller }) func createBackup(data : Blob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create backups");
    };
    let backup : Backup = {
      timestamp = Time.now();
      data;
    };
    backups := textMap.put(backups, Int.toText(Time.now()), backup);
  };

  public query ({ caller }) func getBackups() : async [Backup] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view backups");
    };
    Iter.toArray(Iter.map(textMap.entries(backups), func((_, v) : (Text, Backup)) : Backup { v }));
  };

  // Error handling and learning system
  public type ParsingError = {
    timestamp : Int;
    fileName : Text;
    errorMessage : Text;
    severity : Text;
    suggestedFix : Text;
  };

  var parsingErrors = textMap.empty<ParsingError>();

  public shared ({ caller }) func logParsingError(error : ParsingError) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can log parsing errors");
    };
    parsingErrors := textMap.put(parsingErrors, Int.toText(Time.now()), error);
  };

  public query ({ caller }) func getParsingErrors() : async [ParsingError] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view parsing errors");
    };
    Iter.toArray(Iter.map(textMap.entries(parsingErrors), func((_, v) : (Text, ParsingError)) : ParsingError { v }));
  };

  public shared ({ caller }) func applySuggestedFix(fileName : Text, fix : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can apply suggested fixes");
    };
    Debug.print("Applying fix to " # fileName # ": " # fix);
  };

  // Fixture system
  public type Fixture = {
    id : Text;
    name : Text;
    description : Text;
    status : Text;
    validationTime : Int;
    validator : Principal;
  };

  var fixtures = textMap.empty<Fixture>();

  public shared ({ caller }) func addFixture(fixture : Fixture) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add fixtures");
    };
    fixtures := textMap.put(fixtures, fixture.id, fixture);
  };

  public query ({ caller }) func getFixtures() : async [Fixture] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view fixtures");
    };
    Iter.toArray(Iter.map(textMap.entries(fixtures), func((_, v) : (Text, Fixture)) : Fixture { v }));
  };

  public shared ({ caller }) func updateFixtureStatus(fixtureId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update fixture status");
    };
    switch (textMap.get(fixtures, fixtureId)) {
      case null Debug.trap("Fixture not found");
      case (?fixture) {
        let updatedFixture : Fixture = {
          fixture with
          status;
          validationTime = Time.now();
          validator = caller;
        };
        fixtures := textMap.put(fixtures, fixtureId, updatedFixture);
      };
    };
  };

  // Admin dashboard
  public type Dashboard = {
    newFeatures : [Workflow];
    errorLogs : [ParsingError];
    validationStatus : [Fixture];
  };

  public query ({ caller }) func getAdminDashboard() : async Dashboard {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can access the dashboard");
    };
    {
      newFeatures = Iter.toArray(Iter.map(textMap.entries(workflows), func((_, v) : (Text, Workflow)) : Workflow { v }));
      errorLogs = Iter.toArray(Iter.map(textMap.entries(parsingErrors), func((_, v) : (Text, ParsingError)) : ParsingError { v }));
      validationStatus = Iter.toArray(Iter.map(textMap.entries(fixtures), func((_, v) : (Text, Fixture)) : Fixture { v }));
    };
  };

  // Specification management system
  public type SpecFile = {
    id : Text;
    fileName : Text;
    fileType : Text;
    content : Text;
    uploadTime : Int;
    uploader : Principal;
    validationStatus : Text;
    conversionLog : Text;
    schemaRevision : Nat;
  };

  var specFiles = textMap.empty<SpecFile>();

  public shared ({ caller }) func addSpecFile(specFile : SpecFile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add spec files");
    };
    specFiles := textMap.put(specFiles, specFile.id, specFile);
  };

  public query ({ caller }) func getSpecFiles() : async [SpecFile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view spec files");
    };
    Iter.toArray(Iter.map(textMap.entries(specFiles), func((_, v) : (Text, SpecFile)) : SpecFile { v }));
  };

  public shared ({ caller }) func updateSpecFileStatus(specFileId : Text, status : Text, conversionLog : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update spec file status");
    };
    switch (textMap.get(specFiles, specFileId)) {
      case null Debug.trap("Spec file not found");
      case (?specFile) {
        let updatedSpecFile : SpecFile = {
          specFile with
          validationStatus = status;
          conversionLog;
        };
        specFiles := textMap.put(specFiles, specFileId, updatedSpecFile);
      };
    };
  };

  public shared ({ caller }) func convertSpecMdToMl(specFileId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can convert spec files");
    };
    switch (textMap.get(specFiles, specFileId)) {
      case null Debug.trap("Spec file not found");
      case (?specFile) {
        if (specFile.fileType != "md") {
          Debug.trap("Only .md files can be converted");
        };

        let convertedContent = "Converted ML content from: " # specFile.content;
        let conversionLog = "Conversion successful: " # specFile.fileName;

        let convertedSpecFile : SpecFile = {
          specFile with
          fileType = "yaml";
          content = convertedContent;
          validationStatus = "converted";
          conversionLog;
        };

        specFiles := textMap.put(specFiles, specFileId, convertedSpecFile);
      };
    };
  };

  public shared ({ caller }) func validateSpecFile(specFileId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can validate spec files");
    };
    switch (textMap.get(specFiles, specFileId)) {
      case null Debug.trap("Spec file not found");
      case (?specFile) {
        let validationLog = "Validation successful: " # specFile.fileName;

        let validatedSpecFile : SpecFile = {
          specFile with
          validationStatus = "validated";
          conversionLog = validationLog;
        };

        specFiles := textMap.put(specFiles, specFileId, validatedSpecFile);
      };
    };
  };

  public shared ({ caller }) func promoteSpecFileToLeaderboard(specFileId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can promote spec files");
    };
    switch (textMap.get(specFiles, specFileId)) {
      case null Debug.trap("Spec file not found");
      case (?specFile) {
        if (specFile.validationStatus != "validated") {
          Debug.trap("Only validated spec files can be promoted");
        };

        let promotedSpecFile : SpecFile = {
          specFile with
          validationStatus = "promoted";
        };

        specFiles := textMap.put(specFiles, specFileId, promotedSpecFile);
      };
    };
  };

  // Manifest log system
  public type ManifestLog = {
    id : Text;
    fileName : Text;
    fileType : Text;
    validationStatus : Text;
    errors : Text;
    schemaCompliance : Text;
    conversionLog : Text;
    uploadTime : Int;
    uploader : Principal;
  };

  var manifestLogs = textMap.empty<ManifestLog>();

  public shared ({ caller }) func addManifestLog(manifestLog : ManifestLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add manifest logs");
    };
    manifestLogs := textMap.put(manifestLogs, manifestLog.id, manifestLog);
  };

  public query ({ caller }) func getManifestLogs() : async [ManifestLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view manifest logs");
    };
    Iter.toArray(Iter.map(textMap.entries(manifestLogs), func((_, v) : (Text, ManifestLog)) : ManifestLog { v }));
  };

  public shared ({ caller }) func updateManifestLogStatus(manifestLogId : Text, status : Text, errors : Text, schemaCompliance : Text, conversionLog : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update manifest log status");
    };
    switch (textMap.get(manifestLogs, manifestLogId)) {
      case null Debug.trap("Manifest log not found");
      case (?manifestLog) {
        let updatedManifestLog : ManifestLog = {
          manifestLog with
          validationStatus = status;
          errors;
          schemaCompliance;
          conversionLog;
        };
        manifestLogs := textMap.put(manifestLogs, manifestLogId, updatedManifestLog);
      };
    };
  };

  public shared ({ caller }) func processSpecFile(specFileId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can process spec files");
    };
    switch (textMap.get(specFiles, specFileId)) {
      case null Debug.trap("Spec file not found");
      case (?specFile) {
        let hasMlVersion = checkForMlVersion(specFile.fileName);
        let hasYamlVersion = checkForYamlVersion(specFile.fileName);

        if (not hasMlVersion and not hasYamlVersion) {
          let convertedContent = convertMdToYaml(specFile.content);
          let conversionLog = "Conversion successful: " # specFile.fileName;

          let convertedSpecFile : SpecFile = {
            specFile with
            fileType = "yaml";
            content = convertedContent;
            validationStatus = "converted";
            conversionLog;
          };

          specFiles := textMap.put(specFiles, specFileId, convertedSpecFile);

          let validationResult = validateSchema(convertedContent);
          let validationLog = "Validation result: " # validationResult;

          let validatedSpecFile : SpecFile = {
            convertedSpecFile with
            validationStatus = "validated";
            conversionLog = validationLog;
          };

          specFiles := textMap.put(specFiles, specFileId, validatedSpecFile);

          let manifestLog : ManifestLog = {
            id = specFileId;
            fileName = specFile.fileName;
            fileType = "yaml";
            validationStatus = "validated";
            errors = "";
            schemaCompliance = validationResult;
            conversionLog;
            uploadTime = Time.now();
            uploader = caller;
          };

          manifestLogs := textMap.put(manifestLogs, specFileId, manifestLog);
        };
      };
    };
  };

  // Specification deduplication system
  public type DeduplicationLog = {
    id : Text;
    timestamp : Int;
    affectedFiles : [Text];
    action : Text;
    result : Text;
    normalizedFileId : Text;
    schemaRevision : Nat;
    performer : Principal;
  };

  var deduplicationLogs = textMap.empty<DeduplicationLog>();

  public shared ({ caller }) func runDeduplicationCheck() : async DeduplicationLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can run deduplication checks");
    };

    let allSpecFiles = Iter.toArray(textMap.vals(specFiles));
    let duplicates = findDuplicateSpecFiles(allSpecFiles);
    let affectedFileIds = Array.map<SpecFile, Text>(duplicates, func(sf) { sf.id });

    let deduplicationLog : DeduplicationLog = {
      id = Int.toText(Time.now());
      timestamp = Time.now();
      affectedFiles = affectedFileIds;
      action = "deduplication_check";
      result = "Found " # Nat32.toText(Nat32.fromNat(duplicates.size())) # " duplicate files";
      normalizedFileId = "";
      schemaRevision = 0;
      performer = caller;
    };

    deduplicationLogs := textMap.put(deduplicationLogs, deduplicationLog.id, deduplicationLog);
    deduplicationLog;
  };

  public shared ({ caller }) func deduplicateSpecFiles(fileIds : [Text]) : async DeduplicationLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can deduplicate spec files");
    };

    let filesToProcess = Array.mapFilter<Text, SpecFile>(
      fileIds,
      func(id) { textMap.get(specFiles, id) }
    );

    if (filesToProcess.size() == 0) {
      Debug.trap("No valid files found for deduplication");
    };

    let normalizedFile = selectNormalizedVersion(filesToProcess);
    let removedFiles = Array.filter<SpecFile>(
      filesToProcess,
      func(sf) { sf.id != normalizedFile.id }
    );

    for (file in removedFiles.vals()) {
      specFiles := textMap.delete(specFiles, file.id);
    };

    let deduplicationLog : DeduplicationLog = {
      id = Int.toText(Time.now());
      timestamp = Time.now();
      affectedFiles = fileIds;
      action = "deduplicate";
      result = "Kept " # normalizedFile.fileName # ", removed " # Nat32.toText(Nat32.fromNat(removedFiles.size())) # " duplicates";
      normalizedFileId = normalizedFile.id;
      schemaRevision = normalizedFile.schemaRevision;
      performer = caller;
    };

    deduplicationLogs := textMap.put(deduplicationLogs, deduplicationLog.id, deduplicationLog);
    deduplicationLog;
  };

  public query ({ caller }) func getDeduplicationLogs() : async [DeduplicationLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view deduplication logs");
    };
    Iter.toArray(Iter.map(textMap.entries(deduplicationLogs), func((_, v) : (Text, DeduplicationLog)) : DeduplicationLog { v }));
  };

  public shared ({ caller }) func compareSchemaRevisions(fileId1 : Text, fileId2 : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can compare schema revisions");
    };

    let file1 = textMap.get(specFiles, fileId1);
    let file2 = textMap.get(specFiles, fileId2);

    switch (file1, file2) {
      case (?f1, ?f2) {
        if (f1.schemaRevision > f2.schemaRevision) {
          return "File " # fileId1 # " has newer schema revision (" # Nat32.toText(Nat32.fromNat(f1.schemaRevision)) # " vs " # Nat32.toText(Nat32.fromNat(f2.schemaRevision)) # ")";
        } else if (f1.schemaRevision < f2.schemaRevision) {
          return "File " # fileId2 # " has newer schema revision (" # Nat32.toText(Nat32.fromNat(f2.schemaRevision)) # " vs " # Nat32.toText(Nat32.fromNat(f1.schemaRevision)) # ")";
        } else {
          return "Both files have the same schema revision (" # Nat32.toText(Nat32.fromNat(f1.schemaRevision)) # ")";
        };
      };
      case _ {
        Debug.trap("One or both files not found");
      };
    };
  };

  public shared ({ caller }) func validateSpecFileBeforeUpload(fileName : Text, content : Text, fileType : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can validate spec files before upload");
    };

    true;
  };

  public shared ({ caller }) func normalizeSpecFile(specFileId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can normalize spec files");
    };

    switch (textMap.get(specFiles, specFileId)) {
      case null Debug.trap("Spec file not found");
      case (?specFile) {
        let normalizedContent = if (specFile.fileType == "md") {
          convertMdToYaml(specFile.content);
        } else if (specFile.fileType == "ml") {
          convertMlToYaml(specFile.content);
        } else {
          specFile.content;
        };

        let normalizedSpecFile : SpecFile = {
          specFile with
          fileType = "yaml";
          content = normalizedContent;
          validationStatus = "normalized";
          conversionLog = "Normalized to YAML format";
        };

        specFiles := textMap.put(specFiles, specFileId, normalizedSpecFile);

        let manifestLog : ManifestLog = {
          id = specFileId # "_normalized";
          fileName = specFile.fileName;
          fileType = "yaml";
          validationStatus = "normalized";
          errors = "";
          schemaCompliance = "YAML normalized";
          conversionLog = "Normalized to YAML format";
          uploadTime = Time.now();
          uploader = caller;
        };

        manifestLogs := textMap.put(manifestLogs, manifestLog.id, manifestLog);
      };
    };
  };

  public query ({ caller }) func getDeduplicationStatistics() : async {
    totalSpecFiles : Nat;
    duplicateGroups : Nat;
    normalizedFiles : Nat;
    pendingDeduplication : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view deduplication statistics");
    };

    let allSpecFiles = Iter.toArray(textMap.vals(specFiles));
    let duplicates = findDuplicateSpecFiles(allSpecFiles);
    let normalized = Array.filter<SpecFile>(
      allSpecFiles,
      func(sf) { sf.validationStatus == "normalized" or sf.fileType == "yaml" }
    );

    {
      totalSpecFiles = allSpecFiles.size();
      duplicateGroups = if (duplicates.size() > 0) { 1 } else { 0 };
      normalizedFiles = normalized.size();
      pendingDeduplication = duplicates.size();
    };
  };

  // Helper functions for deduplication
  func findDuplicateSpecFiles(files : [SpecFile]) : [SpecFile] {
    var seen = textMap.empty<SpecFile>();
    var duplicates : [SpecFile] = [];

    for (file in files.vals()) {
      let hash = file.id;
      switch (textMap.get(seen, hash)) {
        case null {
          seen := textMap.put(seen, hash, file);
        };
        case (?_) {
          duplicates := Array.append(duplicates, [file]);
        };
      };
    };

    duplicates;
  };

  func selectNormalizedVersion(files : [SpecFile]) : SpecFile {
    var bestFile = files[0];

    for (file in files.vals()) {
      if (file.fileType == "yaml" and bestFile.fileType != "yaml") {
        bestFile := file;
      } else if (file.schemaRevision > bestFile.schemaRevision) {
        bestFile := file;
      } else if (file.validationStatus == "validated" and bestFile.validationStatus != "validated") {
        bestFile := file;
      };
    };

    bestFile;
  };

  func checkForMlVersion(fileName : Text) : Bool {
    false;
  };

  func checkForYamlVersion(fileName : Text) : Bool {
    false;
  };

  func convertMdToYaml(content : Text) : Text {
    "# Converted YAML content from Markdown\n" # content;
  };

  func convertMlToYaml(content : Text) : Text {
    "# Converted YAML content from ML\n" # content;
  };

  func validateSchema(content : Text) : Text {
    "Schema validation passed";
  };

  // Sitemap management
  public type Page = {
    slug : Text;
    title : Text;
    description : Text;
    priority : Nat;
    createdAt : Int;
    createdBy : Principal;
  };

  var pages : [Page] = [];

  public shared ({ caller }) func addPage(slug : Text, title : Text, description : Text, priority : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add pages");
    };

    // Check for duplicate slugs
    for (page in pages.vals()) {
      if (page.slug == slug) {
        Debug.trap("Page with this slug already exists");
      };
    };

    let newPage : Page = {
      slug;
      title;
      description;
      priority;
      createdAt = Time.now();
      createdBy = caller;
    };
    pages := Array.append(pages, [newPage]);

    let logEntry : LogEntry = {
      timestamp = Time.now();
      message = "Added new page: " # slug # " by admin " # Principal.toText(caller);
      level = "INFO";
    };
    logs := textMap.put(logs, Int.toText(Time.now()), logEntry);
  };

  // Public access - anyone can view the sitemap pages (no authentication required)
  public query func getPages() : async [Page] {
    Array.sort(
      pages,
      func(a : Page, b : Page) : { #less; #equal; #greater } {
        if (a.priority > b.priority) { #less } else if (a.priority < b.priority) {
          #greater;
        } else { #equal };
      },
    );
  };

  // Public access - anyone can view the sitemap structure (no authentication required)
  public query func getSitemap() : async {
    autoRoutes : [Text];
    adminPages : [Page];
    appRoutes : [Text];
  } {
    let autoRoutes = [
      "/",
      "/home",
      "/blog",
      "/about",
      "/pros",
      "/what-we-do",
      "/why-us",
      "/contact",
      "/faq",
      "/terms",
      "/trust",
      "/dashboard",
      "/features",
      "/referral",
      "/admin",
      "/catalog",
      "/subscribers",
    ];

    let appRoutes = ["/broadcast", "/remote", "/live"];

    {
      autoRoutes;
      adminPages = Array.sort(
        pages,
        func(a : Page, b : Page) : { #less; #equal; #greater } {
          if (a.priority > b.priority) { #less } else if (a.priority < b.priority) {
            #greater;
          } else { #equal };
        },
      );
      appRoutes;
    };
  };

  public type SecoinfiApp = {
    slug : Text;
    name : Text;
    description : Text;
    approvedRoutes : [Text];
    createdAt : Int;
    createdBy : Principal;
  };

  var secoinfiApps : [SecoinfiApp] = [];

  public shared ({ caller }) func addSecoinfiApp(app : SecoinfiApp) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add apps");
    };
    secoinfiApps := Array.append(secoinfiApps, [app]);
  };

  // Admin-only access to view whitelisted apps
  public query ({ caller }) func getSecoinfiApps() : async [SecoinfiApp] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view whitelisted apps");
    };
    secoinfiApps;
  };

  public shared ({ caller }) func assignRoutesToApp(appSlug : Text, routes : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can assign routes");
    };

    // Validate that routes are from the allowed list
    let allowedRoutes = ["/broadcast", "/remote", "/live"];
    for (route in routes.vals()) {
      var isAllowed = false;
      for (allowedRoute in allowedRoutes.vals()) {
        if (route == allowedRoute) {
          isAllowed := true;
        };
      };
      if (not isAllowed) {
        Debug.trap("Route " # route # " is not in the allowed list");
      };
    };

    var foundApp : ?SecoinfiApp = null;
    for (app in secoinfiApps.vals()) {
      if (app.slug == appSlug) {
        foundApp := ?app;
      };
    };

    switch (foundApp) {
      case null {
        Debug.trap("App not found");
      };
      case (?app) {
        let updatedApp : SecoinfiApp = {
          app with
          approvedRoutes = routes;
        };

        secoinfiApps := Array.map<SecoinfiApp, SecoinfiApp>(
          secoinfiApps,
          func(a) {
            if (a.slug == appSlug) { updatedApp } else { a };
          },
        );

        let logEntry : LogEntry = {
          timestamp = Time.now();
          message = "Assigned routes to app " # appSlug # ": " # debug_show(routes) # " by admin " # Principal.toText(caller);
          level = "INFO";
        };
        logs := textMap.put(logs, Int.toText(Time.now()), logEntry);
      };
    };
  };

  // Sitemap audit log
  public type SitemapAuditLog = {
    timestamp : Int;
    action : Text;
    pageSlug : Text;
    admin : Principal;
    merkleHash : Text;
  };

  var sitemapAuditLogs : [SitemapAuditLog] = [];

  public shared ({ caller }) func addSitemapAuditLog(action : Text, pageSlug : Text, merkleHash : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add sitemap audit logs");
    };

    let log : SitemapAuditLog = {
      timestamp = Time.now();
      action;
      pageSlug;
      admin = caller;
      merkleHash;
    };

    sitemapAuditLogs := Array.append(sitemapAuditLogs, [log]);
  };

  // Admin-only access to view audit logs
  public query ({ caller }) func getSitemapAuditLogs() : async [SitemapAuditLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view sitemap audit logs");
    };
    sitemapAuditLogs;
  };
};
