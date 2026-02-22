import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
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
    // Other user metadata if needed
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Task Management
  public type Task = {
    id : Nat;
    title : Text;
    description : Text;
    column : Column;
    owner : Principal;
  };

  public type Column = {
    #toDo;
    #inProgress;
    #done;
  };

  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);
  var tasks = natMap.empty<Task>();
  var nextTaskId = 0;

  public shared ({ caller }) func createTask(title : Text, description : Text, column : Column) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create tasks");
    };

    let taskId = nextTaskId;
    let task : Task = {
      id = taskId;
      title;
      description;
      column;
      owner = caller;
    };

    tasks := natMap.put(tasks, taskId, task);
    nextTaskId += 1;
    taskId;
  };

  public shared ({ caller }) func updateTaskColumn(taskId : Nat, newColumn : Column) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update tasks");
    };

    switch (natMap.get(tasks, taskId)) {
      case (null) { Debug.trap("Task not found") };
      case (?task) {
        if (task.owner != caller) {
          Debug.trap("Unauthorized: You do not own this task");
        };

        let updatedTask : Task = {
          id = task.id;
          title = task.title;
          description = task.description;
          column = newColumn;
          owner = task.owner;
        };

        tasks := natMap.put(tasks, taskId, updatedTask);
      };
    };
  };

  public shared ({ caller }) func deleteTask(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete tasks");
    };

    switch (natMap.get(tasks, taskId)) {
      case (null) { Debug.trap("Task not found") };
      case (?task) {
        if (task.owner != caller) {
          Debug.trap("Unauthorized: You do not own this task");
        };

        tasks := natMap.delete(tasks, taskId);
      };
    };
  };

  public query ({ caller }) func getUserTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view tasks");
    };

    let userTasks = Iter.toArray(
      Iter.filter(
        natMap.vals(tasks),
        func(task : Task) : Bool {
          task.owner == caller;
        },
      )
    );
    userTasks;
  };

  // Schema Validation and Logging
  public type SchemaChangeLog = {
    timestamp : Time.Time;
    description : Text;
    schemaType : SchemaType;
    changeType : ChangeType;
  };

  public type SchemaType = {
    #userProfile;
    #task;
  };

  public type ChangeType = {
    #fieldAdded;
    #fieldRemoved;
    #typeChanged;
    #validationRuleChanged;
  };

  transient let timeMap = OrderedMap.Make<Time.Time>(func(a : Time.Time, b : Time.Time) : { #less; #equal; #greater } { if (a < b) #less else if (a == b) #equal else #greater });
  var schemaChangeLogs = timeMap.empty<SchemaChangeLog>();

  public shared ({ caller }) func logSchemaChange(description : Text, schemaType : SchemaType, changeType : ChangeType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can log schema changes");
    };

    let logEntry : SchemaChangeLog = {
      timestamp = Time.now();
      description;
      schemaType;
      changeType;
    };

    schemaChangeLogs := timeMap.put(schemaChangeLogs, logEntry.timestamp, logEntry);
  };

  public query ({ caller }) func getSchemaChangeLogs() : async [SchemaChangeLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view schema change logs");
    };

    Iter.toArray(timeMap.vals(schemaChangeLogs));
  };
};

