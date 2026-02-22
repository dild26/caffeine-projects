import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import List "mo:core/List";
import Array "mo:core/Array";

actor {
  type UserProfile = {
    name : Text;
    email : Text;
    role : AccessControl.UserRole;
    themePreference : Text;
  };

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

  var userProfiles = Map.empty<Principal, UserProfile>();

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

  public type Resource = {
    id : Text;
    title : Text;
    category : Text;
    feeRs : Float;
    feeUsd : Float;
    verified : Bool;
    hashtags : [Text];
    topics : [Text];
  };

  public type Instructor = {
    id : Text;
    name : Text;
    availability : [Text];
    topics : [Text];
    hashtags : [Text];
  };

  public type Learner = {
    id : Text;
    name : Text;
    progress : [Text];
    preferences : [Text];
    owner : Principal;
  };

  public type Appointment = {
    id : Text;
    learnerId : Text;
    instructorId : Text;
    resourceId : Text;
    timeSlot : Text;
    status : Text;
    owner : Principal;
  };

  public type SyncMetadata = {
    lastSyncTime : Time.Time;
    syncStatus : Text;
    contentHash : Text;
  };

  public type ContactDetails = {
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
    lastVerified : Time.Time;
    source : Text;
  };

  public type SyncLog = {
    timestamp : Time.Time;
    status : Text;
    details : Text;
  };

  public type NavigationItem = {
    id : Text;
    navLabel : Text;
    url : Text;
    parentId : ?Text;
    order : Nat;
    type_ : Text;
    children : [NavigationItem];
    isPublic : Bool;
  };

  public type Theme = {
    id : Text;
    name : Text;
    primaryColor : Text;
    secondaryColor : Text;
    backgroundColor : Text;
    textColor : Text;
    accentColor : Text;
  };

  public type FeatureValidation = {
    featureName : Text;
    aiValidated : Bool;
    adminValidated : Bool;
  };

  public type PageModification = {
    id : Text;
    timestamp : Time.Time;
    user : Principal;
    action : Text;
    details : Text;
  };

  var resources = Map.empty<Text, Resource>();
  var instructors = Map.empty<Text, Instructor>();
  var learners = Map.empty<Text, Learner>();
  var appointments = Map.empty<Text, Appointment>();
  var syncMetadata = Map.empty<Text, SyncMetadata>();
  var staticPages = Map.empty<Text, Text>();
  var contactDetails = Map.empty<Text, ContactDetails>();
  var syncLogs = Map.empty<Text, SyncLog>();
  var navigationItems = Map.empty<Text, NavigationItem>();
  var themes = Map.empty<Text, Theme>();
  var featureValidations = Map.empty<Text, FeatureValidation>();
  var pageModifications = Map.empty<Text, PageModification>();

  // Resource Management - Admin only for adding/verifying
  public shared ({ caller }) func addResource(resource : Resource) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add resources");
    };
    resources.add(resource.id, resource);
  };

  // Public access to view resources
  public query func getResources() : async [Resource] {
    resources.values().toArray();
  };

  public shared ({ caller }) func verifyResource(resourceId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify resources");
    };
    switch (resources.get(resourceId)) {
      case (?resource) {
        let verifiedResource = { resource with verified = true };
        resources.add(resourceId, verifiedResource);
      };
      case null {
        Runtime.trap("Resource not found");
      };
    };
  };

  // Instructor Management - Admin only for adding
  public shared ({ caller }) func addInstructor(instructor : Instructor) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add instructors");
    };
    instructors.add(instructor.id, instructor);
  };

  // Public access to view instructors
  public query func getInstructors() : async [Instructor] {
    instructors.values().toArray();
  };

  // Learner Management - Users can add their own learners
  public shared ({ caller }) func addLearner(learner : Learner) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add learners");
    };
    // Verify ownership - caller must be the owner
    if (learner.owner != caller) {
      Runtime.trap("Unauthorized: Can only add learners for yourself");
    };
    learners.add(learner.id, learner);
  };

  // Admin can view all learners
  public query ({ caller }) func getLearners() : async [Learner] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all learners");
    };
    learners.values().toArray();
  };

  // Appointment Management - Users can book their own appointments
  public shared ({ caller }) func bookAppointment(appointment : Appointment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book appointments");
    };
    // Verify ownership - caller must be the owner
    if (appointment.owner != caller) {
      Runtime.trap("Unauthorized: Can only book appointments for yourself");
    };
    appointments.add(appointment.id, appointment);
  };

  // Users can view their own appointments, admins can view all
  public query ({ caller }) func getAppointments() : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view appointments");
    };
    // Users can only see their own appointments, admins see all
    if (AccessControl.isAdmin(accessControlState, caller)) {
      appointments.values().toArray();
    } else {
      appointments.values().toArray().filter(func(appointment : Appointment) : Bool { appointment.owner == caller });
    };
  };

  // Sync Metadata Management - Admin only for updates
  public shared ({ caller }) func updateSyncMetadata(id : Text, metadata : SyncMetadata) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update sync metadata");
    };
    syncMetadata.add(id, metadata);
  };

  // Public access to view sync metadata
  public query func getSyncMetadata() : async [SyncMetadata] {
    syncMetadata.values().toArray();
  };

  // Static Page Management - Admin only
  public shared ({ caller }) func addStaticPage(id : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add static pages");
    };
    staticPages.add(id, content);
  };

  public shared ({ caller }) func updateStaticPage(id : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update static pages");
    };
    staticPages.add(id, content);
  };

  public shared ({ caller }) func deleteStaticPage(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete static pages");
    };
    staticPages.remove(id);
  };

  // Public access to view static pages
  public query func getStaticPages() : async [(Text, Text)] {
    staticPages.entries().toArray();
  };

  // Public search functions
  public query func searchResourcesByHashtag(hashtag : Text) : async [Resource] {
    let allResources = resources.values().toArray();
    allResources.filter(func(resource : Resource) : Bool { 
      switch (resource.hashtags.find(func(tag : Text) : Bool { tag == hashtag })) { 
        case (null) { false }; 
        case (_tag) { true } 
      } 
    });
  };

  public query func searchInstructorsByHashtag(hashtag : Text) : async [Instructor] {
    instructors.values().toArray().filter(func(instructor : Instructor) : Bool { 
      switch (instructor.hashtags.find(func(tag : Text) : Bool { tag == hashtag })) { 
        case (null) { false }; 
        case (_tag) { true } 
      } 
    });
  };

  // HTTP outcall transform function - public query
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Contact sync - Admin only
  public shared ({ caller }) func syncContactPage() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can sync external content");
    };
    await OutCall.httpGetRequest("https://networth-htm.caffeine.xyz/contact", [], transform);
  };

  // Public query functions for viewing data
  public query func getResourceMatrixByCategory(category : Text) : async [Resource] {
    resources.values().toArray().filter(func(resource : Resource) : Bool { resource.category == category });
  };

  public query func getInstructorAvailability(instructorId : Text) : async ?[Text] {
    switch (instructors.get(instructorId)) {
      case (?instructor) { ?instructor.availability };
      case null { null };
    };
  };

  // Users can view their own progress, admins can view all
  public query ({ caller }) func getLearnerProgress(learnerId : Text) : async ?[Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view learner progress");
    };
    switch (learners.get(learnerId)) {
      case (?learner) {
        // Users can only view their own progress, admins can view all
        if (learner.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?learner.progress;
        } else {
          Runtime.trap("Unauthorized: Can only view your own progress");
        };
      };
      case null { null };
    };
  };

  // Public access to individual resources
  public query func getResourceById(resourceId : Text) : async ?Resource {
    resources.get(resourceId);
  };

  public query func getInstructorById(instructorId : Text) : async ?Instructor {
    instructors.get(instructorId);
  };

  // Users can view their own learner data, admins can view all
  public query ({ caller }) func getLearnerById(learnerId : Text) : async ?Learner {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view learners");
    };
    switch (learners.get(learnerId)) {
      case (?learner) {
        // Users can only view their own learner data, admins can view all
        if (learner.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?learner;
        } else {
          Runtime.trap("Unauthorized: Can only view your own learner data");
        };
      };
      case null { null };
    };
  };

  // Users can view their own appointments, admins can view all
  public query ({ caller }) func getAppointmentById(appointmentId : Text) : async ?Appointment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view appointments");
    };
    switch (appointments.get(appointmentId)) {
      case (?appointment) {
        // Users can only view their own appointments, admins can view all
        if (appointment.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?appointment;
        } else {
          Runtime.trap("Unauthorized: Can only view your own appointments");
        };
      };
      case null { null };
    };
  };

  // Public access to static pages
  public query func getStaticPageById(pageId : Text) : async ?Text {
    staticPages.get(pageId);
  };

  // Contact Details Management - Admin only for adding
  public shared ({ caller }) func addContactDetails(id : Text, details : ContactDetails) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add contact details");
    };
    contactDetails.add(id, details);
  };

  // Public access to contact details
  public query func getContactDetails() : async [ContactDetails] {
    contactDetails.values().toArray();
  };

  // Sync Log Management - Admin only
  public shared ({ caller }) func addSyncLog(id : Text, log : SyncLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add sync logs");
    };
    syncLogs.add(id, log);
  };

  public query ({ caller }) func getSyncLogs() : async [SyncLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view sync logs");
    };
    syncLogs.values().toArray();
  };

  // Public access to individual contact details
  public query func getContactDetailsById(id : Text) : async ?ContactDetails {
    contactDetails.get(id);
  };

  // Admin only access to individual sync logs
  public query ({ caller }) func getSyncLogById(id : Text) : async ?SyncLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view sync logs");
    };
    syncLogs.get(id);
  };

  // Navigation Management - Admin only for modifications
  public shared ({ caller }) func addNavigationItem(item : NavigationItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add navigation items");
    };
    navigationItems.add(item.id, item);
  };

  public shared ({ caller }) func updateNavigationItem(item : NavigationItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update navigation items");
    };
    navigationItems.add(item.id, item);
  };

  public shared ({ caller }) func deleteNavigationItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete navigation items");
    };
    navigationItems.remove(id);
  };

  // Public access to navigation items
  public query func getNavigationItems() : async [NavigationItem] {
    navigationItems.values().toArray();
  };

  // Theme Management - Admin only for adding themes
  public shared ({ caller }) func addTheme(theme : Theme) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add themes");
    };
    themes.add(theme.id, theme);
  };

  // Public access to themes
  public query func getThemes() : async [Theme] {
    themes.values().toArray();
  };

  public query func getThemeById(themeId : Text) : async ?Theme {
    themes.get(themeId);
  };

  // Theme preference update - accessible to all (authenticated users store in profile, guests use localStorage)
  public shared ({ caller }) func updateCallerThemePreference(themeId : Text) : async () {
    // Only update profile if user is authenticated (not a guest)
    if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      switch (userProfiles.get(caller)) {
        case (?profile) {
          let updatedProfile = { profile with themePreference = themeId };
          userProfiles.add(caller, updatedProfile);
        };
        case null {
          Runtime.trap("User profile not found");
        };
      };
    };
    // For guests, this function succeeds but doesn't store anything
    // Frontend will handle guest theme preference via localStorage
  };

  // Feature Validation Management
  public shared ({ caller }) func updateFeatureValidation(validation : FeatureValidation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update feature validations");
    };
    featureValidations.add(validation.featureName, validation);
  };

  // Public access to feature validations
  public query func getFeatureValidations() : async [FeatureValidation] {
    featureValidations.values().toArray();
  };

  // Page Modification Logging - Admin only
  public shared ({ caller }) func addPageModification(modification : PageModification) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add page modifications");
    };
    pageModifications.add(modification.id, modification);
  };

  public query ({ caller }) func getPageModifications() : async [PageModification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view page modifications");
    };
    pageModifications.values().toArray();
  };
};
