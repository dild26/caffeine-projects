import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor TerrorUproot {
  let accessControlState = AccessControl.initState();
  let storage = Storage.new();
  include MixinStorage(storage);

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  public type UserProfile = {
    name : Text;
    organization : Text;
    role : AccessControl.UserRole;
  };

  public type Incident = {
    id : Text;
    location : Text;
    incidentType : Text;
    severity : Nat;
    status : Text;
    timestamp : Time.Time;
    description : Text;
  };

  public type DataSource = {
    id : Text;
    name : Text;
    sourceType : Text;
    verified : Bool;
    lastUpdated : Time.Time;
  };

  public type Report = {
    id : Text;
    title : Text;
    content : Text;
    created : Time.Time;
    author : Principal;
  };

  public type YamlConfig = {
    content : Text;
    version : Nat;
    timestamp : Time.Time;
  };

  var userProfiles = principalMap.empty<UserProfile>();
  var incidents = textMap.empty<Incident>();
  var dataSources = textMap.empty<DataSource>();
  var reports = textMap.empty<Report>();
  var yamlConfigs = textMap.empty<YamlConfig>();

  // Access Control Initialization
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

  // Incident Management
  public shared ({ caller }) func addIncident(incident : Incident) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add incidents");
    };
    incidents := textMap.put(incidents, incident.id, incident);
  };

  public query func getIncidents() : async [Incident] {
    // Public access - all users including guests can view anonymized incident data
    Iter.toArray(textMap.vals(incidents));
  };

  public query func getIncidentById(id : Text) : async ?Incident {
    // Public access - all users including guests can view anonymized incident data
    textMap.get(incidents, id);
  };

  public shared ({ caller }) func updateIncidentStatus(id : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update incidents");
    };
    switch (textMap.get(incidents, id)) {
      case (null) { Debug.trap("Incident not found") };
      case (?incident) {
        let updatedIncident = {
          id = incident.id;
          location = incident.location;
          incidentType = incident.incidentType;
          severity = incident.severity;
          status;
          timestamp = incident.timestamp;
          description = incident.description;
        };
        incidents := textMap.put(incidents, id, updatedIncident);
      };
    };
  };

  public shared ({ caller }) func deleteIncident(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete incidents");
    };
    incidents := textMap.delete(incidents, id);
  };

  // Data Source Management
  public shared ({ caller }) func addDataSource(dataSource : DataSource) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add data sources");
    };
    dataSources := textMap.put(dataSources, dataSource.id, dataSource);
  };

  public query func getDataSources() : async [DataSource] {
    // Public access - all users including guests can view data source information
    Iter.toArray(textMap.vals(dataSources));
  };

  public shared ({ caller }) func verifyDataSource(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can verify data sources");
    };
    switch (textMap.get(dataSources, id)) {
      case (null) { Debug.trap("Data source not found") };
      case (?dataSource) {
        let updatedDataSource = {
          id = dataSource.id;
          name = dataSource.name;
          sourceType = dataSource.sourceType;
          verified = true;
          lastUpdated = dataSource.lastUpdated;
        };
        dataSources := textMap.put(dataSources, id, updatedDataSource);
      };
    };
  };

  public shared ({ caller }) func deleteDataSource(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete data sources");
    };
    dataSources := textMap.delete(dataSources, id);
  };

  // Report Management
  public shared ({ caller }) func createReport(report : Report) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create reports");
    };
    // Verify that the caller is the author to prevent impersonation
    if (report.author != caller) {
      Debug.trap("Unauthorized: Cannot create reports for other users");
    };
    reports := textMap.put(reports, report.id, report);
  };

  public query func getReports() : async [Report] {
    // Public access - all users including guests can view reports for research purposes
    Iter.toArray(textMap.vals(reports));
  };

  public query func getReportById(id : Text) : async ?Report {
    // Public access - all users including guests can view reports for research purposes
    textMap.get(reports, id);
  };

  public shared ({ caller }) func deleteReport(id : Text) : async () {
    switch (textMap.get(reports, id)) {
      case (null) { Debug.trap("Report not found") };
      case (?report) {
        // Only the author or an admin can delete a report
        if (report.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Only the report author or admins can delete reports");
        };
        reports := textMap.delete(reports, id);
      };
    };
  };

  // YAML Configuration Management
  public shared ({ caller }) func addYamlConfig(config : YamlConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add YAML configurations");
    };
    yamlConfigs := textMap.put(yamlConfigs, config.content, config);
  };

  public query func getYamlConfigs() : async [YamlConfig] {
    // Public access - all users including guests can view YAML configurations
    Iter.toArray(textMap.vals(yamlConfigs));
  };

  public query func getLatestYamlConfig() : async ?YamlConfig {
    // Public access - all users including guests can view the latest YAML configuration
    var latestConfig : ?YamlConfig = null;
    for (config in textMap.vals(yamlConfigs)) {
      switch (latestConfig) {
        case (null) { latestConfig := ?config };
        case (?current) {
          if (config.version > current.version) {
            latestConfig := ?config;
          };
        };
      };
    };
    latestConfig;
  };

  public shared ({ caller }) func deleteYamlConfig(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete YAML configurations");
    };
    yamlConfigs := textMap.delete(yamlConfigs, content);
  };
};

