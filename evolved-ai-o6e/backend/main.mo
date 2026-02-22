import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import List "mo:base/List";
import Migration "migration";

(with migration = Migration.run)
actor MainAdmin {
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

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
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

  // Module configuration types
  public type ModuleConfig = {
    id : Text;
    name : Text;
    enabled : Bool;
    settings : [(Text, Text)];
  };

  public type Blueprint = {
    id : Text;
    name : Text;
    instructions : Text;
  };

  public type Fixture = {
    id : Text;
    name : Text;
    data : Text;
  };

  // OrderedMap instances
  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  // State variables
  var moduleConfigs = textMap.empty<ModuleConfig>();
  var blueprints = textMap.empty<Blueprint>();
  var fixtures = textMap.empty<Fixture>();

  // Menu item type
  public type MenuItem = {
    id : Text;
    name : Text;
    category : Text;
  };

  // Menu items state
  var menuItems = textMap.empty<MenuItem>();

  // Initialize default modules and menu items
  public shared ({ caller }) func initializeDefaultModules() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can initialize modules");
    };

    let defaultModules = [
      {
        id = "onboarding";
        name = "Onboarding";
        enabled = true;
        settings = [("welcomeMessage", "Welcome to Evolved-AI")];
      },
      {
        id = "search";
        name = "Search";
        enabled = true;
        settings = [("searchEngine", "default")];
      },
      {
        id = "payments";
        name = "Payments";
        enabled = true;
        settings = [("currency", "USD")];
      },
      {
        id = "analytics";
        name = "Analytics";
        enabled = true;
        settings = [("trackingEnabled", "true")];
      },
      {
        id = "integrations";
        name = "Integrations";
        enabled = true;
        settings = [("crm", "none")];
      },
      {
        id = "moderation";
        name = "Moderation";
        enabled = true;
        settings = [("contentFilter", "basic")];
      },
      {
        id = "localization";
        name = "Localization";
        enabled = true;
        settings = [("defaultLanguage", "en")];
      },
      {
        id = "performance";
        name = "Performance";
        enabled = true;
        settings = [("caching", "enabled")];
      },
      {
        id = "security";
        name = "Security";
        enabled = true;
        settings = [("encryption", "AES-256")];
      },
    ];

    for (mod in Iter.fromArray(defaultModules)) {
      moduleConfigs := textMap.put(moduleConfigs, mod.id, mod);
    };

    let defaultMenuItems = [
      {
        id = "home";
        name = "Home";
        category = "navigation";
      },
      {
        id = "search";
        name = "Search";
        category = "navigation";
      },
      {
        id = "dashboard";
        name = "Dashboard";
        category = "navigation";
      },
      {
        id = "profile";
        name = "Profile";
        category = "user";
      },
      {
        id = "payments";
        name = "Payments";
        category = "modules";
      },
      {
        id = "integrations";
        name = "Integrations";
        category = "modules";
      },
      {
        id = "moderation";
        name = "Moderation";
        category = "modules";
      },
      {
        id = "docs";
        name = "Docs";
        category = "resources";
      },
      {
        id = "api";
        name = "API";
        category = "resources";
      },
      {
        id = "status";
        name = "Status";
        category = "system";
      },
      {
        id = "localization";
        name = "Localization";
        category = "modules";
      },
      {
        id = "user-actions";
        name = "User actions";
        category = "actions";
      },
      {
        id = "contextual-actions";
        name = "Contextual actions";
        category = "actions";
      },
      {
        id = "shortcuts";
        name = "Shortcuts";
        category = "actions";
      },
      {
        id = "help-support";
        name = "Help & support";
        category = "resources";
      },
      {
        id = "marketing";
        name = "Marketing";
        category = "modules";
      },
      {
        id = "legal";
        name = "Legal";
        category = "system";
      },
      {
        id = "developer";
        name = "Developer";
        category = "resources";
      },
    ];

    for (item in Iter.fromArray(defaultMenuItems)) {
      menuItems := textMap.put(menuItems, item.id, item);
    };
  };

  // Get all module configurations
  public query ({ caller }) func getAllModuleConfigs() : async [ModuleConfig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view module configs");
    };
    Iter.toArray(textMap.vals(moduleConfigs));
  };

  // Update module configuration
  public shared ({ caller }) func updateModuleConfig(config : ModuleConfig) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can update module configs");
    };
    moduleConfigs := textMap.put(moduleConfigs, config.id, config);
  };

  // Add blueprint
  public shared ({ caller }) func addBlueprint(blueprint : Blueprint) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can add blueprints");
    };
    blueprints := textMap.put(blueprints, blueprint.id, blueprint);
  };

  // Update blueprint
  public shared ({ caller }) func updateBlueprint(blueprint : Blueprint) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can update blueprints");
    };
    blueprints := textMap.put(blueprints, blueprint.id, blueprint);
  };

  // Get all blueprints
  public query ({ caller }) func getAllBlueprints() : async [Blueprint] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view blueprints");
    };
    Iter.toArray(textMap.vals(blueprints));
  };

  // Add fixture
  public shared ({ caller }) func addFixture(fixture : Fixture) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can add fixtures");
    };
    fixtures := textMap.put(fixtures, fixture.id, fixture);
  };

  // Update fixture
  public shared ({ caller }) func updateFixture(fixture : Fixture) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can update fixtures");
    };
    fixtures := textMap.put(fixtures, fixture.id, fixture);
  };

  // Get all fixtures
  public query ({ caller }) func getAllFixtures() : async [Fixture] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view fixtures");
    };
    Iter.toArray(textMap.vals(fixtures));
  };

  // Import CSV fixture
  public shared ({ caller }) func importCsvFixture(id : Text, name : Text, data : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can import CSV fixtures");
    };
    let fixture : Fixture = {
      id;
      name;
      data;
    };
    fixtures := textMap.put(fixtures, id, fixture);
  };

  // Import YAML pipeline
  public shared ({ caller }) func importYamlPipeline(id : Text, name : Text, instructions : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can import YAML pipelines");
    };
    let blueprint : Blueprint = {
      id;
      name;
      instructions;
    };
    blueprints := textMap.put(blueprints, id, blueprint);
  };

  // Get module by ID
  public query ({ caller }) func getModuleConfig(id : Text) : async ?ModuleConfig {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view module configs");
    };
    textMap.get(moduleConfigs, id);
  };

  // Get blueprint by ID
  public query ({ caller }) func getBlueprint(id : Text) : async ?Blueprint {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view blueprints");
    };
    textMap.get(blueprints, id);
  };

  // Get fixture by ID
  public query ({ caller }) func getFixture(id : Text) : async ?Fixture {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view fixtures");
    };
    textMap.get(fixtures, id);
  };

  // Delete module
  public shared ({ caller }) func deleteModuleConfig(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can delete modules");
    };
    moduleConfigs := textMap.delete(moduleConfigs, id);
  };

  // Delete blueprint
  public shared ({ caller }) func deleteBlueprint(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can delete blueprints");
    };
    blueprints := textMap.delete(blueprints, id);
  };

  // Delete fixture
  public shared ({ caller }) func deleteFixture(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can delete fixtures");
    };
    fixtures := textMap.delete(fixtures, id);
  };

  // Get enabled modules
  public query ({ caller }) func getEnabledModules() : async [ModuleConfig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view enabled modules");
    };

    var enabledModulesList = List.nil<ModuleConfig>();
    for (mod in Iter.fromArray(Iter.toArray(textMap.vals(moduleConfigs)))) {
      if (mod.enabled) {
        enabledModulesList := List.push(mod, enabledModulesList);
      };
    };
    List.toArray(enabledModulesList);
  };

  // Get all menu items (public - no auth required for global search)
  public query func getAllMenuItems() : async [MenuItem] {
    Iter.toArray(textMap.vals(menuItems));
  };

  // Search menu items (public - no auth required for global search)
  public query func searchMenuItems(searchTerm : Text) : async [MenuItem] {
    let lowerSearchTerm = Text.toLowercase(searchTerm);
    var resultsList = List.nil<MenuItem>();

    for (item in Iter.fromArray(Iter.toArray(textMap.vals(menuItems)))) {
      let lowerName = Text.toLowercase(item.name);
      let lowerCategory = Text.toLowercase(item.category);

      if (Text.contains(lowerName, #text lowerSearchTerm) or Text.contains(lowerCategory, #text lowerSearchTerm)) {
        resultsList := List.push(item, resultsList);
      };
    };

    List.toArray(resultsList);
  };

  // Get menu item by ID (requires user permission)
  public query ({ caller }) func getMenuItem(id : Text) : async ?MenuItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view menu item details");
    };
    textMap.get(menuItems, id);
  };

  // Add menu item (admin only)
  public shared ({ caller }) func addMenuItem(item : MenuItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can add menu items");
    };
    menuItems := textMap.put(menuItems, item.id, item);
  };

  // Update menu item (admin only)
  public shared ({ caller }) func updateMenuItem(item : MenuItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can update menu items");
    };
    menuItems := textMap.put(menuItems, item.id, item);
  };

  // Delete menu item (admin only)
  public shared ({ caller }) func deleteMenuItem(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Debug.trap("Unauthorized: Only admins can delete menu items");
    };
    menuItems := textMap.delete(menuItems, id);
  };
};
