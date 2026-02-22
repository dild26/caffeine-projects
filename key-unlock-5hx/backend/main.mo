import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import List "mo:base/List";
import Time "mo:base/Time";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Text "mo:base/Text";
import Array "mo:base/Array";
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
    // Admin-only check happens inside assignRole
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    subscribed : Bool;
    merkleRoot : ?Text;
    nonce : ?Nat;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

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

  public type Theme = {
    #light;
    #dark;
    #vibgyor;
  };

  var currentTheme : Theme = #light;

  // Theme toggle is public - accessible to all users including guests per specification
  public shared func toggleTheme() : async Theme {
    currentTheme := switch (currentTheme) {
      case (#light) #dark;
      case (#dark) #vibgyor;
      case (#vibgyor) #light;
    };
    currentTheme;
  };

  public query func getCurrentTheme() : async Theme {
    currentTheme;
  };

  public type NavItem = {
    title : Text;
    path : Text;
    adminOnly : Bool;
    restricted : Bool;
  };

  var navItems : List.List<NavItem> = List.fromArray([
    { title = "Home"; path = "/"; adminOnly = false; restricted = false },
    { title = "Dashboard"; path = "/dashboard"; adminOnly = true; restricted = true },
    { title = "Features"; path = "/features"; adminOnly = true; restricted = true },
    { title = "Blog"; path = "/blog"; adminOnly = false; restricted = false },
    { title = "About Us"; path = "/about"; adminOnly = false; restricted = false },
    { title = "Pros of SECoin"; path = "/pros"; adminOnly = false; restricted = false },
    { title = "What We Do"; path = "/what-we-do"; adminOnly = false; restricted = false },
    { title = "Why Us"; path = "/why-us"; adminOnly = false; restricted = false },
    { title = "Contact Us"; path = "/contact"; adminOnly = false; restricted = false },
    { title = "FAQ"; path = "/faq"; adminOnly = false; restricted = false },
    { title = "Terms & Conditions"; path = "/terms"; adminOnly = false; restricted = false },
    { title = "Referral"; path = "/referral"; adminOnly = false; restricted = true },
    { title = "Proof of Trust"; path = "/proof-of-trust"; adminOnly = false; restricted = true },
    { title = "Sitemap"; path = "/sitemap"; adminOnly = false; restricted = false },
    { title = "Secure"; path = "/secure"; adminOnly = false; restricted = false },
    { title = "Private"; path = "/private"; adminOnly = false; restricted = false },
    { title = "Decentralised"; path = "/decentralised"; adminOnly = false; restricted = false },
    { title = "Universal"; path = "/universal"; adminOnly = false; restricted = false },
    { title = "Profile"; path = "/profile"; adminOnly = false; restricted = false },
    { title = "Identity"; path = "/identity"; adminOnly = false; restricted = false },
    { title = "Authenticated"; path = "/authenticated"; adminOnly = false; restricted = false },
    { title = "Blockchain-based"; path = "/blockchain-based"; adminOnly = false; restricted = false },
    { title = "Cryptographic Security"; path = "/cryptographic-security"; adminOnly = false; restricted = false },
    { title = "Multi-device Support"; path = "/multi-device-support"; adminOnly = false; restricted = false },
    { title = "Protected Identity"; path = "/protected-identity"; adminOnly = false; restricted = false },
    { title = "Test Input"; path = "/test-input"; adminOnly = false; restricted = false },
    { title = "Integration Guide"; path = "/integration-guide"; adminOnly = false; restricted = false },
  ]);

  public query ({ caller }) func getNavItems() : async [NavItem] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filteredItems = List.filter<NavItem>(
      navItems,
      func(item) { not item.adminOnly or isAdmin },
    );
    List.toArray(filteredItems);
  };

  // Separate function for public nav items (used for public navigation menus)
  public query func getPublicNavItems() : async [NavItem] {
    let filteredItems = List.filter<NavItem>(
      navItems,
      func(item) { not item.adminOnly and not item.restricted },
    );
    List.toArray(filteredItems);
  };

  // Public function to check if a path is restricted (used for route protection in frontend)
  public query func isPathRestricted(path : Text) : async Bool {
    switch (List.find<NavItem>(navItems, func(item) { item.path == path })) {
      case (null) false;
      case (?item) item.restricted;
    };
  };

  public type ContactInfo = {
    ceoName : Text;
    ceoTitle : Text;
    email : Text;
    phone : Text;
    whatsapp : Text;
    address : Text;
    mapLink : Text;
    googleMapLink : Text;
    paymentMethods : {
      paypal : Text;
      upi : Text;
      eth : Text;
    };
    socialLinks : {
      facebook : Text;
      linkedin : Text;
      telegram : Text;
      discord : Text;
      blogspot : Text;
      instagram : Text;
      twitter : Text;
      youtube : Text;
    };
  };

  var contactInfo : ContactInfo = {
    ceoName = "DILEEP KUMAR D";
    ceoTitle = "CEO & Founder of SECOINFI";
    email = "dild26@gmail.com";
    phone = "+91-962-005-8644";
    whatsapp = "+91-962-005-8644";
    address = "Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097";
    mapLink = "https://www.openstreetmap.org/way/1417238145";
    googleMapLink = "https://www.google.com/maps/place/Sudha+Enterprises/@13.0818168,77.5425331,228m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bae229442d2afb9:0x1ef57e487d50ee1f!8m2!3d13.0818168!4d77.5425331!16s%2Fg%2F1v6p798y?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D";
    paymentMethods = {
      paypal = "newgoldenjewel@gmail.com";
      upi = "secoin@uboi";
      eth = "0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7";
    };
    socialLinks = {
      facebook = "https://facebook.com/dild26";
      linkedin = "https://www.linkedin.com/in/dild26";
      telegram = "https://t.me/dilee";
      discord = "https://discord.com/users/dild26";
      blogspot = "https://dildiva.blogspot.com/";
      instagram = "https://www.instagram.com/newgoldenjewel";
      twitter = "https://x.com/dil_sec";
      youtube = "https://www.youtube.com/@dileepkumard4484";
    };
  };

  // Contact info is public - accessible to all users including guests
  public query func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  public type Feature = {
    id : Nat;
    title : Text;
    description : Text;
    aiCompleted : Bool;
    adminAffirmed : Bool;
    instructions : Text;
    action : ?Text;
    timestamp : Int;
  };

  var features : List.List<Feature> = List.fromArray([
    {
      id = 1;
      title = "Authentication Flow";
      description = "Handle OAuth callbacks for multiple subdomains with secure token exchange and cookie management.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement PKCE validation and secure cookie handling for each subdomain.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 2;
      title = "User Interface";
      description = "Create a comprehensive navigation system with global theme switching and detailed contact information.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Ensure reliable theme toggle and persistent navigation elements across all pages.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 3;
      title = "Enhanced Features Page System";
      description = "Implement dual-checkbox system with real-time diff fixture and action assignment for feature management.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Create a features page with admin validation and AI completion checkboxes, real-time diff tracking, and color-coded action tags.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 4;
      title = "Test Input System";
      description = "Develop a chat-like interface for secure data submission with comprehensive input validation and feedback.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement real-time input sanitization and validation feedback for test submissions.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 5;
      title = "Key-Unlock App Subscription System";
      description = "Manage subscriptions with Merkle root tracking and nonce inclusion for security.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement subscription prompts and status management using Merkle root verification.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 6;
      title = "Token Management";
      description = "Create shared helper utilities for token exchange and secure cookie setting across subdomains.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement session-based PKCE verifier storage and secure cookie configuration.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 7;
      title = "Configuration Management";
      description = "Generate environment templates and manage configuration mappings for subdomain routing.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement environment validation and configuration parsing for each app.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 8;
      title = "Deployment System";
      description = "Automate deployment with environment validation, configuration conversion, and health panel integration.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Create deploy scripts and manifest summary posting for health status reporting.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 9;
      title = "Security Policies";
      description = "Enforce CORS and CSP policies restricted to approved domains and prevent cross-site cookie access.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement strict security policies for content and cookie management.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 10;
      title = "Backend Data Storage";
      description = "Store PKCE verifiers, session data, configuration mappings, and user preferences securely.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement secure storage and retrieval of authentication and configuration data.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 11;
      title = "Backend Operations";
      description = "Process OAuth callbacks, token exchanges, and manage global theme preferences with error handling.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement reliable backend operations for authentication and theme management.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 12;
      title = "OAuth Callback Handling";
      description = "Process OAuth authorization codes and exchange them for tokens at a central auth server.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement secure token exchange and session management for each subdomain.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 13;
      title = "PKCE Verifier Storage";
      description = "Store and validate PKCE verifiers per session for secure authentication flow.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement session-based storage and validation of PKCE verifiers.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 14;
      title = "Secure Cookie Management";
      description = "Set secure cookies with HttpOnly and SameSite=strict attributes scoped to subdomains.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement secure cookie handling for authentication and session management.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 15;
      title = "Global Theme State Management";
      description = "Manage global theme preferences and synchronize state across all application components.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement reliable theme state management and persistence.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 16;
      title = "Navigation Menu System";
      description = "Create a comprehensive navigation menu with search functionality and access control.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement searchable navigation menu with admin-only and public pages.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 17;
      title = "Contact Information Management";
      description = "Store and display genuine SECOINFI contact information with structured formatting.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement contact information retrieval and display with correct formatting.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 18;
      title = "Pros Page System";
      description = "Display Key-Unlock App advantages in a zig-zag card layout with individual pro pages.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement pros page and individual pro pages with related data.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 19;
      title = "Subscription Tracking";
      description = "Track subscriptions using Merkle root for each Principal ID with nonce inclusion.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement subscription status management and verification.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 20;
      title = "Configuration Mapping";
      description = "Manage configuration mappings for subdomain routing and environment validation.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement configuration management for each app and subdomain.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 21;
      title = "Deployment Automation";
      description = "Automate deployment with environment validation, configuration conversion, and health panel integration.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Create deploy scripts and manifest summary posting for health status reporting.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 22;
      title = "Security Policy Enforcement";
      description = "Enforce CORS and CSP policies restricted to approved domains and prevent cross-site cookie access.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement strict security policies for content and cookie management.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 23;
      title = "Session Data Management";
      description = "Store and manage session data for authentication flow tracking and configuration mappings.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement secure session data storage and retrieval.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 24;
      title = "Theme Preference Synchronization";
      description = "Synchronize theme preferences across sessions and browser navigation with error handling.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement reliable theme preference management and synchronization.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 25;
      title = "Merkle-root Verification";
      description = "Integrate Merkle-root verification for all feature completions and admin validations.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement Merkle-root verification for feature management and validation.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 26;
      title = "Manifest Record Management";
      description = "Manage manifest records for all feature-related activities, validations, and action assignments.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement manifest record management and tracking.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 27;
      title = "Live State Synchronization";
      description = "Synchronize live state changes for real-time diff fixture updates and UI synchronization.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement live state synchronization for real-time updates.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 28;
      title = "Input Sanitization and Validation";
      description = "Sanitize and validate input submissions with comprehensive error tracking and feedback.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement input sanitization and validation for test submissions.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 29;
      title = "Security Pattern Matching";
      description = "Match and filter security patterns for unsafe characters and code injection attempts.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement security pattern matching and filtering for input validation.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 30;
      title = "Validation Rule Management";
      description = "Manage validation rules and patterns for input filtering and error reporting.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Implement validation rule management and error reporting.";
      action = null;
      timestamp = Time.now();
    },
    {
      id = 31;
      title = "Integration Documentation System";
      description = "Generate integration instructions and code snippets for connecting SECOINFI apps to the Key-Unlock Auth system.";
      aiCompleted = false;
      adminAffirmed = false;
      instructions = "Create callback route templates, environment variable templates, and step-by-step integration guides for each app.";
      action = null;
      timestamp = Time.now();
    },
  ]);

  // Features list is admin-only (Features page is admin-only per specification)
  public query ({ caller }) func getFeatures() : async [Feature] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view features");
    };
    List.toArray(features);
  };

  // Admin-only: Mark feature as AI completed
  public shared ({ caller }) func markFeatureAICompleted(featureId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can mark features as completed");
    };
    features := List.map<Feature, Feature>(
      features,
      func(feature) {
        if (feature.id == featureId) {
          { feature with aiCompleted = true };
        } else {
          feature;
        };
      },
    );
  };

  // Admin-only: Affirm or reject feature
  public shared ({ caller }) func affirmFeatureAdmin(featureId : Nat, isAffirmed : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can affirm features");
    };
    features := List.map<Feature, Feature>(
      features,
      func(feature) {
        if (feature.id == featureId) {
          { feature with adminAffirmed = isAffirmed };
        } else {
          feature;
        };
      },
    );
  };

  // Admin-only: Assign action to feature
  public shared ({ caller }) func assignFeatureAction(featureId : Nat, action : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can assign actions");
    };
    features := List.map<Feature, Feature>(
      features,
      func(feature) {
        if (feature.id == featureId) {
          { feature with action = ?action };
        } else {
          feature;
        };
      },
    );
  };

  // Admin-only: Get pending tasks
  public query ({ caller }) func getPendingTasks() : async [Feature] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view pending tasks");
    };
    let pending = List.filter<Feature>(
      features,
      func(feature) { feature.aiCompleted != feature.adminAffirmed },
    );
    List.toArray(pending);
  };

  public type Pro = {
    id : Nat;
    title : Text;
    description : Text;
    link : Text;
    relatedPros : [Nat];
  };

  var pros : List.List<Pro> = List.fromArray([
    {
      id = 1;
      title = "Secure";
      description = "Advanced security features to protect your data and identity.";
      link = "/secure";
      relatedPros = [2, 3, 5];
    },
    {
      id = 2;
      title = "Private";
      description = "Your information remains confidential and protected.";
      link = "/private";
      relatedPros = [1, 3, 4];
    },
    {
      id = 3;
      title = "Decentralised";
      description = "No single point of failure, ensuring reliability and security.";
      link = "/decentralised";
      relatedPros = [1, 2, 5];
    },
    {
      id = 4;
      title = "Universal";
      description = "Works across multiple devices and platforms seamlessly.";
      link = "/universal";
      relatedPros = [2, 6, 7];
    },
    {
      id = 5;
      title = "Profile";
      description = "Manage your profile securely and efficiently.";
      link = "/profile";
      relatedPros = [1, 3, 6];
    },
    {
      id = 6;
      title = "Identity";
      description = "Protect and manage your digital identity with ease.";
      link = "/identity";
      relatedPros = [4, 5, 7];
    },
    {
      id = 7;
      title = "Authenticated";
      description = "Ensure secure and verified access to your accounts.";
      link = "/authenticated";
      relatedPros = [4, 6, 8];
    },
    {
      id = 8;
      title = "Blockchain-based";
      description = "Leverage blockchain technology for enhanced security.";
      link = "/blockchain-based";
      relatedPros = [7, 9, 10];
    },
    {
      id = 9;
      title = "Cryptographic Security";
      description = "Utilize advanced cryptographic methods for data protection.";
      link = "/cryptographic-security";
      relatedPros = [8, 10, 1];
    },
    {
      id = 10;
      title = "Multi-device Support";
      description = "Access your data securely from any device.";
      link = "/multi-device-support";
      relatedPros = [8, 9, 4];
    },
    {
      id = 11;
      title = "Protected Identity";
      description = "Keep your identity safe from unauthorized access.";
      link = "/protected-identity";
      relatedPros = [6, 7, 1];
    },
  ]);

  // Pros are public - accessible to all users including guests
  public query func getPros() : async [Pro] {
    List.toArray(pros);
  };

  public query func getProById(id : Nat) : async ?Pro {
    List.find<Pro>(pros, func(pro) { pro.id == id });
  };

  public query func getRelatedPros(id : Nat) : async [Pro] {
    switch (List.find<Pro>(pros, func(pro) { pro.id == id })) {
      case (null) [];
      case (?pro) {
        let related = List.filter<Pro>(
          pros,
          func(p) {
            List.some<Nat>(List.fromArray(pro.relatedPros), func(rid) { rid == p.id });
          },
        );
        List.toArray(related);
      };
    };
  };

  // Subscription management - users can subscribe themselves
  public shared ({ caller }) func subscribeToKeyUnlock(merkleRoot : Text, nonce : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can subscribe");
    };

    switch (principalMap.get(userProfiles, caller)) {
      case (null) {
        Debug.trap("User profile not found. Please create a profile first.");
      };
      case (?profile) {
        let updatedProfile = {
          name = profile.name;
          subscribed = true;
          merkleRoot = ?merkleRoot;
          nonce = ?nonce;
        };
        userProfiles := principalMap.put(userProfiles, caller, updatedProfile);
      };
    };
  };

  // Check subscription status - users can check their own, admins can check any
  public query ({ caller }) func getSubscriptionStatus(user : Principal) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only check your own subscription status");
    };

    switch (principalMap.get(userProfiles, user)) {
      case (null) false;
      case (?profile) profile.subscribed;
    };
  };

  // Test Input System
  public type TestInput = {
    id : Nat;
    content : Text;
    timestamp : Int;
    isValid : Bool;
    validationMessage : Text;
  };

  var testInputs : List.List<TestInput> = List.nil<TestInput>();
  var nextTestInputId : Nat = 1;

  // Validation patterns for unsafe characters and code injection
  let unsafePatterns : [Text] = [
    "<", ">", "`", "${", "}", ";", "|", "&&", "||", "script", "eval", "function", "alert", "onerror", "onload"
  ];

  // Validate input content
  func validateInput(content : Text) : (Bool, Text) {
    var foundPatterns = List.nil<Text>();

    for (pattern in unsafePatterns.vals()) {
      if (Text.contains(content, #text pattern)) {
        foundPatterns := List.push(pattern, foundPatterns);
      };
    };

    if (List.isNil(foundPatterns)) {
      (true, "Input is valid");
    } else {
      let patternsArray = List.toArray(foundPatterns);
      let patternsText = Text.join(", ", patternsArray.vals());
      (false, "Input contains restricted characters or patterns: " # patternsText);
    };
  };

  // Submit test input - now public, no authentication required
  public shared func submitTestInput(content : Text) : async TestInput {
    let (isValid, validationMessage) = validateInput(content);

    let testInput : TestInput = {
      id = nextTestInputId;
      content;
      timestamp = Time.now();
      isValid;
      validationMessage;
    };

    testInputs := List.push(testInput, testInputs);
    nextTestInputId += 1;

    testInput;
  };

  // Get all test inputs - now public
  public query func getTestInputs() : async [TestInput] {
    List.toArray(testInputs);
  };

  // Get test input by ID - now public
  public query func getTestInputById(id : Nat) : async ?TestInput {
    List.find<TestInput>(testInputs, func(input) { input.id == id });
  };

  // Get validation rules - public information
  public query func getValidationRules() : async [Text] {
    unsafePatterns;
  };

  // Get real-time diff fixture - admin-only
  public query ({ caller }) func getDiffFixture() : async [Feature] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view diff fixture");
    };
    let diff = List.filter<Feature>(
      features,
      func(feature) { feature.aiCompleted != feature.adminAffirmed },
    );
    List.toArray(diff);
  };

  // Get action color mapping - public information
  public type ActionColor = {
    action : Text;
    color : Text;
  };

  public query func getActionColors() : async [ActionColor] {
    [
      { action = "redo"; color = "#F0A" },
      { action = "edit"; color = "#0AF" },
      { action = "update"; color = "#FA0" },
      { action = "modify"; color = "#A0F" },
      { action = "draft"; color = "#0FA" },
      { action = "error"; color = "#F00" },
      { action = "publish"; color = "#0F0" },
      { action = "archive"; color = "#AAA" },
      { action = "delete"; color = "#000" },
    ];
  };

  // Integration Documentation System
  public type IntegrationDoc = {
    appName : Text;
    callbackRoute : Text;
    envVariables : {
      authBase : Text;
      clientId : Text;
      callbackUri : Text;
      cookieDomain : Text;
      sessionSecret : Text;
    };
    integrationSteps : [Text];
    codeSnippets : [Text];
  };

  var integrationDocs : List.List<IntegrationDoc> = List.fromArray([
    {
      appName = "MOAP";
      callbackRoute = "/auth/callback/moap";
      envVariables = {
        authBase = "https://auth.caffeine.xyz";
        clientId = "moap-client-id";
        callbackUri = "https://moap.caffeine.xyz/auth/callback";
        cookieDomain = "moap.caffeine.xyz";
        sessionSecret = "moap-session-secret";
      };
      integrationSteps = [
        "Add login button to your app",
        "Redirect to central auth server",
        "Handle callback route and exchange code for token",
        "Set secure cookie with HttpOnly and SameSite=strict attributes",
        "Redirect to dashboard after successful authentication",
      ];
      codeSnippets = [
        "app.get('/auth/callback/moap', async (req, res) => { /* ... */ });",
        "res.cookie('session', token, { httpOnly: true, sameSite: 'strict', domain: 'moap.caffeine.xyz' });",
      ];
    },
    {
      appName = "Business Management";
      callbackRoute = "/auth/callback/business";
      envVariables = {
        authBase = "https://auth.caffeine.xyz";
        clientId = "business-client-id";
        callbackUri = "https://business.caffeine.xyz/auth/callback";
        cookieDomain = "business.caffeine.xyz";
        sessionSecret = "business-session-secret";
      };
      integrationSteps = [
        "Add login button to your app",
        "Redirect to central auth server",
        "Handle callback route and exchange code for token",
        "Set secure cookie with HttpOnly and SameSite=strict attributes",
        "Redirect to dashboard after successful authentication",
      ];
      codeSnippets = [
        "app.get('/auth/callback/business', async (req, res) => { /* ... */ });",
        "res.cookie('session', token, { httpOnly: true, sameSite: 'strict', domain: 'business.caffeine.xyz' });",
      ];
    },
    {
      appName = "IPFS";
      callbackRoute = "/auth/callback/ipfs";
      envVariables = {
        authBase = "https://auth.caffeine.xyz";
        clientId = "ipfs-client-id";
        callbackUri = "https://ipfs.caffeine.xyz/auth/callback";
        cookieDomain = "ipfs.caffeine.xyz";
        sessionSecret = "ipfs-session-secret";
      };
      integrationSteps = [
        "Add login button to your app",
        "Redirect to central auth server",
        "Handle callback route and exchange code for token",
        "Set secure cookie with HttpOnly and SameSite=strict attributes",
        "Redirect to dashboard after successful authentication",
      ];
      codeSnippets = [
        "app.get('/auth/callback/ipfs', async (req, res) => { /* ... */ });",
        "res.cookie('session', token, { httpOnly: true, sameSite: 'strict', domain: 'ipfs.caffeine.xyz' });",
      ];
    },
  ]);

  // Integration docs are public - accessible to all users including guests
  public query func getIntegrationDocs() : async [IntegrationDoc] {
    List.toArray(integrationDocs);
  };

  public query func getIntegrationDocByApp(appName : Text) : async ?IntegrationDoc {
    List.find<IntegrationDoc>(integrationDocs, func(doc) { doc.appName == appName });
  };

  // File Presence Checker System
  public type FileCheckResult = {
    fileName : Text;
    isPresent : Bool;
  };

  public type FileCheckStatus = {
    expectedFiles : [FileCheckResult];
    missingFiles : [Text];
    lastChecked : Int;
    isComplete : Bool;
  };

  var fileCheckStatus : FileCheckStatus = {
    expectedFiles = [
      { fileName = "server.js"; isPresent = false },
      { fileName = "manifest.yaml"; isPresent = false },
      { fileName = "routes/ia-niqaw-947.node.js"; isPresent = false },
      { fileName = "routes/ipfs-lrm.node.js"; isPresent = false },
      { fileName = "routes/networth-htm.node.js"; isPresent = false },
      { fileName = "routes/geo-map-w9s.node.js"; isPresent = false },
      { fileName = "routes/e-contract-lwf.node.js"; isPresent = false },
      { fileName = "routes/secoin-ep6.node.js"; isPresent = false },
      { fileName = "routes/n8n-tasks-c2i.node.js"; isPresent = false },
      { fileName = "routes/n8n-workflows-6sy.node.js"; isPresent = false },
      { fileName = "routes/e-contracts-bqe.node.js"; isPresent = false },
      { fileName = "routes/infytask-mia.node.js"; isPresent = false },
      { fileName = "routes/sitemaps-fwh.node.js"; isPresent = false },
      { fileName = "routes/key-unlock-5hx.node.js"; isPresent = false },
      { fileName = "routes/xcaller-0aw.node.js"; isPresent = false },
      { fileName = "routes/forms-sxn.node.js"; isPresent = false },
      { fileName = "routes/terror-uproot-97d.node.js"; isPresent = false },
      { fileName = "utils/compliance.js"; isPresent = false },
      { fileName = "logs/manifest-audit.log"; isPresent = false },
    ];
    missingFiles = [
      "server.js",
      "manifest.yaml",
      "routes/ia-niqaw-947.node.js",
      "routes/ipfs-lrm.node.js",
      "routes/networth-htm.node.js",
      "routes/geo-map-w9s.node.js",
      "routes/e-contract-lwf.node.js",
      "routes/secoin-ep6.node.js",
      "routes/n8n-tasks-c2i.node.js",
      "routes/n8n-workflows-6sy.node.js",
      "routes/e-contracts-bqe.node.js",
      "routes/infytask-mia.node.js",
      "routes/sitemaps-fwh.node.js",
      "routes/key-unlock-5hx.node.js",
      "routes/xcaller-0aw.node.js",
      "routes/forms-sxn.node.js",
      "routes/terror-uproot-97d.node.js",
      "utils/compliance.js",
      "logs/manifest-audit.log",
    ];
    lastChecked = Time.now();
    isComplete = false;
  };

  // Admin-only: Get file check status
  public query ({ caller }) func getFileCheckStatus() : async FileCheckStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view file check status");
    };
    fileCheckStatus;
  };

  // Admin-only: Update file presence
  public shared ({ caller }) func updateFilePresence(fileName : Text, isPresent : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update file presence");
    };

    let updatedFiles = List.map<FileCheckResult, FileCheckResult>(
      List.fromArray(fileCheckStatus.expectedFiles),
      func(file) {
        if (file.fileName == fileName) {
          { file with isPresent };
        } else {
          file;
        };
      },
    );

    let missingFiles = List.toArray(
      List.mapFilter<FileCheckResult, Text>(
        updatedFiles,
        func(file) {
          if (not file.isPresent) { ?file.fileName } else { null };
        },
      )
    );

    fileCheckStatus := {
      expectedFiles = List.toArray(updatedFiles);
      missingFiles;
      lastChecked = Time.now();
      isComplete = missingFiles.size() == 0;
    };
  };

  // Admin-only: Reset file check status
  public shared ({ caller }) func resetFileCheckStatus() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can reset file check status");
    };

    fileCheckStatus := {
      expectedFiles = [
        { fileName = "server.js"; isPresent = false },
        { fileName = "manifest.yaml"; isPresent = false },
        { fileName = "routes/ia-niqaw-947.node.js"; isPresent = false },
        { fileName = "routes/ipfs-lrm.node.js"; isPresent = false },
        { fileName = "routes/networth-htm.node.js"; isPresent = false },
        { fileName = "routes/geo-map-w9s.node.js"; isPresent = false },
        { fileName = "routes/e-contract-lwf.node.js"; isPresent = false },
        { fileName = "routes/secoin-ep6.node.js"; isPresent = false },
        { fileName = "routes/n8n-tasks-c2i.node.js"; isPresent = false },
        { fileName = "routes/n8n-workflows-6sy.node.js"; isPresent = false },
        { fileName = "routes/e-contracts-bqe.node.js"; isPresent = false },
        { fileName = "routes/infytask-mia.node.js"; isPresent = false },
        { fileName = "routes/sitemaps-fwh.node.js"; isPresent = false },
        { fileName = "routes/key-unlock-5hx.node.js"; isPresent = false },
        { fileName = "routes/xcaller-0aw.node.js"; isPresent = false },
        { fileName = "routes/forms-sxn.node.js"; isPresent = false },
        { fileName = "routes/terror-uproot-97d.node.js"; isPresent = false },
        { fileName = "utils/compliance.js"; isPresent = false },
        { fileName = "logs/manifest-audit.log"; isPresent = false },
      ];
      missingFiles = [
        "server.js",
        "manifest.yaml",
        "routes/ia-niqaw-947.node.js",
        "routes/ipfs-lrm.node.js",
        "routes/networth-htm.node.js",
        "routes/geo-map-w9s.node.js",
        "routes/e-contract-lwf.node.js",
        "routes/secoin-ep6.node.js",
        "routes/n8n-tasks-c2i.node.js",
        "routes/n8n-workflows-6sy.node.js",
        "routes/e-contracts-bqe.node.js",
        "routes/infytask-mia.node.js",
        "routes/sitemaps-fwh.node.js",
        "routes/key-unlock-5hx.node.js",
        "routes/xcaller-0aw.node.js",
        "routes/forms-sxn.node.js",
        "routes/terror-uproot-97d.node.js",
        "utils/compliance.js",
        "logs/manifest-audit.log",
      ];
      lastChecked = Time.now();
      isComplete = false;
    };
  };

  // Admin-only: Get missing files
  public query ({ caller }) func getMissingFiles() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view missing files");
    };
    fileCheckStatus.missingFiles;
  };

  // Admin-only: Check if all files are present
  public query ({ caller }) func isFileCheckComplete() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can check file status");
    };
    fileCheckStatus.isComplete;
  };

  // Multi-File Upload System
  public type FileUpload = {
    id : Nat;
    fileName : Text;
    fileType : Text;
    fileSize : Nat;
    uploadStatus : Text;
    hashEdges : Text;
    timestamp : Int;
  };

  var fileUploads : List.List<FileUpload> = List.nil<FileUpload>();
  var nextFileUploadId : Nat = 1;

  // Validate file type
  func isValidFileType(fileType : Text) : Bool {
    fileType == ".js" or fileType == ".md" or fileType == ".yaml" or fileType == ".zip";
  };

  // Admin-only: Upload file metadata
  public shared ({ caller }) func uploadFileMetadata(fileName : Text, fileType : Text, fileSize : Nat, hashEdges : Text) : async FileUpload {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can upload files");
    };

    if (not isValidFileType(fileType)) {
      Debug.trap("Invalid file type. Only .js, .md, .yaml, and .zip files are allowed.");
    };

    let fileUpload : FileUpload = {
      id = nextFileUploadId;
      fileName;
      fileType;
      fileSize;
      uploadStatus = "uploaded";
      hashEdges;
      timestamp = Time.now();
    };

    fileUploads := List.push(fileUpload, fileUploads);
    nextFileUploadId += 1;

    fileUpload;
  };

  // Admin-only: Get all file uploads
  public query ({ caller }) func getFileUploads() : async [FileUpload] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view file uploads");
    };
    List.toArray(fileUploads);
  };

  // Admin-only: Get file upload by ID
  public query ({ caller }) func getFileUploadById(id : Nat) : async ?FileUpload {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view file uploads");
    };
    List.find<FileUpload>(fileUploads, func(upload) { upload.id == id });
  };

  // Admin-only: Update file upload status
  public shared ({ caller }) func updateFileUploadStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update file upload status");
    };

    fileUploads := List.map<FileUpload, FileUpload>(
      fileUploads,
      func(upload) {
        if (upload.id == id) {
          { upload with uploadStatus = status };
        } else {
          upload;
        };
      },
    );
  };

  // Auth Optimization Panel
  public type AuthMetric = {
    id : Nat;
    metricName : Text;
    value : Nat;
    timestamp : Int;
  };

  var authMetrics : List.List<AuthMetric> = List.nil<AuthMetric>();
  var nextAuthMetricId : Nat = 1;

  // Admin-only: Add auth metric
  public shared ({ caller }) func addAuthMetric(metricName : Text, value : Nat) : async AuthMetric {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add auth metrics");
    };

    let authMetric : AuthMetric = {
      id = nextAuthMetricId;
      metricName;
      value;
      timestamp = Time.now();
    };

    authMetrics := List.push(authMetric, authMetrics);
    nextAuthMetricId += 1;

    authMetric;
  };

  // Admin-only: Get all auth metrics
  public query ({ caller }) func getAuthMetrics() : async [AuthMetric] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view auth metrics");
    };
    List.toArray(authMetrics);
  };

  // Admin-only: Get auth metric by ID
  public query ({ caller }) func getAuthMetricById(id : Nat) : async ?AuthMetric {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view auth metrics");
    };
    List.find<AuthMetric>(authMetrics, func(metric) { metric.id == id });
  };

  // Admin-only: Update auth metric value
  public shared ({ caller }) func updateAuthMetricValue(id : Nat, value : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update auth metrics");
    };

    authMetrics := List.map<AuthMetric, AuthMetric>(
      authMetrics,
      func(metric) {
        if (metric.id == id) {
          { metric with value };
        } else {
          metric;
        };
      },
    );
  };

  // Route Status Polling
  public type RouteStatus = {
    id : Nat;
    routeName : Text;
    status : Text;
    lastChecked : Int;
  };

  var routeStatuses : List.List<RouteStatus> = List.nil<RouteStatus>();
  var nextRouteStatusId : Nat = 1;

  // Admin-only: Update route status
  public shared ({ caller }) func updateRouteStatus(routeName : Text, status : Text) : async RouteStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update route status");
    };

    let routeStatus : RouteStatus = {
      id = nextRouteStatusId;
      routeName;
      status;
      lastChecked = Time.now();
    };

    routeStatuses := List.push(routeStatus, routeStatuses);
    nextRouteStatusId += 1;

    routeStatus;
  };

  // Admin-only: Get all route statuses
  public query ({ caller }) func getRouteStatuses() : async [RouteStatus] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view route statuses");
    };
    List.toArray(routeStatuses);
  };

  // Admin-only: Get route status by ID
  public query ({ caller }) func getRouteStatusById(id : Nat) : async ?RouteStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view route statuses");
    };
    List.find<RouteStatus>(routeStatuses, func(status) { status.id == id });
  };

  // Admin-only: Update route status value
  public shared ({ caller }) func updateRouteStatusValue(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update route statuses");
    };

    routeStatuses := List.map<RouteStatus, RouteStatus>(
      routeStatuses,
      func(route) {
        if (route.id == id) {
          { route with status };
        } else {
          route;
        };
      },
    );
  };

  // HTTP Outcalls for Route Status
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func makeGetOutcall(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };

  // Admin-only: Check route status via HTTP outcall
  public shared ({ caller }) func checkRouteStatus(url : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can check route status");
    };
    await makeGetOutcall(url);
  };

  // Blob Storage Integration
  let storage = Storage.new();
  include MixinStorage(storage);

  // Additive Sitemap Extension
  var manualPages : List.List<Text> = List.fromArray([
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
  ]);

  var autoPages : [Text] = [
    "home",
    "dashboard",
    "features",
    "profile",
    "settings",
    "help",
  ];

  public query func getSitemapPages() : async [Text] {
    let manualArray = List.toArray(manualPages);
    Array.append(autoPages, manualArray);
  };

  public shared ({ caller }) func addManualPage(page : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add manual pages");
    };

    if (Text.contains(page, #char ' ')) {
      Debug.trap("Page name cannot contain spaces");
    };

    if (Text.less(page, Text.toLowercase(page))) {
      Debug.trap("Page name must be lowercase");
    };

    if (Array.find<Text>(autoPages, func(p) { p == page }) != null) {
      Debug.trap("Cannot overwrite auto-generated sitemap nodes");
    };

    if (List.find<Text>(manualPages, func(p) { p == page }) != null) {
      Debug.trap("Page already exists in manual pages");
    };

    manualPages := List.push(page, manualPages);
  };

  public shared ({ caller }) func removeManualPage(page : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove manual pages");
    };

    manualPages := List.filter<Text>(
      manualPages,
      func(p) { p != page },
    );
  };

  public query func getControlledRoutes() : async [(Text, Text)] {
    [
      ("broadcast", "Secoinfi-App"),
      ("remote", "Secoinfi-App"),
      ("live", "Secoinfi-App"),
    ];
  };

  public query func isRouteControlled(route : Text) : async Bool {
    switch (route) {
      case ("broadcast") true;
      case ("remote") true;
      case ("live") true;
      case (_) false;
    };
  };
};
