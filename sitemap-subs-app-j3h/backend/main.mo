import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import List "mo:base/List";
import Char "mo:base/Char";
import Blob "mo:base/Blob";
import Migration "migration";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

// Specify the data migration function in with-clause
(with migration = Migration.run)
actor {
  // Enable blob storage
  let storage = Storage.new();
  include MixinStorage(storage);

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

  // Extended role type for business logic
  public type BusinessRole = {
    #admin;
    #sales;
    #billing;
    #viewer;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : AccessControl.UserRole;
    businessRole : BusinessRole;
    tenantId : Text;
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

  // Helper function to get caller's business role
  func getCallerBusinessRole(caller : Principal) : ?BusinessRole {
    switch (principalMap.get(userProfiles, caller)) {
      case null null;
      case (?profile) ?profile.businessRole;
    };
  };

  // Helper function to get caller's tenant
  func getCallerTenantId(caller : Principal) : ?Text {
    switch (principalMap.get(userProfiles, caller)) {
      case null null;
      case (?profile) ?profile.tenantId;
    };
  };

  // Helper function to check if caller has sales access
  func hasSalesAccess(caller : Principal) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (getCallerBusinessRole(caller)) {
      case null false;
      case (?#admin) true;
      case (?#sales) true;
      case _ false;
    };
  };

  // Helper function to check if caller has billing access
  func hasBillingAccess(caller : Principal) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (getCallerBusinessRole(caller)) {
      case null false;
      case (?#admin) true;
      case (?#billing) true;
      case _ false;
    };
  };

  // Helper function to check if caller has write access (not viewer)
  func hasWriteAccess(caller : Principal) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (getCallerBusinessRole(caller)) {
      case null false;
      case (?#viewer) false;
      case _ true;
    };
  };

  // CRM Module
  public type Contact = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    company : Text;
    tags : [Text];
    tenantId : Text;
    createdBy : Principal;
    createdAt : Int;
    updatedAt : Int;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var contacts = textMap.empty<Contact>();

  public shared ({ caller }) func addContact(contact : Contact) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can add contacts");
    };
    if (not hasSalesAccess(caller)) {
      Debug.trap("Unauthorized: Only admin or sales roles can add contacts");
    };
    if (not hasWriteAccess(caller)) {
      Debug.trap("Unauthorized: Viewers cannot add contacts");
    };
    // Verify tenant matches caller's tenant
    switch (getCallerTenantId(caller)) {
      case null Debug.trap("User profile not found");
      case (?tenantId) {
        if (contact.tenantId != tenantId and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Cannot add contacts to other tenants");
        };
      };
    };
    contacts := textMap.put(contacts, contact.id, contact);
  };

  public shared ({ caller }) func updateContact(contact : Contact) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can update contacts");
    };
    if (not hasSalesAccess(caller)) {
      Debug.trap("Unauthorized: Only admin or sales roles can update contacts");
    };
    if (not hasWriteAccess(caller)) {
      Debug.trap("Unauthorized: Viewers cannot update contacts");
    };
    // Verify tenant matches caller's tenant
    switch (getCallerTenantId(caller)) {
      case null Debug.trap("User profile not found");
      case (?tenantId) {
        if (contact.tenantId != tenantId and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Cannot update contacts from other tenants");
        };
      };
    };
    contacts := textMap.put(contacts, contact.id, contact);
  };

  public shared ({ caller }) func deleteContact(contactId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can delete contacts");
    };
    if (not hasSalesAccess(caller)) {
      Debug.trap("Unauthorized: Only admin or sales roles can delete contacts");
    };
    if (not hasWriteAccess(caller)) {
      Debug.trap("Unauthorized: Viewers cannot delete contacts");
    };
    // Verify tenant matches
    switch (textMap.get(contacts, contactId)) {
      case null Debug.trap("Contact not found");
      case (?contact) {
        switch (getCallerTenantId(caller)) {
          case null Debug.trap("User profile not found");
          case (?tenantId) {
            if (contact.tenantId != tenantId and not AccessControl.isAdmin(accessControlState, caller)) {
              Debug.trap("Unauthorized: Cannot delete contacts from other tenants");
            };
          };
        };
      };
    };
    contacts := textMap.delete(contacts, contactId);
  };

  public query ({ caller }) func getContacts() : async [Contact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view contacts");
    };
    if (not hasSalesAccess(caller)) {
      Debug.trap("Unauthorized: Only admin or sales roles can view contacts");
    };
    // Filter by tenant
    let callerTenantId = getCallerTenantId(caller);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = textMap.mapFilter<Contact, Contact>(
      contacts,
      func(_id, contact) {
        if (isAdmin) {
          ?contact;
        } else {
          switch (callerTenantId) {
            case null null;
            case (?tenantId) {
              if (contact.tenantId == tenantId) {
                ?contact;
              } else {
                null;
              };
            };
          };
        };
      },
    );
    Iter.toArray(textMap.vals(filtered));
  };

  public query ({ caller }) func searchContacts(searchTerm : Text) : async [Contact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can search contacts");
    };
    if (not hasSalesAccess(caller)) {
      Debug.trap("Unauthorized: Only admin or sales roles can search contacts");
    };
    let callerTenantId = getCallerTenantId(caller);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let results = textMap.mapFilter<Contact, Contact>(
      contacts,
      func(_id, contact) {
        let matchesSearch = Text.contains(contact.name, #text searchTerm) or
          Text.contains(contact.email, #text searchTerm) or
          Text.contains(contact.company, #text searchTerm);

        if (not matchesSearch) {
          return null;
        };

        if (isAdmin) {
          ?contact;
        } else {
          switch (callerTenantId) {
            case null null;
            case (?tenantId) {
              if (contact.tenantId == tenantId) {
                ?contact;
              } else {
                null;
              };
            };
          };
        };
      },
    );
    Iter.toArray(textMap.vals(results));
  };

  // Billing Module
  public type Invoice = {
    id : Text;
    customerId : Text;
    amount : Nat;
    currency : Text;
    status : Text;
    tenantId : Text;
    createdBy : Principal;
    createdAt : Int;
    updatedAt : Int;
  };

  var invoices = textMap.empty<Invoice>();

  public shared ({ caller }) func createInvoice(invoice : Invoice) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can create invoices");
    };
    if (not hasBillingAccess(caller)) {
      Debug.trap("Unauthorized: Only admin or billing roles can create invoices");
    };
    if (not hasWriteAccess(caller)) {
      Debug.trap("Unauthorized: Viewers cannot create invoices");
    };
    // Verify tenant matches
    switch (getCallerTenantId(caller)) {
      case null Debug.trap("User profile not found");
      case (?tenantId) {
        if (invoice.tenantId != tenantId and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Cannot create invoices for other tenants");
        };
      };
    };
    invoices := textMap.put(invoices, invoice.id, invoice);
  };

  public shared ({ caller }) func updateInvoice(invoice : Invoice) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can update invoices");
    };
    if (not hasBillingAccess(caller)) {
      Debug.trap("Unauthorized: Only admin or billing roles can update invoices");
    };
    if (not hasWriteAccess(caller)) {
      Debug.trap("Unauthorized: Viewers cannot update invoices");
    };
    // Verify tenant matches
    switch (getCallerTenantId(caller)) {
      case null Debug.trap("User profile not found");
      case (?tenantId) {
        if (invoice.tenantId != tenantId and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Cannot update invoices from other tenants");
        };
      };
    };
    invoices := textMap.put(invoices, invoice.id, invoice);
  };

  public query ({ caller }) func getInvoices() : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view invoices");
    };
    // Sales can view invoices (limited view per spec), billing and admin have full access
    let callerTenantId = getCallerTenantId(caller);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = textMap.mapFilter<Invoice, Invoice>(
      invoices,
      func(_id, invoice) {
        if (isAdmin) {
          ?invoice;
        } else {
          switch (callerTenantId) {
            case null null;
            case (?tenantId) {
              if (invoice.tenantId == tenantId) {
                ?invoice;
              } else {
                null;
              };
            };
          };
        };
      },
    );
    Iter.toArray(textMap.vals(filtered));
  };

  public query ({ caller }) func searchInvoices(searchTerm : Text) : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can search invoices");
    };
    let callerTenantId = getCallerTenantId(caller);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let results = textMap.mapFilter<Invoice, Invoice>(
      invoices,
      func(_id, invoice) {
        let matchesSearch = Text.contains(invoice.customerId, #text searchTerm) or
          Text.contains(invoice.status, #text searchTerm);

        if (not matchesSearch) {
          return null;
        };

        if (isAdmin) {
          ?invoice;
        } else {
          switch (callerTenantId) {
            case null null;
            case (?tenantId) {
              if (invoice.tenantId == tenantId) {
                ?invoice;
              } else {
                null;
              };
            };
          };
        };
      },
    );
    Iter.toArray(textMap.vals(results));
  };

  // Product Catalog
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    currency : Text;
    tenantId : Text;
    createdBy : Principal;
    createdAt : Int;
    updatedAt : Int;
  };

  var products = textMap.empty<Product>();

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can add products");
    };
    // Admin and sales can add products
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasSalesAccess(caller))) {
      Debug.trap("Unauthorized: Only admin or sales roles can add products");
    };
    if (not hasWriteAccess(caller)) {
      Debug.trap("Unauthorized: Viewers cannot add products");
    };
    // Verify tenant matches
    switch (getCallerTenantId(caller)) {
      case null Debug.trap("User profile not found");
      case (?tenantId) {
        if (product.tenantId != tenantId and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Cannot add products for other tenants");
        };
      };
    };
    products := textMap.put(products, product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can update products");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasSalesAccess(caller))) {
      Debug.trap("Unauthorized: Only admin or sales roles can update products");
    };
    if (not hasWriteAccess(caller)) {
      Debug.trap("Unauthorized: Viewers cannot update products");
    };
    // Verify tenant matches
    switch (getCallerTenantId(caller)) {
      case null Debug.trap("User profile not found");
      case (?tenantId) {
        if (product.tenantId != tenantId and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Cannot update products from other tenants");
        };
      };
    };
    products := textMap.put(products, product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can delete products");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or hasSalesAccess(caller))) {
      Debug.trap("Unauthorized: Only admin or sales roles can delete products");
    };
    if (not hasWriteAccess(caller)) {
      Debug.trap("Unauthorized: Viewers cannot delete products");
    };
    // Verify tenant matches
    switch (textMap.get(products, productId)) {
      case null Debug.trap("Product not found");
      case (?product) {
        switch (getCallerTenantId(caller)) {
          case null Debug.trap("User profile not found");
          case (?tenantId) {
            if (product.tenantId != tenantId and not AccessControl.isAdmin(accessControlState, caller)) {
              Debug.trap("Unauthorized: Cannot delete products from other tenants");
            };
          };
        };
      };
    };
    products := textMap.delete(products, productId);
  };

  public query ({ caller }) func getProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view products");
    };
    // All authenticated users can view products (sales needs access per spec)
    let callerTenantId = getCallerTenantId(caller);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = textMap.mapFilter<Product, Product>(
      products,
      func(_id, product) {
        if (isAdmin) {
          ?product;
        } else {
          switch (callerTenantId) {
            case null null;
            case (?tenantId) {
              if (product.tenantId == tenantId) {
                ?product;
              } else {
                null;
              };
            };
          };
        };
      },
    );
    Iter.toArray(textMap.vals(filtered));
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can search products");
    };
    let callerTenantId = getCallerTenantId(caller);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let results = textMap.mapFilter<Product, Product>(
      products,
      func(_id, product) {
        let matchesSearch = Text.contains(product.name, #text searchTerm) or
          Text.contains(product.description, #text searchTerm);

        if (not matchesSearch) {
          return null;
        };

        if (isAdmin) {
          ?product;
        } else {
          switch (callerTenantId) {
            case null null;
            case (?tenantId) {
              if (product.tenantId == tenantId) {
                ?product;
              } else {
                null;
              };
            };
          };
        };
      },
    );
    Iter.toArray(textMap.vals(results));
  };

  // Stripe integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query ({ caller }) func isStripeConfigured() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can check Stripe configuration");
    };
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Feature Toggles
  public type FeatureToggle = {
    featureName : Text;
    isEnabled : Bool;
  };

  var featureToggles = textMap.empty<FeatureToggle>();

  public shared ({ caller }) func setFeatureToggle(toggle : FeatureToggle) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set feature toggles");
    };
    featureToggles := textMap.put(featureToggles, toggle.featureName, toggle);
  };

  public query ({ caller }) func getFeatureToggles() : async [FeatureToggle] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view feature toggles");
    };
    Iter.toArray(textMap.vals(featureToggles));
  };

  // Payment Provider Configurations
  public type PaymentProviderConfig = {
    providerName : Text;
    apiKeyHash : Blob;
    allowedCountries : [Text];
    createdAt : Int;
  };

  var paymentConfigs = textMap.empty<PaymentProviderConfig>();

  public shared ({ caller }) func addPaymentProviderConfig(config : PaymentProviderConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add payment provider configs");
    };
    paymentConfigs := textMap.put(paymentConfigs, config.providerName, config);
  };

  public query ({ caller }) func getPaymentProviderConfigs() : async [PaymentProviderConfig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view payment provider configs");
    };
    Iter.toArray(textMap.vals(paymentConfigs));
  };

  // System Configuration
  public type SystemConfig = {
    id : Text;
    value : Text;
    updatedAt : Int;
  };

  var systemConfigs = textMap.empty<SystemConfig>();

  public shared ({ caller }) func setSystemConfig(config : SystemConfig) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set system configs");
    };
    systemConfigs := textMap.put(systemConfigs, config.id, config);
  };

  public query ({ caller }) func getSystemConfigs() : async [SystemConfig] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view system configs");
    };
    Iter.toArray(textMap.vals(systemConfigs));
  };

  // Sitemap Management
  public type SitemapData = {
    auto : [Text];
    manualPages : [Text];
    controlledRoutes : [(Text, Text)];
  };

  var sitemapData : SitemapData = {
    auto = [];
    manualPages = [
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
      "ZKProof"
    ];
    controlledRoutes = [("broadcast", "Secoinfi-App"), ("remote", "Secoinfi-App"), ("live", "Secoinfi-App")];
  };

  public shared ({ caller }) func addManualPage(slug : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add manual pages");
    };

    // Validate lowercase and uniqueness
    if (not isLowercase(slug)) {
      Debug.trap("Slug must be lowercase");
    };

    if (Text.contains(slug, #text " ")) {
      Debug.trap("Slug must not contain spaces");
    };

    // Check uniqueness across all layers
    if (existsInSitemap(slug)) {
      Debug.trap("Slug already exists in sitemap");
    };

    // Prevent modification of controlled routes
    if (isControlledRoute(slug)) {
      Debug.trap("Cannot modify controlled routes");
    };

    let newManualPages = List.push(slug, List.fromArray(sitemapData.manualPages));
    sitemapData := {
      sitemapData with
      manualPages = List.toArray(newManualPages)
    };
  };

  public query func getSitemapData() : async SitemapData {
    sitemapData;
  };

  func isLowercase(text : Text) : Bool {
    let chars = Text.toIter(text);
    let charList = Iter.toArray(chars);
    for (char in charList.vals()) {
      if (Char.toNat32(char) >= 65 and Char.toNat32(char) <= 90) { // ASCII range for uppercase letters
        return false;
      };
    };
    true;
  };

  func existsInSitemap(slug : Text) : Bool {
    // Check auto pages
    for (page in sitemapData.auto.vals()) {
      if (page == slug) {
        return true;
      };
    };

    // Check manual pages
    for (page in sitemapData.manualPages.vals()) {
      if (page == slug) {
        return true;
      };
    };

    // Check controlled routes
    for ((route, _) in sitemapData.controlledRoutes.vals()) {
      if (route == slug) {
        return true;
      };
    };

    false;
  };

  func isControlledRoute(slug : Text) : Bool {
    for ((route, _) in sitemapData.controlledRoutes.vals()) {
      if (route == slug) {
        return true;
      };
    };
    false;
  };

  // CSV Import Placeholder
  public shared ({ caller }) func importContactsFromCSV(_csvData : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can import contacts");
    };
    if (not hasSalesAccess(caller)) {
      Debug.trap("Unauthorized: Only admin or sales roles can import contacts");
    };
    if (not hasWriteAccess(caller)) {
      Debug.trap("Unauthorized: Viewers cannot import contacts");
    };
    // CSV parsing and contact creation logic to be implemented
  };

  // WhatsApp Catalog Sharing Placeholder
  public shared ({ caller }) func shareCatalogOnWhatsApp(_catalogId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can share catalogs");
    };
    if (not hasSalesAccess(caller)) {
      Debug.trap("Unauthorized: Only admin or sales roles can share catalogs");
    };
    // WhatsApp integration logic to be implemented
  };

  // Map Integration Placeholder
  public query func getMapIntegrationData() : async Text {
    // Public data, no auth required
    "Map integration data placeholder";
  };

  // Multi-Tenant Support
  public type Tenant = {
    id : Text;
    name : Text;
    createdAt : Int;
  };

  var tenants = textMap.empty<Tenant>();

  public shared ({ caller }) func addTenant(tenant : Tenant) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add tenants");
    };
    tenants := textMap.put(tenants, tenant.id, tenant);
  };

  public query ({ caller }) func getTenants() : async [Tenant] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view tenants");
    };
    Iter.toArray(textMap.vals(tenants));
  };

  // Helper Functions
  public query func getCurrentTime() : async Int {
    Time.now();
  };

  public query func getSystemStatus() : async Text {
    "System is operational";
  };
};
