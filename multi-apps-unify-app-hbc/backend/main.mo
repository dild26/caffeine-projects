import AccessControl "authorization/access-control";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  var accessControlInitialized = false;
  let accessControlState = AccessControl.initState();

  type SpecFile = {
    content : Text;
    lastModified : Time.Time;
    version : Nat;
  };

  type SyncLog = {
    timestamp : Time.Time;
    status : Text;
    message : Text;
  };

  type SecoinfiApp = {
    name : Text;
    description : Text;
    url : Text;
  };

  type RouteConfig = {
    path : Text;
    requiresAuth : Bool;
    role : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : Text;
  };

  let specFiles = Map.empty<Text, SpecFile>();
  let syncLogs = Map.empty<Nat, SyncLog>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let routeConfigs = Map.empty<Text, RouteConfig>();
  let secoinfiApps = Map.empty<Text, SecoinfiApp>();

  // Initialization function with admin access check
  public shared ({ caller }) func initializeAccessControl() : async () {
    if (accessControlInitialized) {
      Runtime.trap("Already initialized, cannot initialize again.");
    };
    AccessControl.initialize(accessControlState, caller);
    specFiles.add(
      "spec.yaml",
      {
        content = "";
        lastModified = Time.now();
        version = 1;
      },
    );
    specFiles.add(
      "spec.md",
      {
        content = "";
        lastModified = Time.now();
        version = 1;
      },
    );
    initializeDefaultRoutes();
    accessControlInitialized := true;
  };

  // Default route configurations
  func initializeDefaultRoutes() {
    addRoute("/", false, "public");
    addRoute("/home", false, "public");
    addRoute("/blog", false, "public");
    addRoute("/pros", false, "public");
    addRoute("/apps", false, "public");
    addRoute("/sitemap", false, "public");
    addRoute("/admin", true, "admin");
    addRoute("/admin/dashboard", true, "admin");
    addRoute("/settings/admin", true, "admin");
  };

  func addRoute(path : Text, requiresAuth : Bool, role : Text) {
    routeConfigs.add(
      path,
      { path; requiresAuth; role },
    );
  };

  // Public function to get specification files - no auth required
  public query func getSpecFile(filename : Text) : async Text {
    switch (specFiles.get(filename)) {
      case (null) { Runtime.trap("File not found") };
      case (?file) { file.content };
    };
  };

  // Helper function to check admin access for shared functions
  func assertAdminAccess(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // Update spec.yaml with admin check
  public shared ({ caller }) func updateSpecYaml(content : Text) : async () {
    assertAdminAccess(caller);
    let currentTime = Time.now();
    specFiles.add(
      "spec.yaml",
      {
        content;
        lastModified = currentTime;
        version = currentTime.toNat();
      },
    );
    await syncToMarkdown();
    updateSecoinfiApps(content);
  };

  // Update secoinfi-apps list from YAML content
  func updateSecoinfiApps(yamlContent : Text) {
    secoinfiApps.clear();
    // Parse YAML and extract Secoinfi-Apps
    // This is a simplified parser - extracts app entries from YAML structure
    let lines = yamlContent.split(#char '\n');
    var currentApp : ?{
      var name : Text;
      var description : Text;
      var url : Text;
    } = null;

    for (line in lines) {
      let trimmed = line.trim(#text " ");
      
      // Detect app name line (e.g., "- name: App Name")
      if (trimmed.startsWith(#text "- name:")) {
        // Save previous app if exists
        switch (currentApp) {
          case (?app) {
            let newApp : SecoinfiApp = {
              name = app.name;
              description = app.description;
              url = app.url;
            };
            secoinfiApps.add(newApp.name, newApp);
          };
          case null {};
        };
        
        // Start new app
        let nameValue = trimmed.replace(#text "- name:", "").trim(#text " ");
        currentApp := ?{
          var name = nameValue;
          var description = "";
          var url = "";
        };
      } else if (trimmed.startsWith(#text "description:")) {
        switch (currentApp) {
          case (?app) {
            app.description := trimmed.replace(#text "description:", "").trim(#text " ");
          };
          case null {};
        };
      } else if (trimmed.startsWith(#text "url:")) {
        switch (currentApp) {
          case (?app) {
            app.url := trimmed.replace(#text "url:", "").trim(#text " ");
          };
          case null {};
        };
      };
    };

    // Save last app
    switch (currentApp) {
      case (?app) {
        let newApp : SecoinfiApp = {
          name = app.name;
          description = app.description;
          url = app.url;
        };
        secoinfiApps.add(newApp.name, newApp);
      };
      case null {};
    };
  };

  // Update spec.md with admin check
  public shared ({ caller }) func updateSpecMarkdown(content : Text) : async () {
    assertAdminAccess(caller);
    let currentTime = Time.now();
    specFiles.add(
      "spec.md",
      {
        content;
        lastModified = currentTime;
        version = currentTime.toNat();
      },
    );
  };

  // Synchronization function with admin check
  public shared ({ caller }) func manualSync() : async () {
    assertAdminAccess(caller);
    await syncToMarkdown();
  };

  // NEW: Admin-only manual clean duplicates function
  public shared ({ caller }) func cleanDuplicates() : async () {
    assertAdminAccess(caller);
    await syncToMarkdown();
    
    let logEntry = {
      timestamp = Time.now();
      status = "Success";
      message = "Duplicates cleaned and markdown regenerated successfully";
    };
    syncLogs.add(Time.now().toNat(), logEntry);
  };

  func syncToMarkdown() : async () {
    switch (specFiles.get("spec.yaml")) {
      case (null) { Runtime.trap("spec.yaml not found") };
      case (?yamlFile) {
        let markdownContent = convertYamlToMarkdownWithDeduplication(yamlFile.content);
        let currentTime = Time.now();
        specFiles.add(
          "spec.md",
          {
            content = markdownContent;
            lastModified = currentTime;
            version = yamlFile.version;
          },
        );

        let logEntry = {
          timestamp = currentTime;
          status = "Success";
          message = "Sync completed successfully with deduplication";
        };
        syncLogs.add(currentTime.toNat(), logEntry);
      };
    };
  };

  // Enhanced YAML to Markdown conversion with deduplication logic
  func convertYamlToMarkdownWithDeduplication(yamlContent : Text) : Text {
    var markdown = "# Specification Document\n\n";
    markdown #= "This document is automatically generated from spec.yaml with duplicate removal.\n\n";
    markdown #= "---\n\n";

    // Track seen items to prevent duplicates
    let seenApps = Map.empty<Text, Bool>();
    let seenSections = Map.empty<Text, Bool>();
    
    let lines = yamlContent.split(#char '\n');
    var inAppsSection = false;
    var currentSection = "";

    for (line in lines) {
      let trimmed = line.trim(#text " ");
      
      // Detect sections
      if (trimmed.endsWith(#char ':') and not trimmed.startsWith(#text "-")) {
        let sectionName = trimmed.trimEnd(#char ':');
        
        // Only add section if not seen before
        switch (seenSections.get(sectionName)) {
          case null {
            seenSections.add(sectionName, true);
            currentSection := sectionName;
            
            if (sectionName == "Secoinfi-Apps" or sectionName == "secoinfi-apps") {
              inAppsSection := true;
              markdown #= "## Secoinfi-Apps\n\n";
            } else {
              inAppsSection := false;
              markdown #= "## " # sectionName # "\n\n";
            };
          };
          case (?_) {
            // Skip duplicate section
          };
        };
      } else if (inAppsSection and trimmed.startsWith(#text "- name:")) {
        // Extract app name
        let appName = trimmed.replace(#text "- name:", "").trim(#text " ");
        
        // Only process if not seen before
        switch (seenApps.get(appName)) {
          case null {
            seenApps.add(appName, true);
            // App will be added when we have all its fields
          };
          case (?_) {
            // Skip duplicate app
          };
        };
      };
    };

    // Add unique Secoinfi-Apps to markdown
    markdown #= "### Applications List\n\n";
    let uniqueApps = secoinfiApps.values().toArray();
    
    for (app in uniqueApps.vals()) {
      markdown #= "#### " # app.name # "\n\n";
      markdown #= "**Description:** " # app.description # "\n\n";
      markdown #= "**URL:** [" # app.url # "](" # app.url # ")\n\n";
      markdown #= "---\n\n";
    };

    markdown #= "\n## Summary\n\n";
    markdown #= "Total unique applications: " # Nat.toText(uniqueApps.size()) # "\n\n";
    markdown #= "*This document was generated with automatic duplicate removal.*\n";

    markdown;
  };

  // Synchronization status (admin-only) - using shared query for proper authorization
  public shared query ({ caller }) func getSyncStatus() : async {
    lastSyncTime : Time.Time;
    status : Text;
    history : [SyncLog];
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view sync status");
    };
    let logsArray = syncLogs.values().toArray();
    let lastLog = if (logsArray.size() == 0) {
      { timestamp = 0; status = "Not Synced"; message = "" };
    } else {
      logsArray[logsArray.size() - 1];
    };
    {
      lastSyncTime = lastLog.timestamp;
      status = lastLog.status;
      history = logsArray;
    };
  };

  // Route configuration management (admin-only)
  public shared ({ caller }) func setRouteConfig(path : Text, requiresAuth : Bool, role : Text) : async () {
    assertAdminAccess(caller);
    routeConfigs.add(path, { path; requiresAuth; role });
  };

  // Public function - anyone can check route configuration
  public query func getRouteConfig(path : Text) : async ?RouteConfig {
    routeConfigs.get(path);
  };

  // Public function to get all route configurations
  public query func getAllRouteConfigs() : async [RouteConfig] {
    routeConfigs.values().toArray();
  };

  // Admin-only function to delete route configuration
  public shared ({ caller }) func deleteRouteConfig(path : Text) : async () {
    assertAdminAccess(caller);
    routeConfigs.remove(path);
  };

  // Secoinfi-Apps functions - PUBLIC (no authentication required)
  public query func getAllSecoinfiApps() : async [SecoinfiApp] {
    secoinfiApps.values().toArray();
  };

  public query func searchSecoinfiApps(searchTerm : Text) : async [SecoinfiApp] {
    let results = secoinfiApps.values().toArray().filter(
      func(app : SecoinfiApp) : Bool {
        app.name.contains(#text searchTerm) or app.description.contains(#text searchTerm);
      }
    );
    results;
  };

  public query func getSecoinfiAppsCount() : async Nat {
    secoinfiApps.size();
  };

  // Access control functions
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

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // File history (admin-only) - using shared query for proper authorization
  public shared query ({ caller }) func getFileHistory(filename : Text) : async [{
    version : Nat;
    lastModified : Time.Time;
  }] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view file history");
    };
    switch (specFiles.get(filename)) {
      case (null) { [] };
      case (?file) {
        [{
          version = file.version;
          lastModified = file.lastModified;
        }];
      };
    };
  };

  // Backup operations (admin-only)
  public shared ({ caller }) func backupSpecFiles() : async {
    yaml : Text;
    markdown : Text;
    timestamp : Time.Time;
  } {
    assertAdminAccess(caller);
    let yamlContent = switch (specFiles.get("spec.yaml")) {
      case (null) { "" };
      case (?file) { file.content };
    };
    let mdContent = switch (specFiles.get("spec.md")) {
      case (null) { "" };
      case (?file) { file.content };
    };
    {
      yaml = yamlContent;
      markdown = mdContent;
      timestamp = Time.now();
    };
  };

  // Restore operations (admin-only)
  public shared ({ caller }) func restoreSpecFiles(yamlContent : Text, markdownContent : Text) : async () {
    assertAdminAccess(caller);
    let currentTime = Time.now();
    specFiles.add(
      "spec.yaml",
      {
        content = yamlContent;
        lastModified = currentTime;
        version = currentTime.toNat();
      },
    );
    specFiles.add(
      "spec.md",
      {
        content = markdownContent;
        lastModified = currentTime;
        version = currentTime.toNat();
      },
    );
    updateSecoinfiApps(yamlContent);
  };
};
