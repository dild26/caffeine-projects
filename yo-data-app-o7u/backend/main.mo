import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

import AccessControl "authorization/access-control";
import BlobStorage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";


actor {
  include MixinStorage();

  type Blob = BlobStorage.ExternalBlob;

  // TYPES
  type Dataset = {
    id : Text;
    name : Text;
    owner : Principal;
    createdAt : Time.Time;
    format : Text;
    schema : Text;
    blob : Blob;
    isPublic : Bool;
    cid : ?Text;
    merkleHash : ?Text;
  };

  type Project = {
    id : Text;
    name : Text;
    owner : Principal;
    createdAt : Time.Time;
    description : Text;
  };

  type UserProfile = {
    id : Principal;
    name : Text;
    email : Text;
    createdAt : Time.Time;
  };

  type DatasetPermission = {
    datasetId : Text;
    user : Principal;
    canRead : Bool;
    canWrite : Bool;
  };

  type NavigationPage = {
    id : Text;
    route : Text;
    title : Text;
    metadata : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    version : Nat;
  };

  type ContactInfo = {
    companyName : Text;
    ceoName : Text;
    primaryEmail : Text;
    phone : Text;
    website : Text;
    whatsapp : Text;
    businessAddress : Text;
    paypal : Text;
    upiId : Text;
    ethId : Text;
    mapLink : Text;
    socialLinks : [(Text, Text)];
    logoText : Text;
    logoImageUrl : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    version : Nat;
  };

  type ContactInfoVersion = {
    contactInfo : ContactInfo;
    updatedAt : Time.Time;
    version : Nat;
  };

  type SitemapEntry = {
    id : Text;
    route : Text;
    title : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    version : Nat;
  };

  type SitemapPage = {
    id : Text;
    route : Text;
    title : Text;
    metadata : Text;
    navOrder : Nat;
    visibility : Bool;
    content : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    version : Nat;
  };

  type ArchiveContent = {
    id : Text;
    title : Text;
    content : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    version : Nat;
  };

  type ArchiveCollection = {
    id : Text;
    name : Text;
    owner : Principal;
    pages : [ArchiveContent];
    createdAt : Time.Time;
    updatedAt : Time.Time;
    version : Nat;
    zipFileName : Text;
    fileParseErrors : [(Text, Text)];
  };

  type FeatureProgress = {
    id : Text;
    name : Text;
    description : Text;
    completion : Nat;
    implemented : Bool;
    validated : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  // Persistent storage (state variables)
  var profiles = Map.empty<Principal, UserProfile>();
  var datasets = Map.empty<Text, Dataset>();
  var datasetPermissions = Map.empty<Text, List.List<DatasetPermission>>();
  var projects = Map.empty<Text, Project>();
  var projectMembers = Map.empty<Text, List.List<Principal>>();
  var navigationPages = Map.empty<Text, NavigationPage>();
  var contactInfo : ?ContactInfo = null;
  var contactInfoHistory = List.empty<ContactInfoVersion>();
  var sitemaps = Map.empty<Text, SitemapEntry>();
  var sitemapPages = Map.empty<Text, SitemapPage>();
  var archives = Map.empty<Text, ArchiveCollection>();
  var featureProgressMap = Map.empty<Text, FeatureProgress>();

  // Map to store public links by CID.
  let publicLinks = Map.empty<Text, Text>();

  // Map to store cid to dataset id mappings.
  let cidToDatasetId = Map.empty<Text, Text>();

  // Next nonce value for merkle hashes / CID generation.
  var nextNonce = 0;

  let accessControlState = AccessControl.initState();

  // CID / Merkle hash generation helper returns 8 char CID.
  // Nonce is not used (for deterministic hash after upload!) to avoid collisions with existing code.
  func generateCID(blob : Blob) : Text {
    // Simply return a dummy CID until proper hash implementation.
    "12345678";
  };

  // Public route handler for /dataset/:cid
  public query ({ caller }) func getPublicDatasetByCID(cid : Text) : async ?Dataset {
    switch (cidToDatasetId.get(cid)) {
      case (?datasetId) {
        switch (datasets.get(datasetId)) {
          case (?dataset) {
            if (dataset.isPublic) {
              ?{
                id = dataset.id;
                name = dataset.name;
                owner = dataset.owner;
                createdAt = dataset.createdAt;
                format = dataset.format;
                schema = dataset.schema;
                blob = dataset.blob;
                isPublic = true;
                cid = dataset.cid;
                merkleHash = dataset.merkleHash;
              };
            } else {
              null;
            };
          };
          case (null) {
            null;
          };
        };
      };
      case (null) {
        null;
      };
    };
  };

  // FEATURE PROGRESS
  // ================
  module FeatureProgress {
    public func compare(a : FeatureProgress, b : FeatureProgress) : Order.Order {
      switch (Nat.compare(a.completion, b.completion)) {
        case (#equal) {
          Text.compare(a.name, b.name);
        };
        case (other) { other };
      };
    };

    public func compareByTimestamp(a : FeatureProgress, b : FeatureProgress) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };
  };

  func getFeatureProgress(featureId : Text) : ?FeatureProgress {
    featureProgressMap.get(featureId);
  };

  func getAllFeatureProgress() : [FeatureProgress] {
    featureProgressMap.values().toArray();
  };

  func updateFeatureProgress(
    current : FeatureProgress,
    validationStatus : ?Bool,
    completion : ?Nat,
  ) : FeatureProgress {
    let validated = switch (validationStatus, completion) {
      case (null, null) { current.implemented };
      case (?status, null) { status };
      case (null, ?p) { current.implemented and p == 100 };
      case (?status, ?p) { status or p == 100 };
    };

    let implemented = switch (validationStatus) {
      case (null) { current.implemented };
      case (?value) { value };
    };

    {
      id = current.id;
      name = current.name;
      description = current.description;
      completion = switch (completion) {
        case (null) { current.completion };
        case (?value) { value };
      };
      implemented = implemented;
      validated = validated;
      createdAt = current.createdAt;
      updatedAt = Time.now();
    };
  };

  public shared ({ caller }) func updateFeatureStatus(
    featureId : Text,
    validationStatus : ?Bool,
    completion : ?Nat,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update feature progress");
    };
    switch (featureProgressMap.get(featureId)) {
      case (null) { false };
      case (?currentStatus) {
        let updatedStatus = updateFeatureProgress(currentStatus, validationStatus, completion);
        featureProgressMap.add(featureId, updatedStatus);
        true;
      };
    };
  };

  public shared ({ caller }) func updateMultipleFeatureStatus(
    statuses : [(Text, ?Bool, ?Nat)],
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update feature progress");
    };
    var updatedCount = 0;
    for ((featureId, validated, completed) in statuses.values()) {
      switch (featureProgressMap.get(featureId)) {
        case (null) {};
        case (?currentStatus) {
          let updatedStatus = updateFeatureProgress(currentStatus, validated, completed);
          featureProgressMap.add(featureId, updatedStatus);
          updatedCount += 1;
        };
      };
    };
    updatedCount;
  };

  public query ({ caller }) func getFeatureById(
    featureId : Text,
  ) : async ?FeatureProgress {
    switch (featureProgressMap.get(featureId)) {
      case (null) { null };
      case (?status) { ?status };
    };
  };

  public query ({ caller }) func getFeaturesByType(
    isImplemented : ?Bool,
    isValidated : ?Bool,
    completionPercentage : ?Nat,
  ) : async [FeatureProgress] {
    featureProgressMap.values().toArray();
  };

  public query ({ caller }) func getFeaturesByTimestamp(
    createdFrom : Time.Time,
    createdTo : Time.Time,
    modifiedFrom : Time.Time,
    modifiedTo : Time.Time,
  ) : async [FeatureProgress] {
    featureProgressMap.values().toArray();
  };

  public query func getPublicFeatures() : async [FeatureProgress] {
    featureProgressMap.values().toArray();
  };

  public query ({ caller }) func getAllFeatures() : async [FeatureProgress] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access full features list.");
    };
    featureProgressMap.values().toArray();
  };

  // ACCESS CONTROL
  // ==============

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(
    user : Principal,
    role : AccessControl.UserRole,
  ) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // USER PROFILE
  // ============

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  // DATASETS
  // ========

  private func hasDatasetReadAccess(caller : Principal, dataset : Dataset) : Bool {
    if (dataset.owner == caller) { return true };
    if (AccessControl.isAdmin(accessControlState, caller)) { return true };
    if (dataset.isPublic) { return true };

    switch (datasetPermissions.get(dataset.id)) {
      case (null) { false };
      case (?permList) {
        var hasAccess = false;
        for (perm in permList.toArray().vals()) {
          if (perm.user == caller and perm.canRead) { hasAccess := true };
        };
        hasAccess;
      };
    };
  };

  private func hasDatasetWriteAccess(caller : Principal, dataset : Dataset) : Bool {
    if (dataset.owner == caller) { return true };
    if (AccessControl.isAdmin(accessControlState, caller)) { return true };

    switch (datasetPermissions.get(dataset.id)) {
      case (null) { false };
      case (?permList) {
        var hasAccess = false;
        for (perm in permList.toArray().vals()) {
          if (perm.user == caller and perm.canWrite) { hasAccess := true };
        };
        hasAccess;
      };
    };
  };

  module Dataset {
    public func compare(a : Dataset, b : Dataset) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  public shared ({ caller }) func createDataset(
    name : Text,
    format : Text,
    schema : Text,
    blob : Blob,
    isPublic : Bool,
  ) : async Dataset {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create datasets");
    };
    let id = Time.now().toText();
    let cid = if (isPublic) { ?generateCID(blob) } else { null };
    let merkleHash = cid;
    let dataset = {
      id;
      name;
      owner = caller;
      createdAt = Time.now();
      format;
      schema;
      blob;
      isPublic;
      cid;
      merkleHash;
    };
    datasets.add(id, dataset);

    switch (cid) {
      case (?c) {
        publicLinks.add(c, id);
        cidToDatasetId.add(c, id);
      };
      case (null) {};
    };

    dataset;
  };

  public query ({ caller }) func getDataset(id : Text) : async ?Dataset {
    switch (datasets.get(id)) {
      case (?dataset) {
        if (hasDatasetReadAccess(caller, dataset)) { ?dataset } else {
          Runtime.trap("Unauthorized: Insufficient permissions to view this dataset");
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserDatasets() : async [Dataset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list datasets");
    };
    datasets.values().toArray().filter(func(d) { hasDatasetReadAccess(caller, d) });
  };

  public query func getPublicDatasets() : async [Dataset] {
    datasets.values().toArray().filter(func(d) { d.isPublic });
  };

  public query ({ caller }) func getAllDatasetsSorted() : async [Dataset] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all datasets");
    };
    datasets.values().toArray().sort();
  };

  public shared ({ caller }) func updateDataset(
    id : Text,
    name : Text,
    schema : Text,
    isPublic : Bool,
  ) : async ?Dataset {
    switch (datasets.get(id)) {
      case (?dataset) {
        if (not hasDatasetWriteAccess(caller, dataset)) {
          Runtime.trap("Unauthorized: Only the owner or admin can update this dataset");
        };

        let cid = if (isPublic) { ?generateCID(dataset.blob) } else { null };
        let merkleHash = cid;

        let updatedDataset = {
          id = dataset.id;
          name;
          owner = dataset.owner;
          createdAt = dataset.createdAt;
          format = dataset.format;
          schema;
          blob = dataset.blob;
          isPublic;
          cid;
          merkleHash;
        };
        datasets.add(id, updatedDataset);

        switch (cid) {
          case (?c) {
            publicLinks.add(c, id);
            cidToDatasetId.add(c, id);
          };
          case (null) {};
        };

        ?updatedDataset;
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteDataset(id : Text) : async Bool {
    switch (datasets.get(id)) {
      case (?dataset) {
        if (not hasDatasetWriteAccess(caller, dataset)) {
          Runtime.trap("Unauthorized: Only the owner or admin can delete this dataset");
        };
        datasets.remove(id);
        datasetPermissions.remove(id);
        switch (dataset.cid) {
          case (?c) {
            publicLinks.remove(c);
            cidToDatasetId.remove(c);
          };
          case (null) {};
        };
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func shareDataset(
    datasetId : Text,
    user : Principal,
    canRead : Bool,
    canWrite : Bool,
  ) : async Bool {
    switch (datasets.get(datasetId)) {
      case (?dataset) {
        if (not hasDatasetWriteAccess(caller, dataset)) {
          Runtime.trap("Unauthorized: Only the owner or admin can share this dataset");
        };
        let permission : DatasetPermission = {
          datasetId;
          user;
          canRead;
          canWrite;
        };
        let currentPerms = switch (datasetPermissions.get(datasetId)) {
          case (null) { List.empty<DatasetPermission>() };
          case (?perms) { perms };
        };
        let filteredPerms = currentPerms.filter(func(p) { p.user != user });
        filteredPerms.add(permission);
        datasetPermissions.add(datasetId, filteredPerms);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func revokeDatasetAccess(
    datasetId : Text,
    user : Principal,
  ) : async Bool {
    switch (datasets.get(datasetId)) {
      case (?dataset) {
        if (not hasDatasetWriteAccess(caller, dataset)) {
          Runtime.trap("Unauthorized: Only the owner or admin can revoke access");
        };
        switch (datasetPermissions.get(datasetId)) {
          case (null) { false };
          case (?perms) {
            let filteredPerms = perms.filter(func(p) { p.user != user });
            datasetPermissions.add(datasetId, filteredPerms);
            true;
          };
        };
      };
      case (null) { false };
    };
  };

  // PROJECTS
  // ========

  module Project {
    public func compare(a : Project, b : Project) : Order.Order {
      Int.compare(a.createdAt, b.createdAt);
    };
  };

  private func isProjectMember(projectId : Text, user : Principal) : Bool {
    switch (projectMembers.get(projectId)) {
      case (null) { false };
      case (?members) {
        var isMember = false;
        for (member in members.toArray().vals()) {
          if (member == user) { isMember := true };
        };
        isMember;
      };
    };
  };

  public shared ({ caller }) func createProject(
    name : Text,
    description : Text,
  ) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };
    let id = Time.now().toText();
    let project = {
      id;
      name;
      owner = caller;
      createdAt = Time.now();
      description;
    };
    projects.add(id, project);

    let members = List.empty<Principal>();
    members.add(caller);
    projectMembers.add(id, members);

    project;
  };

  public query ({ caller }) func getProject(id : Text) : async ?Project {
    switch (projects.get(id)) {
      case (?project) {
        if (
          project.owner == caller or isProjectMember(id, caller) or AccessControl.isAdmin(
            accessControlState,
            caller,
          )
        ) {
          ?project;
        } else {
          Runtime.trap("Unauthorized: Only project members can view this project");
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list projects");
    };
    projects.values().toArray().filter(
      func(p) {
        p.owner == caller or isProjectMember(p.id, caller);
      }
    );
  };

  public query ({ caller }) func getAllProjectsSorted() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all projects");
    };
    projects.values().toArray().sort();
  };

  public shared ({ caller }) func updateProject(
    id : Text,
    name : Text,
    description : Text,
  ) : async ?Project {
    switch (projects.get(id)) {
      case (?project) {
        if (
          project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)
        ) {
          Runtime.trap("Unauthorized: Only the owner or admin can update this project");
        };

        let updatedProject = {
          id = project.id;
          name;
          owner = project.owner;
          createdAt = project.createdAt;
          description;
        };
        projects.add(id, updatedProject);
        ?updatedProject;
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteProject(id : Text) : async Bool {
    switch (projects.get(id)) {
      case (?project) {
        if (
          project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)
        ) {
          Runtime.trap("Unauthorized: Only the owner or admin can delete this project");
        };
        projects.remove(id);
        projectMembers.remove(id);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func addProjectMember(
    projectId : Text,
    user : Principal,
  ) : async Bool {
    switch (projects.get(projectId)) {
      case (?project) {
        if (
          project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)
        ) {
          Runtime.trap("Unauthorized: Only the owner or admin can add members");
        };
        let currentMembers = switch (projectMembers.get(projectId)) {
          case (null) { List.empty<Principal>() };
          case (?members) { members };
        };
        let filteredMembers = currentMembers.filter(func(m) { m != user });
        projectMembers.add(projectId, filteredMembers);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func removeProjectMember(
    projectId : Text,
    user : Principal,
  ) : async Bool {
    switch (projects.get(projectId)) {
      case (?project) {
        if (
          project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)
        ) {
          Runtime.trap("Unauthorized: Only the owner or admin can remove members");
        };
        switch (projectMembers.get(projectId)) {
          case (null) { false };
          case (?members) {
            let filteredMembers = members.filter(func(m) { m != user });
            projectMembers.add(projectId, filteredMembers);
            true;
          };
        };
      };
      case (null) { false };
    };
  };

  // NAVIGATION PAGES
  // ================

  public shared ({ caller }) func createNavigationPage(
    route : Text,
    title : Text,
    metadata : Text,
  ) : async NavigationPage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create navigation pages");
    };
    let id = Time.now().toText();
    let page = {
      id;
      route;
      title;
      metadata;
      createdAt = Time.now();
      updatedAt = Time.now();
      version = 1;
    };
    navigationPages.add(id, page);
    page;
  };

  public query func getNavigationPage(id : Text) : async ?NavigationPage {
    navigationPages.get(id);
  };

  public query func getAllNavigationPages() : async [NavigationPage] {
    navigationPages.values().toArray();
  };

  public shared ({ caller }) func updateNavigationPage(
    id : Text,
    route : Text,
    title : Text,
    metadata : Text,
  ) : async ?NavigationPage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update navigation pages");
    };
    switch (navigationPages.get(id)) {
      case (?page) {
        let updatedPage = {
          id = page.id;
          route;
          title;
          metadata;
          createdAt = page.createdAt;
          updatedAt = Time.now();
          version = page.version + 1;
        };
        navigationPages.add(id, updatedPage);
        ?updatedPage;
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteNavigationPage(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete navigation pages");
    };
    switch (navigationPages.get(id)) {
      case (?_) {
        navigationPages.remove(id);
        true;
      };
      case (null) { false };
    };
  };

  // CONTACT INFO
  // ============

  public query func getContactInfo() : async ?ContactInfo {
    contactInfo;
  };

  public shared ({ caller }) func updateContactInfo(info : ContactInfo) : async ContactInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update contact information");
    };
    let version = switch (contactInfo) {
      case (null) { 1 };
      case (?current) { current.version + 1 };
    };

    let newInfo = {
      companyName = info.companyName;
      ceoName = info.ceoName;
      primaryEmail = info.primaryEmail;
      phone = info.phone;
      website = info.website;
      whatsapp = info.whatsapp;
      businessAddress = info.businessAddress;
      paypal = info.paypal;
      upiId = info.upiId;
      ethId = info.ethId;
      mapLink = info.mapLink;
      socialLinks = info.socialLinks;
      logoText = info.logoText;
      logoImageUrl = info.logoImageUrl;
      createdAt = switch (contactInfo) {
        case (null) { Time.now() };
        case (?current) { current.createdAt };
      };
      updatedAt = Time.now();
      version;
    };

    let historyEntry : ContactInfoVersion = {
      contactInfo = newInfo;
      updatedAt = Time.now();
      version;
    };
    contactInfoHistory.add(historyEntry);

    contactInfo := ?newInfo;
    newInfo;
  };

  public query ({ caller }) func getContactInfoHistory() : async [ContactInfoVersion] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact information history");
    };
    contactInfoHistory.toArray();
  };

  // SITEMAP
  // =======

  public shared ({ caller }) func createSitemapEntry(
    route : Text,
    title : Text,
  ) : async SitemapEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create sitemap entries");
    };
    let id = Time.now().toText();
    let entry = {
      id;
      route;
      title;
      createdAt = Time.now();
      updatedAt = Time.now();
      version = 1;
    };
    sitemaps.add(id, entry);
    entry;
  };

  public query func getSitemapEntry(id : Text) : async ?SitemapEntry {
    sitemaps.get(id);
  };

  public query func getAllSitemapEntries() : async [SitemapEntry] {
    sitemaps.values().toArray();
  };

  public shared ({ caller }) func updateSitemapEntry(
    id : Text,
    route : Text,
    title : Text,
  ) : async ?SitemapEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update sitemap entries");
    };
    switch (sitemaps.get(id)) {
      case (?entry) {
        let updatedEntry = {
          id = entry.id;
          route;
          title;
          createdAt = entry.createdAt;
          updatedAt = Time.now();
          version = entry.version + 1;
        };
        sitemaps.add(id, updatedEntry);
        ?updatedEntry;
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteSitemapEntry(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete sitemap entries");
    };
    switch (sitemaps.get(id)) {
      case (?_) {
        sitemaps.remove(id);
        true;
      };
      case (null) { false };
    };
  };

  // SITEMAP PAGES
  // =============

  public shared ({ caller }) func createSitemapPage(
    route : Text,
    title : Text,
    metadata : Text,
    navOrder : Nat,
    visibility : Bool,
    content : Text,
  ) : async SitemapPage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create sitemap pages");
    };
    let id = Time.now().toText();
    let page = {
      id;
      route;
      title;
      metadata;
      navOrder;
      visibility;
      content;
      createdAt = Time.now();
      updatedAt = Time.now();
      version = 1;
    };
    sitemapPages.add(id, page);
    page;
  };

  public query func getSitemapPage(id : Text) : async ?SitemapPage {
    sitemapPages.get(id);
  };

  public query func getSitemapPages() : async [SitemapPage] {
    sitemapPages.values().toArray();
  };

  public shared ({ caller }) func updateSitemapPage(
    id : Text,
    route : Text,
    title : Text,
    metadata : Text,
    navOrder : Nat,
    visibility : Bool,
    content : Text,
  ) : async ?SitemapPage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update sitemap pages");
    };
    switch (sitemapPages.get(id)) {
      case (?page) {
        let updatedPage = {
          id = page.id;
          route;
          title;
          metadata;
          navOrder;
          visibility;
          content;
          createdAt = page.createdAt;
          updatedAt = Time.now();
          version = page.version + 1;
        };
        sitemapPages.add(id, updatedPage);
        ?updatedPage;
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteSitemapPage(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete sitemap pages");
    };
    switch (sitemapPages.get(id)) {
      case (?_) {
        sitemapPages.remove(id);
        true;
      };
      case (null) { false };
    };
  };

  // ARCHIVE COLLECTIONS
  // ===================

  public shared ({ caller }) func createArchiveCollection(
    name : Text,
    zipFileName : Text,
    pages : [ArchiveContent],
    fileParseErrors : [(Text, Text)],
  ) : async ArchiveCollection {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users and admins can create archive collections");
    };
    let id = Time.now().toText();
    let collection = {
      id;
      name;
      owner = caller;
      pages;
      createdAt = Time.now();
      updatedAt = Time.now();
      version = 1;
      zipFileName;
      fileParseErrors;
    };
    archives.add(id, collection);
    collection;
  };

  public query func getArchiveCollection(id : Text) : async ?ArchiveCollection {
    // Public read access - explore page is accessible to all users including guests
    archives.get(id);
  };

  public query func getArchiveCollections() : async [ArchiveCollection] {
    // Public read access - explore page is accessible to all users including guests
    archives.values().toArray();
  };

  public shared ({ caller }) func updateArchiveCollection(
    id : Text,
    name : Text,
    zipFileName : Text,
    pages : [ArchiveContent],
    fileParseErrors : [(Text, Text)],
  ) : async ?ArchiveCollection {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users and admins can update archive collections");
    };
    switch (archives.get(id)) {
      case (?collection) {
        // Verify ownership: only the owner or an admin can update
        if (collection.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner or admin can update this archive collection");
        };

        let updatedCollection = {
          id = collection.id;
          name;
          owner = collection.owner;
          pages;
          createdAt = collection.createdAt;
          updatedAt = Time.now();
          version = collection.version + 1;
          zipFileName;
          fileParseErrors;
        };
        archives.add(id, updatedCollection);
        ?updatedCollection;
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteArchiveCollection(id : Text) : async Bool {
    // Only admins can delete archive collections
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete archive collections");
    };
    switch (archives.get(id)) {
      case (?_) {
        archives.remove(id);
        true;
      };
      case (null) { false };
    };
  };
};
