import AccessControl "authorization/access-control";
import Registry "blob-storage/registry";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";

import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import List "mo:base/List";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Char "mo:base/Char";

actor {
  let accessControlState = AccessControl.initState();
  let registry = Registry.new();

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
    email : Text;
    subscriptionStatus : SubscriptionStatus;
    referralCode : Text;
    referredBy : ?Text;
    createdAt : Time.Time;
  };

  public type SubscriptionStatus = {
    #none;
    #basic;
    #pro;
    #enterprise;
    #payAsYouUse;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

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

  public type SitemapEntry = {
    url : Text;
    metadata : Text;
    category : Text;
    tld : Text;
    createdAt : Time.Time;
  };

  public type Referral = {
    referrer : Principal;
    referred : Principal;
    commission : Nat;
    createdAt : Time.Time;
  };

  public type PaymentRecord = {
    user : Principal;
    amount : Nat;
    currency : Text;
    subscriptionType : SubscriptionStatus;
    timestamp : Time.Time;
    stripeSessionId : Text;
  };

  public type ControlledRoute = {
    route : Text;
    appId : Text;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var sitemaps = textMap.empty<SitemapEntry>();
  var referrals = textMap.empty<Referral>();
  var payments = textMap.empty<PaymentRecord>();

  var manualPagesList = List.nil<Text>();

  public shared ({ caller }) func addManualPage(page : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add manual pages");
    };

    let pageLower = Text.map(page, func c = if (c >= 'A' and c <= 'Z') { Char.fromNat32(Char.toNat32(c) + 32) } else c);

    if (pageLower.size() == 0) {
      Debug.trap("Invalid page name: Cannot be empty");
    };

    if (pageLower.size() > 100) {
      Debug.trap("Invalid page name: Length must be at most 100 characters");
    };

    if (Text.contains(pageLower, #text " ")) {
      Debug.trap("Invalid page name: Spaces are not allowed");
    };

    switch (textMap.get(sitemaps, pageLower)) {
      case (?_) Debug.trap("Invalid page name: Already exists in sitemaps");
      case null {
        let existingPages = List.filter<Text>(manualPagesList, func p = p == pageLower);
        if (List.size(existingPages) > 0) {
          Debug.trap("Invalid page name: Duplicate entry");
        };
        manualPagesList := List.push(pageLower, manualPagesList);
      };
    };
  };

  public query func getManualPages() : async [Text] {
    List.toArray(manualPagesList);
  };

  var controlledRoutesList = List.nil<ControlledRoute>();

  public shared ({ caller }) func addControlledRoute(route : Text, appId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add controlled routes");
    };

    let validRoutes = List.fromArray(["/broadcast", "/remote", "/live"]);
    let isValidRoute = List.some<Text>(validRoutes, func r = r == route);
    if (not isValidRoute) {
      Debug.trap("Invalid route: Route must be one of /broadcast, /remote, or /live");
    };

    if (appId.size() == 0) {
      Debug.trap("Invalid app ID: Cannot be empty");
    };

    if (Text.contains(appId, #text " ")) {
      Debug.trap("Invalid app ID: Spaces are not allowed");
    };

    let existingRoutes = List.filter<ControlledRoute>(controlledRoutesList, func r = r.route == route and r.appId == appId);
    if (List.size(existingRoutes) > 0) {
      Debug.trap("Invalid route: Duplicate entry");
    };

    controlledRoutesList := List.push({ route; appId }, controlledRoutesList);
  };

  public query func getControlledRoutes() : async [ControlledRoute] {
    List.toArray(controlledRoutesList);
  };

  public shared ({ caller }) func addSitemap(entry : SitemapEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add sitemaps");
    };
    sitemaps := textMap.put(sitemaps, entry.url, entry);
  };

  public query func getSitemap(url : Text) : async ?SitemapEntry {
    textMap.get(sitemaps, url);
  };

  public query func searchSitemaps(searchTerm : Text, limit : Nat) : async [SitemapEntry] {
    var results = List.nil<SitemapEntry>();
    var count = 0;

    for ((_, entry) in textMap.entries(sitemaps)) {
      if (Text.contains(entry.url, #text searchTerm) or Text.contains(entry.metadata, #text searchTerm)) {
        if (count < limit) {
          results := List.push(entry, results);
          count += 1;
        };
      };
    };

    List.toArray(results);
  };

  public shared ({ caller }) func addReferral(referral : Referral) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add referrals");
    };
    let key = Principal.toText(referral.referrer) # "-" # Principal.toText(referral.referred);
    referrals := textMap.put(referrals, key, referral);
  };

  public query func getReferralsByReferrer(referrer : Principal) : async [Referral] {
    var results = List.nil<Referral>();

    for ((_, referral) in textMap.entries(referrals)) {
      if (referral.referrer == referrer) {
        results := List.push(referral, results);
      };
    };

    List.toArray(results);
  };

  public shared ({ caller }) func addPaymentRecord(record : PaymentRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add payment records");
    };
    payments := textMap.put(payments, record.stripeSessionId, record);
  };

  public query ({ caller }) func getPaymentRecord(sessionId : Text) : async ?PaymentRecord {
    let record = textMap.get(payments, sessionId);
    switch (record) {
      case null { null };
      case (?r) {
        if (r.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only view your own payment records");
        };
        ?r;
      };
    };
  };

  public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can register file references");
    };
    Registry.add(registry, path, hash);
  };

  public query func getFileReference(path : Text) : async Registry.FileReference {
    Registry.get(registry, path);
  };

  public query func listFileReferences() : async [Registry.FileReference] {
    Registry.list(registry);
  };

  public shared ({ caller }) func dropFileReference(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can drop file references");
    };
    Registry.remove(registry, path);
  };

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query func getSitemapCountByTld(tld : Text) : async Nat {
    var count = 0;
    for ((_, entry) in textMap.entries(sitemaps)) {
      if (entry.tld == tld) {
        count += 1;
      };
    };
    count;
  };

  public query func getAllTlds() : async [Text] {
    var tlds = List.nil<Text>();

    for ((_, entry) in textMap.entries(sitemaps)) {
      var found = false;
      for (tld in List.toIter(tlds)) {
        if (tld == entry.tld) {
          found := true;
        };
      };
      if (not found) {
        tlds := List.push(entry.tld, tlds);
      };
    };

    List.toArray(tlds);
  };

  public query func getSitemapsByPage(page : Nat, pageSize : Nat) : async [SitemapEntry] {
    let start = page * pageSize;
    var results = List.nil<SitemapEntry>();
    var count = 0;
    var index = 0;

    for ((_, entry) in textMap.entries(sitemaps)) {
      if (index >= start and count < pageSize) {
        results := List.push(entry, results);
        count += 1;
      };
      index += 1;
    };

    List.toArray(results);
  };
};

