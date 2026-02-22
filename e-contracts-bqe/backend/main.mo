import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

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
    isSubscriber : Bool;
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

  // Helper function to check if user is a subscriber
  func isSubscriber(caller : Principal) : Bool {
    switch (principalMap.get(userProfiles, caller)) {
      case (null) { false };
      case (?profile) { profile.isSubscriber };
    };
  };

  // Contract Management Types
  public type ContractStatus = {
    #draft;
    #active;
    #completed;
    #cancelled;
  };

  public type Contract = {
    id : Text;
    title : Text;
    content : Text;
    status : ContractStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    owner : Principal;
    parties : [Principal];
  };

  public type ContractTemplate = {
    id : Text;
    name : Text;
    fields : [Text];
    content : Text;
    createdAt : Time.Time;
    category : Text;
    size : Nat;
    format : Text;
    previewImage : Text;
    fileReference : ?Storage.ExternalBlob;
    dynamicStructure : ?Text;
  };

  public type UserPreferences = {
    voiceEnabled : Bool;
    ttsEnabled : Bool;
    accessibilityMode : Bool;
  };

  // Theme Types
  public type Theme = {
    #normal;
    #dark;
    #vibgyor;
  };

  public type ThemeSettings = {
    theme : Theme;
    lastUpdated : Time.Time;
  };

  // Initialize OrderedMap operations
  transient let textMap = OrderedMap.Make<Text>(Text.compare);

  // Storage for contracts, templates, and preferences
  var contracts = textMap.empty<Contract>();
  var templates = textMap.empty<ContractTemplate>();
  var preferences = principalMap.empty<UserPreferences>();
  var themeSettings = principalMap.empty<ThemeSettings>();

  // Contract Operations
  public shared ({ caller }) func createContract(title : Text, content : Text, parties : [Principal]) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create contracts");
    };
    if (not isSubscriber(caller)) {
      Debug.trap("Unauthorized: Only subscribers can create contracts");
    };

    let id = Text.concat(title, Text.concat("-", debug_show (Time.now())));
    let contract : Contract = {
      id;
      title;
      content;
      status = #draft;
      createdAt = Time.now();
      updatedAt = Time.now();
      owner = caller;
      parties;
    };

    contracts := textMap.put(contracts, id, contract);
    id;
  };

  public shared ({ caller }) func updateContract(id : Text, title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update contracts");
    };

    switch (textMap.get(contracts, id)) {
      case (null) { Debug.trap("Contract not found") };
      case (?contract) {
        if (contract.owner != caller) {
          Debug.trap("Unauthorized: Only the owner can update this contract");
        };
        if (contract.status != #draft) {
          Debug.trap("Only draft contracts can be updated");
        };

        let updatedContract : Contract = {
          contract with
          title;
          content;
          updatedAt = Time.now();
        };

        contracts := textMap.put(contracts, id, updatedContract);
      };
    };
  };

  public shared ({ caller }) func deleteContract(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can delete contracts");
    };

    switch (textMap.get(contracts, id)) {
      case (null) { Debug.trap("Contract not found") };
      case (?contract) {
        if (contract.owner != caller) {
          Debug.trap("Unauthorized: Only the owner can delete this contract");
        };
        if (contract.status != #draft) {
          Debug.trap("Only draft contracts can be deleted");
        };

        contracts := textMap.delete(contracts, id);
      };
    };
  };

  public shared ({ caller }) func changeContractStatus(id : Text, newStatus : ContractStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can change contract status");
    };

    switch (textMap.get(contracts, id)) {
      case (null) { Debug.trap("Contract not found") };
      case (?contract) {
        if (contract.owner != caller) {
          Debug.trap("Unauthorized: Only the owner can change contract status");
        };

        let updatedContract : Contract = {
          contract with
          status = newStatus;
          updatedAt = Time.now();
        };

        contracts := textMap.put(contracts, id, updatedContract);
      };
    };
  };

  public query ({ caller }) func getContract(id : Text) : async ?Contract {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view contracts");
    };

    switch (textMap.get(contracts, id)) {
      case (null) { null };
      case (?contract) {
        // Allow access if caller is owner, a party, or admin
        if (contract.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?contract;
        } else {
          // Check if caller is in parties list
          let isParty = Array.find<Principal>(contract.parties, func(p : Principal) : Bool { p == caller });
          switch (isParty) {
            case (?_) { ?contract };
            case (null) { Debug.trap("Unauthorized: You don't have access to this contract") };
          };
        };
      };
    };
  };

  public query ({ caller }) func getAllContracts() : async [Contract] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view contracts");
    };

    // Admins can see all contracts
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return Iter.toArray(textMap.vals(contracts));
    };

    // Regular users only see their own contracts or contracts they're party to
    Iter.toArray(
      Iter.filter(
        textMap.vals(contracts),
        func(contract : Contract) : Bool {
          if (contract.owner == caller) {
            return true;
          };
          let isParty = Array.find<Principal>(contract.parties, func(p : Principal) : Bool { p == caller });
          switch (isParty) {
            case (?_) { true };
            case (null) { false };
          };
        },
      )
    );
  };

  public query ({ caller }) func getContractsByStatus(status : ContractStatus) : async [Contract] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view contracts");
    };

    // Admins can see all contracts
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return Iter.toArray(
        Iter.filter(
          textMap.vals(contracts),
          func(contract : Contract) : Bool {
            contract.status == status;
          },
        )
      );
    };

    // Regular users only see their own contracts or contracts they're party to
    Iter.toArray(
      Iter.filter(
        textMap.vals(contracts),
        func(contract : Contract) : Bool {
          if (contract.status != status) {
            return false;
          };
          if (contract.owner == caller) {
            return true;
          };
          let isParty = Array.find<Principal>(contract.parties, func(p : Principal) : Bool { p == caller });
          switch (isParty) {
            case (?_) { true };
            case (null) { false };
          };
        },
      )
    );
  };

  // Template Operations
  public shared ({ caller }) func createTemplate(name : Text, fields : [Text], content : Text, category : Text, size : Nat, format : Text, previewImage : Text, fileReference : ?Storage.ExternalBlob, dynamicStructure : ?Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create templates");
    };

    let id = Text.concat(name, Text.concat("-", debug_show (Time.now())));
    let template : ContractTemplate = {
      id;
      name;
      fields;
      content;
      createdAt = Time.now();
      category;
      size;
      format;
      previewImage;
      fileReference;
      dynamicStructure;
    };

    templates := textMap.put(templates, id, template);
    id;
  };

  public shared ({ caller }) func updateTemplate(id : Text, name : Text, fields : [Text], content : Text, category : Text, size : Nat, format : Text, previewImage : Text, fileReference : ?Storage.ExternalBlob, dynamicStructure : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update templates");
    };

    switch (textMap.get(templates, id)) {
      case (null) { Debug.trap("Template not found") };
      case (?template) {
        let updatedTemplate : ContractTemplate = {
          template with
          name;
          fields;
          content;
          category;
          size;
          format;
          previewImage;
          fileReference;
          dynamicStructure;
        };

        templates := textMap.put(templates, id, updatedTemplate);
      };
    };
  };

  public shared ({ caller }) func deleteTemplate(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete templates");
    };

    switch (textMap.get(templates, id)) {
      case (null) { Debug.trap("Template not found") };
      case (?_) {
        templates := textMap.delete(templates, id);
      };
    };
  };

  public query ({ caller }) func getTemplate(id : Text) : async ?ContractTemplate {
    // Subscribers can view full template details
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view template details");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view full template details");
    };
    textMap.get(templates, id);
  };

  public query ({ caller }) func getAllTemplates() : async [ContractTemplate] {
    // Subscribers can view all templates
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view templates");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view all templates");
    };
    Iter.toArray(textMap.vals(templates));
  };

  public query ({ caller }) func getTemplatesByCategory(category : Text) : async [ContractTemplate] {
    // Subscribers can view templates by category
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view templates");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view templates");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(templates),
        func(template : ContractTemplate) : Bool {
          template.category == category;
        },
      )
    );
  };

  public query ({ caller }) func getTemplatesByFormat(format : Text) : async [ContractTemplate] {
    // Subscribers can view templates by format
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view templates");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view templates");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(templates),
        func(template : ContractTemplate) : Bool {
          template.format == format;
        },
      )
    );
  };

  public query ({ caller }) func getTemplatesBySizeRange(minSize : Nat, maxSize : Nat) : async [ContractTemplate] {
    // Subscribers can view templates by size range
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view templates");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view templates");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(templates),
        func(template : ContractTemplate) : Bool {
          template.size >= minSize and template.size <= maxSize
        },
      )
    );
  };

  // Public template subjects - accessible to everyone including guests
  public query func getPublicTemplateSubjects() : async [{ id : Text; name : Text; category : Text; previewImage : Text }] {
    Iter.toArray(
      Iter.map(
        textMap.vals(templates),
        func(template : ContractTemplate) : { id : Text; name : Text; category : Text; previewImage : Text } {
          {
            id = template.id;
            name = template.name;
            category = template.category;
            previewImage = template.previewImage;
          };
        },
      )
    );
  };

  public query ({ caller }) func getDynamicTemplateStructure(id : Text) : async ?Text {
    // Subscribers can view dynamic template structure
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view template structure");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view template structure");
    };
    switch (textMap.get(templates, id)) {
      case (null) { null };
      case (?template) { template.dynamicStructure };
    };
  };

  // Pagination Support for Templates
  public type PaginatedResult<T> = {
    items : [T];
    totalItems : Nat;
    totalPages : Nat;
    currentPage : Nat;
    pageSize : Nat;
    hasNextPage : Bool;
    hasPreviousPage : Bool;
  };

  // Public pagination - accessible to everyone including guests for browsing
  public query func getPaginatedTemplates(page : Nat, pageSize : Nat) : async PaginatedResult<{
    id : Text;
    name : Text;
    category : Text;
    previewImage : Text;
  }> {
    let allTemplates = Iter.toArray(textMap.vals(templates));
    let totalItems = allTemplates.size();
    let totalPages = if (totalItems == 0) { 1 } else { (totalItems + pageSize - 1) / pageSize };

    let currentPage = if (page == 0) { 1 } else if (page > totalPages) { totalPages } else { page };
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = if (startIndex + pageSize > totalItems) { totalItems } else { startIndex + pageSize };

    let paginatedItems = Array.tabulate<{
      id : Text;
      name : Text;
      category : Text;
      previewImage : Text;
    }>(
      endIndex - startIndex,
      func(i : Nat) : {
        id : Text;
        name : Text;
        category : Text;
        previewImage : Text;
      } {
        let template = allTemplates[startIndex + i];
        {
          id = template.id;
          name = template.name;
          category = template.category;
          previewImage = template.previewImage;
        };
      },
    );

    {
      items = paginatedItems;
      totalItems;
      totalPages;
      currentPage;
      pageSize;
      hasNextPage = currentPage < totalPages;
      hasPreviousPage = currentPage > 1;
    };
  };

  // Public pagination by category - accessible to everyone including guests
  public query func getPaginatedTemplatesByCategory(category : Text, page : Nat, pageSize : Nat) : async PaginatedResult<{
    id : Text;
    name : Text;
    category : Text;
    previewImage : Text;
  }> {
    let filteredTemplates = Iter.toArray(
      Iter.filter(
        textMap.vals(templates),
        func(template : ContractTemplate) : Bool {
          template.category == category;
        },
      )
    );

    let totalItems = filteredTemplates.size();
    let totalPages = if (totalItems == 0) { 1 } else { (totalItems + pageSize - 1) / pageSize };

    let currentPage = if (page == 0) { 1 } else if (page > totalPages) { totalPages } else { page };
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = if (startIndex + pageSize > totalItems) { totalItems } else { startIndex + pageSize };

    let paginatedItems = Array.tabulate<{
      id : Text;
      name : Text;
      category : Text;
      previewImage : Text;
    }>(
      endIndex - startIndex,
      func(i : Nat) : {
        id : Text;
        name : Text;
        category : Text;
        previewImage : Text;
      } {
        let template = filteredTemplates[startIndex + i];
        {
          id = template.id;
          name = template.name;
          category = template.category;
          previewImage = template.previewImage;
        };
      },
    );

    {
      items = paginatedItems;
      totalItems;
      totalPages;
      currentPage;
      pageSize;
      hasNextPage = currentPage < totalPages;
      hasPreviousPage = currentPage > 1;
    };
  };

  // User Preferences Operations
  public shared ({ caller }) func savePreferences(prefs : UserPreferences) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save preferences");
    };
    preferences := principalMap.put(preferences, caller, prefs);
  };

  public query ({ caller }) func getPreferences() : async ?UserPreferences {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view preferences");
    };
    principalMap.get(preferences, caller);
  };

  // Theme Management Operations
  public shared ({ caller }) func setTheme(theme : Theme) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can set theme");
    };
    let settings : ThemeSettings = {
      theme;
      lastUpdated = Time.now();
    };
    themeSettings := principalMap.put(themeSettings, caller, settings);
  };

  public query ({ caller }) func getTheme() : async Theme {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get theme");
    };
    switch (principalMap.get(themeSettings, caller)) {
      case (null) { #normal };
      case (?settings) { settings.theme };
    };
  };

  // Static Content Types
  public type StaticPage = {
    id : Text;
    title : Text;
    content : Text;
    lastUpdated : Time.Time;
  };

  public type BlogPost = {
    id : Text;
    title : Text;
    content : Text;
    author : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type ContactFormSubmission = {
    id : Text;
    name : Text;
    email : Text;
    message : Text;
    submittedAt : Time.Time;
  };

  // Storage for static content
  var staticPages = textMap.empty<StaticPage>();
  var blogPosts = textMap.empty<BlogPost>();
  var contactForms = textMap.empty<ContactFormSubmission>();

  // Static Content Operations
  public shared ({ caller }) func createOrUpdateStaticPage(id : Text, title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can manage static pages");
    };

    let page : StaticPage = {
      id;
      title;
      content;
      lastUpdated = Time.now();
    };

    staticPages := textMap.put(staticPages, id, page);
  };

  // Public pages - accessible to everyone including guests
  public query func getStaticPage(id : Text) : async ?StaticPage {
    textMap.get(staticPages, id);
  };

  public query func getAllStaticPages() : async [StaticPage] {
    Iter.toArray(textMap.vals(staticPages));
  };

  // Blog Operations
  public shared ({ caller }) func createOrUpdateBlogPost(id : Text, title : Text, content : Text, author : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can manage blog posts");
    };

    let post : BlogPost = {
      id;
      title;
      content;
      author;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    blogPosts := textMap.put(blogPosts, id, post);
  };

  // Public blog posts - accessible to everyone including guests
  public query func getBlogPost(id : Text) : async ?BlogPost {
    textMap.get(blogPosts, id);
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    Iter.toArray(textMap.vals(blogPosts));
  };

  // Contact Form Operations - accessible to everyone including guests
  public shared func submitContactForm(name : Text, email : Text, message : Text) : async () {
    let id = Text.concat(name, Text.concat("-", debug_show (Time.now())));
    let submission : ContactFormSubmission = {
      id;
      name;
      email;
      message;
      submittedAt = Time.now();
    };

    contactForms := textMap.put(contactForms, id, submission);
  };

  public query ({ caller }) func getAllContactForms() : async [ContactFormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view contact forms");
    };

    Iter.toArray(textMap.vals(contactForms));
  };

  // Navigation Menu Structure - accessible to everyone including guests
  public type MenuItem = {
    id : Text;
    displayName : Text;
    url : Text;
    requiresAdmin : Bool;
  };

  public query func getNavigationMenu() : async [MenuItem] {
    [
      {
        id = "home";
        displayName = "Home";
        url = "/";
        requiresAdmin = false;
      },
      {
        id = "dashboard";
        displayName = "Dashboard";
        url = "/dashboard";
        requiresAdmin = true;
      },
      {
        id = "features";
        displayName = "Features";
        url = "/features";
        requiresAdmin = true;
      },
      {
        id = "blog";
        displayName = "Blog";
        url = "/blog";
        requiresAdmin = false;
      },
      {
        id = "about-us";
        displayName = "About Us";
        url = "/about-us";
        requiresAdmin = false;
      },
      {
        id = "pros-of-e-contracts";
        displayName = "Pros of e-Contracts";
        url = "/pros-of-e-contracts";
        requiresAdmin = false;
      },
      {
        id = "what-we-do";
        displayName = "What We Do";
        url = "/what-we-do";
        requiresAdmin = false;
      },
      {
        id = "why-us";
        displayName = "Why Us";
        url = "/why-us";
        requiresAdmin = false;
      },
      {
        id = "contact-us";
        displayName = "Contact Us";
        url = "/contact-us";
        requiresAdmin = false;
      },
      {
        id = "faq";
        displayName = "FAQ";
        url = "/faq";
        requiresAdmin = false;
      },
      {
        id = "terms-conditions";
        displayName = "Terms & Conditions";
        url = "/terms-conditions";
        requiresAdmin = false;
      },
      {
        id = "referral";
        displayName = "Referral";
        url = "/referral";
        requiresAdmin = false;
      },
      {
        id = "proof-of-trust";
        displayName = "Proof of Trust";
        url = "/proof-of-trust";
        requiresAdmin = false;
      },
      {
        id = "sitemap";
        displayName = "Sitemap";
        url = "/sitemap";
        requiresAdmin = false;
      },
      {
        id = "templates";
        displayName = "Templates";
        url = "/templates";
        requiresAdmin = false;
      },
      {
        id = "upload";
        displayName = "Upload";
        url = "/upload";
        requiresAdmin = true;
      },
      {
        id = "analytics";
        displayName = "Analytics";
        url = "/analytics";
        requiresAdmin = true;
      },
      {
        id = "reports";
        displayName = "Reports";
        url = "/reports";
        requiresAdmin = true;
      },
      {
        id = "settings";
        displayName = "Settings";
        url = "/settings";
        requiresAdmin = true;
      },
      {
        id = "help";
        displayName = "Help";
        url = "/help";
        requiresAdmin = false;
      },
    ];
  };

  // Contact Information Structure - accessible to everyone including guests
  public type ContactInfo = {
    companyName : Text;
    ceoName : Text;
    email : Text;
    phone : Text;
    whatsapp : Text;
    website : Text;
    address : Text;
    paymentMethods : {
      paypal : Text;
      upi : Text;
      eth : Text;
    };
    socialMedia : {
      facebook : Text;
      linkedin : Text;
      telegram : Text;
      discord : Text;
      blogspot : Text;
      instagram : Text;
      twitter : Text;
      youtube : Text;
    };
    mapLocation : Text;
  };

  public query func getContactInfo() : async ContactInfo {
    {
      companyName = "SECOINFI";
      ceoName = "DILEEP KUMAR D";
      email = "dild26@gmail.com";
      phone = "+91-962-005-8644";
      whatsapp = "+91-962-005-8644";
      website = "www.seco.in.net";
      address = "Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDyARANYAPUR PO, BANGALORE-560097";
      paymentMethods = {
        paypal = "newgoldenjewel@gmail.com";
        upi = "secoin@uboi";
        eth = "0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7";
      };
      socialMedia = {
        facebook = "https://facebook.com/dild26";
        linkedin = "https://www.linkedin.com/in/dild26";
        telegram = "https://t.me/dilee";
        discord = "https://discord.com/users/dild26";
        blogspot = "https://dildiva.blogspot.com/";
        instagram = "https://www.instagram.com/newgoldenjewel";
        twitter = "https://x.com/dil_sec";
        youtube = "https://www.youtube.com/@dileepkumard4484";
      };
      mapLocation = "https://maps.google.com/?q=Sudha+Enterprises,+No.+157,+V+R+VIHAR,+VARADARAJ+NAGAR,+VIDyARANYAPUR+PO,+BANGALORE-560097";
    };
  };

  // Storage integration for file uploads
  let storage = Storage.new();
  include MixinStorage(storage);

  // Template Engine Types
  public type TemplateFileType = {
    #markdown;
    #json;
    #solidity;
    #text;
    #zip;
    #unknown;
  };

  public type TemplateFile = {
    id : Text;
    name : Text;
    fileType : TemplateFileType;
    content : Text;
    size : Nat;
    hash : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    sourceFile : ?Text;
    isValid : Bool;
    errors : [Text];
    warnings : [Text];
    extractedFields : [Text];
    codeBlocks : [Text];
    canonicalContent : Text;
    version : Nat;
    isPublished : Bool;
    previewImage : ?Text;
    fileReference : ?Storage.ExternalBlob;
  };

  public type TemplateImportReport = {
    id : Text;
    fileName : Text;
    fileType : TemplateFileType;
    size : Nat;
    hash : Text;
    status : Text;
    errors : [Text];
    warnings : [Text];
    extractedFields : [Text];
    codeBlocks : [Text];
    canonicalContent : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    version : Nat;
  };

  public type TemplateEngine = {
    id : Text;
    name : Text;
    description : Text;
    files : [TemplateFile];
    importReports : [TemplateImportReport];
    createdAt : Time.Time;
    updatedAt : Time.Time;
    version : Nat;
    isPublished : Bool;
    previewImage : ?Text;
    fileReference : ?Storage.ExternalBlob;
  };

  // Storage for template engine data
  var templateEngines = textMap.empty<TemplateEngine>();
  var templateFiles = textMap.empty<TemplateFile>();
  var importReports = textMap.empty<TemplateImportReport>();

  // Template Engine Operations
  public shared ({ caller }) func createTemplateEngine(name : Text, description : Text, files : [TemplateFile], importReports : [TemplateImportReport], previewImage : ?Text, fileReference : ?Storage.ExternalBlob) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create template engines");
    };

    let id = Text.concat(name, Text.concat("-", debug_show (Time.now())));
    let engine : TemplateEngine = {
      id;
      name;
      description;
      files;
      importReports;
      createdAt = Time.now();
      updatedAt = Time.now();
      version = 1;
      isPublished = false;
      previewImage;
      fileReference;
    };

    templateEngines := textMap.put(templateEngines, id, engine);
    id;
  };

  public shared ({ caller }) func updateTemplateEngine(id : Text, name : Text, description : Text, files : [TemplateFile], importReports : [TemplateImportReport], previewImage : ?Text, fileReference : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update template engines");
    };

    switch (textMap.get(templateEngines, id)) {
      case (null) { Debug.trap("Template engine not found") };
      case (?engine) {
        let updatedEngine : TemplateEngine = {
          engine with
          name;
          description;
          files;
          importReports;
          updatedAt = Time.now();
          version = engine.version + 1;
          previewImage;
          fileReference;
        };

        templateEngines := textMap.put(templateEngines, id, updatedEngine);
      };
    };
  };

  public shared ({ caller }) func deleteTemplateEngine(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete template engines");
    };

    switch (textMap.get(templateEngines, id)) {
      case (null) { Debug.trap("Template engine not found") };
      case (?_) {
        templateEngines := textMap.delete(templateEngines, id);
      };
    };
  };

  public query ({ caller }) func getTemplateEngine(id : Text) : async ?TemplateEngine {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view template engines");
    };
    textMap.get(templateEngines, id);
  };

  public query ({ caller }) func getAllTemplateEngines() : async [TemplateEngine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view template engines");
    };
    Iter.toArray(textMap.vals(templateEngines));
  };

  // Public published template engines - accessible to subscribers
  public query ({ caller }) func getPublishedTemplateEngines() : async [TemplateEngine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view published template engines");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view published template engines");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(templateEngines),
        func(engine : TemplateEngine) : Bool {
          engine.isPublished;
        },
      )
    );
  };

  public shared ({ caller }) func publishTemplateEngine(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can publish template engines");
    };

    switch (textMap.get(templateEngines, id)) {
      case (null) { Debug.trap("Template engine not found") };
      case (?engine) {
        let updatedEngine : TemplateEngine = {
          engine with
          isPublished = true;
          updatedAt = Time.now();
        };

        templateEngines := textMap.put(templateEngines, id, updatedEngine);
      };
    };
  };

  // Template File Operations
  public shared ({ caller }) func createTemplateFile(name : Text, fileType : TemplateFileType, content : Text, size : Nat, hash : Text, sourceFile : ?Text, isValid : Bool, errors : [Text], warnings : [Text], extractedFields : [Text], codeBlocks : [Text], canonicalContent : Text, previewImage : ?Text, fileReference : ?Storage.ExternalBlob) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create template files");
    };

    let id = Text.concat(name, Text.concat("-", debug_show (Time.now())));
    let file : TemplateFile = {
      id;
      name;
      fileType;
      content;
      size;
      hash;
      createdAt = Time.now();
      updatedAt = Time.now();
      sourceFile;
      isValid;
      errors;
      warnings;
      extractedFields;
      codeBlocks;
      canonicalContent;
      version = 1;
      isPublished = false;
      previewImage;
      fileReference;
    };

    templateFiles := textMap.put(templateFiles, id, file);
    id;
  };

  public shared ({ caller }) func updateTemplateFile(id : Text, name : Text, fileType : TemplateFileType, content : Text, size : Nat, hash : Text, sourceFile : ?Text, isValid : Bool, errors : [Text], warnings : [Text], extractedFields : [Text], codeBlocks : [Text], canonicalContent : Text, previewImage : ?Text, fileReference : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update template files");
    };

    switch (textMap.get(templateFiles, id)) {
      case (null) { Debug.trap("Template file not found") };
      case (?file) {
        let updatedFile : TemplateFile = {
          file with
          name;
          fileType;
          content;
          size;
          hash;
          updatedAt = Time.now();
          sourceFile;
          isValid;
          errors;
          warnings;
          extractedFields;
          codeBlocks;
          canonicalContent;
          version = file.version + 1;
          previewImage;
          fileReference;
        };

        templateFiles := textMap.put(templateFiles, id, updatedFile);
      };
    };
  };

  public shared ({ caller }) func deleteTemplateFile(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete template files");
    };

    switch (textMap.get(templateFiles, id)) {
      case (null) { Debug.trap("Template file not found") };
      case (?_) {
        templateFiles := textMap.delete(templateFiles, id);
      };
    };
  };

  public query ({ caller }) func getTemplateFile(id : Text) : async ?TemplateFile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view template files");
    };
    textMap.get(templateFiles, id);
  };

  public query ({ caller }) func getAllTemplateFiles() : async [TemplateFile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view template files");
    };
    Iter.toArray(textMap.vals(templateFiles));
  };

  public query ({ caller }) func getPublishedTemplateFiles() : async [TemplateFile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view published template files");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view published template files");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(templateFiles),
        func(file : TemplateFile) : Bool {
          file.isPublished;
        },
      )
    );
  };

  public shared ({ caller }) func publishTemplateFile(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can publish template files");
    };

    switch (textMap.get(templateFiles, id)) {
      case (null) { Debug.trap("Template file not found") };
      case (?file) {
        let updatedFile : TemplateFile = {
          file with
          isPublished = true;
          updatedAt = Time.now();
        };

        templateFiles := textMap.put(templateFiles, id, updatedFile);
      };
    };
  };

  // Import Report Operations
  public shared ({ caller }) func createImportReport(fileName : Text, fileType : TemplateFileType, size : Nat, hash : Text, status : Text, errors : [Text], warnings : [Text], extractedFields : [Text], codeBlocks : [Text], canonicalContent : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create import reports");
    };

    let id = Text.concat(fileName, Text.concat("-", debug_show (Time.now())));
    let report : TemplateImportReport = {
      id;
      fileName;
      fileType;
      size;
      hash;
      status;
      errors;
      warnings;
      extractedFields;
      codeBlocks;
      canonicalContent;
      createdAt = Time.now();
      updatedAt = Time.now();
      version = 1;
    };

    importReports := textMap.put(importReports, id, report);
    id;
  };

  public shared ({ caller }) func updateImportReport(id : Text, fileName : Text, fileType : TemplateFileType, size : Nat, hash : Text, status : Text, errors : [Text], warnings : [Text], extractedFields : [Text], codeBlocks : [Text], canonicalContent : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update import reports");
    };

    switch (textMap.get(importReports, id)) {
      case (null) { Debug.trap("Import report not found") };
      case (?report) {
        let updatedReport : TemplateImportReport = {
          report with
          fileName;
          fileType;
          size;
          hash;
          status;
          errors;
          warnings;
          extractedFields;
          codeBlocks;
          canonicalContent;
          updatedAt = Time.now();
          version = report.version + 1;
        };

        importReports := textMap.put(importReports, id, updatedReport);
      };
    };
  };

  public shared ({ caller }) func deleteImportReport(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete import reports");
    };

    switch (textMap.get(importReports, id)) {
      case (null) { Debug.trap("Import report not found") };
      case (?_) {
        importReports := textMap.delete(importReports, id);
      };
    };
  };

  public query ({ caller }) func getImportReport(id : Text) : async ?TemplateImportReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view import reports");
    };
    textMap.get(importReports, id);
  };

  public query ({ caller }) func getAllImportReports() : async [TemplateImportReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view import reports");
    };
    Iter.toArray(textMap.vals(importReports));
  };

  // HTTP Outcall Transform
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Stripe integration
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
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

  // New Analytics and Reporting Types
  public type FileUploadStatus = {
    #pending;
    #processing;
    #completed;
    #failed;
  };

  public type FileUploadRecord = {
    id : Text;
    fileName : Text;
    fileType : TemplateFileType;
    size : Nat;
    hash : Text;
    status : FileUploadStatus;
    errors : [Text];
    warnings : [Text];
    createdAt : Time.Time;
    updatedAt : Time.Time;
    fileReference : ?Storage.ExternalBlob;
  };

  public type AnalyticsReport = {
    totalUploads : Nat;
    successfulUploads : Nat;
    failedUploads : Nat;
    totalSize : Nat;
    fileTypeBreakdown : [(TemplateFileType, Nat)];
    errorSummary : [(Text, Nat)];
    warningSummary : [(Text, Nat)];
    timestamp : Time.Time;
  };

  // Storage for new analytics and reporting data
  var fileUploadRecords = textMap.empty<FileUploadRecord>();
  var analyticsReports = textMap.empty<AnalyticsReport>();

  // File Upload Operations
  public shared ({ caller }) func createFileUploadRecord(fileName : Text, fileType : TemplateFileType, size : Nat, hash : Text, status : FileUploadStatus, errors : [Text], warnings : [Text], fileReference : ?Storage.ExternalBlob) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create file upload records");
    };

    let id = Text.concat(fileName, Text.concat("-", debug_show (Time.now())));
    let record : FileUploadRecord = {
      id;
      fileName;
      fileType;
      size;
      hash;
      status;
      errors;
      warnings;
      createdAt = Time.now();
      updatedAt = Time.now();
      fileReference;
    };

    fileUploadRecords := textMap.put(fileUploadRecords, id, record);
    id;
  };

  public shared ({ caller }) func updateFileUploadRecord(id : Text, fileName : Text, fileType : TemplateFileType, size : Nat, hash : Text, status : FileUploadStatus, errors : [Text], warnings : [Text], fileReference : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update file upload records");
    };

    switch (textMap.get(fileUploadRecords, id)) {
      case (null) { Debug.trap("File upload record not found") };
      case (?record) {
        let updatedRecord : FileUploadRecord = {
          record with
          fileName;
          fileType;
          size;
          hash;
          status;
          errors;
          warnings;
          updatedAt = Time.now();
          fileReference;
        };

        fileUploadRecords := textMap.put(fileUploadRecords, id, updatedRecord);
      };
    };
  };

  public shared ({ caller }) func deleteFileUploadRecord(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete file upload records");
    };

    switch (textMap.get(fileUploadRecords, id)) {
      case (null) { Debug.trap("File upload record not found") };
      case (?_) {
        fileUploadRecords := textMap.delete(fileUploadRecords, id);
      };
    };
  };

  public query ({ caller }) func getFileUploadRecord(id : Text) : async ?FileUploadRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view file upload records");
    };
    textMap.get(fileUploadRecords, id);
  };

  public query ({ caller }) func getAllFileUploadRecords() : async [FileUploadRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view file upload records");
    };
    Iter.toArray(textMap.vals(fileUploadRecords));
  };

  // Analytics and Reporting Operations
  public shared ({ caller }) func createAnalyticsReport(totalUploads : Nat, successfulUploads : Nat, failedUploads : Nat, totalSize : Nat, fileTypeBreakdown : [(TemplateFileType, Nat)], errorSummary : [(Text, Nat)], warningSummary : [(Text, Nat)]) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create analytics reports");
    };

    let id = Text.concat("analytics-", debug_show (Time.now()));
    let report : AnalyticsReport = {
      totalUploads;
      successfulUploads;
      failedUploads;
      totalSize;
      fileTypeBreakdown;
      errorSummary;
      warningSummary;
      timestamp = Time.now();
    };

    analyticsReports := textMap.put(analyticsReports, id, report);
    id;
  };

  public query ({ caller }) func getAnalyticsReport(id : Text) : async ?AnalyticsReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view analytics reports");
    };
    textMap.get(analyticsReports, id);
  };

  public query ({ caller }) func getAllAnalyticsReports() : async [AnalyticsReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view analytics reports");
    };
    Iter.toArray(textMap.vals(analyticsReports));
  };

  // New function to get combined import and upload reports
  public query ({ caller }) func getCombinedReports() : async {
    importReports : [TemplateImportReport];
    fileUploadRecords : [FileUploadRecord];
    analyticsReports : [AnalyticsReport];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view combined reports");
    };
    {
      importReports = Iter.toArray(textMap.vals(importReports));
      fileUploadRecords = Iter.toArray(textMap.vals(fileUploadRecords));
      analyticsReports = Iter.toArray(textMap.vals(analyticsReports));
    };
  };

  // Features Checklist Types
  public type FeatureStatus = {
    #pending;
    #started;
    #cancelled;
    #failure;
    #completed;
    #updated;
    #upgraded;
    #modified;
    #migrated;
    #verified;
    #deleted;
    #archived;
  };

  public type FeatureChecklistItem = {
    id : Text;
    name : Text;
    description : Text;
    status : FeatureStatus;
    isVerified : Bool;
    lastUpdated : Time.Time;
    createdAt : Time.Time;
    adminVerifiedBy : ?Principal;
    statusHistory : [FeatureStatus];
    verificationHistory : [Bool];
  };

  // Storage for features checklist
  var featuresChecklist = textMap.empty<FeatureChecklistItem>();

  // Features Checklist Operations
  public shared ({ caller }) func createFeatureChecklistItem(name : Text, description : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create checklist items");
    };

    let id = Text.concat(name, Text.concat("-", debug_show (Time.now())));
    let item : FeatureChecklistItem = {
      id;
      name;
      description;
      status = #pending;
      isVerified = false;
      lastUpdated = Time.now();
      createdAt = Time.now();
      adminVerifiedBy = null;
      statusHistory = [#pending];
      verificationHistory = [false];
    };

    featuresChecklist := textMap.put(featuresChecklist, id, item);
    id;
  };

  public shared ({ caller }) func updateFeatureChecklistItem(id : Text, name : Text, description : Text, status : FeatureStatus, isVerified : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update checklist items");
    };

    switch (textMap.get(featuresChecklist, id)) {
      case (null) { Debug.trap("Checklist item not found") };
      case (?item) {
        let updatedItem : FeatureChecklistItem = {
          item with
          name;
          description;
          status;
          isVerified;
          lastUpdated = Time.now();
          adminVerifiedBy = ?caller;
          statusHistory = Array.append(item.statusHistory, [status]);
          verificationHistory = Array.append(item.verificationHistory, [isVerified]);
        };

        featuresChecklist := textMap.put(featuresChecklist, id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func verifyFeatureChecklistItem(id : Text, isVerified : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can verify checklist items");
    };

    switch (textMap.get(featuresChecklist, id)) {
      case (null) { Debug.trap("Checklist item not found") };
      case (?item) {
        let updatedItem : FeatureChecklistItem = {
          item with
          isVerified;
          lastUpdated = Time.now();
          adminVerifiedBy = ?caller;
          verificationHistory = Array.append(item.verificationHistory, [isVerified]);
        };

        featuresChecklist := textMap.put(featuresChecklist, id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func deleteFeatureChecklistItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete checklist items");
    };

    switch (textMap.get(featuresChecklist, id)) {
      case (null) { Debug.trap("Checklist item not found") };
      case (?_) {
        featuresChecklist := textMap.delete(featuresChecklist, id);
      };
    };
  };

  // Admin-only query functions for feature checklist
  public query ({ caller }) func getFeatureChecklistItem(id : Text) : async ?FeatureChecklistItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view checklist items");
    };
    textMap.get(featuresChecklist, id);
  };

  public query ({ caller }) func getAllFeatureChecklistItems() : async [FeatureChecklistItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view checklist items");
    };
    Iter.toArray(textMap.vals(featuresChecklist));
  };

  public query ({ caller }) func getFeatureChecklistByStatus(status : FeatureStatus) : async [FeatureChecklistItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view checklist items");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(featuresChecklist),
        func(item : FeatureChecklistItem) : Bool {
          item.status == status;
        },
      )
    );
  };

  public query ({ caller }) func getVerifiedFeatureChecklistItems() : async [FeatureChecklistItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view checklist items");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(featuresChecklist),
        func(item : FeatureChecklistItem) : Bool {
          item.isVerified;
        },
      )
    );
  };

  // AI Auto-Completion Logic
  public shared ({ caller }) func autoCompletePendingFeatures() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can auto-complete features");
    };

    for ((id, item) in textMap.entries(featuresChecklist)) {
      if (item.status == #pending or item.status == #started) {
        let updatedItem : FeatureChecklistItem = {
          item with
          status = #completed;
          lastUpdated = Time.now();
          statusHistory = Array.append(item.statusHistory, [#completed]);
        };

        featuresChecklist := textMap.put(featuresChecklist, id, updatedItem);
      };
    };
  };

  // Combined Reports with Features Checklist
  public query ({ caller }) func getCombinedReportsWithChecklist() : async {
    importReports : [TemplateImportReport];
    fileUploadRecords : [FileUploadRecord];
    analyticsReports : [AnalyticsReport];
    featuresChecklist : [FeatureChecklistItem];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view combined reports");
    };
    {
      importReports = Iter.toArray(textMap.vals(importReports));
      fileUploadRecords = Iter.toArray(textMap.vals(fileUploadRecords));
      analyticsReports = Iter.toArray(textMap.vals(analyticsReports));
      featuresChecklist = Iter.toArray(textMap.vals(featuresChecklist));
    };
  };

  // New Template Details Tab Functionality
  public type TemplateDetailsTab = {
    templateId : Text;
    markdownContent : Text;
    lastUpdated : Time.Time;
    createdAt : Time.Time;
    isPublished : Bool;
    previewImage : ?Text;
    fileReference : ?Storage.ExternalBlob;
  };

  var templateDetailsTabs = textMap.empty<TemplateDetailsTab>();

  public shared ({ caller }) func createTemplateDetailsTab(templateId : Text, markdownContent : Text, previewImage : ?Text, fileReference : ?Storage.ExternalBlob) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create template details tabs");
    };

    let id = Text.concat(templateId, Text.concat("-details-", debug_show (Time.now())));
    let detailsTab : TemplateDetailsTab = {
      templateId;
      markdownContent;
      lastUpdated = Time.now();
      createdAt = Time.now();
      isPublished = false;
      previewImage;
      fileReference;
    };

    templateDetailsTabs := textMap.put(templateDetailsTabs, id, detailsTab);
    id;
  };

  public shared ({ caller }) func updateTemplateDetailsTab(id : Text, templateId : Text, markdownContent : Text, previewImage : ?Text, fileReference : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update template details tabs");
    };

    switch (textMap.get(templateDetailsTabs, id)) {
      case (null) { Debug.trap("Template details tab not found") };
      case (?detailsTab) {
        let updatedDetailsTab : TemplateDetailsTab = {
          detailsTab with
          templateId;
          markdownContent;
          lastUpdated = Time.now();
          previewImage;
          fileReference;
        };

        templateDetailsTabs := textMap.put(templateDetailsTabs, id, updatedDetailsTab);
      };
    };
  };

  public shared ({ caller }) func deleteTemplateDetailsTab(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete template details tabs");
    };

    switch (textMap.get(templateDetailsTabs, id)) {
      case (null) { Debug.trap("Template details tab not found") };
      case (?_) {
        templateDetailsTabs := textMap.delete(templateDetailsTabs, id);
      };
    };
  };

  public query ({ caller }) func getTemplateDetailsTab(id : Text) : async ?TemplateDetailsTab {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view template details");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view template details");
    };
    textMap.get(templateDetailsTabs, id);
  };

  public query ({ caller }) func getAllTemplateDetailsTabs() : async [TemplateDetailsTab] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view all template details tabs");
    };
    Iter.toArray(textMap.vals(templateDetailsTabs));
  };

  public shared ({ caller }) func publishTemplateDetailsTab(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can publish template details tabs");
    };

    switch (textMap.get(templateDetailsTabs, id)) {
      case (null) { Debug.trap("Template details tab not found") };
      case (?detailsTab) {
        let updatedDetailsTab : TemplateDetailsTab = {
          detailsTab with
          isPublished = true;
          lastUpdated = Time.now();
        };

        templateDetailsTabs := textMap.put(templateDetailsTabs, id, updatedDetailsTab);
      };
    };
  };

  public query ({ caller }) func getPublishedTemplateDetailsTabs() : async [TemplateDetailsTab] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view published template details");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view published template details");
    };
    Iter.toArray(
      Iter.filter(
        textMap.vals(templateDetailsTabs),
        func(tab : TemplateDetailsTab) : Bool {
          tab.isPublished;
        },
      )
    );
  };

  public query ({ caller }) func getTemplateDetailsTabByTemplateId(templateId : Text) : async ?TemplateDetailsTab {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view template details");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view template details");
    };
    let tabs = Iter.toArray(
      Iter.filter(
        textMap.vals(templateDetailsTabs),
        func(tab : TemplateDetailsTab) : Bool {
          tab.templateId == templateId;
        },
      )
    );
    if (tabs.size() > 0) { ?tabs[0] } else { null };
  };

  public shared ({ caller }) func getTemplateWithDetailsTab(templateId : Text) : async {
    template : ?ContractTemplate;
    detailsTab : ?TemplateDetailsTab;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view template with details");
    };
    if (not isSubscriber(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Only subscribers can view template with details");
    };
    {
      template = textMap.get(templates, templateId);
      detailsTab = await getTemplateDetailsTabByTemplateId(templateId);
    };
  };

  // Backup and Restore Functionality
  public shared ({ caller }) func createBackup() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create backups");
    };

    let backupId = Text.concat("backup-", debug_show (Time.now()));
    let backupContent = Text.concat(
      "Contracts: ",
      Text.concat(
        debug_show (contracts),
        Text.concat(
          "\nTemplates: ",
          Text.concat(
            debug_show (templates),
            Text.concat(
              "\nTemplateEngines: ",
              Text.concat(
                debug_show (templateEngines),
                Text.concat(
                  "\nTemplateFiles: ",
                  Text.concat(
                    debug_show (templateFiles),
                    Text.concat(
                      "\nImportReports: ",
                      Text.concat(
                        debug_show (importReports),
                        Text.concat(
                          "\nFileUploadRecords: ",
                          Text.concat(
                            debug_show (fileUploadRecords),
                            Text.concat(
                              "\nAnalyticsReports: ",
                              Text.concat(
                                debug_show (analyticsReports),
                                Text.concat(
                                  "\nFeaturesChecklist: ",
                                  Text.concat(
                                    debug_show (featuresChecklist),
                                    Text.concat(
                                      "\nTemplateDetailsTabs: ",
                                      debug_show (templateDetailsTabs),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );

    let backupFile : TemplateFile = {
      id = backupId;
      name = backupId;
      fileType = #zip;
      content = backupContent;
      size = backupContent.size();
      hash = backupId;
      createdAt = Time.now();
      updatedAt = Time.now();
      sourceFile = null;
      isValid = true;
      errors = [];
      warnings = [];
      extractedFields = [];
      codeBlocks = [];
      canonicalContent = backupContent;
      version = 1;
      isPublished = false;
      previewImage = null;
      fileReference = null;
    };

    templateFiles := textMap.put(templateFiles, backupId, backupFile);
    backupId;
  };

  public shared ({ caller }) func restoreFromBackup(backupId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can restore from backups");
    };

    switch (textMap.get(templateFiles, backupId)) {
      case (null) { Debug.trap("Backup not found") };
      case (?backupFile) {
        // In a real implementation, you would parse the backup content and restore the state
        // For now, this is a placeholder to indicate the restore operation
        Debug.print("Restoring from backup: " # backupFile.content);
      };
    };
  };

  // New function to handle .md file uploads
  public shared ({ caller }) func uploadMarkdownFile(fileName : Text, content : Text, size : Nat, previewImage : ?Text, fileReference : ?Storage.ExternalBlob) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can upload markdown files");
    };

    let id = Text.concat(fileName, Text.concat("-", debug_show (Time.now())));
    let detailsTab : TemplateDetailsTab = {
      templateId = id;
      markdownContent = content;
      lastUpdated = Time.now();
      createdAt = Time.now();
      isPublished = false;
      previewImage;
      fileReference;
    };

    templateDetailsTabs := textMap.put(templateDetailsTabs, id, detailsTab);
    id;
  };

  // New function to get all markdown files
  public query ({ caller }) func getAllMarkdownFiles() : async [TemplateDetailsTab] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view markdown files");
    };
    Iter.toArray(textMap.vals(templateDetailsTabs));
  };

  // External link access control - subscribers only
  public query ({ caller }) func canAccessExternalLink(linkUrl : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return false;
    };
    isSubscriber(caller) or AccessControl.isAdmin(accessControlState, caller);
  };
};

