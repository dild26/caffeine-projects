import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import List "mo:base/List";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Float "mo:base/Float";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Char "mo:base/Char";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Genesis admin principal - stable for persistence across upgrades
  stable var genesisAdmin : ?Principal = null;

  // Initialize auth (first caller becomes Genesis admin with permanent privileges)
  public shared ({ caller }) func initializeAccessControl() : async () {
    // Set Genesis admin if not already set (first caller becomes permanent admin)
    switch (genesisAdmin) {
      case (null) {
        genesisAdmin := ?caller;
        AccessControl.initialize(accessControlState, caller);
      };
      case (?admin) {
        // Genesis admin is already set, just initialize the caller
        AccessControl.initialize(accessControlState, caller);
      };
    };
  };

  // Get caller's role with Genesis admin override
  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    switch (genesisAdmin) {
      case (?admin) {
        if (caller == admin) {
          return #admin;
        };
      };
      case (null) {};
    };
    AccessControl.getUserRole(accessControlState, caller);
  };

  // Assign role with Genesis admin check
  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can assign roles");
    };
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // Check if caller is admin with Genesis admin override
  public query ({ caller }) func isCallerAdmin() : async Bool {
    switch (genesisAdmin) {
      case (?admin) {
        if (caller == admin) {
          return true;
        };
      };
      case (null) {};
    };
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Get admin status information for dashboard display
  public query ({ caller }) func getAdminStatus() : async {
    isAdmin : Bool;
    isGenesisAdmin : Bool;
    currentPrincipal : Text;
    genesisAdminPrincipal : ?Text;
  } {
    let isGenesis = switch (genesisAdmin) {
      case (?admin) { caller == admin };
      case (null) { false };
    };

    let isAdminUser = if (isGenesis) {
      true;
    } else {
      AccessControl.isAdmin(accessControlState, caller);
    };

    let genesisPrincipalText = switch (genesisAdmin) {
      case (?admin) { ?Principal.toText(admin) };
      case (null) { null };
    };

    {
      isAdmin = isAdminUser;
      isGenesisAdmin = isGenesis;
      currentPrincipal = Principal.toText(caller);
      genesisAdminPrincipal = genesisPrincipalText;
    };
  };

  public type UserProfile = {
    name : Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  // Helper function to trim whitespace from text
  func trimText(text : Text) : Text {
    let chars = Text.toIter(text);
    var result = "";
    var leadingWhitespace = true;
    var trailingWhitespace = "";

    for (c in chars) {
      if (c == ' ' or c == '\t' or c == '\n' or c == '\r') {
        if (not leadingWhitespace) {
          trailingWhitespace := trailingWhitespace # Text.fromChar(c);
        };
      } else {
        leadingWhitespace := false;
        result := result # trailingWhitespace # Text.fromChar(c);
        trailingWhitespace := "";
      };
    };

    result;
  };

  // Get caller's profile (any authenticated user can access their own profile)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (Principal.isAnonymous(caller)) {
      return null;
    };
    principalMap.get(userProfiles, caller);
  };

  // Get any user's profile (admin can view any profile, users can only view their own)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Allow if caller is viewing their own profile
    if (caller == user) {
      return principalMap.get(userProfiles, user);
    };

    // Allow if caller is Genesis admin
    switch (genesisAdmin) {
      case (?admin) {
        if (caller == admin) {
          return principalMap.get(userProfiles, user);
        };
      };
      case (null) {};
    };

    // Allow if caller is admin
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return principalMap.get(userProfiles, user);
    };

    // Otherwise deny
    null;
  };

  // Save caller's profile (any authenticated user can save their own profile)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Check if caller is anonymous
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Unauthorized: Anonymous users cannot save profiles");
    };

    // Validate profile name is not empty after trimming
    let trimmedName = trimText(profile.name);
    if (trimmedName == "") {
      Debug.trap("Invalid profile: Name cannot be empty");
    };

    // Create validated profile with trimmed name
    let validatedProfile : UserProfile = {
      name = trimmedName;
    };

    // Save the validated profile
    userProfiles := principalMap.put(userProfiles, caller, validatedProfile);
  };

  // Property data types
  public type Property = {
    id : Text;
    name : Text;
    location : Text;
    price : UnitValue;
    fractionalOwnership : [FractionalOwnership];
    floors : [Floor];
    schemaVersion : Nat;
    latitude : UnitValue;
    longitude : UnitValue;
    nodes : [Node];
    nodeCount : Nat;
    nodePricing : UnitValue;
    area : UnitValue;
    elevation : UnitValue;
    pricePerUnit : UnitValue;
    gallery : [Storage.ExternalBlob];
  };

  public type FractionalOwnership = {
    owner : Text;
    percentage : Nat;
  };

  public type Floor = {
    floorNumber : Nat;
    area : Nat;
    price : Nat;
  };

  public type Node = {
    id : Text;
    latitude : UnitValue;
    longitude : UnitValue;
    altitude : UnitValue;
    createdAt : Int;
    updatedAt : Int;
  };

  public type UnitValue = {
    value : Int;
    unit : Text;
    scale : Int;
    editableBy : [Text];
  };

  // Property storage
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var properties = textMap.empty<Property>();

  // Internal function to check if caller is admin or Genesis admin
  func isCallerAdminInternal(caller : Principal) : async Bool {
    switch (genesisAdmin) {
      case (?admin) {
        if (caller == admin) {
          return true;
        };
      };
      case (null) {};
    };
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Admin-only property upload
  public shared ({ caller }) func uploadProperty(property : Property) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can upload properties");
    };
    properties := textMap.put(properties, property.id, property);
  };

  // Get all properties (publicly accessible)
  public query func getProperties() : async [Property] {
    Iter.toArray(textMap.vals(properties));
  };

  // Get property by ID (publicly accessible)
  public query func getProperty(id : Text) : async ?Property {
    textMap.get(properties, id);
  };

  // Update property price (admin only)
  public shared ({ caller }) func updatePropertyPrice(id : Text, newPrice : UnitValue) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can update property prices");
    };

    switch (textMap.get(properties, id)) {
      case (null) { Debug.trap("Property not found") };
      case (?property) {
        let updatedProperty : Property = {
          id = property.id;
          name = property.name;
          location = property.location;
          price = newPrice;
          fractionalOwnership = property.fractionalOwnership;
          floors = property.floors;
          schemaVersion = property.schemaVersion;
          latitude = property.latitude;
          longitude = property.longitude;
          nodes = property.nodes;
          nodeCount = property.nodeCount;
          // Recalculate node pricing
          nodePricing = {
            value = if (property.nodeCount > 0) {
              newPrice.value / Int.abs(Nat.toInt(property.nodeCount))
            } else {
              0
            };
            unit = newPrice.unit;
            scale = newPrice.scale;
            editableBy = newPrice.editableBy;
          };
          area = property.area;
          elevation = property.elevation;
          pricePerUnit = property.pricePerUnit;
          gallery = property.gallery;
        };
        properties := textMap.put(properties, id, updatedProperty);
      };
    };
  };

  // Add node to property (admin only)
  public shared ({ caller }) func addNodeToProperty(propertyId : Text, latitude : UnitValue, longitude : UnitValue, altitude : UnitValue) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can add nodes to properties");
    };

    switch (textMap.get(properties, propertyId)) {
      case (null) { Debug.trap("Property not found") };
      case (?property) {
        let nodeId = Text.concat(propertyId, Int.toText(Time.now()));
        let newNode : Node = {
          id = nodeId;
          latitude;
          longitude;
          altitude;
          createdAt = Time.now();
          updatedAt = Time.now();
        };

        let updatedNodes = Array.append<Node>(property.nodes, [newNode]);
        let nodeCount = updatedNodes.size();
        let nodePricing : UnitValue = {
          value = if (nodeCount > 0) {
            property.price.value / Int.abs(Nat.toInt(nodeCount))
          } else {
            0
          };
          unit = property.price.unit;
          scale = property.price.scale;
          editableBy = property.price.editableBy;
        };

        let updatedProperty : Property = {
          id = property.id;
          name = property.name;
          location = property.location;
          price = property.price;
          fractionalOwnership = property.fractionalOwnership;
          floors = property.floors;
          schemaVersion = property.schemaVersion;
          latitude = property.latitude;
          longitude = property.longitude;
          nodes = updatedNodes;
          nodeCount;
          nodePricing;
          area = property.area;
          elevation = property.elevation;
          pricePerUnit = property.pricePerUnit;
          gallery = property.gallery;
        };
        properties := textMap.put(properties, propertyId, updatedProperty);
      };
    };
  };

  // Remove node from property (admin only)
  public shared ({ caller }) func removeNodeFromProperty(propertyId : Text, nodeId : Text) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can remove nodes from properties");
    };

    switch (textMap.get(properties, propertyId)) {
      case (null) { Debug.trap("Property not found") };
      case (?property) {
        let updatedNodes = Array.filter<Node>(
          property.nodes,
          func(node) { node.id != nodeId },
        );
        let nodeCount = updatedNodes.size();
        let nodePricing : UnitValue = {
          value = if (nodeCount > 0) {
            property.price.value / Int.abs(Nat.toInt(nodeCount))
          } else {
            0
          };
          unit = property.price.unit;
          scale = property.price.scale;
          editableBy = property.price.editableBy;
        };

        let updatedProperty : Property = {
          id = property.id;
          name = property.name;
          location = property.location;
          price = property.price;
          fractionalOwnership = property.fractionalOwnership;
          floors = property.floors;
          schemaVersion = property.schemaVersion;
          latitude = property.latitude;
          longitude = property.longitude;
          nodes = updatedNodes;
          nodeCount;
          nodePricing;
          area = property.area;
          elevation = property.elevation;
          pricePerUnit = property.pricePerUnit;
          gallery = property.gallery;
        };
        properties := textMap.put(properties, propertyId, updatedProperty);
      };
    };
  };

  // Get property nodes (publicly accessible)
  public query func getPropertyNodes(propertyId : Text) : async [Node] {
    switch (textMap.get(properties, propertyId)) {
      case (null) { [] };
      case (?property) { property.nodes };
    };
  };

  // Get property node count (publicly accessible)
  public query func getPropertyNodeCount(propertyId : Text) : async Nat {
    switch (textMap.get(properties, propertyId)) {
      case (null) { 0 };
      case (?property) { property.nodeCount };
    };
  };

  // Get property node pricing (publicly accessible)
  public query func getPropertyNodePricing(propertyId : Text) : async UnitValue {
    switch (textMap.get(properties, propertyId)) {
      case (null) { 
        { 
          value = 0; 
          unit = ""; 
          scale = 0; 
          editableBy = [] 
        } 
      };
      case (?property) { property.nodePricing };
    };
  };

  // Blog post types
  public type BlogPost = {
    id : Text;
    title : Text;
    content : Text;
    published : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  var blogPosts = textMap.empty<BlogPost>();

  // Create blog post (admin only)
  public shared ({ caller }) func createBlogPost(title : Text, content : Text) : async Text {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can create blog posts");
    };

    let id = Text.concat(title, Int.toText(Time.now()));
    let blogPost : BlogPost = {
      id;
      title;
      content;
      published = false;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    blogPosts := textMap.put(blogPosts, id, blogPost);
    id;
  };

  // Update blog post (admin only)
  public shared ({ caller }) func updateBlogPost(id : Text, title : Text, content : Text) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can update blog posts");
    };

    switch (textMap.get(blogPosts, id)) {
      case (null) { Debug.trap("Blog post not found") };
      case (?blogPost) {
        let updatedBlogPost : BlogPost = {
          id = blogPost.id;
          title;
          content;
          published = blogPost.published;
          createdAt = blogPost.createdAt;
          updatedAt = Time.now();
        };
        blogPosts := textMap.put(blogPosts, id, updatedBlogPost);
      };
    };
  };

  // Publish/unpublish blog post (admin only)
  public shared ({ caller }) func setBlogPostPublished(id : Text, published : Bool) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can publish/unpublish blog posts");
    };

    switch (textMap.get(blogPosts, id)) {
      case (null) { Debug.trap("Blog post not found") };
      case (?blogPost) {
        let updatedBlogPost : BlogPost = {
          id = blogPost.id;
          title = blogPost.title;
          content = blogPost.content;
          published;
          createdAt = blogPost.createdAt;
          updatedAt = Time.now();
        };
        blogPosts := textMap.put(blogPosts, id, updatedBlogPost);
      };
    };
  };

  // Get all published blog posts (publicly accessible)
  public query func getPublishedBlogPosts() : async [BlogPost] {
    let publishedPosts = List.filter<BlogPost>(
      List.fromArray(Iter.toArray(textMap.vals(blogPosts))),
      func(post) { post.published },
    );
    List.toArray(publishedPosts);
  };

  // Get blog post by ID (publicly accessible if published, admin-only if draft)
  public query ({ caller }) func getBlogPost(id : Text) : async ?BlogPost {
    switch (textMap.get(blogPosts, id)) {
      case (null) { null };
      case (?blogPost) {
        // If published, anyone can view
        if (blogPost.published) {
          return ?blogPost;
        };
        
        // If not published, only admin can view
        switch (genesisAdmin) {
          case (?admin) {
            if (caller == admin) {
              return ?blogPost;
            };
          };
          case (null) {};
        };
        
        if (AccessControl.isAdmin(accessControlState, caller)) {
          return ?blogPost;
        };
        
        null;
      };
    };
  };

  // Get all blog posts (admin only)
  public shared ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can get all blog posts");
    };
    Iter.toArray(textMap.vals(blogPosts));
  };

  // Feature tracking types
  public type Feature = {
    id : Text;
    name : Text;
    completionPercentage : Nat;
    tasks : [Task];
    aiVerified : Bool;
    manuallyVerified : Bool;
    category : Text;
    priority : Nat;
    progress : Nat;
    pending : Bool;
    completed : Bool;
    fixture : Text;
  };

  public type Task = {
    id : Text;
    name : Text;
    completed : Bool;
  };

  var features = textMap.empty<Feature>();

  // Add feature (admin only)
  public shared ({ caller }) func addFeature(name : Text, tasks : [Task], category : Text, priority : Nat, fixture : Text) : async Text {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can add features");
    };

    let id = Text.concat(name, Int.toText(Time.now()));
    let feature : Feature = {
      id;
      name;
      completionPercentage = 0;
      tasks;
      aiVerified = false;
      manuallyVerified = false;
      category;
      priority;
      progress = 0;
      pending = true;
      completed = false;
      fixture;
    };
    features := textMap.put(features, id, feature);
    id;
  };

  // Update task completion (admin only)
  public shared ({ caller }) func updateTaskCompletion(featureId : Text, taskId : Text, completed : Bool) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can update task completion");
    };

    switch (textMap.get(features, featureId)) {
      case (null) { Debug.trap("Feature not found") };
      case (?feature) {
        let updatedTasks = Array.map<Task, Task>(
          feature.tasks,
          func(task) {
            if (task.id == taskId) {
              { task with completed };
            } else {
              task;
            };
          },
        );

        let completedTasks = Array.foldLeft<Task, Nat>(
          updatedTasks,
          0,
          func(acc, task) {
            if (task.completed) { acc + 1 } else { acc };
          },
        );

        let completionPercentage = if (updatedTasks.size() > 0) {
          (completedTasks * 100) / updatedTasks.size();
        } else {
          0;
        };

        let updatedFeature : Feature = {
          id = feature.id;
          name = feature.name;
          completionPercentage;
          tasks = updatedTasks;
          aiVerified = feature.aiVerified;
          manuallyVerified = feature.manuallyVerified;
          category = feature.category;
          priority = feature.priority;
          progress = feature.progress;
          pending = feature.pending;
          completed = feature.completed;
          fixture = feature.fixture;
        };
        features := textMap.put(features, featureId, updatedFeature);
      };
    };
  };

  // Update feature verification (admin only)
  public shared ({ caller }) func updateFeatureVerification(featureId : Text, aiVerified : Bool, manuallyVerified : Bool) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can update feature verification");
    };

    switch (textMap.get(features, featureId)) {
      case (null) { Debug.trap("Feature not found") };
      case (?feature) {
        let updatedFeature : Feature = {
          id = feature.id;
          name = feature.name;
          completionPercentage = feature.completionPercentage;
          tasks = feature.tasks;
          aiVerified;
          manuallyVerified;
          category = feature.category;
          priority = feature.priority;
          progress = feature.progress;
          pending = feature.pending;
          completed = feature.completed;
          fixture = feature.fixture;
        };
        features := textMap.put(features, featureId, updatedFeature);
      };
    };
  };

  // Get all features (publicly accessible)
  public query func getFeatures() : async [Feature] {
    Iter.toArray(textMap.vals(features));
  };

  // Get features by category (publicly accessible)
  public query func getFeaturesByCategory(category : Text) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) { feature.category == category },
    );
  };

  // Get features by verification status (publicly accessible)
  public query func getFeaturesByVerificationStatus(aiVerified : Bool, manuallyVerified : Bool) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        feature.aiVerified == aiVerified and feature.manuallyVerified == manuallyVerified
      },
    );
  };

  // Get features by fixture (publicly accessible)
  public query func getFeaturesByFixture(fixture : Text) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) { feature.fixture == fixture },
    );
  };

  // Get features by completion percentage (publicly accessible)
  public query func getFeaturesByCompletionPercentage(minPercentage : Nat, maxPercentage : Nat) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        feature.completionPercentage >= minPercentage and feature.completionPercentage <= maxPercentage
      },
    );
  };

  // Get features by priority (publicly accessible)
  public query func getFeaturesByPriority(priority : Nat) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) { feature.priority == priority },
    );
  };

  // Get features by progress (publicly accessible)
  public query func getFeaturesByProgress(minProgress : Nat, maxProgress : Nat) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        feature.progress >= minProgress and feature.progress <= maxProgress
      },
    );
  };

  // Get features by pending status (publicly accessible)
  public query func getFeaturesByPendingStatus(pending : Bool) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) { feature.pending == pending },
    );
  };

  // Get features by completed status (publicly accessible)
  public query func getFeaturesByCompletedStatus(completed : Bool) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) { feature.completed == completed },
    );
  };

  // Get features by combined criteria (publicly accessible)
  public query func getFeaturesByCombinedCriteria(
    category : Text,
    aiVerified : Bool,
    manuallyVerified : Bool,
    minPercentage : Nat,
    maxPercentage : Nat,
    priority : Nat,
    minProgress : Nat,
    maxProgress : Nat,
    pending : Bool,
    completed : Bool,
    fixture : Text,
  ) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        feature.category == category and feature.aiVerified == aiVerified and feature.manuallyVerified == manuallyVerified and feature.completionPercentage >= minPercentage and feature.completionPercentage <= maxPercentage and feature.priority == priority and feature.progress >= minProgress and feature.progress <= maxProgress and feature.pending == pending and feature.completed == completed and feature.fixture == fixture
      },
    );
  };

  // Get features by multiple fixtures (publicly accessible)
  public query func getFeaturesByMultipleFixtures(fixtures : [Text]) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        Array.find<Text>(fixtures, func(fixture) { fixture == feature.fixture }) != null;
      },
    );
  };

  // Get features by multiple categories (publicly accessible)
  public query func getFeaturesByMultipleCategories(categories : [Text]) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        Array.find<Text>(categories, func(category) { category == feature.category }) != null;
      },
    );
  };

  // Get features by multiple priorities (publicly accessible)
  public query func getFeaturesByMultiplePriorities(priorities : [Nat]) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        Array.find<Nat>(priorities, func(priority) { priority == feature.priority }) != null;
      },
    );
  };

  // Get features by multiple completion percentages (publicly accessible)
  public query func getFeaturesByMultipleCompletionPercentages(percentages : [Nat]) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        Array.find<Nat>(percentages, func(percentage) { percentage == feature.completionPercentage }) != null;
      },
    );
  };

  // Get features by multiple progress values (publicly accessible)
  public query func getFeaturesByMultipleProgressValues(progressValues : [Nat]) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        Array.find<Nat>(progressValues, func(progress) { progress == feature.progress }) != null;
      },
    );
  };

  // Get features by multiple verification statuses (publicly accessible)
  public query func getFeaturesByMultipleVerificationStatuses(aiVerified : [Bool], manuallyVerified : [Bool]) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        Array.find<Bool>(aiVerified, func(status) { status == feature.aiVerified }) != null and Array.find<Bool>(manuallyVerified, func(status) { status == feature.manuallyVerified }) != null
      },
    );
  };

  // Get features by multiple pending statuses (publicly accessible)
  public query func getFeaturesByMultiplePendingStatuses(pendingStatuses : [Bool]) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        Array.find<Bool>(pendingStatuses, func(status) { status == feature.pending }) != null;
      },
    );
  };

  // Get features by multiple completed statuses (publicly accessible)
  public query func getFeaturesByMultipleCompletedStatuses(completedStatuses : [Bool]) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        Array.find<Bool>(completedStatuses, func(status) { status == feature.completed }) != null;
      },
    );
  };

  // Get features by multiple combined criteria (publicly accessible)
  public query func getFeaturesByMultipleCombinedCriteria(
    categories : [Text],
    aiVerified : [Bool],
    manuallyVerified : [Bool],
    minPercentage : Nat,
    maxPercentage : Nat,
    priorities : [Nat],
    minProgress : Nat,
    maxProgress : Nat,
    pendingStatuses : [Bool],
    completedStatuses : [Bool],
    fixtures : [Text],
  ) : async [Feature] {
    let featuresArray = Iter.toArray(textMap.vals(features));
    Array.filter<Feature>(
      featuresArray,
      func(feature) {
        Array.find<Text>(categories, func(category) { category == feature.category }) != null and Array.find<Bool>(aiVerified, func(status) { status == feature.aiVerified }) != null and Array.find<Bool>(manuallyVerified, func(status) { status == feature.manuallyVerified }) != null and feature.completionPercentage >= minPercentage and feature.completionPercentage <= maxPercentage and Array.find<Nat>(priorities, func(priority) { priority == feature.priority }) != null and feature.progress >= minProgress and feature.progress <= maxProgress and Array.find<Bool>(pendingStatuses, func(status) { status == feature.pending }) != null and Array.find<Bool>(completedStatuses, func(status) { status == feature.completed }) != null and Array.find<Text>(fixtures, func(fixture) { fixture == feature.fixture }) != null
      },
    );
  };

  // Get system statistics (publicly accessible)
  public query func getSystemStats() : async {
    totalProperties : Nat;
    totalBlogPosts : Nat;
    totalFeatures : Nat;
    totalUsers : Nat;
  } {
    {
      totalProperties = textMap.size(properties);
      totalBlogPosts = textMap.size(blogPosts);
      totalFeatures = textMap.size(features);
      totalUsers = principalMap.size(userProfiles);
    };
  };

  // FAQ types
  public type FAQ = {
    id : Text;
    question : Text;
    answer : Text;
    order : Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  var faqs = textMap.empty<FAQ>();

  // Create FAQ (admin only)
  public shared ({ caller }) func createFAQ(question : Text, answer : Text, order : Nat) : async Text {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can create FAQs");
    };

    let id = Text.concat(question, Int.toText(Time.now()));
    let faq : FAQ = {
      id;
      question;
      answer;
      order;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    faqs := textMap.put(faqs, id, faq);
    id;
  };

  // Update FAQ (admin only)
  public shared ({ caller }) func updateFAQ(id : Text, question : Text, answer : Text, order : Nat) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can update FAQs");
    };

    switch (textMap.get(faqs, id)) {
      case (null) { Debug.trap("FAQ not found") };
      case (?faq) {
        let updatedFAQ : FAQ = {
          id = faq.id;
          question;
          answer;
          order;
          createdAt = faq.createdAt;
          updatedAt = Time.now();
        };
        faqs := textMap.put(faqs, id, updatedFAQ);
      };
    };
  };

  // Delete FAQ (admin only)
  public shared ({ caller }) func deleteFAQ(id : Text) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can delete FAQs");
    };

    switch (textMap.get(faqs, id)) {
      case (null) { Debug.trap("FAQ not found") };
      case (?_) {
        faqs := textMap.delete(faqs, id);
      };
    };
  };

  // Get all FAQs (publicly accessible)
  public query func getFAQs() : async [FAQ] {
    let faqArray = Iter.toArray(textMap.vals(faqs));
    Array.sort<FAQ>(
      faqArray,
      func(a, b) {
        if (a.order < b.order) { #less } else if (a.order > b.order) { #greater } else {
          #equal;
        };
      },
    );
  };

  // Get FAQ by ID (publicly accessible)
  public query func getFAQ(id : Text) : async ?FAQ {
    textMap.get(faqs, id);
  };

  // Search FAQs (publicly accessible)
  public query func searchFAQs(searchTerm : Text) : async [FAQ] {
    let faqArray = Iter.toArray(textMap.vals(faqs));
    let filteredFAQs = Array.filter<FAQ>(
      faqArray,
      func(faq) {
        Text.contains(faq.question, #text searchTerm) or Text.contains(faq.answer, #text searchTerm);
      },
    );
    Array.sort<FAQ>(
      filteredFAQs,
      func(a, b) {
        if (a.order < b.order) { #less } else if (a.order > b.order) { #greater } else {
          #equal;
        };
      },
    );
  };

  // Social Media Platform types
  public type SocialMediaPlatform = {
    id : Text;
    name : Text;
    url : Text;
    icon : Text;
    displayOrder : Nat;
    active : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  var socialMediaPlatforms = textMap.empty<SocialMediaPlatform>();

  // Helper function to extract clean domain from URL
  func extractCleanDomain(url : Text) : Text {
    let urlWithoutProtocol = if (Text.startsWith(url, #text "https://")) {
      Text.replace(url, #text "https://", "");
    } else if (Text.startsWith(url, #text "http://")) {
      Text.replace(url, #text "http://", "");
    } else {
      url;
    };

    let urlWithoutWww = if (Text.startsWith(urlWithoutProtocol, #text "www.")) {
      Text.replace(urlWithoutProtocol, #text "www.", "");
    } else {
      urlWithoutProtocol;
    };

    let parts = Text.split(urlWithoutWww, #char '/');
    let partsArray = Iter.toArray(parts);
    if (partsArray.size() > 0) {
      let domain = partsArray[0];
      let domainParts = Text.split(domain, #char ':');
      let domainPartsArray = Iter.toArray(domainParts);
      if (domainPartsArray.size() > 0) {
        let cleanDomain = domainPartsArray[0];
        let cleanDomainParts = Text.split(cleanDomain, #char '.');
        let cleanDomainPartsArray = Iter.toArray(cleanDomainParts);
        if (cleanDomainPartsArray.size() > 1) {
          return cleanDomainPartsArray[cleanDomainPartsArray.size() - 2];
        };
        return cleanDomain;
      };
      return domain;
    };
    url;
  };

  // Helper function to capitalize first character
  func capitalizeFirstChar(text : Text) : Text {
    if (text.size() == 0) {
      return text;
    };
    let chars = Text.toIter(text);
    switch (chars.next()) {
      case (null) { text };
      case (?firstChar) {
        let firstCharText = Text.fromIter(Iter.fromArray([firstChar]));
        let restText = Text.fromIter(chars);
        Text.concat(firstCharText, restText);
      };
    };
  };

  // Create Social Media Platform (admin only) with auto-inferred platform name and icon
  public shared ({ caller }) func createSocialMediaPlatform(url : Text, displayOrder : Nat, active : Bool) : async Text {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can create social media platforms");
    };

    let cleanDomain = extractCleanDomain(url);
    let name = capitalizeFirstChar(cleanDomain);
    let icon = cleanDomain;

    let id = Text.concat(name, Int.toText(Time.now()));
    let platform : SocialMediaPlatform = {
      id;
      name;
      url;
      icon;
      displayOrder;
      active;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    socialMediaPlatforms := textMap.put(socialMediaPlatforms, id, platform);
    id;
  };

  // Update Social Media Platform (admin only) with auto-inferred platform name and icon
  public shared ({ caller }) func updateSocialMediaPlatform(id : Text, url : Text, displayOrder : Nat, active : Bool) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can update social media platforms");
    };

    switch (textMap.get(socialMediaPlatforms, id)) {
      case (null) { Debug.trap("Social media platform not found") };
      case (?platform) {
        let cleanDomain = extractCleanDomain(url);
        let name = capitalizeFirstChar(cleanDomain);
        let icon = cleanDomain;

        let updatedPlatform : SocialMediaPlatform = {
          id = platform.id;
          name;
          url;
          icon;
          displayOrder;
          active;
          createdAt = platform.createdAt;
          updatedAt = Time.now();
        };
        socialMediaPlatforms := textMap.put(socialMediaPlatforms, id, updatedPlatform);
      };
    };
  };

  // Delete Social Media Platform (admin only)
  public shared ({ caller }) func deleteSocialMediaPlatform(id : Text) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can delete social media platforms");
    };

    switch (textMap.get(socialMediaPlatforms, id)) {
      case (null) { Debug.trap("Social media platform not found") };
      case (?_) {
        socialMediaPlatforms := textMap.delete(socialMediaPlatforms, id);
      };
    };
  };

  // Get all Social Media Platforms (publicly accessible)
  public query func getSocialMediaPlatforms() : async [SocialMediaPlatform] {
    let platformsArray = Iter.toArray(textMap.vals(socialMediaPlatforms));
    Array.sort<SocialMediaPlatform>(
      platformsArray,
      func(a, b) {
        if (a.displayOrder < b.displayOrder) { #less } else if (a.displayOrder > b.displayOrder) {
          #greater;
        } else { #equal };
      },
    );
  };

  // Get active Social Media Platforms (publicly accessible)
  public query func getActiveSocialMediaPlatforms() : async [SocialMediaPlatform] {
    let platformsArray = Iter.toArray(textMap.vals(socialMediaPlatforms));
    let activePlatforms = Array.filter<SocialMediaPlatform>(
      platformsArray,
      func(platform) { platform.active },
    );
    Array.sort<SocialMediaPlatform>(
      activePlatforms,
      func(a, b) {
        if (a.displayOrder < b.displayOrder) { #less } else if (a.displayOrder > b.displayOrder) {
          #greater;
        } else { #equal };
      },
    );
  };

  // Get Social Media Platform by ID (publicly accessible)
  public query func getSocialMediaPlatform(id : Text) : async ?SocialMediaPlatform {
    textMap.get(socialMediaPlatforms, id);
  };

  // Search Social Media Platforms by name and icon (publicly accessible)
  public query func searchSocialMediaPlatforms(searchTerm : Text) : async [SocialMediaPlatform] {
    let platformsArray = Iter.toArray(textMap.vals(socialMediaPlatforms));
    let filteredPlatforms = Array.filter<SocialMediaPlatform>(
      platformsArray,
      func(platform) {
        Text.contains(platform.name, #text searchTerm) or Text.contains(platform.icon, #text searchTerm);
      },
    );
    Array.sort<SocialMediaPlatform>(
      filteredPlatforms,
      func(a, b) {
        if (a.displayOrder < b.displayOrder) { #less } else if (a.displayOrder > b.displayOrder) {
          #greater;
        } else { #equal };
      },
    );
  };

  // Initialize default social media platforms (admin only)
  public shared ({ caller }) func initializeDefaultSocialMediaPlatforms() : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can initialize default social media platforms");
    };

    let defaultPlatforms : [SocialMediaPlatform] = [
      {
        id = "facebook";
        name = "Facebook";
        url = "https://facebook.com/secoinfi";
        icon = "facebook";
        displayOrder = 1;
        active = true;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "linkedin";
        name = "LinkedIn";
        url = "https://linkedin.com/company/secoinfi";
        icon = "linkedin";
        displayOrder = 2;
        active = true;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "telegram";
        name = "Telegram";
        url = "https://t.me/dilee";
        icon = "telegram";
        displayOrder = 3;
        active = true;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "discord";
        name = "Discord";
        url = "https://discord.com/invite/secoinfi";
        icon = "discord";
        displayOrder = 4;
        active = true;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "blogspot";
        name = "Blogspot";
        url = "https://newgoldenjewel.blogspot.com";
        icon = "blogspot";
        displayOrder = 5;
        active = true;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "instagram";
        name = "Instagram";
        url = "https://instagram.com/newgoldenjewel";
        icon = "instagram";
        displayOrder = 6;
        active = true;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "twitter";
        name = "X/Twitter";
        url = "https://twitter.com/dil_sec";
        icon = "twitter";
        displayOrder = 7;
        active = true;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "youtube";
        name = "YouTube";
        url = "https://youtube.com/@secoinfi";
        icon = "youtube";
        displayOrder = 8;
        active = true;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
    ];

    for (platform in defaultPlatforms.vals()) {
      socialMediaPlatforms := textMap.put(socialMediaPlatforms, platform.id, platform);
    };
  };

  // Sitemap types
  public type SitemapEntry = {
    loc : Text;
    lastmod : Text;
    changefreq : Text;
    priority : Text;
  };

  public type Sitemap = {
    entries : [SitemapEntry];
    rawXml : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  var sitemap : ?Sitemap = null;

  // Create or update sitemap (admin only)
  public shared ({ caller }) func createOrUpdateSitemap(entries : [SitemapEntry], rawXml : Text) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can create or update sitemap");
    };

    let newSitemap : Sitemap = {
      entries;
      rawXml;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    sitemap := ?newSitemap;
  };

  // Get sitemap (publicly accessible)
  public query func getSitemap() : async ?Sitemap {
    sitemap;
  };

  // Get sitemap entries (publicly accessible)
  public query func getSitemapEntries() : async [SitemapEntry] {
    switch (sitemap) {
      case (null) { [] };
      case (?s) { s.entries };
    };
  };

  // Get raw sitemap XML (publicly accessible)
  public query func getRawSitemapXml() : async Text {
    switch (sitemap) {
      case (null) { "" };
      case (?s) { s.rawXml };
    };
  };

  // Serve sitemap.xml at root path (publicly accessible)
  public query func getSitemapXml() : async Text {
    switch (sitemap) {
      case (null) { "" };
      case (?s) { s.rawXml };
    };
  };

  // Serve robots.txt at root path (publicly accessible)
  public query func getRobotsTxt() : async Text {
    let robotsTxtContent = "User-agent: *\nAllow: /\nSitemap: https://secoin-ep6.caffeine.xyz/sitemap.xml\n";
    robotsTxtContent;
  };

  // Data integrity check for FAQs (publicly accessible)
  public query func checkFAQIntegrity() : async Bool {
    let faqsArray = Iter.toArray(textMap.vals(faqs));
    faqsArray.size() == 39;
  };

  // Data integrity check for sitemap (publicly accessible)
  public query func checkSitemapIntegrity() : async Bool {
    switch (sitemap) {
      case (null) { false };
      case (?s) { s.rawXml != "" };
    };
  };

  // Automated test for data integrity (admin only)
  public shared ({ caller }) func runDataIntegrityTests() : async Bool {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can run data integrity tests");
    };
    let faqIntegrity = await checkFAQIntegrity();
    let sitemapIntegrity = await checkSitemapIntegrity();
    faqIntegrity and sitemapIntegrity;
  };

  // Menu item type
  public type MenuItem = {
    id : Text;
    title : Text;
    url : Text;
    icon : Text;
    order : Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  var menuItems = textMap.empty<MenuItem>();

  // Create menu item (admin only)
  public shared ({ caller }) func createMenuItem(title : Text, url : Text, icon : Text, order : Nat) : async Text {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can create menu items");
    };

    let id = Text.concat(title, Int.toText(Time.now()));
    let menuItem : MenuItem = {
      id;
      title;
      url;
      icon;
      order;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    menuItems := textMap.put(menuItems, id, menuItem);
    id;
  };

  // Update menu item (admin only)
  public shared ({ caller }) func updateMenuItem(id : Text, title : Text, url : Text, icon : Text, order : Nat) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can update menu items");
    };

    switch (textMap.get(menuItems, id)) {
      case (null) { Debug.trap("Menu item not found") };
      case (?menuItem) {
        let updatedMenuItem : MenuItem = {
          id = menuItem.id;
          title;
          url;
          icon;
          order;
          createdAt = menuItem.createdAt;
          updatedAt = Time.now();
        };
        menuItems := textMap.put(menuItems, id, updatedMenuItem);
      };
    };
  };

  // Delete menu item (admin only)
  public shared ({ caller }) func deleteMenuItem(id : Text) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can delete menu items");
    };

    switch (textMap.get(menuItems, id)) {
      case (null) { Debug.trap("Menu item not found") };
      case (?_) {
        menuItems := textMap.delete(menuItems, id);
      };
    };
  };

  // Get all menu items (publicly accessible)
  public query func getMenuItems() : async [MenuItem] {
    let menuArray = Iter.toArray(textMap.vals(menuItems));
    Array.sort<MenuItem>(
      menuArray,
      func(a, b) {
        if (a.order < b.order) { #less } else if (a.order > b.order) { #greater } else {
          #equal;
        };
      },
    );
  };

  // Get menu item by ID (publicly accessible)
  public query func getMenuItem(id : Text) : async ?MenuItem {
    textMap.get(menuItems, id);
  };

  // Search menu items (publicly accessible)
  public query func searchMenuItems(searchTerm : Text) : async [MenuItem] {
    let menuArray = Iter.toArray(textMap.vals(menuItems));
    let filteredMenuItems = Array.filter<MenuItem>(
      menuArray,
      func(menuItem) {
        Text.contains(menuItem.title, #text searchTerm) or Text.contains(menuItem.url, #text searchTerm);
      },
    );
    Array.sort<MenuItem>(
      filteredMenuItems,
      func(a, b) {
        if (a.order < b.order) { #less } else if (a.order > b.order) { #greater } else {
          #equal;
        };
      },
    );
  };

  // Initialize default menu items (admin only)
  public shared ({ caller }) func initializeDefaultMenuItems() : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can initialize default menu items");
    };

    let defaultMenuItems : [MenuItem] = [
      {
        id = "home";
        title = "Home";
        url = "/";
        icon = "home";
        order = 1;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "features";
        title = "Features";
        url = "/features";
        icon = "features";
        order = 2;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "dashboard";
        title = "Dashboard";
        url = "/dashboard";
        icon = "dashboard";
        order = 3;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "admin";
        title = "Admin";
        url = "/admin";
        icon = "admin";
        order = 4;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "blog";
        title = "Blog";
        url = "/blog";
        icon = "blog";
        order = 5;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "faq";
        title = "FAQ";
        url = "/faq";
        icon = "faq";
        order = 6;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "contact";
        title = "Contact";
        url = "/contact";
        icon = "contact";
        order = 7;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
    ];

    for (menuItem in defaultMenuItems.vals()) {
      menuItems := textMap.put(menuItems, menuItem.id, menuItem);
    };
  };

  // Ensure critical menu items are always present (admin only)
  public shared ({ caller }) func ensureCriticalMenuItems() : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can ensure critical menu items");
    };

    let criticalMenuItems : [MenuItem] = [
      {
        id = "features";
        title = "Features";
        url = "/features";
        icon = "features";
        order = 2;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "dashboard";
        title = "Dashboard";
        url = "/dashboard";
        icon = "dashboard";
        order = 3;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
      {
        id = "admin";
        title = "Admin";
        url = "/admin";
        icon = "admin";
        order = 4;
        createdAt = Time.now();
        updatedAt = Time.now();
      },
    ];

    for (menuItem in criticalMenuItems.vals()) {
      switch (textMap.get(menuItems, menuItem.id)) {
        case (null) {
          menuItems := textMap.put(menuItems, menuItem.id, menuItem);
        };
        case (?existingMenuItem) {
          if (existingMenuItem.url != menuItem.url) {
            menuItems := textMap.put(menuItems, menuItem.id, menuItem);
          };
        };
      };
    };
  };

  // Analyze menu structure and return analysis with missing pages (publicly accessible)
  public query func analyzeMenuStructure() : async {
    totalUniquePages : Nat;
    uniquePages : [Text];
    missingCriticalPages : [Text];
    hasDuplicates : Bool;
    duplicateUrls : [Text];
    isAdminPresent : Bool;
    menuItems : [MenuItem];
  } {
    let menuArray = Iter.toArray(textMap.vals(menuItems));
    
    // Get unique URLs
    let uniqueUrls = Array.foldLeft<MenuItem, [Text]>(
      menuArray,
      [],
      func(acc, item) {
        if (Array.find<Text>(acc, func(url) { url == item.url }) == null) {
          Array.append<Text>(acc, [item.url]);
        } else {
          acc;
        };
      },
    );

    // Check for duplicates
    let hasDuplicates = uniqueUrls.size() < menuArray.size();
    
    // Find duplicate URLs
    let duplicateUrls = Array.foldLeft<MenuItem, [Text]>(
      menuArray,
      [],
      func(acc, item) {
        let count = Array.foldLeft<MenuItem, Nat>(
          menuArray,
          0,
          func(c, mi) {
            if (mi.url == item.url) { c + 1 } else { c };
          },
        );
        if (count > 1 and Array.find<Text>(acc, func(url) { url == item.url }) == null) {
          Array.append<Text>(acc, [item.url]);
        } else {
          acc;
        };
      },
    );

    // Check for critical pages
    let criticalPages = ["/features", "/dashboard", "/admin"];
    let missingCriticalPages = Array.filter<Text>(
      criticalPages,
      func(page) {
        Array.find<Text>(uniqueUrls, func(url) { url == page }) == null;
      },
    );

    // Check if /admin is present
    let isAdminPresent = Array.find<Text>(uniqueUrls, func(url) { url == "/admin" }) != null;

    {
      totalUniquePages = uniqueUrls.size();
      uniquePages = uniqueUrls;
      missingCriticalPages;
      hasDuplicates;
      duplicateUrls;
      isAdminPresent;
      menuItems = Array.sort<MenuItem>(
        menuArray,
        func(a, b) {
          if (a.order < b.order) { #less } else if (a.order > b.order) { #greater } else {
            #equal;
          };
        },
      );
    };
  };

  // Get corrected menu structure with missing pages added (publicly accessible - read-only analysis)
  public query func getCorrectedMenuStructure() : async {
    originalMenuItems : [MenuItem];
    correctedMenuItems : [MenuItem];
    addedPages : [Text];
    removedDuplicates : [Text];
  } {
    let menuArray = Iter.toArray(textMap.vals(menuItems));
    
    // Critical pages that must be present
    let criticalPages : [(Text, Text, Text, Nat)] = [
      ("/features", "Features", "features", 2),
      ("/dashboard", "Dashboard", "dashboard", 3),
      ("/admin", "Admin", "admin", 4),
    ];

    // Find missing critical pages
    let addedPages = Array.foldLeft<(Text, Text, Text, Nat), [Text]>(
      criticalPages,
      [],
      func(acc, page) {
        let (url, _, _, _) = page;
        let exists = Array.find<MenuItem>(menuArray, func(item) { item.url == url }) != null;
        if (not exists) {
          Array.append<Text>(acc, [url]);
        } else {
          acc;
        };
      },
    );

    // Create corrected menu items (without duplicates)
    var correctedItems : [MenuItem] = [];
    var seenUrls : [Text] = [];
    var removedDuplicates : [Text] = [];

    // Add existing items (deduplicated)
    for (item in menuArray.vals()) {
      if (Array.find<Text>(seenUrls, func(url) { url == item.url }) == null) {
        correctedItems := Array.append<MenuItem>(correctedItems, [item]);
        seenUrls := Array.append<Text>(seenUrls, [item.url]);
      } else {
        removedDuplicates := Array.append<Text>(removedDuplicates, [item.url]);
      };
    };

    // Add missing critical pages
    for (page in criticalPages.vals()) {
      let (url, title, icon, order) = page;
      if (Array.find<Text>(seenUrls, func(u) { u == url }) == null) {
        let newItem : MenuItem = {
          id = Text.concat(title, Int.toText(Time.now()));
          title;
          url;
          icon;
          order;
          createdAt = Time.now();
          updatedAt = Time.now();
        };
        correctedItems := Array.append<MenuItem>(correctedItems, [newItem]);
      };
    };

    // Sort corrected items by order
    let sortedCorrectedItems = Array.sort<MenuItem>(
      correctedItems,
      func(a, b) {
        if (a.order < b.order) { #less } else if (a.order > b.order) { #greater } else {
          #equal;
        };
      },
    );

    {
      originalMenuItems = Array.sort<MenuItem>(
        menuArray,
        func(a, b) {
          if (a.order < b.order) { #less } else if (a.order > b.order) { #greater } else {
            #equal;
          };
        },
      );
      correctedMenuItems = sortedCorrectedItems;
      addedPages;
      removedDuplicates;
    };
  };

  // Fixtures types
  public type Fixtures = {
    id : Text;
    merkleRoot : Text;
    verkleLeaves : [Text];
    proofStatus : Text;
    verificationResult : Text;
    autoUpdateRecommendations : [Text];
    discrepancyResolution : Text;
    recalculationHistory : [Text];
    createdAt : Int;
    updatedAt : Int;
  };

  var fixtures = textMap.empty<Fixtures>();

  // Create or update fixtures (admin only)
  public shared ({ caller }) func createOrUpdateFixtures(
    id : Text,
    merkleRoot : Text,
    verkleLeaves : [Text],
    proofStatus : Text,
    verificationResult : Text,
    autoUpdateRecommendations : [Text],
    discrepancyResolution : Text,
    recalculationHistory : [Text],
  ) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can create or update fixtures");
    };

    let newFixtures : Fixtures = {
      id;
      merkleRoot;
      verkleLeaves;
      proofStatus;
      verificationResult;
      autoUpdateRecommendations;
      discrepancyResolution;
      recalculationHistory;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    fixtures := textMap.put(fixtures, id, newFixtures);
  };

  // Get fixtures by ID (publicly accessible)
  public query func getFixtures(id : Text) : async ?Fixtures {
    textMap.get(fixtures, id);
  };

  // Get all fixtures (publicly accessible)
  public query func getAllFixtures() : async [Fixtures] {
    Iter.toArray(textMap.vals(fixtures));
  };

  // Delete fixtures (admin only)
  public shared ({ caller }) func deleteFixtures(id : Text) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can delete fixtures");
    };

    switch (textMap.get(fixtures, id)) {
      case (null) { Debug.trap("Fixtures not found") };
      case (?_) {
        fixtures := textMap.delete(fixtures, id);
      };
    };
  };

  // Verify fixtures integrity (publicly accessible)
  public query func verifyFixturesIntegrity(id : Text) : async Bool {
    switch (textMap.get(fixtures, id)) {
      case (null) { false };
      case (?f) {
        f.proofStatus == "verified" and f.verificationResult == "success";
      };
    };
  };

  // Get fixtures verification status (publicly accessible)
  public query func getFixturesVerificationStatus(id : Text) : async Text {
    switch (textMap.get(fixtures, id)) {
      case (null) { "not found" };
      case (?f) { f.proofStatus };
    };
  };

  // Get fixtures auto-update recommendations (publicly accessible)
  public query func getFixturesAutoUpdateRecommendations(id : Text) : async [Text] {
    switch (textMap.get(fixtures, id)) {
      case (null) { [] };
      case (?f) { f.autoUpdateRecommendations };
    };
  };

  // Get fixtures discrepancy resolution (publicly accessible)
  public query func getFixturesDiscrepancyResolution(id : Text) : async Text {
    switch (textMap.get(fixtures, id)) {
      case (null) { "not found" };
      case (?f) { f.discrepancyResolution };
    };
  };

  // Get fixtures recalculation history (publicly accessible)
  public query func getFixturesRecalculationHistory(id : Text) : async [Text] {
    switch (textMap.get(fixtures, id)) {
      case (null) { [] };
      case (?f) { f.recalculationHistory };
    };
  };

  // Referral program types
  public type ReferralProgram = {
    id : Text;
    name : Text;
    description : Text;
    earningOpportunities : [EarningOpportunity];
    profitShareDetails : ProfitShareDetails;
    levelStructure : LevelStructure;
    uniqueNonceSystem : UniqueNonceSystem;
    runningBalanceTracking : RunningBalanceTracking;
    messaging : [ReferralMessage];
    uspContent : [USPContent];
    createdAt : Int;
    updatedAt : Int;
  };

  public type EarningOpportunity = {
    id : Text;
    title : Text;
    description : Text;
    level : Nat;
    percentage : Nat;
  };

  public type ProfitShareDetails = {
    totalPercentage : Nat;
    distributionMethod : Text;
    payoutFrequency : Text;
  };

  public type LevelStructure = {
    levels : Nat;
    unlimitedLevels : Bool;
    levelPercentages : [Nat];
  };

  public type UniqueNonceSystem = {
    nonceGenerationMethod : Text;
    memberTracking : Text;
    referrerTracking : Text;
  };

  public type RunningBalanceTracking = {
    calculationMethod : Text;
    distributionMethod : Text;
    feeTracking : Text;
  };

  public type ReferralMessage = {
    id : Text;
    title : Text;
    content : Text;
    type_ : Text;
  };

  public type USPContent = {
    id : Text;
    title : Text;
    description : Text;
    highlight : Bool;
  };

  var referralPrograms = textMap.empty<ReferralProgram>();

  // Create or update referral program (admin only)
  public shared ({ caller }) func createOrUpdateReferralProgram(
    id : Text,
    name : Text,
    description : Text,
    earningOpportunities : [EarningOpportunity],
    profitShareDetails : ProfitShareDetails,
    levelStructure : LevelStructure,
    uniqueNonceSystem : UniqueNonceSystem,
    runningBalanceTracking : RunningBalanceTracking,
    messaging : [ReferralMessage],
    uspContent : [USPContent],
  ) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can create or update referral programs");
    };

    let newReferralProgram : ReferralProgram = {
      id;
      name;
      description;
      earningOpportunities;
      profitShareDetails;
      levelStructure;
      uniqueNonceSystem;
      runningBalanceTracking;
      messaging;
      uspContent;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    referralPrograms := textMap.put(referralPrograms, id, newReferralProgram);
  };

  // Get referral program by ID (publicly accessible)
  public query func getReferralProgram(id : Text) : async ?ReferralProgram {
    textMap.get(referralPrograms, id);
  };

  // Get all referral programs (publicly accessible)
  public query func getAllReferralPrograms() : async [ReferralProgram] {
    Iter.toArray(textMap.vals(referralPrograms));
  };

  // Delete referral program (admin only)
  public shared ({ caller }) func deleteReferralProgram(id : Text) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can delete referral programs");
    };

    switch (textMap.get(referralPrograms, id)) {
      case (null) { Debug.trap("Referral program not found") };
      case (?_) {
        referralPrograms := textMap.delete(referralPrograms, id);
      };
    };
  };

  // Get referral earning opportunities (publicly accessible)
  public query func getReferralEarningOpportunities(programId : Text) : async [EarningOpportunity] {
    switch (textMap.get(referralPrograms, programId)) {
      case (null) { [] };
      case (?program) { program.earningOpportunities };
    };
  };

  // Get referral profit share details (publicly accessible)
  public query func getReferralProfitShareDetails(programId : Text) : async ?ProfitShareDetails {
    switch (textMap.get(referralPrograms, programId)) {
      case (null) { null };
      case (?program) { ?program.profitShareDetails };
    };
  };

  // Get referral level structure (publicly accessible)
  public query func getReferralLevelStructure(programId : Text) : async ?LevelStructure {
    switch (textMap.get(referralPrograms, programId)) {
      case (null) { null };
      case (?program) { ?program.levelStructure };
    };
  };

  // Get referral unique nonce system (publicly accessible)
  public query func getReferralUniqueNonceSystem(programId : Text) : async ?UniqueNonceSystem {
    switch (textMap.get(referralPrograms, programId)) {
      case (null) { null };
      case (?program) { ?program.uniqueNonceSystem };
    };
  };

  // Get referral running balance tracking (publicly accessible)
  public query func getReferralRunningBalanceTracking(programId : Text) : async ?RunningBalanceTracking {
    switch (textMap.get(referralPrograms, programId)) {
      case (null) { null };
      case (?program) { ?program.runningBalanceTracking };
    };
  };

  // Get referral messaging (publicly accessible)
  public query func getReferralMessaging(programId : Text) : async [ReferralMessage] {
    switch (textMap.get(referralPrograms, programId)) {
      case (null) { [] };
      case (?program) { program.messaging };
    };
  };

  // Get referral USP content (publicly accessible)
  public query func getReferralUSPContent(programId : Text) : async [USPContent] {
    switch (textMap.get(referralPrograms, programId)) {
      case (null) { [] };
      case (?program) { program.uspContent };
    };
  };

  // Stripe integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can configure Stripe");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Unauthorized: Anonymous users cannot create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Storage integration
  let storage = Storage.new();
  include MixinStorage(storage);

  // Add image to property gallery (admin only)
  public shared ({ caller }) func addImageToPropertyGallery(propertyId : Text, image : Storage.ExternalBlob) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can add images to property gallery");
    };

    switch (textMap.get(properties, propertyId)) {
      case (null) { Debug.trap("Property not found") };
      case (?property) {
        let updatedGallery = Array.append<Storage.ExternalBlob>(property.gallery, [image]);
        let updatedProperty : Property = {
          id = property.id;
          name = property.name;
          location = property.location;
          price = property.price;
          fractionalOwnership = property.fractionalOwnership;
          floors = property.floors;
          schemaVersion = property.schemaVersion;
          latitude = property.latitude;
          longitude = property.longitude;
          nodes = property.nodes;
          nodeCount = property.nodeCount;
          nodePricing = property.nodePricing;
          area = property.area;
          elevation = property.elevation;
          pricePerUnit = property.pricePerUnit;
          gallery = updatedGallery;
        };
        properties := textMap.put(properties, propertyId, updatedProperty);
      };
    };
  };

  // Remove image from property gallery (admin only)
  public shared ({ caller }) func removeImageFromPropertyGallery(propertyId : Text, imageIndex : Nat) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can remove images from property gallery");
    };

    switch (textMap.get(properties, propertyId)) {
      case (null) { Debug.trap("Property not found") };
      case (?property) {
        if (imageIndex >= property.gallery.size()) {
          Debug.trap("Image index out of bounds");
        };
        let updatedGallery = Array.tabulate<Storage.ExternalBlob>(
          property.gallery.size() - 1,
          func(i) {
            if (i < imageIndex) {
              property.gallery[i];
            } else {
              property.gallery[i + 1];
            };
          },
        );
        let updatedProperty : Property = {
          id = property.id;
          name = property.name;
          location = property.location;
          price = property.price;
          fractionalOwnership = property.fractionalOwnership;
          floors = property.floors;
          schemaVersion = property.schemaVersion;
          latitude = property.latitude;
          longitude = property.longitude;
          nodes = property.nodes;
          nodeCount = property.nodeCount;
          nodePricing = property.nodePricing;
          area = property.area;
          elevation = property.elevation;
          pricePerUnit = property.pricePerUnit;
          gallery = updatedGallery;
        };
        properties := textMap.put(properties, propertyId, updatedProperty);
      };
    };
  };

  // Get property gallery (publicly accessible)
  public query func getPropertyGallery(propertyId : Text) : async [Storage.ExternalBlob] {
    switch (textMap.get(properties, propertyId)) {
      case (null) { [] };
      case (?property) { property.gallery };
    };
  };

  // Import images in bulk (admin only)
  public shared ({ caller }) func importImagesInBulk(images : [Storage.ExternalBlob]) : async () {
    if (not (await isCallerAdminInternal(caller))) {
      Debug.trap("Unauthorized: Only admins can import images in bulk");
    };

    for (image in images.vals()) {
      for ((propertyId, property) in textMap.entries(properties)) {
        let updatedGallery = Array.append<Storage.ExternalBlob>(property.gallery, [image]);
        let updatedProperty : Property = {
          id = property.id;
          name = property.name;
          location = property.location;
          price = property.price;
          fractionalOwnership = property.fractionalOwnership;
          floors = property.floors;
          schemaVersion = property.schemaVersion;
          latitude = property.latitude;
          longitude = property.longitude;
          nodes = property.nodes;
          nodeCount = property.nodeCount;
          nodePricing = property.nodePricing;
          area = property.area;
          elevation = property.elevation;
          pricePerUnit = property.pricePerUnit;
          gallery = updatedGallery;
        };
        properties := textMap.put(properties, propertyId, updatedProperty);
      };
    };
  };

  // Helper function to normalize text for comparison
  func normalizeText(text : Text) : Text {
    let lower = Text.map(
      text,
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32(Char.toNat32(c) + 32);
        } else {
          c;
        };
      },
    );
    let replaced = Text.replace(Text.replace(Text.replace(Text.replace(lower, #text "-", ""), #text "_", ""), #text " ", ""), #text ".png", "");
    replaced;
  };

  // Get property image by filename (publicly accessible)
  public query func getPropertyImageByFilename(propertyId : Text, filename : Text) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (property.gallery.size() > 0) {
            return ?property.gallery[0];
          };
        };
        null;
      };
    };
  };

  // Get property image by index (publicly accessible)
  public query func getPropertyImageByIndex(propertyId : Text, index : Nat) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        if (index < property.gallery.size()) {
          return ?property.gallery[index];
        };
        null;
      };
    };
  };

  // Get property image by filename and index (publicly accessible)
  public query func getPropertyImageByFilenameAndIndex(propertyId : Text, filename : Text, index : Nat) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (index < property.gallery.size()) {
            return ?property.gallery[index];
          };
        };
        null;
      };
    };
  };

  // Get property image by filename and extension (publicly accessible)
  public query func getPropertyImageByFilenameAndExtension(propertyId : Text, filename : Text, extension : Text) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (property.gallery.size() > 0) {
            return ?property.gallery[0];
          };
        };
        null;
      };
    };
  };

  // Get property image by filename and index (publicly accessible)
  public query func getPropertyImageByFilenameIndex(propertyId : Text, filename : Text, index : Nat) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (index < property.gallery.size()) {
            return ?property.gallery[index];
          };
        };
        null;
      };
    };
  };

  // Get property image by filename, index, and extension (publicly accessible)
  public query func getPropertyImageByFilenameIndexAndExtension(propertyId : Text, filename : Text, index : Nat, extension : Text) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (index < property.gallery.size()) {
            return ?property.gallery[index];
          };
        };
        null;
      };
    };
  };

  // Get property image by filename, index, extension, and size (publicly accessible)
  public query func getPropertyImageByFilenameIndexExtensionAndSize(propertyId : Text, filename : Text, index : Nat, extension : Text, size : Text) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (index < property.gallery.size()) {
            return ?property.gallery[index];
          };
        };
        null;
      };
    };
  };

  // Get property image by filename, index, extension, size, and format (publicly accessible)
  public query func getPropertyImageByFilenameIndexExtensionSizeAndFormat(propertyId : Text, filename : Text, index : Nat, extension : Text, size : Text, format : Text) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (index < property.gallery.size()) {
            return ?property.gallery[index];
          };
        };
        null;
      };
    };
  };

  // Get property image by filename, index, extension, size, format, and quality (publicly accessible)
  public query func getPropertyImageByFilenameIndexExtensionSizeFormatAndQuality(propertyId : Text, filename : Text, index : Nat, extension : Text, size : Text, format : Text, quality : Text) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (index < property.gallery.size()) {
            return ?property.gallery[index];
          };
        };
        null;
      };
    };
  };

  // Get property image by filename, index, extension, size, format, quality, and cache busting (publicly accessible)
  public query func getPropertyImageByFilenameIndexExtensionSizeFormatQualityAndCacheBusting(propertyId : Text, filename : Text, index : Nat, extension : Text, size : Text, format : Text, quality : Text, cacheBusting : Text) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (index < property.gallery.size()) {
            return ?property.gallery[index];
          };
        };
        null;
      };
    };
  };

  // Get property image by filename, index, extension, size, format, quality, cache busting, and timestamp (publicly accessible)
  public query func getPropertyImageByFilenameIndexExtensionSizeFormatQualityCacheBustingAndTimestamp(propertyId : Text, filename : Text, index : Nat, extension : Text, size : Text, format : Text, quality : Text, cacheBusting : Text, timestamp : Int) : async ?Storage.ExternalBlob {
    switch (textMap.get(properties, propertyId)) {
      case (null) { null };
      case (?property) {
        let normalizedFilename = normalizeText(filename);
        let normalizedPropertyId = normalizeText(propertyId);

        if (normalizedFilename == normalizedPropertyId) {
          if (index < property.gallery.size()) {
            return ?property.gallery[index];
          };
        };
        null;
      };
    };
  };
};
