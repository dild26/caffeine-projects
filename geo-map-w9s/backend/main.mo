import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Array "mo:core/Array";

actor {
  var accessControlState = AccessControl.initState();

  // ============================================================================
  // ACCESS CONTROL FUNCTIONS
  // ============================================================================

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

  // ============================================================================
  // STRIPE FUNCTIONS
  // ============================================================================

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ============================================================================
  // USER PROFILE MANAGEMENT
  // ============================================================================

  public type UserProfile = {
    name : Text;
  };

  var userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ============================================================================
  // DATA TYPES
  // ============================================================================

  public type Coordinate = {
    latitude : Float;
    longitude : Float;
    altitude : Float;
  };

  public type Pin = {
    id : Text;
    coordinates : Coordinate;
    gridCellId : Text;
    timestamp : Time.Time;
    userId : Principal;
  };

  public type Polygon = {
    id : Text;
    vertices : [Coordinate];
    triangulation : [[Nat]];
    gridCellIds : [Text];
    timestamp : Time.Time;
    userId : Principal;
  };

  public type OperationType = {
    #pinPlacement;
    #gridSnap;
    #arcCreation;
    #radiusCreation;
    #polygonCreation;
    #osmImport;
    #osmTransformation;
    #osmSnapOperation;
    #imageAdjustment;
    #osmBulkImport;
    #osmSchemaChange;
  };

  public type ManifestLogEntry = {
    timestamp : Time.Time;
    userId : Principal;
    operationType : OperationType;
    inputs : Text;
    outputs : Text;
    srs : Text;
    resolution : Nat;
    signature : Text;
  };

  public type ImageAdjustment = {
    id : Text;
    position : { x : Float; y : Float; z : Float };
    scale : Float;
    rotation : Float;
    timestamp : Time.Time;
    userId : Principal;
    isPermanent : Bool;
  };

  public type OSMRasterTile = {
    id : Text;
    url : Text;
    zoomLevel : Nat;
    x : Nat;
    y : Nat;
    timestamp : Time.Time;
    userId : Principal;
  };

  public type OSMVectorFeature = {
    id : Text;
    featureType : Text;
    coordinates : [Coordinate];
    properties : Text;
    timestamp : Time.Time;
    userId : Principal;
  };

  public type OSMLabel = {
    id : Text;
    text : Text;
    position : Coordinate;
    timestamp : Time.Time;
    userId : Principal;
  };

  public type OSMGPSTrace = {
    id : Text;
    coordinates : [Coordinate];
    timestamp : Time.Time;
    userId : Principal;
  };

  public type OSMAdminBoundary = {
    id : Text;
    name : Text;
    coordinates : [Coordinate];
    timestamp : Time.Time;
    userId : Principal;
  };

  public type OverlayType = {
    #roads;
    #railways;
    #rivers;
    #vegetation;
    #climate;
    #floodAlerts;
    #disasterAlerts;
    #borders;
  };

  public type OverlayLayer = {
    id : Text;
    overlayType : OverlayType;
    source : Text;
    isEnabled : Bool;
    timestamp : Time.Time;
    userId : Principal;
  };

  public type ECEFCoordinate = {
    x : Float;
    y : Float;
    z : Float;
  };

  public type WebMercatorCoordinate = {
    x : Float;
    y : Float;
  };

  public type GridCell = {
    id : Text;
    coordinates : Coordinate;
    ecef : ECEFCoordinate;
    webMercator : WebMercatorCoordinate;
    gridNumber : Nat;
    x : Float;
    y : Float;
    z : Float;
  };

  public type SitemapEntry = {
    page : Text;
    url : Text;
    lastModified : Time.Time;
  };

  public type PageAuditEntry = {
    page : Text;
    action : Text;
    timestamp : Time.Time;
    adminId : Principal;
    merkleRoot : Text;
  };

  public type ControlledRoute = {
    path : Text;
    delegate : Text;
    adminOnly : Bool;
  };

  // ============================================================================
  // STATE VARIABLES
  // ============================================================================

  var pins = Map.empty<Text, Pin>();
  var polygons = Map.empty<Text, Polygon>();
  var manifestLog = List.empty<ManifestLogEntry>();
  var imageAdjustments = Map.empty<Text, ImageAdjustment>();
  var osmRasterTiles = Map.empty<Text, OSMRasterTile>();
  var osmVectorFeatures = Map.empty<Text, OSMVectorFeature>();
  var osmLabels = Map.empty<Text, OSMLabel>();
  var osmGPSTraces = Map.empty<Text, OSMGPSTrace>();
  var osmAdminBoundaries = Map.empty<Text, OSMAdminBoundary>();
  var overlayLayers = Map.empty<Text, OverlayLayer>();
  var stripeSessions = Map.empty<Text, Principal>();
  var configuration : ?Stripe.StripeConfiguration = null;
  var pageAuditLog = List.empty<PageAuditEntry>();

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

  var controlledRoutes : [ControlledRoute] = [
    { path = "/broadcast"; delegate = "Secoinfi-App"; adminOnly = true },
    { path = "/remote"; delegate = "Secoinfi-App"; adminOnly = true },
    { path = "/live"; delegate = "Secoinfi-App"; adminOnly = true },
  ];

  // ============================================================================
  // SITEMAP MANAGEMENT (Admin-only for modifications, public for reading)
  // ============================================================================

  public query ({ caller }) func getPages() : async [Text] {
    pages;
  };

  public shared ({ caller }) func addPage(page : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add pages");
    };

    let normalizedPage = page.toLower();
    if (normalizedPage != page) {
      Runtime.trap("Page slug must be lowercase");
    };

    let hasSpace = normalizedPage.contains(#char ' ');
    if (hasSpace) {
      Runtime.trap("Page slug cannot contain spaces");
    };

    let pageExists = pages.find(func(p) { p == normalizedPage });
    if (pageExists != null) {
      Runtime.trap("Page slug must be unique");
    };

    pages := pages.concat([normalizedPage]);

    let auditEntry : PageAuditEntry = {
      page = normalizedPage;
      action = "add";
      timestamp = Time.now();
      adminId = caller;
      merkleRoot = generateMerkleRoot(normalizedPage, caller);
    };
    pageAuditLog.add(auditEntry);
  };

  public shared ({ caller }) func removePage(page : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove pages");
    };

    pages := pages.filter(func(p) { p != page });

    let auditEntry : PageAuditEntry = {
      page = page;
      action = "remove";
      timestamp = Time.now();
      adminId = caller;
      merkleRoot = generateMerkleRoot(page, caller);
    };
    pageAuditLog.add(auditEntry);
  };

  public query ({ caller }) func getSitemap() : async [SitemapEntry] {
    let now = Time.now();
    pages.map(
      func(page) {
        {
          page;
          url = "/" # page;
          lastModified = now;
        };
      }
    );
  };

  public query ({ caller }) func getControlledRoutes() : async [ControlledRoute] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view controlled routes");
    };
    controlledRoutes;
  };

  public shared ({ caller }) func addControlledRoute(route : ControlledRoute) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add controlled routes");
    };
    controlledRoutes := controlledRoutes.concat([route]);
  };

  public query ({ caller }) func getPageAuditLog() : async [PageAuditEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit log");
    };
    pageAuditLog.toArray();
  };

  // ============================================================================
  // PIN MANAGEMENT (User-level operations)
  // ============================================================================

  public shared ({ caller }) func createPin(pin : Pin) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create pins");
    };

    if (pin.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create pins for other users");
    };

    pins.add(pin.id, pin);

    let logEntry : ManifestLogEntry = {
      timestamp = Time.now();
      userId = caller;
      operationType = #pinPlacement;
      inputs = "Pin ID: " # pin.id;
      outputs = "Pin created";
      srs = "ECEF";
      resolution = 0;
      signature = "";
    };
    manifestLog.add(logEntry);
  };

  public query ({ caller }) func getPin(pinId : Text) : async ?Pin {
    pins.get(pinId);
  };

  public query ({ caller }) func getUserPins(userId : Principal) : async [Pin] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own pins");
    };

    let userPins = pins.filter(func(_, pin) { pin.userId == userId });
    userPins.values().toArray();
  };

  public shared ({ caller }) func deletePin(pinId : Text) : async () {
    switch (pins.get(pinId)) {
      case null {
        Runtime.trap("Pin not found");
      };
      case (?pin) {
        if (pin.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own pins");
        };
        pins.remove(pinId);
      };
    };
  };

  // ============================================================================
  // POLYGON MANAGEMENT (User-level operations)
  // ============================================================================

  public shared ({ caller }) func createPolygon(polygon : Polygon) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create polygons");
    };

    if (polygon.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create polygons for other users");
    };

    polygons.add(polygon.id, polygon);

    let logEntry : ManifestLogEntry = {
      timestamp = Time.now();
      userId = caller;
      operationType = #polygonCreation;
      inputs = "Polygon ID: " # polygon.id;
      outputs = "Polygon created";
      srs = "ECEF";
      resolution = 0;
      signature = "";
    };
    manifestLog.add(logEntry);
  };

  public query ({ caller }) func getPolygon(polygonId : Text) : async ?Polygon {
    polygons.get(polygonId);
  };

  public query ({ caller }) func getUserPolygons(userId : Principal) : async [Polygon] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own polygons");
    };

    let userPolygons = polygons.filter(func(_, polygon) { polygon.userId == userId });
    userPolygons.values().toArray();
  };

  public shared ({ caller }) func deletePolygon(polygonId : Text) : async () {
    switch (polygons.get(polygonId)) {
      case null {
        Runtime.trap("Polygon not found");
      };
      case (?polygon) {
        if (polygon.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own polygons");
        };
        polygons.remove(polygonId);
      };
    };
  };

  // ============================================================================
  // IMAGE ADJUSTMENT MANAGEMENT
  // ============================================================================

  public shared ({ caller }) func createImageAdjustment(adjustment : ImageAdjustment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create image adjustments");
    };

    if (adjustment.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create adjustments for other users");
    };

    if (adjustment.isPermanent and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create permanent adjustments");
    };

    imageAdjustments.add(adjustment.id, adjustment);

    let logEntry : ManifestLogEntry = {
      timestamp = Time.now();
      userId = caller;
      operationType = #imageAdjustment;
      inputs = "Adjustment ID: " # adjustment.id;
      outputs = "Adjustment created";
      srs = "ECEF";
      resolution = 0;
      signature = "";
    };
    manifestLog.add(logEntry);
  };

  public query ({ caller }) func getImageAdjustment(adjustmentId : Text) : async ?ImageAdjustment {
    switch (imageAdjustments.get(adjustmentId)) {
      case null { null };
      case (?adjustment) {
        if (not adjustment.isPermanent and adjustment.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own session adjustments");
        };
        ?adjustment;
      };
    };
  };

  public query ({ caller }) func getUserImageAdjustments(userId : Principal) : async [ImageAdjustment] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own adjustments");
    };

    let userAdjustments = imageAdjustments.filter(func(_, adjustment) { adjustment.userId == userId });
    userAdjustments.values().toArray();
  };

  public shared ({ caller }) func saveImageAdjustmentPermanently(adjustmentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can save adjustments permanently");
    };

    switch (imageAdjustments.get(adjustmentId)) {
      case null {
        Runtime.trap("Adjustment not found");
      };
      case (?adjustment) {
        let permanentAdjustment = {
          adjustment with isPermanent = true
        };
        imageAdjustments.add(adjustmentId, permanentAdjustment);
      };
    };
  };

  public shared ({ caller }) func deleteImageAdjustment(adjustmentId : Text) : async () {
    switch (imageAdjustments.get(adjustmentId)) {
      case null {
        Runtime.trap("Adjustment not found");
      };
      case (?adjustment) {
        if (adjustment.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own adjustments");
        };
        imageAdjustments.remove(adjustmentId);
      };
    };
  };

  // ============================================================================
  // OVERLAY LAYER MANAGEMENT
  // ============================================================================

  public shared ({ caller }) func createOverlayLayer(layer : OverlayLayer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create overlay layers");
    };

    if (layer.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create layers for other users");
    };

    overlayLayers.add(layer.id, layer);
  };

  public query ({ caller }) func getOverlayLayer(layerId : Text) : async ?OverlayLayer {
    overlayLayers.get(layerId);
  };

  public query ({ caller }) func getUserOverlayLayers(userId : Principal) : async [OverlayLayer] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own layers");
    };

    let userLayers = overlayLayers.filter(func(_, layer) { layer.userId == userId });
    userLayers.values().toArray();
  };

  public shared ({ caller }) func updateOverlayLayerConfig(layerId : Text, isEnabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update overlay layer configuration");
    };

    switch (overlayLayers.get(layerId)) {
      case null {
        Runtime.trap("Layer not found");
      };
      case (?layer) {
        let updatedLayer = {
          layer with isEnabled = isEnabled
        };
        overlayLayers.add(layerId, updatedLayer);
      };
    };
  };

  public shared ({ caller }) func deleteOverlayLayer(layerId : Text) : async () {
    switch (overlayLayers.get(layerId)) {
      case null {
        Runtime.trap("Layer not found");
      };
      case (?layer) {
        if (layer.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own layers");
        };
        overlayLayers.remove(layerId);
      };
    };
  };

  // ============================================================================
  // OSM DATA MANAGEMENT (User-level operations)
  // ============================================================================

  public shared ({ caller }) func createOSMRasterTile(tile : OSMRasterTile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create OSM raster tiles");
    };

    if (tile.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create tiles for other users");
    };

    osmRasterTiles.add(tile.id, tile);
  };

  public shared ({ caller }) func createOSMVectorFeature(feature : OSMVectorFeature) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create OSM vector features");
    };

    if (feature.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create features for other users");
    };

    osmVectorFeatures.add(feature.id, feature);
  };

  public shared ({ caller }) func createOSMLabel(osmLabel : OSMLabel) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create OSM labels");
    };

    if (osmLabel.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create labels for other users");
    };

    osmLabels.add(osmLabel.id, osmLabel);
  };

  public shared ({ caller }) func createOSMGPSTrace(trace : OSMGPSTrace) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create OSM GPS traces");
    };

    if (trace.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create traces for other users");
    };

    osmGPSTraces.add(trace.id, trace);
  };

  public shared ({ caller }) func createOSMAdminBoundary(boundary : OSMAdminBoundary) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create OSM admin boundaries");
    };

    if (boundary.userId != caller) {
      Runtime.trap("Unauthorized: Cannot create boundaries for other users");
    };

    osmAdminBoundaries.add(boundary.id, boundary);
  };

  public query ({ caller }) func getOSMRasterTile(tileId : Text) : async ?OSMRasterTile {
    osmRasterTiles.get(tileId);
  };

  public query ({ caller }) func getOSMVectorFeature(featureId : Text) : async ?OSMVectorFeature {
    osmVectorFeatures.get(featureId);
  };

  public query ({ caller }) func getOSMLabel(labelId : Text) : async ?OSMLabel {
    osmLabels.get(labelId);
  };

  public query ({ caller }) func getOSMGPSTrace(traceId : Text) : async ?OSMGPSTrace {
    osmGPSTraces.get(traceId);
  };

  public query ({ caller }) func getOSMAdminBoundary(boundaryId : Text) : async ?OSMAdminBoundary {
    osmAdminBoundaries.get(boundaryId);
  };

  // ============================================================================
  // MANIFEST LOG (Admin read, system write)
  // ============================================================================

  public query ({ caller }) func getManifestLog() : async [ManifestLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view manifest log");
    };
    manifestLog.toArray();
  };

  public query ({ caller }) func getUserManifestLog(userId : Principal) : async [ManifestLogEntry] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own manifest log");
    };

    let userLog = manifestLog.filter(func(entry) { entry.userId == userId });
    userLog.toArray();
  };

  // ============================================================================
  // COORDINATE CONVERSION UTILITIES (Public access)
  // ============================================================================

  func convertToECEFSync(latitude : Float, longitude : Float, altitude : Float) : ECEFCoordinate {
    let radLat = latitude * 3.141592653589793 / 180.0;
    let radLon = longitude * 3.141592653589793 / 180.0;
    let earthRadius = 6378137.0;
    let cosLat = Float.cos(radLat);
    let cosLon = Float.cos(radLon);
    let radius = earthRadius + altitude;

    {
      x = radius * cosLat * cosLon;
      y = radius * cosLat * Float.sin(radLon);
      z = radius * Float.sin(radLat);
    };
  };

  func convertToWebMercatorSync(latitude : Float, longitude : Float) : WebMercatorCoordinate {
    let radLat = latitude * 3.141592653589793 / 180.0;
    let radLon = longitude * 3.141592653589793 / 180.0;
    let earthRadius = 6378137.0;

    {
      x = earthRadius * radLon;
      y = earthRadius * Float.log(Float.tan(3.141592653589793 / 4.0 + radLat / 2.0));
    };
  };

  public query func convertToECEF(latitude : Float, longitude : Float, altitude : Float) : async ECEFCoordinate {
    convertToECEFSync(latitude, longitude, altitude);
  };

  public query func convertToWebMercator(latitude : Float, longitude : Float) : async WebMercatorCoordinate {
    convertToWebMercatorSync(latitude, longitude);
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  func generateMerkleRoot(page : Text, admin : Principal) : Text {
    let timestamp = Time.now().toText();
    let adminText = admin.toText();
    page # "-" # adminText # "-" # timestamp;
  };
};
