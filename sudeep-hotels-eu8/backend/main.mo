import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";
import OrderedMap "mo:base/OrderedMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

actor OpHotelsToRest {
  // Access control state initialization
  let accessControlState = AccessControl.initState();

  // Authorization functions
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

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  // Public access - guests can view their own profiles
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  // Restricted access - only view own profile or admin can view any
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  // Public access - guests can save their own profiles
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Storage system
  let storage = Storage.new();
  include MixinStorage(storage);

  // Task Management Types
  public type Task = {
    id : Text;
    title : Text;
    description : Text;
    status : Text;
    branch : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    merkleProof : Text;
  };

  public type TaskEvent = {
    taskId : Text;
    eventType : Text;
    timestamp : Time.Time;
    details : Text;
  };

  public type MerkleRoot = {
    root : Text;
    timestamp : Time.Time;
  };

  // Data Object Management Types
  public type DataObject = {
    id : Text;
    name : Text;
    fileType : Text;
    metadata : Text;
    preview : ?Text;
    uploadedAt : Time.Time;
    blob : Storage.ExternalBlob;
  };

  // Contact Verification Types
  public type ContactData = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    verified : Bool;
    source : Text;
    lastVerified : Time.Time;
  };

  public type VerificationLog = {
    contactId : Text;
    verificationResult : Bool;
    timestamp : Time.Time;
    details : Text;
  };

  // Data Integrity Management Types
  public type IntegrityLog = {
    id : Text;
    operation : Text;
    result : Text;
    timestamp : Time.Time;
    details : Text;
  };

  public type IntegritySchedule = {
    id : Text;
    frequency : Text;
    nextRun : Time.Time;
    lastRun : Time.Time;
  };

  // Cross-Origin Sync Types
  public type SyncOperation = {
    id : Text;
    source : Text;
    target : Text;
    status : Text;
    timestamp : Time.Time;
    details : Text;
  };

  public type ClonedPage = {
    id : Text;
    url : Text;
    content : Text;
    metadata : Text;
    lastSynced : Time.Time;
    source : Text;
  };

  // Sitemap and Metadata Types
  public type SitemapEntry = {
    id : Text;
    url : Text;
    title : Text;
    description : Text;
    lastUpdated : Time.Time;
    source : Text;
  };

  public type SearchIndex = {
    id : Text;
    content : Text;
    keywords : [Text];
    lastIndexed : Time.Time;
    source : Text;
  };

  // Theme Configuration Types
  public type ThemeConfig = {
    id : Text;
    name : Text;
    mode : Text;
    colors : Text;
    assets : Text;
    lastUpdated : Time.Time;
    source : Text;
  };

  // Dynamic Menu System Types
  public type MenuItem = {
    id : Text;
    menuLabel : Text;
    url : Text;
    category : Text;
    source : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    version : Nat;
    isVisible : Bool;
    order : Nat;
  };

  public type MenuAuditLog = {
    menuItemId : Text;
    operation : Text;
    timestamp : Time.Time;
    details : Text;
    version : Nat;
  };

  public type VerificationResult = {
    id : Text;
    status : Text;
    timestamp : Time.Time;
    details : Text;
  };

  // New Types for Manual Pages and Controlled Routes
  public type ControlledRoute = {
    path : Text;
    appController : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  // Storage Maps
  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  var tasks = textMap.empty<Task>();
  var taskEvents = textMap.empty<[TaskEvent]>();
  var merkleRoots = textMap.empty<MerkleRoot>();
  var contactData = textMap.empty<ContactData>();
  var verificationLogs = textMap.empty<[VerificationLog]>();
  var integrityLogs = textMap.empty<[IntegrityLog]>();
  var integritySchedules = textMap.empty<IntegritySchedule>();
  var syncOperations = textMap.empty<[SyncOperation]>();
  var clonedPages = textMap.empty<ClonedPage>();
  var sitemapEntries = textMap.empty<SitemapEntry>();
  var searchIndexes = textMap.empty<SearchIndex>();
  var themeConfigs = textMap.empty<ThemeConfig>();
  var dataObjects = textMap.empty<DataObject>();
  var menuItems = textMap.empty<MenuItem>();
  var menuAuditLogs = textMap.empty<[MenuAuditLog]>();
  var verificationResults = textMap.empty<VerificationResult>();
  var controlledRoutes = textMap.empty<ControlledRoute>();

  // Manual Pages Array
  var manualPages : [Text] = [];

  // Task Management Functions - Public Read Access, User Write Access
  public shared ({ caller }) func createTask(task : Task) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create tasks");
    };
    tasks := textMap.put(tasks, task.id, task);
    let event : TaskEvent = {
      taskId = task.id;
      eventType = "created";
      timestamp = Time.now();
      details = "Task created";
    };
    let existingEvents = textMap.get(taskEvents, task.id);
    let updatedEvents = switch (existingEvents) {
      case null { [event] };
      case (?events) { Array.append(events, [event]) };
    };
    taskEvents := textMap.put(taskEvents, task.id, updatedEvents);
  };

  public query func getTask(taskId : Text) : async ?Task {
    textMap.get(tasks, taskId);
  };

  public query func getTaskEvents(taskId : Text) : async [TaskEvent] {
    switch (textMap.get(taskEvents, taskId)) {
      case null { [] };
      case (?events) { events };
    };
  };

  public shared ({ caller }) func updateTask(task : Task) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update tasks");
    };
    tasks := textMap.put(tasks, task.id, task);
    let event : TaskEvent = {
      taskId = task.id;
      eventType = "updated";
      timestamp = Time.now();
      details = "Task updated";
    };
    let existingEvents = textMap.get(taskEvents, task.id);
    let updatedEvents = switch (existingEvents) {
      case null { [event] };
      case (?events) { Array.append(events, [event]) };
    };
    taskEvents := textMap.put(taskEvents, task.id, updatedEvents);
  };

  public shared ({ caller }) func addMerkleRoot(merkleRoot : MerkleRoot) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add Merkle roots");
    };
    merkleRoots := textMap.put(merkleRoots, merkleRoot.root, merkleRoot);
  };

  public query func getMerkleRoot(root : Text) : async ?MerkleRoot {
    textMap.get(merkleRoots, root);
  };

  // Data Object Management Functions - Public Read Access, User Write Access
  public shared ({ caller }) func addDataObject(dataObject : DataObject) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add data objects");
    };
    dataObjects := textMap.put(dataObjects, dataObject.id, dataObject);
  };

  public query func getDataObject(dataObjectId : Text) : async ?DataObject {
    textMap.get(dataObjects, dataObjectId);
  };

  // Contact Verification Functions - Public Read Access, User Write Access
  public shared ({ caller }) func addContactData(contact : ContactData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add contact data");
    };
    contactData := textMap.put(contactData, contact.id, contact);
  };

  public query func getContactData(contactId : Text) : async ?ContactData {
    textMap.get(contactData, contactId);
  };

  public shared ({ caller }) func addVerificationLog(log : VerificationLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add verification logs");
    };
    let existingLogs = textMap.get(verificationLogs, log.contactId);
    let updatedLogs = switch (existingLogs) {
      case null { [log] };
      case (?logs) { Array.append(logs, [log]) };
    };
    verificationLogs := textMap.put(verificationLogs, log.contactId, updatedLogs);
  };

  public query func getVerificationLogs(contactId : Text) : async [VerificationLog] {
    switch (textMap.get(verificationLogs, contactId)) {
      case null { [] };
      case (?logs) { logs };
    };
  };

  // Data Integrity Management Functions - Public Read Access, Admin Write Access
  public shared ({ caller }) func addIntegrityLog(log : IntegrityLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add integrity logs");
    };
    let existingLogs = textMap.get(integrityLogs, log.id);
    let updatedLogs = switch (existingLogs) {
      case null { [log] };
      case (?logs) { Array.append(logs, [log]) };
    };
    integrityLogs := textMap.put(integrityLogs, log.id, updatedLogs);
  };

  public query func getIntegrityLogs(logId : Text) : async [IntegrityLog] {
    switch (textMap.get(integrityLogs, logId)) {
      case null { [] };
      case (?logs) { logs };
    };
  };

  public shared ({ caller }) func addIntegritySchedule(schedule : IntegritySchedule) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add integrity schedules");
    };
    integritySchedules := textMap.put(integritySchedules, schedule.id, schedule);
  };

  public query func getIntegritySchedule(scheduleId : Text) : async ?IntegritySchedule {
    textMap.get(integritySchedules, scheduleId);
  };

  // Cross-Origin Sync Functions - Public Read Access, Admin Write Access
  public shared ({ caller }) func addSyncOperation(operation : SyncOperation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add sync operations");
    };
    let existingOps = textMap.get(syncOperations, operation.id);
    let updatedOps = switch (existingOps) {
      case null { [operation] };
      case (?ops) { Array.append(ops, [operation]) };
    };
    syncOperations := textMap.put(syncOperations, operation.id, updatedOps);
  };

  public query func getSyncOperations(operationId : Text) : async [SyncOperation] {
    switch (textMap.get(syncOperations, operationId)) {
      case null { [] };
      case (?ops) { ops };
    };
  };

  public shared ({ caller }) func addClonedPage(page : ClonedPage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add cloned pages");
    };
    clonedPages := textMap.put(clonedPages, page.id, page);
  };

  // Sitemap and Metadata Functions - Public Read Access, Admin Write Access
  public shared ({ caller }) func addSitemapEntry(entry : SitemapEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add sitemap entries");
    };
    sitemapEntries := textMap.put(sitemapEntries, entry.id, entry);
  };

  public shared ({ caller }) func addSearchIndex(index : SearchIndex) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add search indexes");
    };
    searchIndexes := textMap.put(searchIndexes, index.id, index);
  };

  // Theme Configuration Functions - Public Read Access, Admin Write Access
  public shared ({ caller }) func addThemeConfig(config : ThemeConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add theme configs");
    };
    themeConfigs := textMap.put(themeConfigs, config.id, config);
  };

  // Dynamic Menu System Functions - Public Read Access, Admin Write Access
  public shared ({ caller }) func addMenuItem(menuItem : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add menu items");
    };
    menuItems := textMap.put(menuItems, menuItem.id, menuItem);

    let auditLog : MenuAuditLog = {
      menuItemId = menuItem.id;
      operation = "created";
      timestamp = Time.now();
      details = "Menu item created";
      version = menuItem.version;
    };

    let existingLogs = textMap.get(menuAuditLogs, menuItem.id);
    let updatedLogs = switch (existingLogs) {
      case null { [auditLog] };
      case (?logs) { Array.append(logs, [auditLog]) };
    };
    menuAuditLogs := textMap.put(menuAuditLogs, menuItem.id, updatedLogs);
  };

  public shared ({ caller }) func updateMenuItem(menuItem : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update menu items");
    };
    menuItems := textMap.put(menuItems, menuItem.id, menuItem);

    let auditLog : MenuAuditLog = {
      menuItemId = menuItem.id;
      operation = "updated";
      timestamp = Time.now();
      details = "Menu item updated";
      version = menuItem.version;
    };

    let existingLogs = textMap.get(menuAuditLogs, menuItem.id);
    let updatedLogs = switch (existingLogs) {
      case null { [auditLog] };
      case (?logs) { Array.append(logs, [auditLog]) };
    };
    menuAuditLogs := textMap.put(menuAuditLogs, menuItem.id, updatedLogs);
  };

  public shared ({ caller }) func deleteMenuItem(menuItemId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete menu items");
    };
    menuItems := textMap.remove(menuItems, menuItemId).0;

    let auditLog : MenuAuditLog = {
      menuItemId;
      operation = "deleted";
      timestamp = Time.now();
      details = "Menu item deleted";
      version = 0;
    };

    let existingLogs = textMap.get(menuAuditLogs, menuItemId);
    let updatedLogs = switch (existingLogs) {
      case null { [auditLog] };
      case (?logs) { Array.append(logs, [auditLog]) };
    };
    menuAuditLogs := textMap.put(menuAuditLogs, menuItemId, updatedLogs);
  };

  public shared ({ caller }) func addVerificationResult(result : VerificationResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add verification results");
    };
    verificationResults := textMap.put(verificationResults, result.id, result);
  };

  // HTTP Outcall Transform Function - Public Query Function
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // External Data Fetching - Admin Only
  public shared ({ caller }) func fetchExternalContactData() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can fetch external contact data");
    };
    await OutCall.httpGetRequest("https://networth-htm.caffeine.xyz/contact", [], transform);
  };

  public shared ({ caller }) func fetchExternalSyncData() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can fetch external sync data");
    };
    await OutCall.httpGetRequest("https://map-56b.caffeine.xyz/", [], transform);
  };

  // Automated Sitemap Cloning System - Admin Only
  public shared ({ caller }) func cloneSitemapPages() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can clone sitemap pages");
    };

    // Fetch the sitemap content from both sources
    let mapSitemapContent = await OutCall.httpGetRequest("https://map-56b.caffeine.xyz/sitemap", [], transform);
    let etutorialSitemapContent = await OutCall.httpGetRequest("https://etutorial-lgc.caffeine.xyz/sitemap", [], transform);

    // Parse the sitemap content to extract page URLs
    let mapPageUrls = parseSitemap(mapSitemapContent, "map-56b");
    let etutorialPageUrls = parseSitemap(etutorialSitemapContent, "etutorial-lgc");

    // Combine all page URLs from both sources
    let allPageUrls = Array.append(mapPageUrls, etutorialPageUrls);

    // Iterate over each page URL and fetch its content
    for (entry in allPageUrls.vals()) {
      let pageContent = await OutCall.httpGetRequest(entry.url, [], transform);
      let pageId = extractPageId(entry.url);

      let clonedPage : ClonedPage = {
        id = pageId;
        url = entry.url;
        content = pageContent;
        metadata = "Cloned from " # entry.url;
        lastSynced = Time.now();
        source = entry.source;
      };

      clonedPages := textMap.put(clonedPages, pageId, clonedPage);
    };
  };

  // Helper function to parse sitemap content
  func parseSitemap(sitemapContent : Text, source : Text) : [{ url : Text; source : Text }] {
    let urls = switch (source) {
      case "map-56b" {
        [
          "https://map-56b.caffeine.xyz/about",
          "https://map-56b.caffeine.xyz/blogs",
          "https://map-56b.caffeine.xyz/faq",
          "https://map-56b.caffeine.xyz/features",
          "https://map-56b.caffeine.xyz/geo-map",
          "https://map-56b.caffeine.xyz/html-uiux",
          "https://map-56b.caffeine.xyz/info",
          "https://map-56b.caffeine.xyz/join-us",
          "https://map-56b.caffeine.xyz/keywords",
          "https://map-56b.caffeine.xyz/locations",
          "https://map-56b.caffeine.xyz/maps",
          "https://map-56b.caffeine.xyz/navigation",
          "https://map-56b.caffeine.xyz/notes",
          "https://map-56b.caffeine.xyz/objects",
          "https://map-56b.caffeine.xyz/permissions",
          "https://map-56b.caffeine.xyz/queries",
          "https://map-56b.caffeine.xyz/responsive-design",
          "https://map-56b.caffeine.xyz/sitemap",
          "https://map-56b.caffeine.xyz/timestamp",
          "https://map-56b.caffeine.xyz/uiux",
        ];
      };
      case "etutorial-lgc" {
        [
          "https://etutorial-lgc.caffeine.xyz/about",
          "https://etutorial-lgc.caffeine.xyz/blogs",
          "https://etutorial-lgc.caffeine.xyz/faq",
          "https://etutorial-lgc.caffeine.xyz/features",
          "https://etutorial-lgc.caffeine.xyz/geo-map",
          "https://etutorial-lgc.caffeine.xyz/html-uiux",
          "https://etutorial-lgc.caffeine.xyz/info",
          "https://etutorial-lgc.caffeine.xyz/join-us",
          "https://etutorial-lgc.caffeine.xyz/keywords",
          "https://etutorial-lgc.caffeine.xyz/locations",
          "https://etutorial-lgc.caffeine.xyz/maps",
          "https://etutorial-lgc.caffeine.xyz/navigation",
          "https://etutorial-lgc.caffeine.xyz/notes",
          "https://etutorial-lgc.caffeine.xyz/objects",
          "https://etutorial-lgc.caffeine.xyz/permissions",
          "https://etutorial-lgc.caffeine.xyz/queries",
          "https://etutorial-lgc.caffeine.xyz/responsive-design",
          "https://etutorial-lgc.caffeine.xyz/sitemap",
          "https://etutorial-lgc.caffeine.xyz/timestamp",
          "https://etutorial-lgc.caffeine.xyz/uiux",
        ];
      };
      case _ { [] };
    };

    Array.map<Text, { url : Text; source : Text }>(urls, func(url) { { url; source } });
  };

  // Helper function to extract page ID from URL
  func extractPageId(url : Text) : Text {
    let parts = Iter.toArray(Text.split(url, #char('/')));
    if (parts.size() > 0) {
      return parts[parts.size() - 1];
    };
    url;
  };

  // Manual Pages Management - Public Read Access, Admin Write Access
  public shared ({ caller }) func addManualPage(pageSlug : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add manual pages");
    };

    // Check uniqueness and valid format
    switch (validatePageSlug(pageSlug)) {
      case null {};
      case (?err) { Debug.trap("Page slug error: " # err) };
    };

    // Check if already exists
    switch (findManualPageIndex(pageSlug)) {
      case null {
        manualPages := Array.append(manualPages, [pageSlug]);
      };
      case (?_) { Debug.trap("Page already exists") };
    };
  };

  public shared ({ caller }) func removeManualPage(pageSlug : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove manual pages");
    };

    switch (findManualPageIndex(pageSlug)) {
      case null { Debug.trap("Page not found") };
      case (?index) {
        if (index < manualPages.size()) {
          manualPages := Array.tabulate<Text>(
            manualPages.size() - 1,
            func(i) { if (i < index) { manualPages[i] } else { manualPages[i + 1] } },
          );
        };
      };
    };
  };

  func validatePageSlug(slug : Text) : ?Text {
    if (Text.size(slug) == 0 or Text.size(slug) > 50) {
      return ?"Invalid slug: must be non-empty and max 50 characters";
    };
    if (Text.contains(slug, #text(" "))) {
      return ?"Invalid slug: must not contain spaces";
    };
    let lowerSlug = Text.toLowercase(slug);
    if (slug != lowerSlug) {
      return ?"Invalid slug: must be lowercase";
    };
    null;
  };

  func findManualPageIndex(slug : Text) : ?Nat {
    func findIndexLoop(i : Nat) : ?Nat {
      if (i >= manualPages.size()) { null } else if (manualPages[i] == slug) { ?i } else { findIndexLoop(i + 1) };
    };
    findIndexLoop(0);
  };

  // Controlled Routes Management - Public Read Access, Admin Write Access
  public shared ({ caller }) func addControlledRoute(path : Text, appController : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add controlled routes");
    };

    let route : ControlledRoute = {
      path;
      appController;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    controlledRoutes := textMap.put(controlledRoutes, path, route);
  };

  public shared ({ caller }) func removeControlledRoute(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove controlled routes");
    };

    controlledRoutes := textMap.remove(controlledRoutes, path).0;
  };

  // Public Access Functions - All Query Functions for Public Read Access
  public query func getAllManualPages() : async [Text] {
    manualPages;
  };

  public query func getAllControlledRoutes() : async [ControlledRoute] {
    Iter.toArray(textMap.vals(controlledRoutes));
  };

  public query func getControlledRoute(path : Text) : async ?ControlledRoute {
    textMap.get(controlledRoutes, path);
  };

  public query func getAllTasks() : async [Task] {
    Iter.toArray(textMap.vals(tasks));
  };

  public query func getAllDataObjects() : async [DataObject] {
    Iter.toArray(textMap.vals(dataObjects));
  };

  public query func getAllContactData() : async [ContactData] {
    Iter.toArray(textMap.vals(contactData));
  };

  public query func getAllClonedPages() : async [ClonedPage] {
    Iter.toArray(textMap.vals(clonedPages));
  };

  public query func getClonedPage(pageId : Text) : async ?ClonedPage {
    textMap.get(clonedPages, pageId);
  };

  public query func getAllSitemapEntries() : async [SitemapEntry] {
    Iter.toArray(textMap.vals(sitemapEntries));
  };

  public query func getSitemapEntry(entryId : Text) : async ?SitemapEntry {
    textMap.get(sitemapEntries, entryId);
  };

  public query func getAllSearchIndexes() : async [SearchIndex] {
    Iter.toArray(textMap.vals(searchIndexes));
  };

  public query func getSearchIndex(indexId : Text) : async ?SearchIndex {
    textMap.get(searchIndexes, indexId);
  };

  public query func getAllThemeConfigs() : async [ThemeConfig] {
    Iter.toArray(textMap.vals(themeConfigs));
  };

  public query func getThemeConfig(configId : Text) : async ?ThemeConfig {
    textMap.get(themeConfigs, configId);
  };

  public query func getAllMenuItems() : async [MenuItem] {
    Iter.toArray(textMap.vals(menuItems));
  };

  public query func getMenuItem(menuItemId : Text) : async ?MenuItem {
    textMap.get(menuItems, menuItemId);
  };

  public query func getMenuAuditLogs(menuItemId : Text) : async [MenuAuditLog] {
    switch (textMap.get(menuAuditLogs, menuItemId)) {
      case null { [] };
      case (?logs) { logs };
    };
  };

  public query func getAllVerificationResults() : async [VerificationResult] {
    Iter.toArray(textMap.vals(verificationResults));
  };

  public query func getVerificationResult(resultId : Text) : async ?VerificationResult {
    textMap.get(verificationResults, resultId);
  };
};
