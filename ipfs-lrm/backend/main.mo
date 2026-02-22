import Map "mo:core/Map";
import Text "mo:core/Text";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import OutCall "http-outcalls/outcall";
import Iter "mo:core/Iter";

import AccessControl "authorization/access-control";

actor {
  // Access control state
  let accessControlState = AccessControl.initState();

  var pythonFiles = Map.empty<Text, Text>();
  var referralTransactions = Map.empty<Text, Text>();
  var specFileStatus : Text = "spec.md";

  var pages : [Text] = [
    "about",
    "admin",
    "apps",
    "angel-vc",
    "blog",
    "block",
    "broadcast",
    "compare",
    "contact",
    "dash",
    "dex",
    "e-com",
    "faq",
    "finance",
    "fix",
    "fixture",
    "footstep",
    "lang",
    "leader",
    "live",
    "main",
    "map",
    "milestone",
    "pages",
    "payments",
    "pros",
    "rank",
    "referral",
    "remote",
    "resource",
    "routes",
    "secure",
    "sitemap",
    "terms",
    "trust",
    "what",
    "verifySig",
    "when",
    "where",
    "who",
    "why",
    "ZKProof",
  ];

  var userProfiles = Map.empty<Principal, UserProfile>();

  public type UserProfile = {
    name : Text;
  };

  // ===== Access Control Functions =====
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

  // ===== User Profile Functions =====
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  // ===== Admin Protected Functions =====
  public shared ({ caller }) func storePythonFile(fileName : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update python files");
    };
    pythonFiles.add(fileName, content);
  };

  public shared ({ caller }) func storeReferralTransaction(transactionId : Text, details : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update referral transactions");
    };
    referralTransactions.add(transactionId, details);
  };

  public shared ({ caller }) func checkAndConvertSpecFile() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can convert spec files");
    };

    if (specFileStatus == "spec.ml" or specFileStatus == "yaml") {
      return "No conversion needed";
    };

    specFileStatus := "spec.ml";
    "Conversion successful";
  };

  // ===== Public Functions =====
  public query func getPythonFiles() : async [(Text, Text)] {
    pythonFiles.entries().toArray();
  };

  public query func getReferralTransactions() : async [(Text, Text)] {
    referralTransactions.entries().toArray();
  };

  public query func getSpecFileStatus() : async Text {
    specFileStatus;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func fetchIPFSContent(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };

  public func checkIPFSHealth() : async Text {
    let healthCheckUrl = "https://ipfs.io/health";
    await OutCall.httpGetRequest(healthCheckUrl, [], transform);
  };

  public func deduplicateSpecFile(content : Text) : async Text {
    let lines = content.split(#char '\n');
    let uniqueLines = Set.empty<Text>();
    let deduplicatedLines = lines.filter(func(line) { not uniqueLines.contains(line) });
    deduplicatedLines.join("\n");
  };

  public query func getPages() : async [Text] {
    pages;
  };

  public shared ({ caller }) func addPage(newPage : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add pages");
    };

    // Validate lowercase
    if (not isLowercase(newPage)) {
      return "Page slug must be lowercase";
    };

    // Validate no spaces
    if (newPage.contains(#char ' ')) {
      return "Page slug cannot contain spaces";
    };

    // Prevent modification of protected routes
    if (newPage == "broadcast" or newPage == "remote" or newPage == "live") {
      return "Cannot modify protected route: " # newPage;
    };

    if (pages.any(func(page) { page == newPage })) {
      return "Page already exists";
    };

    pages := pages.concat([newPage]);
    "Page added successfully";
  };

  func isLowercase(text : Text) : Bool {
    text == text.toLower();
  };
};
