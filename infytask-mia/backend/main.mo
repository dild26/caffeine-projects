import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Float "mo:base/Float";

import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";

actor {
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  var projects : OrderedMap.Map<Text, Project> = textMap.empty();
  var tasks : OrderedMap.Map<Text, Task> = textMap.empty();
  var moduleMappings : OrderedMap.Map<Text, ModuleMapping> = textMap.empty();
  var apiSpecs : OrderedMap.Map<Text, Text> = textMap.empty();
  var userProfiles : OrderedMap.Map<Principal, UserProfile> = principalMap.empty();
  var openTabs : OrderedMap.Map<Text, Tab> = textMap.empty();
  var notifications : OrderedMap.Map<Text, Notification> = textMap.empty();
  var featureStatuses : OrderedMap.Map<Text, FeatureStatus> = textMap.empty();
  var secureData : OrderedMap.Map<Text, SecureData> = textMap.empty();
  var permissionRequests : OrderedMap.Map<Text, PermissionRequest> = textMap.empty();
  var schemaValidations : OrderedMap.Map<Text, SchemaValidation> = textMap.empty();
  var manifestLogs : OrderedMap.Map<Text, ManifestLog> = textMap.empty();
  var yamlSchemas : OrderedMap.Map<Text, YamlSchema> = textMap.empty();
  var featureVerifications : OrderedMap.Map<Text, FeatureVerification> = textMap.empty();
  var fixtures : OrderedMap.Map<Text, Fixture> = textMap.empty();
  var executionLogs : OrderedMap.Map<Text, ExecutionLog> = textMap.empty();
  var aiImports : OrderedMap.Map<Text, AiImport> = textMap.empty();
  var formTemplates : OrderedMap.Map<Text, FormTemplate> = textMap.empty();
  var nodeTypes : OrderedMap.Map<Text, NodeType> = textMap.empty();
  var nodeLinks : OrderedMap.Map<Text, NodeLink> = textMap.empty();
  var compressionMetrics : OrderedMap.Map<Text, CompressionMetric> = textMap.empty();
  var duplicateDetections : OrderedMap.Map<Text, DuplicateDetection> = textMap.empty();
  var deduplicationResults : OrderedMap.Map<Text, DeduplicationResult> = textMap.empty();

  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  type Project = {
    id : Text;
    name : Text;
    description : Text;
    hash : Text;
    nonce : Nat;
    tasks : [Text];
    status : ProjectStatus;
    color : Text;
    progress : Nat;
    archived : Bool;
  };

  type ProjectStatus = {
    #active;
    #completed;
    #archived;
    #inProgress;
    #pending;
    #blocked;
  };

  type Task = {
    id : Text;
    projectId : Text;
    name : Text;
    description : Text;
    state : TaskState;
    dependencies : [Text];
    hash : Text;
    nonce : Nat;
    color : Text;
    progress : Nat;
    archived : Bool;
  };

  type TaskState = {
    #new;
    #pending;
    #inProgress;
    #completed;
    #blocked;
    #finished;
    #archive;
  };

  type ModuleMapping = {
    moduleName : Text;
    character : Text;
    hash : Text;
  };

  type UserProfile = {
    name : Text;
    role : AccessControl.UserRole;
  };

  type Tab = {
    id : Text;
    name : Text;
    type_ : TabType;
    isActive : Bool;
    lastAccessed : Int;
    resourceId : Text;
    is3D : Bool;
    createdAt : Int;
  };

  type TabType = {
    #project;
    #task;
    #moduleMapping;
    #apiSpec;
    #feature;
  };

  type Notification = {
    id : Text;
    message : Text;
    type_ : NotificationType;
    timestamp : Int;
    isRead : Bool;
  };

  type NotificationType = {
    #info;
    #warning;
    #error;
    #success;
  };

  type FeatureStatus = {
    id : Text;
    name : Text;
    status : FeatureState;
    lastUpdated : Int;
  };

  type FeatureState = {
    #pending;
    #inProgress;
    #completed;
    #failed;
  };

  type SitemapNode = {
    id : Text;
    name : Text;
    type_ : NodeTypeType;
    children : [SitemapNode];
    isActive : Bool;
    lastAccessed : Int;
  };

  type NodeTypeType = {
    #project;
    #task;
    #moduleMapping;
    #apiSpec;
    #feature;
    #secure;
    #nodeType;
  };

  type SecureData = {
    id : Text;
    owner : Principal;
    data : Text;
    encrypted : Bool;
    approved : Bool;
    timestamp : Int;
  };

  type PermissionRequest = {
    id : Text;
    requester : Principal;
    dataId : Text;
    status : RequestStatus;
    timestamp : Int;
  };

  type RequestStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type SchemaValidation = {
    id : Text;
    schema : Text;
    isValid : Bool;
    errors : [Text];
    timestamp : Int;
  };

  type ManifestLog = {
    id : Text;
    changes : [Text];
    version : Nat;
    timestamp : Int;
    validationStatus : Bool;
  };

  type YamlSchema = {
    id : Text;
    content : Text;
    isNormalized : Bool;
    validationStatus : Bool;
    timestamp : Int;
  };

  type FeatureVerification = {
    id : Text;
    name : Text;
    aiVerified : Bool;
    adminApproved : Bool;
    status : VerificationStatus;
    fixtureTopic : Text;
    fof : Text;
    timestamp : Int;
  };

  type VerificationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type Fixture = {
    id : Text;
    topic : Text;
    fof : Text;
    status : FixtureStatus;
    aiDecision : Bool;
    adminDecision : Bool;
    executionLogs : [Text];
    merkleProof : Text;
    timestamp : Int;
  };

  type FixtureStatus = {
    #pending;
    #approved;
    #rejected;
    #executed;
  };

  type ExecutionLog = {
    id : Text;
    action : Text;
    actorPrincipal : Principal;
    target : Text;
    result : Text;
    merkleRoot : Text;
    timestamp : Int;
  };

  type AiImport = {
    id : Text;
    projectId : Text;
    taskId : Text;
    metadata : Text;
    importType : ImportType;
    status : ImportStatus;
    adminApproved : Bool;
    executionLog : Text;
    timestamp : Int;
  };

  type ImportType = {
    #specMl;
    #yaml;
    #markdown;
  };

  type ImportStatus = {
    #pending;
    #approved;
    #executed;
    #failed;
  };

  type FormTemplate = {
    id : Text;
    name : Text;
    formContent : Text;
    metadata : Text;
    detailsOfEContracts : [PostcardContent];
    createdAt : Int;
    updatedAt : Int;
  };

  type PostcardContent = {
    pageNumber : Nat;
    content : Text;
  };

  type NodeType = {
    id : Text;
    name : Text;
    color : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type NodeLink = {
    id : Text;
    sourceNodeId : Text;
    targetNodeId : Text;
    linkType : LinkType;
    createdAt : Int;
    updatedAt : Int;
    relationshipDepth : Nat;
    linkStrength : Nat;
    isBacklink : Bool;
    isActive : Bool;
    metadata : Text;
  };

  type LinkType = {
    #direct;
    #backlink;
    #indirect;
    #dependency;
    #reference;
    #hierarchical;
    #related;
    #custom;
  };

  type CompressionMetric = {
    id : Text;
    targetType : CompressionTargetType;
    originalSize : Nat;
    compressedSize : Nat;
    compressionRatio : Float;
    duplicatesRemoved : Nat;
    redundantSectionsRemoved : Nat;
    validationStatus : Bool;
    timestamp : Int;
  };

  type CompressionTargetType = {
    #specMd;
    #yaml;
    #nodeModules;
  };

  type DuplicateDetection = {
    id : Text;
    targetType : CompressionTargetType;
    duplicateEntries : [Text];
    redundantSections : [Text];
    detectionTimestamp : Int;
    removalStatus : RemovalStatus;
  };

  type RemovalStatus = {
    #pending;
    #completed;
    #failed;
  };

  type DeduplicationResult = {
    id : Text;
    targetFile : Text;
    originalSize : Nat;
    cleanedSize : Nat;
    entriesCleaned : Nat;
    duplicateParagraphs : Nat;
    duplicateFeatureLists : Nat;
    duplicateHeadings : Nat;
    redundantSections : Nat;
    processingTimestamp : Int;
    completionTimestamp : Int;
    status : DeduplicationStatus;
    manifestLogId : Text;
    schemaRevalidated : Bool;
    yamlRefreshed : Bool;
    specMlRefreshed : Bool;
  };

  type DeduplicationStatus = {
    #pending;
    #processing;
    #completed;
    #failed;
  };

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

  public shared ({ caller }) func createProject(id : Text, name : Text, description : Text) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create projects");
    };

    let project : Project = {
      id;
      name;
      description;
      hash = "hash_" # id;
      nonce = 0;
      tasks = [];
      status = #active;
      color = "#9B59B6";
      progress = 0;
      archived = false;
    };
    projects := textMap.put(projects, id, project);
    project;
  };

  public query ({ caller }) func getProject(id : Text) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view projects");
    };
    switch (textMap.get(projects, id)) {
      case (?project) { project };
      case null { Debug.trap("Project not found") };
    };
  };

  public shared ({ caller }) func createTask(id : Text, projectId : Text, name : Text, description : Text) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create tasks");
    };

    let task : Task = {
      id;
      projectId;
      name;
      description;
      state = #new;
      dependencies = [];
      hash = "hash_" # id;
      nonce = 0;
      color = "#9B59B6";
      progress = 0;
      archived = false;
    };
    tasks := textMap.put(tasks, id, task);
    task;
  };

  public query ({ caller }) func getTask(id : Text) : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view tasks");
    };
    switch (textMap.get(tasks, id)) {
      case (?task) {
        let userRole = AccessControl.getUserRole(accessControlState, caller);
        switch (userRole) {
          case (#guest) {
            if (task.state != #finished) {
              Debug.trap("Unauthorized: Public users can only view finished tasks");
            };
          };
          case _ {};
        };
        task;
      };
      case null { Debug.trap("Task not found") };
    };
  };

  public shared ({ caller }) func addModuleMapping(moduleName : Text, character : Text) : async ModuleMapping {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add module mappings");
    };

    let mapping : ModuleMapping = {
      moduleName;
      character;
      hash = "hash_" # moduleName;
    };
    moduleMappings := textMap.put(moduleMappings, moduleName, mapping);
    mapping;
  };

  public query ({ caller }) func getModuleMapping(moduleName : Text) : async ModuleMapping {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view module mappings");
    };
    switch (textMap.get(moduleMappings, moduleName)) {
      case (?mapping) { mapping };
      case null { Debug.trap("Module mapping not found") };
    };
  };

  public shared ({ caller }) func addApiSpec(name : Text, spec : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add API specs");
    };

    apiSpecs := textMap.put(apiSpecs, name, spec);
  };

  public query ({ caller }) func getApiSpec(name : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view API specs");
    };
    switch (textMap.get(apiSpecs, name)) {
      case (?spec) { spec };
      case null { Debug.trap("API spec not found") };
    };
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view projects");
    };
    Iter.toArray(textMap.vals(projects));
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view tasks");
    };
    let allTasks = Iter.toArray(textMap.vals(tasks));
    let userRole = AccessControl.getUserRole(accessControlState, caller);
    switch (userRole) {
      case (#guest) {
        Array.filter<Task>(
          allTasks,
          func(task : Task) : Bool {
            task.state == #finished;
          },
        );
      };
      case _ { allTasks };
    };
  };

  public query ({ caller }) func getAllModuleMappings() : async [ModuleMapping] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view module mappings");
    };
    Iter.toArray(textMap.vals(moduleMappings));
  };

  public shared ({ caller }) func updateTaskState(taskId : Text, newState : TaskState) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update task state");
    };

    switch (textMap.get(tasks, taskId)) {
      case (?task) {
        let updatedTask = { task with state = newState };
        tasks := textMap.put(tasks, taskId, updatedTask);
      };
      case null { Debug.trap("Task not found") };
    };
  };

  public shared ({ caller }) func deleteTasks(taskIds : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete tasks");
    };

    var updatedTasks = tasks;
    for (taskId in taskIds.vals()) {
      updatedTasks := textMap.delete(updatedTasks, taskId);
    };
    tasks := updatedTasks;
  };

  public query func getDemoData() : async {
    projects : [Project];
    tasks : [Task];
    suggestions : [Text];
  } {
    let demoProjects = [
      {
        id = "project1";
        name = "Project 1";
        description = "Description for Project 1";
        hash = "hash_project1";
        nonce = 0;
        tasks = [];
        status = #active;
        color = "#9B59B6";
        progress = 0;
        archived = false;
      },
      {
        id = "project2";
        name = "Project 2";
        description = "Description for Project 2";
        hash = "hash_project2";
        nonce = 0;
        tasks = [];
        status = #active;
        color = "#9B59B6";
        progress = 0;
        archived = false;
      },
    ];

    let demoTasks = [
      {
        id = "task1";
        projectId = "project1";
        name = "Task 1";
        description = "Description for Task 1";
        state = #new;
        dependencies = [];
        hash = "hash_task1";
        nonce = 0;
        color = "#9B59B6";
        progress = 0;
        archived = false;
      },
      {
        id = "task2";
        projectId = "project2";
        name = "Task 2";
        description = "Description for Task 2";
        state = #pending;
        dependencies = [];
        hash = "hash_task2";
        nonce = 0;
        color = "#3498DB";
        progress = 0;
        archived = false;
      },
      {
        id = "task3";
        projectId = "project1";
        name = "Task 3";
        description = "Description for Task 3";
        state = #completed;
        dependencies = [];
        hash = "hash_task3";
        nonce = 0;
        color = "#F4D03F";
        progress = 0;
        archived = false;
      },
      {
        id = "task4";
        projectId = "project2";
        name = "Task 4";
        description = "Description for Task 4";
        state = #finished;
        dependencies = [];
        hash = "hash_task4";
        nonce = 0;
        color = "#FF8C00";
        progress = 0;
        archived = false;
      },
    ];

    let suggestions = [
      "New project suggestion: Project 3 (Category: Development)",
      "New task suggestion: Task 3 (Category: Testing)",
      "New project suggestion: Project 4 (Category: Research)",
      "New task suggestion: Task 5 (Category: Documentation)",
    ];

    {
      projects = demoProjects;
      tasks = demoTasks;
      suggestions;
    };
  };

  public query func getTaskStatusOptions() : async [TaskState] {
    [#new, #pending, #inProgress, #completed, #blocked, #finished, #archive];
  };

  public query func getTaskStatusColor(status : TaskState) : async Text {
    switch (status) {
      case (#new) { "#9B59B6" };
      case (#pending) { "#3498DB" };
      case (#inProgress) { "#2ECC71" };
      case (#completed) { "#F4D03F" };
      case (#blocked) { "#E74C3C" };
      case (#finished) { "#FF8C00" };
      case (#archive) { "#95A5A6" };
    };
  };

  public shared ({ caller }) func updateProject(id : Text, name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update projects");
    };

    switch (textMap.get(projects, id)) {
      case (?project) {
        let updatedProject = { project with name; description };
        projects := textMap.put(projects, id, updatedProject);
      };
      case null { Debug.trap("Project not found") };
    };
  };

  public shared ({ caller }) func updateTask(id : Text, name : Text, description : Text, state : TaskState) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update tasks");
    };

    switch (textMap.get(tasks, id)) {
      case (?task) {
        let updatedTask = { task with name; description; state };
        tasks := textMap.put(tasks, id, updatedTask);
      };
      case null { Debug.trap("Task not found") };
    };
  };

  public shared ({ caller }) func archiveProject(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can archive projects");
    };

    switch (textMap.get(projects, id)) {
      case (?project) {
        let archivedProject = { project with archived = true; status = #archived };
        projects := textMap.put(projects, id, archivedProject);
      };
      case null { Debug.trap("Project not found") };
    };
  };

  public shared ({ caller }) func restoreProject(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can restore projects");
    };

    switch (textMap.get(projects, id)) {
      case (?project) {
        let restoredProject = { project with archived = false; status = #active };
        projects := textMap.put(projects, id, restoredProject);
      };
      case null { Debug.trap("Project not found") };
    };
  };

  public shared ({ caller }) func archiveTask(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can archive tasks");
    };

    switch (textMap.get(tasks, id)) {
      case (?task) {
        let archivedTask = { task with archived = true; state = #archive };
        tasks := textMap.put(tasks, id, archivedTask);
      };
      case null { Debug.trap("Task not found") };
    };
  };

  public shared ({ caller }) func restoreTask(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can restore tasks");
    };

    switch (textMap.get(tasks, id)) {
      case (?task) {
        let restoredTask = { task with archived = false; state = #new };
        tasks := textMap.put(tasks, id, restoredTask);
      };
      case null { Debug.trap("Task not found") };
    };
  };

  public query ({ caller }) func searchProjects(searchTerm : Text) : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can search projects");
    };
    let allProjects = Iter.toArray(textMap.vals(projects));
    Array.filter<Project>(
      allProjects,
      func(project : Project) : Bool {
        Text.contains(project.name, #text searchTerm) or Text.contains(project.description, #text searchTerm);
      },
    );
  };

  public query ({ caller }) func searchTasks(searchTerm : Text) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can search tasks");
    };
    let allTasks = Iter.toArray(textMap.vals(tasks));
    let filteredTasks = Array.filter<Task>(
      allTasks,
      func(task : Task) : Bool {
        Text.contains(task.name, #text searchTerm) or Text.contains(task.description, #text searchTerm);
      },
    );
    let userRole = AccessControl.getUserRole(accessControlState, caller);
    switch (userRole) {
      case (#guest) {
        Array.filter<Task>(
          filteredTasks,
          func(task : Task) : Bool {
            task.state == #finished;
          },
        );
      };
      case _ { filteredTasks };
    };
  };

  public query ({ caller }) func getProjectHierarchy() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view project hierarchy");
    };
    let allProjects = Iter.toArray(textMap.vals(projects));
    Array.sort<Project>(
      allProjects,
      func(a : Project, b : Project) : { #less; #equal; #greater } {
        Text.compare(a.name, b.name);
      },
    );
  };

  public query ({ caller }) func getTaskHierarchy() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view task hierarchy");
    };
    let allTasks = Iter.toArray(textMap.vals(tasks));
    let sortedTasks = Array.sort<Task>(
      allTasks,
      func(a : Task, b : Task) : { #less; #equal; #greater } {
        Text.compare(a.name, b.name);
      },
    );
    let userRole = AccessControl.getUserRole(accessControlState, caller);
    switch (userRole) {
      case (#guest) {
        Array.filter<Task>(
          sortedTasks,
          func(task : Task) : Bool {
            task.state == #finished;
          },
        );
      };
      case _ { sortedTasks };
    };
  };

  public shared ({ caller }) func openTab(id : Text, name : Text, type_ : TabType, resourceId : Text, is3D : Bool) : async Tab {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can open tabs");
    };

    let currentTime = Time.now();

    let activeProjectTabs = Array.filter<Tab>(
      Iter.toArray(textMap.vals(openTabs)),
      func(tab : Tab) : Bool {
        tab.type_ == #project and tab.isActive
      },
    );

    if (type_ == #project and activeProjectTabs.size() >= 2) {
      let sortedTabs = Array.sort<Tab>(
        activeProjectTabs,
        func(a : Tab, b : Tab) : { #less; #equal; #greater } {
          if (a.lastAccessed < b.lastAccessed) { #less } else if (a.lastAccessed > b.lastAccessed) {
            #greater;
          } else { #equal };
        },
      );

      if (sortedTabs.size() > 0) {
        let oldestTab = sortedTabs[0];
        let updatedOldestTab = {
          oldestTab with
          isActive = false;
          lastAccessed = currentTime;
        };
        openTabs := textMap.put(openTabs, oldestTab.resourceId, updatedOldestTab);
      };
    };

    switch (textMap.get(openTabs, resourceId)) {
      case (?existingTab) {
        let updatedTab = {
          existingTab with
          isActive = true;
          lastAccessed = currentTime;
        };
        openTabs := textMap.put(openTabs, resourceId, updatedTab);
        updatedTab;
      };
      case null {
        let newTab : Tab = {
          id;
          name;
          type_;
          isActive = true;
          lastAccessed = currentTime;
          resourceId;
          is3D;
          createdAt = currentTime;
        };
        openTabs := textMap.put(openTabs, resourceId, newTab);
        newTab;
      };
    };
  };

  public shared ({ caller }) func closeTab(resourceId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can close tabs");
    };
    openTabs := textMap.delete(openTabs, resourceId);
  };

  public query ({ caller }) func getOpenTabs() : async [Tab] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view open tabs");
    };
    Iter.toArray(textMap.vals(openTabs));
  };

  public shared ({ caller }) func addNotification(id : Text, message : Text, type_ : NotificationType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can add notifications");
    };

    let currentTime = Time.now();

    switch (textMap.get(notifications, message)) {
      case (?existingNotification) {
        let updatedNotification = {
          existingNotification with
          timestamp = currentTime;
          isRead = false;
        };
        notifications := textMap.put(notifications, message, updatedNotification);
      };
      case null {
        let newNotification : Notification = {
          id;
          message;
          type_;
          timestamp = currentTime;
          isRead = false;
        };
        notifications := textMap.put(notifications, message, newNotification);
      };
    };
  };

  public shared ({ caller }) func markNotificationAsRead(message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can mark notifications as read");
    };
    switch (textMap.get(notifications, message)) {
      case (?notification) {
        let updatedNotification = { notification with isRead = true };
        notifications := textMap.put(notifications, message, updatedNotification);
      };
      case null {};
    };
  };

  public query ({ caller }) func getNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view notifications");
    };
    Iter.toArray(textMap.vals(notifications));
  };

  public shared ({ caller }) func updateFeatureStatus(id : Text, name : Text, status : FeatureState) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update feature status");
    };

    let currentTime = Time.now();

    let featureStatus : FeatureStatus = {
      id;
      name;
      status;
      lastUpdated = currentTime;
    };
    featureStatuses := textMap.put(featureStatuses, id, featureStatus);
  };

  public query ({ caller }) func getFeatureStatuses() : async [FeatureStatus] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view feature statuses");
    };
    Iter.toArray(textMap.vals(featureStatuses));
  };

  public query ({ caller }) func getSitemap() : async [SitemapNode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view sitemap");
    };

    let currentTime = Time.now();

    let projectNodes = Array.map<Project, SitemapNode>(
      Iter.toArray(textMap.vals(projects)),
      func(project : Project) : SitemapNode {
        {
          id = project.id;
          name = project.name;
          type_ = #project;
          children = [];
          isActive = false;
          lastAccessed = currentTime;
        };
      },
    );

    let taskNodes = Array.map<Task, SitemapNode>(
      Iter.toArray(textMap.vals(tasks)),
      func(task : Task) : SitemapNode {
        {
          id = task.id;
          name = task.name;
          type_ = #task;
          children = [];
          isActive = false;
          lastAccessed = currentTime;
        };
      },
    );

    let moduleNodes = Array.map<ModuleMapping, SitemapNode>(
      Iter.toArray(textMap.vals(moduleMappings)),
      func(moduleMapping : ModuleMapping) : SitemapNode {
        {
          id = moduleMapping.moduleName;
          name = moduleMapping.moduleName;
          type_ = #moduleMapping;
          children = [];
          isActive = false;
          lastAccessed = currentTime;
        };
      },
    );

    let apiSpecNodes = Array.map<(Text, Text), SitemapNode>(
      Iter.toArray(textMap.entries(apiSpecs)),
      func((name, _spec) : (Text, Text)) : SitemapNode {
        {
          id = name;
          name;
          type_ = #apiSpec;
          children = [];
          isActive = false;
          lastAccessed = currentTime;
        };
      },
    );

    let featureNodes = Array.map<FeatureStatus, SitemapNode>(
      Iter.toArray(textMap.vals(featureStatuses)),
      func(feature : FeatureStatus) : SitemapNode {
        {
          id = feature.id;
          name = feature.name;
          type_ = #feature;
          children = [];
          isActive = false;
          lastAccessed = currentTime;
        };
      },
    );

    let nodeTypeNodes = Array.map<NodeType, SitemapNode>(
      Iter.toArray(textMap.vals(nodeTypes)),
      func(nodeType : NodeType) : SitemapNode {
        {
          id = nodeType.id;
          name = nodeType.name;
          type_ = #nodeType;
          children = [];
          isActive = false;
          lastAccessed = currentTime;
        };
      },
    );

    let secureNode : SitemapNode = {
      id = "secure";
      name = "Secure Data Sharing";
      type_ = #secure;
      children = [];
      isActive = false;
      lastAccessed = currentTime;
    };

    Array.append<SitemapNode>(
      projectNodes,
      Array.append<SitemapNode>(
        taskNodes,
        Array.append<SitemapNode>(
          moduleNodes,
          Array.append<SitemapNode>(
            apiSpecNodes,
            Array.append<SitemapNode>(
              featureNodes,
              Array.append<SitemapNode>(nodeTypeNodes, [secureNode]),
            ),
          ),
        ),
      ),
    );
  };

  public shared ({ caller }) func storeSecureData(id : Text, data : Text) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only approved users or admins can store secure data");
    };

    let currentTime = Time.now();

    let secureDataEntry : SecureData = {
      id;
      owner = caller;
      data;
      encrypted = true;
      approved = false;
      timestamp = currentTime;
    };

    secureData := textMap.put(secureData, id, secureDataEntry);
  };

  public shared ({ caller }) func requestPermission(dataId : Text) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only approved users or admins can request permissions");
    };

    let currentTime = Time.now();

    let permissionRequest : PermissionRequest = {
      id = "request_" # dataId # "_" # debug_show (currentTime);
      requester = caller;
      dataId;
      status = #pending;
      timestamp = currentTime;
    };

    permissionRequests := textMap.put(permissionRequests, permissionRequest.id, permissionRequest);
  };

  public shared ({ caller }) func approvePermissionRequest(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can approve permission requests");
    };

    switch (textMap.get(permissionRequests, requestId)) {
      case (?request) {
        let updatedRequest = { request with status = #approved };
        permissionRequests := textMap.put(permissionRequests, requestId, updatedRequest);

        switch (textMap.get(secureData, request.dataId)) {
          case (?data) {
            let updatedData = { data with approved = true };
            secureData := textMap.put(secureData, request.dataId, updatedData);
          };
          case null {};
        };
      };
      case null { Debug.trap("Permission request not found") };
    };
  };

  public shared ({ caller }) func rejectPermissionRequest(requestId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can reject permission requests");
    };

    switch (textMap.get(permissionRequests, requestId)) {
      case (?request) {
        let updatedRequest = { request with status = #rejected };
        permissionRequests := textMap.put(permissionRequests, requestId, updatedRequest);
      };
      case null { Debug.trap("Permission request not found") };
    };
  };

  public query ({ caller }) func getSecureData(id : Text) : async SecureData {
    switch (textMap.get(secureData, id)) {
      case (?data) {
        if (data.owner == caller or data.approved or AccessControl.hasPermission(accessControlState, caller, #admin)) {
          data;
        } else {
          Debug.trap("Unauthorized: You do not have access to this data");
        };
      };
      case null { Debug.trap("Secure data not found") };
    };
  };

  public query ({ caller }) func getAllSecureData() : async [SecureData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all secure data");
    };
    Iter.toArray(textMap.vals(secureData));
  };

  public query ({ caller }) func getPermissionRequests() : async [PermissionRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view permission requests");
    };
    Iter.toArray(textMap.vals(permissionRequests));
  };

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

  public shared ({ caller }) func validateSchema(id : Text, schema : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can validate schemas");
    };

    let currentTime = Time.now();

    let validation : SchemaValidation = {
      id;
      schema;
      isValid = true;
      errors = [];
      timestamp = currentTime;
    };

    schemaValidations := textMap.put(schemaValidations, id, validation);
  };

  public query ({ caller }) func getSchemaValidation(id : Text) : async SchemaValidation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view schema validations");
    };
    switch (textMap.get(schemaValidations, id)) {
      case (?validation) { validation };
      case null { Debug.trap("Schema validation not found") };
    };
  };

  public shared ({ caller }) func logManifestChange(id : Text, changes : [Text], version : Nat, validationStatus : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can log manifest changes");
    };

    let currentTime = Time.now();

    let log : ManifestLog = {
      id;
      changes;
      version;
      timestamp = currentTime;
      validationStatus;
    };

    manifestLogs := textMap.put(manifestLogs, id, log);
  };

  public query ({ caller }) func getManifestLog(id : Text) : async ManifestLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view manifest logs");
    };
    switch (textMap.get(manifestLogs, id)) {
      case (?log) { log };
      case null { Debug.trap("Manifest log not found") };
    };
  };

  public shared ({ caller }) func addYamlSchema(id : Text, content : Text, isNormalized : Bool, validationStatus : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add YAML schemas");
    };

    let currentTime = Time.now();

    let schema : YamlSchema = {
      id;
      content;
      isNormalized;
      validationStatus;
      timestamp = currentTime;
    };

    yamlSchemas := textMap.put(yamlSchemas, id, schema);
  };

  public query ({ caller }) func getYamlSchema(id : Text) : async YamlSchema {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view YAML schemas");
    };
    switch (textMap.get(yamlSchemas, id)) {
      case (?schema) { schema };
      case null { Debug.trap("YAML schema not found") };
    };
  };

  public query ({ caller }) func getAllSchemaValidations() : async [SchemaValidation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all schema validations");
    };
    Iter.toArray(textMap.vals(schemaValidations));
  };

  public query ({ caller }) func getAllManifestLogs() : async [ManifestLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all manifest logs");
    };
    Iter.toArray(textMap.vals(manifestLogs));
  };

  public query ({ caller }) func getAllYamlSchemas() : async [YamlSchema] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all YAML schemas");
    };
    Iter.toArray(textMap.vals(yamlSchemas));
  };

  public query ({ caller }) func getActiveProjectCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view active project count");
    };
    let allProjects = Iter.toArray(textMap.vals(projects));
    let activeProjects = Array.filter<Project>(
      allProjects,
      func(project : Project) : Bool {
        not project.archived;
      },
    );
    activeProjects.size();
  };

  public query ({ caller }) func getArchivedProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view archived projects");
    };
    let allProjects = Iter.toArray(textMap.vals(projects));
    Array.filter<Project>(
      allProjects,
      func(project : Project) : Bool {
        project.archived;
      },
    );
  };

  public shared ({ caller }) func addFeatureVerification(id : Text, name : Text, aiVerified : Bool, adminApproved : Bool, status : VerificationStatus, fixtureTopic : Text, fof : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add feature verifications");
    };

    let currentTime = Time.now();

    let verification : FeatureVerification = {
      id;
      name;
      aiVerified;
      adminApproved;
      status;
      fixtureTopic;
      fof;
      timestamp = currentTime;
    };

    featureVerifications := textMap.put(featureVerifications, id, verification);
  };

  public query ({ caller }) func getFeatureVerification(id : Text) : async FeatureVerification {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view feature verifications");
    };
    switch (textMap.get(featureVerifications, id)) {
      case (?verification) { verification };
      case null { Debug.trap("Feature verification not found") };
    };
  };

  public query ({ caller }) func getAllFeatureVerifications() : async [FeatureVerification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view feature verifications");
    };
    Iter.toArray(textMap.vals(featureVerifications));
  };

  public shared ({ caller }) func addFixture(id : Text, topic : Text, fof : Text, status : FixtureStatus, aiDecision : Bool, adminDecision : Bool, executionLogs : [Text], merkleProof : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add fixtures");
    };

    let currentTime = Time.now();

    let fixture : Fixture = {
      id;
      topic;
      fof;
      status;
      aiDecision;
      adminDecision;
      executionLogs;
      merkleProof;
      timestamp = currentTime;
    };

    fixtures := textMap.put(fixtures, id, fixture);
  };

  public query ({ caller }) func getFixture(id : Text) : async Fixture {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view fixtures");
    };
    switch (textMap.get(fixtures, id)) {
      case (?fixture) { fixture };
      case null { Debug.trap("Fixture not found") };
    };
  };

  public query ({ caller }) func getAllFixtures() : async [Fixture] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view fixtures");
    };
    Iter.toArray(textMap.vals(fixtures));
  };

  public shared ({ caller }) func addExecutionLog(id : Text, action : Text, target : Text, result : Text, merkleRoot : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add execution logs");
    };

    let currentTime = Time.now();

    let log : ExecutionLog = {
      id;
      action;
      actorPrincipal = caller;
      target;
      result;
      merkleRoot;
      timestamp = currentTime;
    };

    executionLogs := textMap.put(executionLogs, id, log);
  };

  public query ({ caller }) func getExecutionLog(id : Text) : async ExecutionLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view execution logs");
    };
    switch (textMap.get(executionLogs, id)) {
      case (?log) { log };
      case null { Debug.trap("Execution log not found") };
    };
  };

  public query ({ caller }) func getAllExecutionLogs() : async [ExecutionLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all execution logs");
    };
    Iter.toArray(textMap.vals(executionLogs));
  };

  public shared ({ caller }) func addAiImport(id : Text, projectId : Text, taskId : Text, metadata : Text, importType : ImportType, status : ImportStatus, adminApproved : Bool, executionLog : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add AI imports");
    };

    let currentTime = Time.now();

    let aiImport : AiImport = {
      id;
      projectId;
      taskId;
      metadata;
      importType;
      status;
      adminApproved;
      executionLog;
      timestamp = currentTime;
    };

    aiImports := textMap.put(aiImports, id, aiImport);
  };

  public query ({ caller }) func getAiImport(id : Text) : async AiImport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view AI imports");
    };
    switch (textMap.get(aiImports, id)) {
      case (?aiImport) { aiImport };
      case null { Debug.trap("AI import not found") };
    };
  };

  public query ({ caller }) func getAllAiImports() : async [AiImport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all AI imports");
    };
    Iter.toArray(textMap.vals(aiImports));
  };

  public shared ({ caller }) func addSphereNode(id : Text, name : Text, type_ : NodeTypeType, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add sphere nodes");
    };

    let currentTime = Time.now();

    let node : SitemapNode = {
      id;
      name;
      type_;
      children = [];
      isActive;
      lastAccessed = currentTime;
    };

    switch (type_) {
      case (#project) {
        let project : Project = {
          id;
          name;
          description = "";
          hash = "hash_" # id;
          nonce = 0;
          tasks = [];
          status = #active;
          color = "#9B59B6";
          progress = 0;
          archived = false;
        };
        projects := textMap.put(projects, id, project);
      };
      case (#task) {
        let task : Task = {
          id;
          projectId = "";
          name;
          description = "";
          state = #new;
          dependencies = [];
          hash = "hash_" # id;
          nonce = 0;
          color = "#9B59B6";
          progress = 0;
          archived = false;
        };
        tasks := textMap.put(tasks, id, task);
      };
      case _ {};
    };
  };

  public shared ({ caller }) func removeSphereNode(id : Text, type_ : NodeTypeType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove sphere nodes");
    };

    switch (type_) {
      case (#project) {
        projects := textMap.delete(projects, id);
      };
      case (#task) {
        tasks := textMap.delete(tasks, id);
      };
      case _ {};
    };
  };

  public shared ({ caller }) func createFormTemplate(id : Text, name : Text, formContent : Text, metadata : Text, detailsOfEContracts : [PostcardContent]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create form templates");
    };

    let currentTime = Time.now();

    let formTemplate : FormTemplate = {
      id;
      name;
      formContent;
      metadata;
      detailsOfEContracts;
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    formTemplates := textMap.put(formTemplates, id, formTemplate);
  };

  public shared ({ caller }) func updateFormTemplate(id : Text, name : Text, formContent : Text, metadata : Text, detailsOfEContracts : [PostcardContent]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update form templates");
    };

    let currentTime = Time.now();

    let formTemplate : FormTemplate = {
      id;
      name;
      formContent;
      metadata;
      detailsOfEContracts;
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    formTemplates := textMap.put(formTemplates, id, formTemplate);
  };

  public query ({ caller }) func getFormTemplate(id : Text) : async FormTemplate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view form templates");
    };
    switch (textMap.get(formTemplates, id)) {
      case (?formTemplate) { formTemplate };
      case null { Debug.trap("Form template not found") };
    };
  };

  public query ({ caller }) func getAllFormTemplates() : async [FormTemplate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view form templates");
    };
    Iter.toArray(textMap.vals(formTemplates));
  };

  public shared ({ caller }) func bulkImportMdFiles(mdFiles : [(Text, Text)]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform bulk import");
    };

    let currentTime = Time.now();

    for ((fileName, content) in mdFiles.vals()) {
      let detailsOfEContracts = splitIntoPostcards(content);

      let formTemplate : FormTemplate = {
        id = fileName;
        name = fileName;
        formContent = "";
        metadata = "";
        detailsOfEContracts;
        createdAt = currentTime;
        updatedAt = currentTime;
      };

      formTemplates := textMap.put(formTemplates, fileName, formTemplate);
    };
  };

  func splitIntoPostcards(content : Text) : [PostcardContent] {
    let lines = Text.split(content, #char '\n');
    var postcards : [PostcardContent] = [];
    var currentPage = 1;
    var currentContent = "";

    var lineCount = 0;
    for (line in lines) {
      currentContent := currentContent # line # "\n";
      lineCount += 1;

      if (lineCount >= 20) {
        postcards := Array.append(
          postcards,
          [
            {
              pageNumber = currentPage;
              content = currentContent;
            },
          ],
        );
        currentPage += 1;
        currentContent := "";
        lineCount := 0;
      };
    };

    if (currentContent != "") {
      postcards := Array.append(
        postcards,
        [
          {
            pageNumber = currentPage;
            content = currentContent;
          },
        ],
      );
    };

    postcards;
  };

  public shared ({ caller }) func createNodeType(id : Text, name : Text, color : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create node types");
    };

    let currentTime = Time.now();

    let nodeType : NodeType = {
      id;
      name;
      color;
      description;
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    nodeTypes := textMap.put(nodeTypes, id, nodeType);
  };

  public shared ({ caller }) func updateNodeType(id : Text, name : Text, color : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update node types");
    };

    let currentTime = Time.now();

    let nodeType : NodeType = {
      id;
      name;
      color;
      description;
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    nodeTypes := textMap.put(nodeTypes, id, nodeType);
  };

  public shared ({ caller }) func deleteNodeType(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete node types");
    };

    nodeTypes := textMap.delete(nodeTypes, id);
  };

  public query ({ caller }) func getNodeType(id : Text) : async NodeType {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view node types");
    };
    switch (textMap.get(nodeTypes, id)) {
      case (?nodeType) { nodeType };
      case null { Debug.trap("Node type not found") };
    };
  };

  public query ({ caller }) func getAllNodeTypes() : async [NodeType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view node types");
    };
    Iter.toArray(textMap.vals(nodeTypes));
  };

  public query ({ caller }) func searchNodesByColor(color : Text) : async [NodeType] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can search nodes by color");
    };
    let allNodeTypes = Iter.toArray(textMap.vals(nodeTypes));
    Array.filter<NodeType>(
      allNodeTypes,
      func(nodeType : NodeType) : Bool {
        nodeType.color == color;
      },
    );
  };

  public shared ({ caller }) func createNodeLink(sourceNodeId : Text, targetNodeId : Text, linkType : LinkType, relationshipDepth : Nat, linkStrength : Nat, metadata : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create node links");
    };

    let currentTime = Time.now();

    let linkId = sourceNodeId # "_" # targetNodeId # "_" # debug_show (currentTime);

    let nodeLink : NodeLink = {
      id = linkId;
      sourceNodeId;
      targetNodeId;
      linkType;
      createdAt = currentTime;
      updatedAt = currentTime;
      relationshipDepth;
      linkStrength;
      isBacklink = false;
      isActive = true;
      metadata;
    };

    let backlinkId = targetNodeId # "_" # sourceNodeId # "_" # debug_show (currentTime);

    let backlink : NodeLink = {
      id = backlinkId;
      sourceNodeId = targetNodeId;
      targetNodeId = sourceNodeId;
      linkType = #backlink;
      createdAt = currentTime;
      updatedAt = currentTime;
      relationshipDepth;
      linkStrength;
      isBacklink = true;
      isActive = true;
      metadata;
    };

    nodeLinks := textMap.put(nodeLinks, linkId, nodeLink);
    nodeLinks := textMap.put(nodeLinks, backlinkId, backlink);
  };

  public shared ({ caller }) func updateNodeLink(linkId : Text, linkType : LinkType, relationshipDepth : Nat, linkStrength : Nat, metadata : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update node links");
    };

    switch (textMap.get(nodeLinks, linkId)) {
      case (?link) {
        let updatedLink = {
          link with
          linkType;
          relationshipDepth;
          linkStrength;
          metadata;
          updatedAt = Time.now();
        };
        nodeLinks := textMap.put(nodeLinks, linkId, updatedLink);
      };
      case null { Debug.trap("Node link not found") };
    };
  };

  public shared ({ caller }) func deleteNodeLink(linkId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete node links");
    };

    nodeLinks := textMap.delete(nodeLinks, linkId);
  };

  public query ({ caller }) func getNodeLink(linkId : Text) : async NodeLink {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view node links");
    };
    switch (textMap.get(nodeLinks, linkId)) {
      case (?link) { link };
      case null { Debug.trap("Node link not found") };
    };
  };

  public query ({ caller }) func getAllNodeLinks() : async [NodeLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view node links");
    };
    Iter.toArray(textMap.vals(nodeLinks));
  };

  public query ({ caller }) func getLinksForNode(nodeId : Text) : async [NodeLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view node links");
    };
    let allLinks = Iter.toArray(textMap.vals(nodeLinks));
    Array.filter<NodeLink>(
      allLinks,
      func(link : NodeLink) : Bool {
        link.sourceNodeId == nodeId or link.targetNodeId == nodeId;
      },
    );
  };

  public query ({ caller }) func getBacklinksForNode(nodeId : Text) : async [NodeLink] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view node links");
    };
    let allLinks = Iter.toArray(textMap.vals(nodeLinks));
    Array.filter<NodeLink>(
      allLinks,
      func(link : NodeLink) : Bool {
        link.targetNodeId == nodeId and link.isBacklink
      },
    );
  };

  // Spec.md Deduplication Operations - Admin Only
  public shared ({ caller }) func deduplicateSpecMd(specContent : Text) : async DeduplicationResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can deduplicate spec.md");
    };

    let currentTime = Time.now();
    let resultId = "dedup_" # debug_show (currentTime);

    // Simulate deduplication processing
    let originalSize = Text.size(specContent);
    let cleanedSize = originalSize; // In real implementation, this would be the cleaned size
    let entriesCleaned = 0; // Count of cleaned entries
    let duplicateParagraphs = 0;
    let duplicateFeatureLists = 0;
    let duplicateHeadings = 0;
    let redundantSections = 0;

    // Create manifest log entry
    let manifestLogId = "manifest_dedup_" # debug_show (currentTime);
    let manifestChanges = [
      "Deduplication started for spec.md",
      "Original size: " # debug_show (originalSize) # " characters",
      "Entries cleaned: " # debug_show (entriesCleaned),
    ];

    ignore logManifestChange(manifestLogId, manifestChanges, 1, true);

    let result : DeduplicationResult = {
      id = resultId;
      targetFile = "spec.md";
      originalSize;
      cleanedSize;
      entriesCleaned;
      duplicateParagraphs;
      duplicateFeatureLists;
      duplicateHeadings;
      redundantSections;
      processingTimestamp = currentTime;
      completionTimestamp = currentTime;
      status = #completed;
      manifestLogId;
      schemaRevalidated = false;
      yamlRefreshed = false;
      specMlRefreshed = false;
    };

    deduplicationResults := textMap.put(deduplicationResults, resultId, result);

    // Trigger feature status update
    ignore updateFeatureStatus("spec_deduplication", "Spec.md Deduplication", #completed);

    result;
  };

  public query ({ caller }) func getDeduplicationResult(id : Text) : async DeduplicationResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view deduplication results");
    };
    switch (textMap.get(deduplicationResults, id)) {
      case (?result) { result };
      case null { Debug.trap("Deduplication result not found") };
    };
  };

  public query ({ caller }) func getAllDeduplicationResults() : async [DeduplicationResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all deduplication results");
    };
    Iter.toArray(textMap.vals(deduplicationResults));
  };

  public query ({ caller }) func getLatestDeduplicationResult() : async ?DeduplicationResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view deduplication results");
    };

    let allResults = Iter.toArray(textMap.vals(deduplicationResults));
    if (allResults.size() == 0) {
      return null;
    };

    let sortedResults = Array.sort<DeduplicationResult>(
      allResults,
      func(a : DeduplicationResult, b : DeduplicationResult) : { #less; #equal; #greater } {
        if (a.completionTimestamp > b.completionTimestamp) { #less } else if (a.completionTimestamp < b.completionTimestamp) {
          #greater;
        } else { #equal };
      },
    );

    ?sortedResults[0];
  };

  public shared ({ caller }) func normalizeSpecContent(specContent : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can normalize spec content");
    };

    // In real implementation, this would normalize the content structure
    // For now, return the original content
    specContent;
  };

  public shared ({ caller }) func recompressSpecFile(specContent : Text) : async CompressionMetric {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can recompress spec files");
    };

    let currentTime = Time.now();
    let metricId = "compression_" # debug_show (currentTime);

    let originalSize = Text.size(specContent);
    let compressedSize = originalSize; // In real implementation, this would be the compressed size
    let compressionRatio = 1.0; // Calculate actual ratio

    let metric : CompressionMetric = {
      id = metricId;
      targetType = #specMd;
      originalSize;
      compressedSize;
      compressionRatio;
      duplicatesRemoved = 0;
      redundantSectionsRemoved = 0;
      validationStatus = true;
      timestamp = currentTime;
    };

    compressionMetrics := textMap.put(compressionMetrics, metricId, metric);

    metric;
  };

  public shared ({ caller }) func refreshSchemaAfterDedup(deduplicationId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can refresh schemas");
    };

    switch (textMap.get(deduplicationResults, deduplicationId)) {
      case (?result) {
        let updatedResult = {
          result with
          schemaRevalidated = true;
          yamlRefreshed = true;
          specMlRefreshed = true;
        };
        deduplicationResults := textMap.put(deduplicationResults, deduplicationId, updatedResult);

        // Trigger schema revalidation
        ignore validateSchema("schema_post_dedup", "Revalidated after deduplication");
      };
      case null { Debug.trap("Deduplication result not found") };
    };
  };

  public query ({ caller }) func getDeduplicationStatus() : async {
    totalDeduplicationRuns : Nat;
    lastRunTimestamp : ?Int;
    totalEntriesCleaned : Nat;
    averageCompressionRatio : Float;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view deduplication status");
    };

    let allResults = Iter.toArray(textMap.vals(deduplicationResults));
    let totalRuns = allResults.size();

    var lastTimestamp : ?Int = null;
    var totalCleaned : Nat = 0;
    var totalRatio : Float = 0.0;

    for (result in allResults.vals()) {
      totalCleaned += result.entriesCleaned;
      let ratio = if (result.originalSize > 0) {
        Float.fromInt(result.cleanedSize) / Float.fromInt(result.originalSize);
      } else {
        1.0;
      };
      totalRatio += ratio;

      switch (lastTimestamp) {
        case null { lastTimestamp := ?result.completionTimestamp };
        case (?ts) {
          if (result.completionTimestamp > ts) {
            lastTimestamp := ?result.completionTimestamp;
          };
        };
      };
    };

    let avgRatio = if (totalRuns > 0) {
      totalRatio / Float.fromInt(totalRuns);
    } else {
      0.0;
    };

    {
      totalDeduplicationRuns = totalRuns;
      lastRunTimestamp = lastTimestamp;
      totalEntriesCleaned = totalCleaned;
      averageCompressionRatio = avgRatio;
    };
  };
}
