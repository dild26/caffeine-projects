import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import List "mo:core/List";
import Order "mo:core/Order";
import Char "mo:core/Char";
import VarArray "mo:core/VarArray";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Int64 "mo:core/Int64";
import Int32 "mo:core/Int32";
import Int8 "mo:core/Int8";
import Int16 "mo:core/Int16";
import Nat16 "mo:core/Nat16";

actor {
  // Access control
  let accessControlState = AccessControl.initState();

  // Storage
  let storage = Storage.new();
  include MixinStorage(storage);

  // Types
  public type TenantId = Text;
  public type FileId = Text;
  public type ChunkId = Text;
  public type FolderId = Text;
  public type Role = { #admin; #user; #billing; #replication };
  public type FileMetadata = {
    id : FileId;
    tenantId : TenantId;
    name : Text;
    size : Nat;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    owner : Principal;
    permissions : [Role];
    storageClass : Text;
    version : Nat;
    checksum : Text;
    isEncrypted : Bool;
    tags : [Text];
    path : Text;
    contentType : Text;
    status : Text;
    replicationStatus : Text;
    billingStatus : Text;
    retentionPolicy : Text;
    lifecyclePolicy : Text;
    accessCount : Nat;
    lastAccessed : Time.Time;
    expiration : ?Time.Time;
    customMetadata : [(Text, Text)];
    price : ?Nat;
  };
  public type FolderMetadata = {
    id : FolderId;
    tenantId : TenantId;
    name : Text;
    size : Nat;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    owner : Principal;
    permissions : [Role];
    path : Text;
    parentId : ?FolderId;
    status : Text;
    operationHistory : [FolderOperation];
    customMetadata : [(Text, Text)];
    price : ?Nat;
  };
  public type FolderOperation = {
    operationType : Text;
    timestamp : Time.Time;
    user : Principal;
    details : Text;
  };
  public type Chunk = {
    id : ChunkId;
    data : Blob;
    size : Nat;
    checksum : Text;
    createdAt : Time.Time;
    replicaCount : Nat;
    storageClass : Text;
    status : Text;
  };
  public type Tenant = {
    id : TenantId;
    name : Text;
    createdAt : Time.Time;
    owner : Principal;
    storageQuota : Nat;
    usedStorage : Nat;
    billingPlan : Text;
    status : Text;
    customMetadata : [(Text, Text)];
  };
  public type BillingRecord = {
    id : Text;
    tenantId : TenantId;
    amount : Nat;
    currency : Text;
    periodStart : Time.Time;
    periodEnd : Time.Time;
    status : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    paymentMethod : Text;
    invoiceId : Text;
    description : Text;
    customMetadata : [(Text, Text)];
  };
  public type ReplicationTask = {
    id : Text;
    fileId : FileId;
    sourceCanister : Text;
    targetCanisters : [Text];
    status : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    priority : Nat;
    retryCount : Nat;
    lastAttempt : Time.Time;
    customMetadata : [(Text, Text)];
  };
  public type Policy = {
    id : Text;
    name : Text;
    type_ : Text;
    rules : [(Text, Text)];
    createdAt : Time.Time;
    updatedAt : Time.Time;
    status : Text;
    description : Text;
    customMetadata : [(Text, Text)];
  };
  public type UserProfile = {
    name : Text;
    email : Text;
    roles : [Role];
    tenantId : ?TenantId;
    createdAt : Time.Time;
    lastLogin : Time.Time;
    status : Text;
    customMetadata : [(Text, Text)];
  };
  public type MenuItem = {
    id : Text;
    name : Text;
    link : Text;
    order : Nat;
    isAdminCreated : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    status : Text;
    customMetadata : [(Text, Text)];
  };
  public type SystemLog = {
    id : Text;
    timestamp : Time.Time;
    eventType : Text;
    message : Text;
    details : Text;
    status : Text;
    customMetadata : [(Text, Text)];
  };
  public type ThemePreference = {
    userId : Principal;
    theme : Text;
    updatedAt : Time.Time;
  };
  public type FeatureStatus = {
    id : Text;
    name : Text;
    aiDetectedComplete : Bool;
    adminVerified : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    status : Text;
    customMetadata : [(Text, Text)];
  };
  public type CompareProvider = {
    rank : Nat;
    provider : Text;
    pricePerGB : Text;
    providerType : Text;
    notes : Text;
  };
  public type BackupSession = {
    nonce : Text;
    user : Principal;
    createdAt : Time.Time;
    merkleRoot : Text;
    size : Nat;
    version : Nat;
    status : Text;
    metadata : [(Text, Text)];
  };
  public type MerkleBlock = {
    id : Text;
    sessionNonce : Text;
    data : Blob;
    checksum : Text;
    encrypted : Bool;
    createdAt : Time.Time;
    size : Nat;
  };
  public type UploadBatch = {
    id : Text;
    tenantId : TenantId;
    user : Principal;
    files : [FileMetadata];
    status : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    progress : Nat;
    totalSize : Nat;
    completedSize : Nat;
    metadata : [(Text, Text)];
  };
  public type PageContent = {
    id : Text;
    title : Text;
    content : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    status : Text;
    metadata : [(Text, Text)];
  };
  public type SharingLink = {
    id : Text;
    targetId : Text;
    targetType : Text;
    owner : Principal;
    permissions : [Role];
    createdAt : Time.Time;
    updatedAt : Time.Time;
    status : Text;
    expiration : ?Time.Time;
    embedCode : Text;
    customMetadata : [(Text, Text)];
  };
  public type MonetizationRecord = {
    id : Text;
    merkleRoot : Text;
    nonce : Text;
    owner : Principal;
    rewardAmount : Nat;
    status : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    customMetadata : [(Text, Text)];
  };
  public type ContactInfo = {
    primary_email : Text;
    business_phone : Text;
    website : Text;
    whatsapp : Text;
    address : Text;
    paypal : Text;
    upi_id : Text;
    eth_id : Text;
    facebook_url : Text;
    linkedin_url : Text;
    telegram_url : Text;
    discord_url : Text;
    blogspot_url : Text;
    instagram_url : Text;
    twitter_url : Text;
    youtube_url : Text;
  };
  public type VideoCodec = {
    #H264_AAC;
    #VP8;
    #VP9;
    #OGG;
    #UNKNOWN;
  };
  public type VideoFormat = {
    #MP4;
    #WEBM;
    #OGG;
  };
  public type TranscodingJob = {
    id : Text;
    fileId : FileId;
    owner : Principal;
    sourceFormat : VideoFormat;
    sourceCodec : VideoCodec;
    targetFormat : VideoFormat;
    targetCodec : VideoCodec;
    status : Text;
    progress : Nat;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    completedAt : ?Time.Time;
    errorMessage : ?Text;
    outputFileId : ?FileId;
    metadata : [(Text, Text)];
  };
  public type VideoMetadata = {
    fileId : FileId;
    originalFormat : VideoFormat;
    originalCodec : VideoCodec;
    availableFormats : [(VideoFormat, FileId)];
    transcodingStatus : Text;
    browserCompatibility : [(Text, Bool)];
    lastValidated : Time.Time;
    metadata : [(Text, Text)];
  };
  public type TranscodingConfig = {
    enableAutoTranscode : Bool;
    targetFormats : [VideoFormat];
    targetCodecs : [VideoCodec];
    maxConcurrentJobs : Nat;
    priority : Nat;
    metadata : [(Text, Text)];
  };
  public type MediaDiagnostics = {
    browserId : Text;
    supportedCodecs : [VideoCodec];
    supportedFormats : [VideoFormat];
    testedAt : Time.Time;
    metadata : [(Text, Text)];
  };

  // State variables
  var tenants = Map.empty<Text, Tenant>();
  var files = Map.empty<Text, FileMetadata>();
  var folders = Map.empty<Text, FolderMetadata>();
  var chunks = Map.empty<Text, Chunk>();
  var billingRecords = Map.empty<Text, BillingRecord>();
  var replicationTasks = Map.empty<Text, ReplicationTask>();
  var policies = Map.empty<Text, Policy>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var menuItems = Map.empty<Text, MenuItem>();
  var systemLogs = Map.empty<Text, SystemLog>();
  var themePreferences = Map.empty<Principal, ThemePreference>();
  var featureStatuses = Map.empty<Text, FeatureStatus>();
  var configuration : ?Stripe.StripeConfiguration = null;
  var customRoles = Map.empty<Principal, [Role]>();
  var chunkToFileMapping = Map.empty<Text, FileId>();
  var compareProviders = Map.empty<Text, CompareProvider>();
  var stripeSessionOwners = Map.empty<Text, Principal>();
  var backupSessions = Map.empty<Text, BackupSession>();
  var merkleBlocks = Map.empty<Text, MerkleBlock>();
  var uploadBatches = Map.empty<Text, UploadBatch>();
  var pageContents = Map.empty<Text, PageContent>();
  var sharingLinks = Map.empty<Text, SharingLink>();
  var monetizationRecords = Map.empty<Text, MonetizationRecord>();
  var contactInfo = Map.empty<Text, ContactInfo>();
  var transcodingJobs = Map.empty<Text, TranscodingJob>();
  var videoMetadata = Map.empty<Text, VideoMetadata>();
  var transcodingConfig : TranscodingConfig = {
    enableAutoTranscode = true;
    targetFormats = [#MP4, #WEBM];
    targetCodecs = [#H264_AAC, #VP9];
    maxConcurrentJobs = 5;
    priority = 1;
    metadata = [];
  };
  var mediaDiagnostics = Map.empty<Text, MediaDiagnostics>();

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

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Contact content functions
  public shared ({ caller }) func addContactInfo(newContactInfo : ContactInfo) : async () {
    // Admin-only: Contact information is sensitive business data
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can modify contact information");
    };
    contactInfo.add("contact_info", newContactInfo);
  };

  public query ({ caller }) func getContactInfo() : async ?ContactInfo {
    // Public access: Contact information is publicly accessible
    contactInfo.get("contact_info");
  };

  // Video transcoding functions

  // Upload video with automatic codec detection and transcoding trigger
  public shared ({ caller }) func uploadVideoWithCodecDetection(
    fileId : FileId,
    fileName : Text,
    contentType : Text,
    size : Nat,
    checksum : Text,
    detectedCodec : VideoCodec,
    detectedFormat : VideoFormat
  ) : async Text {
    // Require user permission for upload
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload videos");
    };

    // Create video metadata entry
    let videoMeta : VideoMetadata = {
      fileId = fileId;
      originalFormat = detectedFormat;
      originalCodec = detectedCodec;
      availableFormats = [(detectedFormat, fileId)];
      transcodingStatus = "pending";
      browserCompatibility = [];
      lastValidated = Time.now();
      metadata = [("uploadedBy", caller.toText())];
    };
    videoMetadata.add(fileId, videoMeta);

    // Check if transcoding is needed based on codec compatibility
    let needsTranscoding = switch (detectedCodec) {
      case (#H264_AAC) { false }; // Already compatible
      case (#VP9) { false }; // Already compatible
      case (_) { true }; // Needs transcoding
    };

    if (needsTranscoding and transcodingConfig.enableAutoTranscode) {
      // Create transcoding job
      let jobId = fileId # "-transcode-" # Time.now().toText();
      let job : TranscodingJob = {
        id = jobId;
        fileId = fileId;
        owner = caller;
        sourceFormat = detectedFormat;
        sourceCodec = detectedCodec;
        targetFormat = #MP4;
        targetCodec = #H264_AAC;
        status = "queued";
        progress = 0;
        createdAt = Time.now();
        updatedAt = Time.now();
        completedAt = null;
        errorMessage = null;
        outputFileId = null;
        metadata = [];
      };
      transcodingJobs.add(jobId, job);
      return "Video uploaded. Transcoding job created: " # jobId;
    } else {
      return "Video uploaded. No transcoding needed.";
    };
  };

  // Get transcoding status for a specific job
  public query ({ caller }) func getTranscodingStatus(jobId : Text) : async ?TranscodingJob {
    // Users can query their own jobs, admins can query all
    switch (transcodingJobs.get(jobId)) {
      case (null) { null };
      case (?job) {
        if (job.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?job;
        } else {
          Runtime.trap("Unauthorized: Can only view your own transcoding jobs");
        };
      };
    };
  };

  // Get all transcoding jobs for the caller
  public query ({ caller }) func getMyTranscodingJobs() : async [TranscodingJob] {
    // Require user permission
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transcoding jobs");
    };

    let jobs = Array.empty<TranscodingJob>().toVarArray<TranscodingJob>();

    for ((_, job) in transcodingJobs.entries()) {
      if (job.owner == caller) {
        jobs[jobs.size()] := job;
      };
    };

    jobs.toArray();
  };

  // Get all transcoding jobs (admin only)
  public query ({ caller }) func getAllTranscodingJobs() : async [TranscodingJob] {
    // Admin-only access
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all transcoding jobs");
    };

    let jobs = Array.empty<TranscodingJob>().toVarArray<TranscodingJob>();

    for ((_, job) in transcodingJobs.entries()) {
      jobs[jobs.size()] := job;
    };

    jobs.toArray();
  };

  // Get video metadata including available formats
  public query ({ caller }) func getVideoMetadata(fileId : FileId) : async ?VideoMetadata {
    // Check file ownership or admin permission
    switch (files.get(fileId)) {
      case (null) { null };
      case (?file) {
        if (file.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          videoMetadata.get(fileId);
        } else {
          Runtime.trap("Unauthorized: Can only view your own video metadata");
        };
      };
    };
  };

  // Get available video formats for a file
  public query ({ caller }) func getVideoFormats(fileId : FileId) : async [(VideoFormat, FileId)] {
    // Check file ownership or admin permission
    switch (files.get(fileId)) {
      case (null) { Runtime.trap("File not found") };
      case (?file) {
        if (file.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own video formats");
        };
      };
    };

    switch (videoMetadata.get(fileId)) {
      case (null) { [] };
      case (?meta) { meta.availableFormats };
    };
  };

  // Manually trigger transcoding for a video (admin only)
  public shared ({ caller }) func triggerManualTranscode(
    fileId : FileId,
    targetFormat : VideoFormat,
    targetCodec : VideoCodec
  ) : async Text {
    // Admin-only operation
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can manually trigger transcoding");
    };

    // Verify file exists
    switch (files.get(fileId)) {
      case (null) { Runtime.trap("File not found") };
      case (?file) {
        // Get video metadata
        switch (videoMetadata.get(fileId)) {
          case (null) { Runtime.trap("Video metadata not found") };
          case (?meta) {
            // Create transcoding job
            let jobId = fileId # "-manual-transcode-" # Time.now().toText();
            let job : TranscodingJob = {
              id = jobId;
              fileId = fileId;
              owner = file.owner;
              sourceFormat = meta.originalFormat;
              sourceCodec = meta.originalCodec;
              targetFormat = targetFormat;
              targetCodec = targetCodec;
              status = "queued";
              progress = 0;
              createdAt = Time.now();
              updatedAt = Time.now();
              completedAt = null;
              errorMessage = null;
              outputFileId = null;
              metadata = [("triggeredBy", caller.toText()), ("manual", "true")];
            };
            transcodingJobs.add(jobId, job);
            return "Manual transcoding job created: " # jobId;
          };
        };
      };
    };
  };

  // Update transcoding job progress (internal/admin only)
  public shared ({ caller }) func updateTranscodingProgress(
    jobId : Text,
    progress : Nat,
    status : Text
  ) : async () {
    // Admin-only operation
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update transcoding progress");
    };

    switch (transcodingJobs.get(jobId)) {
      case (null) { Runtime.trap("Transcoding job not found") };
      case (?job) {
        let updatedJob : TranscodingJob = {
          id = job.id;
          fileId = job.fileId;
          owner = job.owner;
          sourceFormat = job.sourceFormat;
          sourceCodec = job.sourceCodec;
          targetFormat = job.targetFormat;
          targetCodec = job.targetCodec;
          status = status;
          progress = progress;
          createdAt = job.createdAt;
          updatedAt = Time.now();
          completedAt = if (status == "completed") { ?Time.now() } else { job.completedAt };
          errorMessage = job.errorMessage;
          outputFileId = job.outputFileId;
          metadata = job.metadata;
        };
        transcodingJobs.add(jobId, updatedJob);
      };
    };
  };

  // Complete transcoding job with output file (internal/admin only)
  public shared ({ caller }) func completeTranscodingJob(
    jobId : Text,
    outputFileId : FileId
  ) : async () {
    // Admin-only operation
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can complete transcoding jobs");
    };

    switch (transcodingJobs.get(jobId)) {
      case (null) { Runtime.trap("Transcoding job not found") };
      case (?job) {
        // Update job status
        let updatedJob : TranscodingJob = {
          id = job.id;
          fileId = job.fileId;
          owner = job.owner;
          sourceFormat = job.sourceFormat;
          sourceCodec = job.sourceCodec;
          targetFormat = job.targetFormat;
          targetCodec = job.targetCodec;
          status = "completed";
          progress = 100;
          createdAt = job.createdAt;
          updatedAt = Time.now();
          completedAt = ?Time.now();
          errorMessage = null;
          outputFileId = ?outputFileId;
          metadata = job.metadata;
        };
        transcodingJobs.add(jobId, updatedJob);

        // Update video metadata with new format
        switch (videoMetadata.get(job.fileId)) {
          case (null) {};
          case (?meta) {
            let newFormats = Array.empty<(VideoFormat, FileId)>().toVarArray<(VideoFormat, FileId)>();
            for (format in meta.availableFormats.vals()) {
              newFormats[newFormats.size()] := format;
            };
            newFormats[newFormats.size()] := (job.targetFormat, outputFileId);

            let updatedMeta : VideoMetadata = {
              fileId = meta.fileId;
              originalFormat = meta.originalFormat;
              originalCodec = meta.originalCodec;
              availableFormats = newFormats.toArray();
              transcodingStatus = "completed";
              browserCompatibility = meta.browserCompatibility;
              lastValidated = Time.now();
              metadata = meta.metadata;
            };
            videoMetadata.add(job.fileId, updatedMeta);
          };
        };
      };
    };
  };

  // Get transcoding configuration (admin only)
  public query ({ caller }) func getTranscodingConfig() : async TranscodingConfig {
    // Admin-only access
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view transcoding configuration");
    };
    transcodingConfig;
  };

  // Update transcoding configuration (admin only)
  public shared ({ caller }) func updateTranscodingConfig(config : TranscodingConfig) : async () {
    // Admin-only operation
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update transcoding configuration");
    };
    transcodingConfig := config;
  };

  // Media diagnostics functions

  // Submit media diagnostics report (any user)
  public shared ({ caller }) func submitMediaDiagnostics(diagnostics : MediaDiagnostics) : async () {
    // Any authenticated user can submit diagnostics
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit media diagnostics");
    };
    mediaDiagnostics.add(diagnostics.browserId, diagnostics);
  };

  // Get media diagnostics (admin only)
  public query ({ caller }) func getMediaDiagnostics(browserId : Text) : async ?MediaDiagnostics {
    // Admin-only access
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view media diagnostics");
    };
    mediaDiagnostics.get(browserId);
  };

  // Get all media diagnostics (admin only)
  public query ({ caller }) func getAllMediaDiagnostics() : async [MediaDiagnostics] {
    // Admin-only access
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all media diagnostics");
    };

    let diagnosticsList = Array.empty<MediaDiagnostics>().toVarArray<MediaDiagnostics>();

    for ((_, diag) in mediaDiagnostics.entries()) {
      diagnosticsList[diagnosticsList.size()] := diag;
    };

    diagnosticsList.toArray();
  };

  // Stripe integration functions
  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
