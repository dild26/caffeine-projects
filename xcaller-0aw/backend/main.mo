import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Int "mo:core/Int";

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
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
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

  let storage = Storage.new();
  include MixinStorage(storage);

  public type Domain = {
    url : Text;
    upvotes : Nat;
    downvotes : Nat;
    clickCount : Nat;
  };

  let domains = Map.empty<Text, Domain>();

  public shared ({ caller }) func addDomain(url : Text) : async () {
    let domain : Domain = {
      url;
      upvotes = 0;
      downvotes = 0;
      clickCount = 0;
    };
    domains.add(url, domain);
  };

  public shared ({ caller }) func upvoteDomain(url : Text) : async () {
    switch (domains.get(url)) {
      case (null) { Runtime.trap("Domain not found") };
      case (?domain) {
        let updatedDomain : Domain = {
          url = domain.url;
          upvotes = domain.upvotes + 1;
          downvotes = domain.downvotes;
          clickCount = domain.clickCount;
        };
        domains.add(url, updatedDomain);
      };
    };
  };

  public shared ({ caller }) func downvoteDomain(url : Text) : async () {
    switch (domains.get(url)) {
      case (null) { Runtime.trap("Domain not found") };
      case (?domain) {
        let updatedDomain : Domain = {
          url = domain.url;
          upvotes = domain.upvotes;
          downvotes = domain.downvotes + 1;
          clickCount = domain.clickCount;
        };
        domains.add(url, updatedDomain);
      };
    };
  };

  public shared ({ caller }) func incrementClickCount(url : Text) : async () {
    switch (domains.get(url)) {
      case (null) { Runtime.trap("Domain not found") };
      case (?domain) {
        let updatedDomain : Domain = {
          url = domain.url;
          upvotes = domain.upvotes;
          downvotes = domain.downvotes;
          clickCount = domain.clickCount + 1;
        };
        domains.add(url, updatedDomain);
      };
    };
  };

  public query func getDomains() : async [Domain] {
    domains.values().toArray();
  };

  public shared ({ caller }) func deleteDomain(url : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete domains");
    };
    domains.remove(url);
  };

  public shared ({ caller }) func generateDomains(urls : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate domains");
    };
    for (url in urls.values()) {
      let domain : Domain = {
        url;
        upvotes = 0;
        downvotes = 0;
        clickCount = 0;
      };
      domains.add(url, domain);
    };
  };

  // Added methods for retrieving domain status and lists
  public query func getDomainVoteStatus(url : Text) : async ?(Nat, Nat) {
    switch (domains.get(url)) {
      case (null) { null };
      case (?domain) { ?(domain.upvotes, domain.downvotes) };
    };
  };

  public query func getTopVotedDomains() : async [Domain] {
    let domainsArray = domains.values().toArray();
    domainsArray.sort(
      func(a, b) {
        let aScore = a.upvotes.toInt() - a.downvotes.toInt();
        let bScore = b.upvotes.toInt() - b.downvotes.toInt();
        Int.compare(bScore, aScore);
      }
    );
  };

  public query func getMostClickedDomains() : async [Domain] {
    let domainsArray = domains.values().toArray();
    domainsArray.sort(
      func(a, b) {
        Nat.compare(b.clickCount, a.clickCount);
      }
    );
  };
};
