import OrderedMap "mo:base/OrderedMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

module {
  type Task = {
    id : Nat;
    title : Text;
    description : Text;
    column : {
      #toDo;
      #inProgress;
      #done;
    };
    owner : Principal;
  };

  type SchemaChangeLog = {
    timestamp : Time.Time;
    description : Text;
    schemaType : {
      #userProfile;
      #task;
    };
    changeType : {
      #fieldAdded;
      #fieldRemoved;
      #typeChanged;
      #validationRuleChanged;
    };
  };

  type OldActor = {
    userProfiles : OrderedMap.Map<Principal, { name : Text }>;
    tasks : OrderedMap.Map<Nat, Task>;
    nextTaskId : Nat;
  };

  type NewActor = {
    userProfiles : OrderedMap.Map<Principal, { name : Text }>;
    tasks : OrderedMap.Map<Nat, Task>;
    nextTaskId : Nat;
    schemaChangeLogs : OrderedMap.Map<Time.Time, SchemaChangeLog>;
  };

  public func run(old : OldActor) : NewActor {
    let timeMap = OrderedMap.Make<Time.Time>(func(a : Time.Time, b : Time.Time) : { #less; #equal; #greater } { if (a < b) #less else if (a == b) #equal else #greater });
    {
      userProfiles = old.userProfiles;
      tasks = old.tasks;
      nextTaskId = old.nextTaskId;
      schemaChangeLogs = timeMap.empty<SchemaChangeLog>();
    };
  };
};

