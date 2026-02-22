import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import List "mo:base/List";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";

actor {
  let accessControlState = AccessControl.initState();

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

  public type SubscriptionStatus = {
    #active;
    #inactive;
    #cancelled;
    #expired;
  };

  public type Subscription = {
    user : Principal;
    status : SubscriptionStatus;
    startDate : Time.Time;
    endDate : ?Time.Time;
    plan : Text;
  };

  var subscriptions : List.List<Subscription> = List.nil<Subscription>();

  private func isSubscriber(user : Principal) : Bool {
    let maybeSub = List.find<Subscription>(subscriptions, func(sub) { sub.user == user });
    switch (maybeSub) {
      case (?sub) {
        switch (sub.status) {
          case (#active) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  private func hasSubscriberAccess(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller) or isSubscriber(caller);
  };

  public shared ({ caller }) func addSubscription(subscription : Subscription) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create subscriptions");
    };

    subscriptions := List.push(subscription, subscriptions);
  };

  public query ({ caller }) func getUserSubscription(user : Principal) : async ?Subscription {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own subscription");
    };
    List.find<Subscription>(subscriptions, func(sub) { sub.user == user });
  };

  public shared ({ caller }) func updateSubscription(updated : Subscription) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update subscriptions");
    };

    let filtered = List.filter<Subscription>(
      subscriptions,
      func(sub) {
        sub.user != updated.user;
      },
    );
    subscriptions := List.push(updated, filtered);
  };

  public query ({ caller }) func isCallerSubscriber() : async Bool {
    isSubscriber(caller);
  };

  public type SpecFormat = {
    #yaml;
    #ml;
    #markdown;
  };

  public type SpecVersion = {
    timestamp : Time.Time;
    content : Text;
    format : SpecFormat;
  };

  public type SpecHistory = List.List<SpecVersion>;

  var currentSpec : ?SpecVersion = null;
  var specHistory : SpecHistory = List.nil<SpecVersion>();

  // Public read access - specifications are viewable by everyone
  public query func getCurrentSpec() : async ?SpecVersion {
    currentSpec;
  };

  public shared ({ caller }) func updateSpec(content : Text, format : SpecFormat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update specifications");
    };

    let newVersion : SpecVersion = {
      timestamp = Time.now();
      content;
      format;
    };

    switch (currentSpec) {
      case (?oldSpec) {
        specHistory := List.push(oldSpec, specHistory);
      };
      case (null) {};
    };

    currentSpec := ?newVersion;
    await logManifestEntryInternal(caller, "update_specification", "Updated specification to format: " # debug_show(format));
  };

  // Public read access - specification history is viewable by everyone
  public query func getSpecHistory() : async [SpecVersion] {
    List.toArray(specHistory);
  };

  public shared ({ caller }) func revertToVersion(timestamp : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can revert specifications");
    };

    let (newHistory, foundVersion) = List.foldLeft<SpecVersion, (SpecHistory, ?SpecVersion)>(
      specHistory,
      (List.nil(), null),
      func((accHistory, accFound), version) {
        if (version.timestamp == timestamp) {
          (accHistory, ?version);
        } else {
          (List.push(version, accHistory), accFound);
        };
      },
    );

    switch (foundVersion) {
      case (?version) {
        switch (currentSpec) {
          case (?oldSpec) {
            specHistory := List.push(oldSpec, newHistory);
          };
          case (null) {
            specHistory := newHistory;
          };
        };
        currentSpec := ?version;
        await logManifestEntryInternal(caller, "revert_specification", "Reverted specification to timestamp: " # debug_show(timestamp));
      };
      case (null) {
        Debug.trap("Version not found");
      };
    };
  };

  public query func validateSpecFormat(format : SpecFormat) : async Bool {
    switch (format) {
      case (#yaml) { true };
      case (#ml) { true };
      case (#markdown) { true };
    };
  };

  public type SitemapEntry = {
    path : Text;
    title : Text;
    description : Text;
  };

  var sitemap : List.List<SitemapEntry> = List.nil<SitemapEntry>();

  // Admin-only - only admins can modify sitemap
  public shared ({ caller }) func addSitemapEntry(entry : SitemapEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add sitemap entries");
    };
    sitemap := List.push(entry, sitemap);
  };

  // Public read access - sitemap is viewable by everyone
  public query func getSitemap() : async [SitemapEntry] {
    List.toArray(sitemap);
  };

  // Public search - anyone can search sitemap
  public query func searchSitemap(searchTerm : Text) : async [SitemapEntry] {
    let lowerSearchTerm = Text.toLowercase(searchTerm);
    let filtered = List.filter<SitemapEntry>(
      sitemap,
      func(entry) {
        let lowerTitle = Text.toLowercase(entry.title);
        let lowerDesc = Text.toLowercase(entry.description);
        let lowerPath = Text.toLowercase(entry.path);
        Text.contains(lowerTitle, #text lowerSearchTerm) or Text.contains(lowerDesc, #text lowerSearchTerm) or Text.contains(lowerPath, #text lowerSearchTerm);
      },
    );
    List.toArray(filtered);
  };

  // Admin-only - only admins can modify sitemap
  public shared ({ caller }) func removeSitemapEntry(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove sitemap entries");
    };

    let filtered = List.filter<SitemapEntry>(
      sitemap,
      func(entry) {
        entry.path != path;
      },
    );
    sitemap := filtered;
  };

  public type Theme = {
    #default;
    #vibgyor;
  };

  var currentTheme : Theme = #default;

  // Public access - anyone can toggle theme
  public shared func toggleTheme() : async Theme {
    currentTheme := switch (currentTheme) {
      case (#default) { #vibgyor };
      case (#vibgyor) { #default };
    };
    currentTheme;
  };

  // Public access - anyone can view current theme
  public query func getCurrentTheme() : async Theme {
    currentTheme;
  };

  public type FileType = {
    #json;
    #markdown;
    #text;
    #zip;
  };

  public type FileMetadata = {
    id : Text;
    name : Text;
    fileType : FileType;
    size : Nat;
    hash : Text;
    uploadTime : Time.Time;
    owner : Principal;
  };

  public type FileUploadStatus = {
    #pending;
    #inProgress;
    #completed;
    #failed;
  };

  public type FileUploadProgress = {
    fileId : Text;
    status : FileUploadStatus;
    progress : Nat;
    error : ?Text;
  };

  public type ContentValidationResult = {
    isValid : Bool;
    contentType : FileType;
    error : ?Text;
  };

  let storage = Storage.new();
  include MixinStorage(storage);

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var fileMetadata : OrderedMap.Map<Text, FileMetadata> = textMap.empty();
  var uploadProgress : OrderedMap.Map<Text, FileUploadProgress> = textMap.empty();

  // Public upload - anyone can upload files (per specification)
  public shared ({ caller }) func addFileMetadata(metadata : FileMetadata) : async () {
    let validatedMetadata : FileMetadata = {
      id = metadata.id;
      name = metadata.name;
      fileType = metadata.fileType;
      size = metadata.size;
      hash = metadata.hash;
      uploadTime = metadata.uploadTime;
      owner = caller;
    };

    fileMetadata := textMap.put(fileMetadata, validatedMetadata.id, validatedMetadata);
  };

  public shared ({ caller }) func updateUploadProgress(progress : FileUploadProgress) : async () {
    switch (textMap.get(fileMetadata, progress.fileId)) {
      case (?metadata) {
        if (metadata.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only update progress for your own files");
        };
      };
      case (null) {
        Debug.trap("File not found");
      };
    };

    uploadProgress := textMap.put(uploadProgress, progress.fileId, progress);
  };

  public type FilePair = {
    baseName : Text;
    jsonFile : ?FileMetadata;
    mdFile : ?FileMetadata;
  };

  public type PairingResult = {
    pairs : [FilePair];
    errors : [Text];
  };

  public type FilePairingAffirmation = {
    pair : FilePair;
    affirmedBy : Principal;
    timestamp : Time.Time;
    notes : Text;
  };

  var pairingAffirmations : List.List<FilePairingAffirmation> = List.nil<FilePairingAffirmation>();

  func pairFiles() : PairingResult {
    var pairs = List.nil<FilePair>();
    var errors = List.nil<Text>();

    let baseNameMap = OrderedMap.Make<Text>(Text.compare);
    var jsonMap = baseNameMap.empty<FileMetadata>();
    var mdMap = baseNameMap.empty<FileMetadata>();

    for ((_, metadata) in textMap.entries(fileMetadata)) {
      let nameParts = Text.split(Text.toLowercase(metadata.name), #char '.');
      let baseName = switch (nameParts.next()) {
        case (?name) name;
        case (null) metadata.name;
      };

      switch (metadata.fileType) {
        case (#json) {
          jsonMap := baseNameMap.put(jsonMap, baseName, metadata);
        };
        case (#markdown) {
          mdMap := baseNameMap.put(mdMap, baseName, metadata);
        };
        case (_) {};
      };
    };

    for ((baseName, jsonMetadata) in baseNameMap.entries(jsonMap)) {
      switch (baseNameMap.get(mdMap, baseName)) {
        case (?mdMetadata) {
          pairs := List.push(
            {
              baseName;
              jsonFile = ?jsonMetadata;
              mdFile = ?mdMetadata;
            },
            pairs,
          );
        };
        case (null) {
          pairs := List.push(
            {
              baseName;
              jsonFile = ?jsonMetadata;
              mdFile = null;
            },
            pairs,
          );
        };
      };
    };

    for ((baseName, mdMetadata) in baseNameMap.entries(mdMap)) {
      switch (baseNameMap.get(jsonMap, baseName)) {
        case (null) {
          pairs := List.push(
            {
              baseName;
              jsonFile = null;
              mdFile = ?mdMetadata;
            },
            pairs,
          );
        };
        case (?_) {};
      };
    };

    {
      pairs = List.toArray(pairs);
      errors = List.toArray(errors);
    };
  };

  // Public validation - anyone can validate file pairings
  public query func validateFilePairing(pair : FilePair) : async Bool {
    switch (pair.jsonFile, pair.mdFile) {
      case (?json, ?md) {
        json.fileType == #json and md.fileType == #markdown;
      };
      case (?json, null) {
        json.fileType == #json;
      };
      case (null, ?md) {
        md.fileType == #markdown;
      };
      case (null, null) {
        false;
      };
    };
  };

  // Admin-only - only admins can affirm file pairings
  public shared ({ caller }) func affirmFilePairing(pair : FilePair, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can affirm file pairings");
    };

    let affirmation : FilePairingAffirmation = {
      pair;
      affirmedBy = caller;
      timestamp = Time.now();
      notes;
    };

    pairingAffirmations := List.push(affirmation, pairingAffirmations);
    await logManifestEntryInternal(caller, "file_pairing_affirmation", "Affirmed pairing for: " # pair.baseName # " - " # notes);
  };

  // Public access - anyone can view file pairs
  public query func getAllFilePairs() : async [FilePair] {
    let result = pairFiles();
    result.pairs;
  };

  // Public access - anyone can view pairing errors
  public query func getPairingErrors() : async [Text] {
    let result = pairFiles();
    result.errors;
  };

  public type Pagination = {
    page : Nat;
    pageSize : Nat;
    totalItems : Nat;
    totalPages : Nat;
  };

  public type PaginatedResult<T> = {
    items : [T];
    pagination : Pagination;
  };

  // Public access - anyone can paginate files
  public query func paginateFiles(page : Nat, pageSize : Nat) : async PaginatedResult<FileMetadata> {
    var files = List.nil<FileMetadata>();
    for ((_, metadata) in textMap.entries(fileMetadata)) {
      files := List.push(metadata, files);
    };

    let allFiles = List.toArray(files);
    let totalItems = allFiles.size();
    let totalPages = if (pageSize == 0) { 1 } else { (totalItems + pageSize - 1) / pageSize };

    let start = page * pageSize;
    let end = if (start + pageSize > totalItems) { totalItems } else { start + pageSize };

    let pagedItems = if (start >= totalItems) {
      [];
    } else {
      Array.tabulate<FileMetadata>(end - start, func(i) { allFiles[start + i] });
    };

    {
      items = pagedItems;
      pagination = {
        page;
        pageSize;
        totalItems;
        totalPages;
      };
    };
  };

  // Public utility - anyone can mask hashes
  public query func maskHash(hash : Text) : async Text {
    let length = Text.size(hash);
    if (length <= 8) {
      return hash;
    };

    let chars = Iter.toArray(Text.toIter(hash));
    let first4 = Array.tabulate<Char>(4, func(i) { chars[i] });
    let last4 = Array.tabulate<Char>(4, func(i) { chars[length - 4 + i] });

    Text.fromIter(Iter.fromArray(first4)) # "****" # Text.fromIter(Iter.fromArray(last4));
  };

  public type Page = {
    path : Text;
    title : Text;
    content : Text;
    isAdminOnly : Bool;
    lastUpdated : Time.Time;
  };

  var pages : List.List<Page> = List.nil<Page>();

  // Admin-only - only admins can add pages
  public shared ({ caller }) func addPage(page : Page) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add pages");
    };
    pages := List.push(page, pages);
  };

  // Public access - anyone can view all pages (filtering happens in getPage)
  public query func getAllPages() : async [Page] {
    List.toArray(pages);
  };

  // Public access with admin-only page protection
  public query ({ caller }) func getPage(path : Text) : async ?Page {
    let maybePage = List.find<Page>(pages, func(page) { page.path == path });

    switch (maybePage) {
      case (?page) {
        if (page.isAdminOnly and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: This page is only accessible to administrators");
        };
        ?page;
      };
      case (null) { null };
    };
  };

  // Admin-only - only admins can remove pages
  public shared ({ caller }) func removePage(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove pages");
    };

    let filtered = List.filter<Page>(
      pages,
      func(page) {
        page.path != path;
      },
    );
    pages := filtered;
  };

  // Admin-only - only admins can update pages
  public shared ({ caller }) func updatePage(updatedPage : Page) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update pages");
    };

    let filtered = List.filter<Page>(
      pages,
      func(page) {
        page.path != updatedPage.path;
      },
    );
    pages := List.push(updatedPage, filtered);
  };

  private func hasAdminOrSubscriberAccess(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller) or isSubscriber(caller);
  };

  // Admin-only - only admins can initialize default pages
  public shared ({ caller }) func initializeDefaultPages() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can initialize default pages");
    };

    let defaultPages : [Page] = [
      {
        path = "/dashboard";
        title = "Dashboard";
        content = "Welcome to the Dashboard";
        isAdminOnly = true;
        lastUpdated = Time.now();
      },
      {
        path = "/features";
        title = "Features";
        content = "Explore our features";
        isAdminOnly = true;
        lastUpdated = Time.now();
      },
      {
        path = "/blog";
        title = "Blog";
        content = "Read our latest blog posts";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/about-us";
        title = "About Us";
        content = "Learn more about us";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/pros-of-e-contracts";
        title = "Pros of e-Contracts";
        content = "Discover the benefits of e-contracts";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/what-we-do";
        title = "What We Do";
        content = "Find out what we do";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/why-us";
        title = "Why Us";
        content = "Why choose us";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/contact-us";
        title = "Contact Us";
        content = "Get in touch with us";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/faq";
        title = "FAQ";
        content = "Frequently Asked Questions";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/terms-and-conditions";
        title = "Terms & Conditions";
        content = "Read our terms and conditions";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/referral";
        title = "Referral";
        content = "Referral program details";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/proof-of-trust";
        title = "Proof of Trust";
        content = "Our proof of trust";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/sitemap";
        title = "Sitemap";
        content = "Website sitemap";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/templates";
        title = "Templates";
        content = "Browse our templates";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/upload";
        title = "Upload";
        content = "Upload your files";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/analytics";
        title = "Analytics";
        content = "View analytics data";
        isAdminOnly = true;
        lastUpdated = Time.now();
      },
      {
        path = "/reports";
        title = "Reports";
        content = "Generate reports";
        isAdminOnly = true;
        lastUpdated = Time.now();
      },
      {
        path = "/settings";
        title = "Settings";
        content = "Manage your settings";
        isAdminOnly = true;
        lastUpdated = Time.now();
      },
      {
        path = "/help";
        title = "Help";
        content = "Get help and support";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/backup";
        title = "Backup";
        content = "Manage backups";
        isAdminOnly = true;
        lastUpdated = Time.now();
      },
      {
        path = "/admin-dashboard";
        title = "Admin Dashboard";
        content = "Admin Dashboard Panel";
        isAdminOnly = true;
        lastUpdated = Time.now();
      },
      {
        path = "/subscription";
        title = "Subscription";
        content = "Manage your subscriptions";
        isAdminOnly = true;
        lastUpdated = Time.now();
      },
      {
        path = "/contracts";
        title = "Contracts";
        content = "Browse and manage contracts";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
      {
        path = "/leaderboard";
        title = "Leaderboard";
        content = "View top contracts and rankings";
        isAdminOnly = false;
        lastUpdated = Time.now();
      },
    ];

    pages := List.nil();
    for (page in defaultPages.vals()) {
      pages := List.push(page, pages);
    };
  };

  // Public access - returns only non-admin pages for public navigation
  public query func getNavigationLinks() : async [Page] {
    let nonAdminPages = List.filter<Page>(
      pages,
      func(page) {
        not page.isAdminOnly;
      },
    );
    List.toArray(nonAdminPages);
  };

  // Admin-only - returns admin pages for admin navigation
  public query ({ caller }) func getAdminNavigationLinks() : async [Page] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can access admin navigation links");
    };

    let adminPages = List.filter<Page>(
      pages,
      func(page) {
        page.isAdminOnly;
      },
    );
    List.toArray(adminPages);
  };

  // Public access - returns non-admin quick links
  public query func getQuickLinks() : async [Page] {
    let quickLinks = List.filter<Page>(
      pages,
      func(page) {
        not page.isAdminOnly and page.path != "/dashboard" and page.path != "/features";
      },
    );
    List.toArray(quickLinks);
  };

  // Public access - returns non-admin bottom navbar links
  public query func getBottomNavbarLinks() : async [Page] {
    let bottomLinks = List.filter<Page>(
      pages,
      func(page) {
        not page.isAdminOnly and page.path != "/dashboard" and page.path != "/features" and page.path != "/blog";
      },
    );
    List.toArray(bottomLinks);
  };

  // Public validation - anyone can validate navigation links
  public query func validateNavigationLinks() : async Bool {
    let publicPages = List.filter<Page>(
      pages,
      func(page) {
        not page.isAdminOnly;
      },
    );

    let requiredPaths : [Text] = [
      "/blog",
      "/about-us",
      "/pros-of-e-contracts",
      "/what-we-do",
      "/why-us",
      "/contact-us",
      "/faq",
      "/terms-and-conditions",
      "/referral",
      "/proof-of-trust",
      "/sitemap",
      "/templates",
      "/upload",
      "/help",
      "/contracts",
      "/leaderboard",
    ];

    for (path in requiredPaths.vals()) {
      let exists = List.some<Page>(
        publicPages,
        func(page) {
          page.path == path;
        },
      );
      if (not exists) {
        return false;
      };
    };

    true;
  };

  // Admin-only - only admins can mark features as completed
  public shared ({ caller }) func markFeatureAsCompleted(featureName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can mark features as completed");
    };

    let featurePage = List.find<Page>(
      pages,
      func(page) {
        page.title == featureName;
      },
    );

    switch (featurePage) {
      case (?page) {
        let updatedPage : Page = {
          path = page.path;
          title = page.title;
          content = page.content # "\n\nFeature marked as completed on " # debug_show(Time.now());
          isAdminOnly = page.isAdminOnly;
          lastUpdated = Time.now();
        };

        let filtered = List.filter<Page>(
          pages,
          func(p) {
            p.path != page.path;
          },
        );
        pages := List.push(updatedPage, filtered);
      };
      case (null) {
        Debug.trap("Feature page not found");
      };
    };
  };

  public type BusinessInfo = {
    companyName : Text;
    address : Text;
    mapLink : Text;
    phone : Text;
    website : Text;
    whatsapp : Text;
    email : Text;
    upiId : Text;
    ethId : Text;
    paypal : Text;
    facebook : Text;
    linkedin : Text;
    telegram : Text;
    discord : Text;
    blogspot : Text;
    instagram : Text;
    x : Text;
    youtube : Text;
    ceo : Text;
  };

  var businessInfo : BusinessInfo = {
    companyName = "Sudha Enterprises";
    address = "Sudha Enterprises | No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097";
    mapLink = "https://www.openstreetmap.org/way/1417238145";
    phone = "+91-962-005-8644";
    website = "https://www.seco.in.net";
    whatsapp = "https://wa.me/919620058644";
    email = "dild26@gmail.com";
    upiId = "secoin@uboi";
    ethId = "0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7";
    paypal = "newgoldenjewel@gmail.com";
    facebook = "https://facebook.com/dild26";
    linkedin = "https://www.linkedin.com/in/dild26";
    telegram = "https://t.me/dilee";
    discord = "https://discord.com/users/dild26";
    blogspot = "https://dildiva.blogspot.com/";
    instagram = "https://www.instagram.com/newgoldenjewel";
    x = "https://x.com/dil_sec";
    youtube = "https://www.youtube.com/@dileepkumard4484";
    ceo = "DILEEP KUMAR D (CEO of SECOINFI)";
  };

  // Public access - anyone can view business info
  public query func getBusinessInfo() : async BusinessInfo {
    businessInfo;
  };

  // Admin-only - only admins can update business information
  public shared ({ caller }) func updateBusinessInfo(info : BusinessInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update business information");
    };
    businessInfo := info;
  };

  // Public validation - anyone can validate business info
  public query func validateBusinessInfo() : async Bool {
    let requiredFields : [Text] = [
      businessInfo.companyName,
      businessInfo.address,
      businessInfo.mapLink,
      businessInfo.phone,
      businessInfo.website,
      businessInfo.whatsapp,
      businessInfo.email,
      businessInfo.upiId,
      businessInfo.ethId,
      businessInfo.paypal,
      businessInfo.facebook,
      businessInfo.linkedin,
      businessInfo.telegram,
      businessInfo.discord,
      businessInfo.blogspot,
      businessInfo.instagram,
      businessInfo.x,
      businessInfo.youtube,
      businessInfo.ceo,
    ];

    for (field in requiredFields.vals()) {
      if (Text.size(field) == 0) {
        return false;
      };
    };

    true;
  };

  public type ManifestEntry = {
    timestamp : Time.Time;
    action : Text;
    details : Text;
    user : Principal;
  };

  var manifestLog : List.List<ManifestEntry> = List.nil<ManifestEntry>();

  private func logManifestEntryInternal(user : Principal, action : Text, details : Text) : async () {
    let entry : ManifestEntry = {
      timestamp = Time.now();
      action;
      details;
      user;
    };
    manifestLog := List.push(entry, manifestLog);
  };

  // Admin-only - only admins can add manifest entries
  public shared ({ caller }) func addManifestEntry(action : Text, details : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add manifest entries");
    };

    await logManifestEntryInternal(caller, action, details);
  };

  // Admin-only - only admins can access manifest log
  public query ({ caller }) func getManifestLog() : async [ManifestEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can access manifest log");
    };
    List.toArray(manifestLog);
  };

  // Admin-only - only admins can filter manifest log
  public query ({ caller }) func filterManifestLogByAction(action : Text) : async [ManifestEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can filter manifest log");
    };

    let filtered = List.filter<ManifestEntry>(
      manifestLog,
      func(entry) {
        entry.action == action;
      },
    );
    List.toArray(filtered);
  };

  public type BackupData = {
    spec : ?SpecVersion;
    specHistory : [SpecVersion];
    sitemap : [SitemapEntry];
    theme : Theme;
    files : [FileMetadata];
    manifestLog : [ManifestEntry];
  };

  // Admin-only - only admins can create backups
  public query ({ caller }) func createBackup() : async BackupData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create backups");
    };

    var allFiles = List.nil<FileMetadata>();
    for ((_, metadata) in textMap.entries(fileMetadata)) {
      allFiles := List.push(metadata, allFiles);
    };

    {
      spec = currentSpec;
      specHistory = List.toArray(specHistory);
      sitemap = List.toArray(sitemap);
      theme = currentTheme;
      files = List.toArray(allFiles);
      manifestLog = List.toArray(manifestLog);
    };
  };

  // Admin-only - only admins can restore backups
  public shared ({ caller }) func restoreBackup(backup : BackupData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can restore backups");
    };

    currentSpec := backup.spec;
    specHistory := List.fromArray(backup.specHistory);
    sitemap := List.fromArray(backup.sitemap);
    currentTheme := backup.theme;
    manifestLog := List.fromArray(backup.manifestLog);

    fileMetadata := textMap.empty();
    for (file in backup.files.vals()) {
      fileMetadata := textMap.put(fileMetadata, file.id, file);
    };
    await logManifestEntryInternal(caller, "backup_restore", "Restored system backup");
  };

  public type AnalyticsData = {
    totalUsers : Nat;
    totalFiles : Nat;
    totalContracts : Nat;
    activeUsers : Nat;
    revenue : Nat;
  };

  // Admin-only - only admins can access analytics data
  public query ({ caller }) func getAnalyticsData() : async AnalyticsData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can access analytics data");
    };

    {
      totalUsers = principalMap.size(userProfiles);
      totalFiles = textMap.size(fileMetadata);
      totalContracts = 0;
      activeUsers = 0;
      revenue = 0;
    };
  };

  // Public transform function for HTTP outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Admin and subscriber access - HTTP outcalls
  public shared ({ caller }) func makeGetOutcall(url : Text) : async Text {
    if (not (hasAdminOrSubscriberAccess(caller))) {
      Debug.trap("Unauthorized: Only admins and subscribers can make HTTP outcalls");
    };
    await OutCall.httpGetRequest(url, [], transform);
  };

  public shared ({ caller }) func makePostOutcall(url : Text, body : Text) : async Text {
    if (not (hasAdminOrSubscriberAccess(caller))) {
      Debug.trap("Unauthorized: Only admins and subscribers can make HTTP outcalls");
    };
    await OutCall.httpPostRequest(url, [], body, transform);
  };

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Public check - anyone can check if Stripe is configured
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  // Admin-only - only admins can configure Stripe
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
    await logManifestEntryInternal(caller, "stripe_configuration", "Updated Stripe payment gateway configuration");
  };

  // Admin-only - only admins can view Stripe configuration
  public query ({ caller }) func getStripeConfiguration() : async ?Stripe.StripeConfiguration {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view Stripe configuration");
    };
    stripeConfig;
  };

  private func getStripeConfigurationInternal() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  // Public access - anyone can check session status
  public shared func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfigurationInternal(), sessionId, transform);
  };

  // Admin and subscriber access - checkout sessions
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (hasAdminOrSubscriberAccess(caller))) {
      Debug.trap("Unauthorized: Only admins and subscribers can create checkout sessions");
    };

    if (stripeConfig == null) {
      Debug.trap("Payment gateway not configured. Please contact administrator.");
    };

    for (item in items.vals()) {
      if (item.priceInCents < 50) {
        Debug.trap("Minimum price of $0.50 per item not met");
      };
    };

    let sessionId = await Stripe.createCheckoutSession(getStripeConfigurationInternal(), caller, items, successUrl, cancelUrl, transform);
    await logManifestEntryInternal(caller, "checkout_session", "Created checkout session: " # sessionId);
    sessionId;
  };

  public type Referral = {
    referrer : Principal;
    referred : Principal;
    date : Time.Time;
    status : Text;
  };

  var referrals : List.List<Referral> = List.nil<Referral>();

  // Subscriber access - subscribers can participate in referral program
  public shared ({ caller }) func addReferral(referred : Principal) : async () {
    if (not hasSubscriberAccess(caller)) {
      Debug.trap("Unauthorized: Only subscribers can participate in referral program");
    };

    let referral : Referral = {
      referrer = caller;
      referred;
      date = Time.now();
      status = "pending";
    };
    referrals := List.push(referral, referrals);
    await logManifestEntryInternal(caller, "referral_created", "Created referral for user: " # debug_show(referred));
  };

  // User can view own referrals, admins can view any
  public query ({ caller }) func getUserReferrals(user : Principal) : async [Referral] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own referrals");
    };
    let userReferrals = List.filter<Referral>(referrals, func(ref) { ref.referrer == user });
    List.toArray(userReferrals);
  };

  // Admin-only - only admins can update referral status
  public shared ({ caller }) func updateReferralStatus(referrer : Principal, referred : Principal, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update referral status");
    };

    let filtered = List.filter<Referral>(
      referrals,
      func(ref) {
        ref.referrer != referrer or ref.referred != referred;
      },
    );
    let updatedReferral : Referral = {
      referrer;
      referred;
      date = Time.now();
      status;
    };
    referrals := List.push(updatedReferral, filtered);
    await logManifestEntryInternal(caller, "referral_status_update", "Updated referral status to: " # status);
  };

  public type TemplateInteraction = {
    user : Principal;
    templateId : Text;
    action : Text;
    timestamp : Time.Time;
  };

  var templateInteractions : List.List<TemplateInteraction> = List.nil<TemplateInteraction>();

  // Public for viewing, subscriber access for interactive features
  public shared ({ caller }) func addTemplateInteraction(templateId : Text, action : Text) : async () {
    let requiresSubscription = action == "submit_form" or action == "download_template" or action == "save_pdf" or action == "send_email" or action == "share";

    if (requiresSubscription) {
      if (not hasSubscriberAccess(caller)) {
        Debug.trap("Unauthorized: Subscribe to access interactive template features");
      };
    };

    let interaction : TemplateInteraction = {
      user = caller;
      templateId;
      action;
      timestamp = Time.now();
    };
    templateInteractions := List.push(interaction, templateInteractions);
    await logManifestEntryInternal(caller, "template_interaction", "Action: " # action # " on template: " # templateId);
  };

  // User can view own interactions, admins can view any
  public query ({ caller }) func getUserTemplateInteractions(user : Principal) : async [TemplateInteraction] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own template interactions");
    };
    let userInteractions = List.filter<TemplateInteraction>(templateInteractions, func(inter) { inter.user == user });
    List.toArray(userInteractions);
  };

  // Admin and subscriber access
  public query ({ caller }) func getTemplateInteractionsByTemplateId(templateId : Text) : async [TemplateInteraction] {
    if (not (hasAdminOrSubscriberAccess(caller))) {
      Debug.trap("Unauthorized: Only admins and subscribers can view template interactions by template ID");
    };
    let templateInteractionsList = List.filter<TemplateInteraction>(templateInteractions, func(inter) { inter.templateId == templateId });
    List.toArray(templateInteractionsList);
  };

  // Public check - anyone can check if they have enhanced access
  public query ({ caller }) func hasEnhancedTemplateAccess() : async Bool {
    hasSubscriberAccess(caller);
  };

  // Subscriber access - subscribers can download templates
  public shared ({ caller }) func downloadTemplate(templateId : Text) : async ?FileMetadata {
    if (not hasSubscriberAccess(caller)) {
      Debug.trap("Unauthorized: Subscribe to download templates");
    };

    let templateFile = textMap.get(fileMetadata, templateId);
    switch (templateFile) {
      case (?file) {
        await logManifestEntryInternal(caller, "template_download", "Downloaded template: " # templateId);
        ?file;
      };
      case (null) { null };
    };
  };

  public type ManualPage = {
    path : Text;
    title : Text;
    description : Text;
    isSystem : Bool;
    isControlled : Bool;
    lastUpdated : Time.Time;
    adminSignature : ?Principal;
  };

  var manualPages : List.List<ManualPage> = List.nil<ManualPage>();

  public type ControlledRoute = {
    path : Text;
    title : Text;
    delegatedApp : Text;
    adminControl : Bool;
    lastUpdated : Time.Time;
    adminSignature : ?Principal;
  };

  var controlledRoutes : List.List<ControlledRoute> = List.nil<ControlledRoute>();

  // Admin-only - only admins can add manual pages
  public shared ({ caller }) func addManualPage(page : ManualPage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add pages");
    };

    let reservedKeywords = [
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

    let pathLower = Text.toLowercase(page.path);

    let isReserved = List.some<Text>(
      List.fromArray(reservedKeywords),
      func(keyword) {
        Text.toLowercase(keyword) == pathLower;
      },
    );

    if (isReserved and not page.isSystem) {
      Debug.trap("Reserved system page '" # page.path # "' must be overridden with isSystem = true");
    };

    let isDuplicate = List.some<ManualPage>(
      manualPages,
      func(existing) {
        Text.toLowercase(existing.path) == pathLower;
      },
    );

    if (isDuplicate) {
      Debug.trap("Page with path '" # page.path # "' already exists");
    };

    manualPages := List.push(page, manualPages);
    await logManifestEntryInternal(caller, "add_page", "Added page: " # page.path);
  };

  // Public access - anyone can view manual pages
  public query func getManualPages() : async [ManualPage] {
    List.toArray(manualPages);
  };

  // Public access - anyone can get page by path
  public query func getPageByPath(path : Text) : async ?ManualPage {
    let allManualPages = List.toArray(manualPages);
    Array.find<ManualPage>(allManualPages, func(page) { page.path == path });
  };

  // Admin-only - only admins can update manual pages
  public shared ({ caller }) func updateManualPage(updated : ManualPage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update pages");
    };

    let filtered = List.filter<ManualPage>(
      manualPages,
      func(page) {
        page.path != updated.path;
      },
    );
    manualPages := List.push(updated, filtered);
    await logManifestEntryInternal(caller, "update_page", "Updated page: " # updated.path);
  };

  // Admin-only - only admins can remove manual pages
  public shared ({ caller }) func removeManualPage(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove pages");
    };

    let page = List.find<ManualPage>(manualPages, func(page) { page.path == path });
    switch (page) {
      case (?page) {
        if (page.isSystem) {
          Debug.trap("Cannot remove system page '" # path # "'");
        };
      };
      case null {
        Debug.trap("Page '" # path # "' not found");
      };
    };

    let filtered = List.filter<ManualPage>(
      manualPages,
      func(page) {
        page.path != path;
      },
    );
    manualPages := filtered;
    await logManifestEntryInternal(caller, "remove_page", "Removed page: " # path);
  };

  // Admin-only - only admins can add controlled routes
  public shared ({ caller }) func addControlledRoute(route : ControlledRoute) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add controlled routes");
    };

    let pathLower = Text.toLowercase(route.path);

    if (not (route.path == "/broadcast" or route.path == "/remote" or route.path == "/live")) {
      Debug.trap("Controlled routes must be '/broadcast', '/remote', or '/live'");
    };

    let isDuplicate = List.some<ControlledRoute>(
      controlledRoutes,
      func(existing) {
        Text.toLowercase(existing.path) == pathLower;
      },
    );

    if (isDuplicate) {
      Debug.trap("Controlled route '" # route.path # "' already exists");
    };

    controlledRoutes := List.push(route, controlledRoutes);
    await logManifestEntryInternal(caller, "add_controlled_route", "Added controlled route: " # route.path # " (Delegated: " # route.delegatedApp # ")");
  };

  // Public access - anyone can view controlled routes
  public query func getControlledRoutes() : async [ControlledRoute] {
    List.toArray(controlledRoutes);
  };

  // Public access - anyone can get controlled route by path
  public query func getControlledRouteByPath(path : Text) : async ?ControlledRoute {
    let allRoutes = List.toArray(controlledRoutes);
    Array.find<ControlledRoute>(allRoutes, func(route) { route.path == path });
  };

  // Admin-only - only admins can update controlled routes
  public shared ({ caller }) func updateControlledRoute(updated : ControlledRoute) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update controlled routes");
    };

    let filtered = List.filter<ControlledRoute>(
      controlledRoutes,
      func(route) {
        route.path != updated.path;
      },
    );
    controlledRoutes := List.push(updated, filtered);
    await logManifestEntryInternal(caller, "update_controlled_route", "Updated controlled route: " # updated.path);
  };

  // Admin-only - only admins can remove controlled routes
  public shared ({ caller }) func removeControlledRoute(path : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can remove controlled routes");
    };

    let route = List.find<ControlledRoute>(controlledRoutes, func(route) { route.path == path });
    switch (route) {
      case (?route) {
        if (not (route.path == "/broadcast" or route.path == "/remote" or route.path == "/live")) {
          Debug.trap("Cannot remove non-standard controlled route '" # path # "'");
        };
      };
      case null {
        Debug.trap("Controlled route '" # path # "' not found");
      };
    };

    let filtered = List.filter<ControlledRoute>(
      controlledRoutes,
      func(route) {
        route.path != path;
      },
    );
    controlledRoutes := filtered;
    await logManifestEntryInternal(caller, "remove_controlled_route", "Removed controlled route: " # path);
  };

  // Public access - anyone can resolve sitemap
  public query func resolveSitemap() : async {
    auto : [SitemapEntry];
    manualPages : [ManualPage];
    controlledRoutes : [ControlledRoute];
  } {
    let allSitemap = List.toArray(sitemap);
    let allManualPages = List.toArray(manualPages);
    let allControlledRoutes = List.toArray(controlledRoutes);

    {
      auto = allSitemap;
      manualPages = allManualPages;
      controlledRoutes = allControlledRoutes;
    };
  };

  // Admin-only - only admins can view system pages configuration
  public query ({ caller }) func getSystemPages() : async [ManualPage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view system pages configuration");
    };

    let systemPages = List.filter<ManualPage>(
      manualPages,
      func(page) {
        page.isSystem;
      },
    );
    List.toArray(systemPages);
  };

  // Admin-only - only admins can view admin-controlled routes configuration
  public query ({ caller }) func getAdminControlledRoutes() : async [ControlledRoute] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view admin-controlled routes configuration");
    };

    let adminControlled = List.filter<ControlledRoute>(
      controlledRoutes,
      func(route) {
        route.adminControl;
      },
    );
    List.toArray(adminControlled);
  };
};
