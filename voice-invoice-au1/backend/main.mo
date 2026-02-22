import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Char "mo:core/Char";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Bool "mo:core/Bool";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";
import MixinStorage "blob-storage/Mixin";

actor class VoiceInvoice() {
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

  var userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Allow any caller (including guests) to check their profile
    // Guests will simply get null
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Users can view their own profile, admins can view any profile
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
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

  // Storage setup
  let storage = Storage.new();
  include MixinStorage(storage);

  // Data types
  public type Transaction = {
    id : Text;
    donorHash : Text;
    amount : Nat;
    taxes : Nat;
    exemptions : Nat;
    merkleRoot : Blob;
    timestamp : Time.Time;
    digitalSignature : Blob;
    owner : Principal;
  };

  public type PoojaRitual = {
    id : Text;
    name : Text;
    category : Text;
    donationType : Text;
    horoscopeReference : Text;
    beneficiaryAccount : Text;
    price : Nat;
  };

  public type TrustAccount = {
    id : Text;
    name : Text;
    cgstRate : Nat;
    sgstRate : Nat;
    exemptionPolicy : Text;
  };

  public type VoiceInvoiceDraft = {
    id : Text;
    voiceInput : Text;
    language : Text;
    invoiceData : Text;
    status : Text;
    owner : Principal;
  };

  public type MerkleProof = {
    transactionId : Text;
    merkleRoot : Blob;
    proof : Blob;
    isValid : Bool;
  };

  // Sitemap Management
  public type Page = {
    slug : Text;
    createdBy : Principal;
    createdAt : Time.Time;
    lastModified : Time.Time;
    pageType : PageType;
  };

  public type PageType = {
    #systemType;
    #manual;
    #dynamic;
  };

  public type SitemapMerkleRoot = {
    rootHash : Blob;
    timestamp : Time.Time;
    createdBy : Principal;
  };

  public type SitemapResponse = {
    pages : [Page];
    merkleRoot : ?SitemapMerkleRoot;
    reservedRoutes : [Text];
    runtimeControlledRoutes : [Text];
  };

  // Storage maps
  var transactions = Map.empty<Text, Transaction>();
  var poojaRituals = Map.empty<Text, PoojaRitual>();
  var trustAccounts = Map.empty<Text, TrustAccount>();
  var voiceInvoiceDrafts = Map.empty<Text, VoiceInvoiceDraft>();
  var merkleProofs = Map.empty<Text, MerkleProof>();
  var pages = Map.empty<Text, Page>();
  var sitemapMerkleRoots = Map.empty<Nat, SitemapMerkleRoot>();

  // Transaction management
  public shared ({ caller }) func createTransaction(transaction : Transaction) : async () {
    // Public access - voice invoice creation is public
    // No authentication required - guests can create transactions
    if (transaction.owner != caller) {
      Runtime.trap("Unauthorized: Cannot create transaction for another user");
    };
    transactions.add(transaction.id, transaction);
  };

  public query ({ caller }) func getTransaction(id : Text) : async ?Transaction {
    // Public access for verification - anyone should be able to verify transactions
    // No authentication required - this is intentional for public verification
    switch (transactions.get(id)) {
      case (null) { null };
      case (?transaction) {
        // Users can only view their own transactions, admins can view all
        if (transaction.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?transaction;
        } else {
          Runtime.trap("Unauthorized: Can only view your own transactions");
        };
      };
    };
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all transactions");
    };
    transactions.values().toArray();
  };

  public query ({ caller }) func getMyTransactions() : async [Transaction] {
    // Public access - guests can view their own transactions
    // No authentication required - this is intentional for public access
    let myTransactions = transactions.values().filter(
      func(transaction) { transaction.owner == caller }
    );
    myTransactions.toArray();
  };

  // Pooja ritual management
  public shared ({ caller }) func addPoojaRitual(ritual : PoojaRitual) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add pooja rituals");
    };
    poojaRituals.add(ritual.id, ritual);
  };

  public query func getPoojaRitual(id : Text) : async ?PoojaRitual {
    // Public access for transparency - users need to see available rituals
    // No authentication required - this is intentional for public transparency
    poojaRituals.get(id);
  };

  public query func getAllPoojaRituals() : async [PoojaRitual] {
    // Public access for transparency - users need to see available rituals
    // No authentication required - this is intentional for public transparency
    poojaRituals.values().toArray();
  };

  // Trust account management
  public shared ({ caller }) func addTrustAccount(account : TrustAccount) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add trust accounts");
    };
    trustAccounts.add(account.id, account);
  };

  public query func getTrustAccount(id : Text) : async ?TrustAccount {
    // Public access for transparency - users need to see trust information
    // No authentication required - this is intentional for public transparency
    trustAccounts.get(id);
  };

  public query func getAllTrustAccounts() : async [TrustAccount] {
    // Public access for transparency - users need to see trust information
    // No authentication required - this is intentional for public transparency
    trustAccounts.values().toArray();
  };

  // Voice invoice management
  public shared ({ caller }) func createVoiceInvoiceDraft(draft : VoiceInvoiceDraft) : async () {
    // Public access - voice invoice creation is public
    // No authentication required - guests can create voice invoice drafts
    // Verify that the draft owner matches the caller
    if (draft.owner != caller) {
      Runtime.trap("Unauthorized: Cannot create draft for another user");
    };
    voiceInvoiceDrafts.add(draft.id, draft);
  };

  public query ({ caller }) func getVoiceInvoiceDraft(id : Text) : async ?VoiceInvoiceDraft {
    // Public access - guests can view their own drafts
    // No authentication required - this is intentional for public access
    switch (voiceInvoiceDrafts.get(id)) {
      case (null) { null };
      case (?draft) {
        // Users can only view their own drafts, admins can view all
        if (draft.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?draft;
        } else {
          Runtime.trap("Unauthorized: Can only view your own drafts");
        };
      };
    };
  };

  public query ({ caller }) func getMyVoiceInvoiceDrafts() : async [VoiceInvoiceDraft] {
    // Public access - guests can view their own drafts
    // No authentication required - this is intentional for public access
    let myDrafts = voiceInvoiceDrafts.values().filter(
      func(draft) { draft.owner == caller }
    );
    myDrafts.toArray();
  };

  // Merkle proof management
  public shared ({ caller }) func addMerkleProof(proof : MerkleProof) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add Merkle proofs");
    };
    merkleProofs.add(proof.transactionId, proof);
  };

  public query func getMerkleProof(transactionId : Text) : async ?MerkleProof {
    // Public access for verification - anyone should be able to verify receipts
    // No authentication required - this is intentional for public verification
    merkleProofs.get(transactionId);
  };

  public query func verifyMerkleProof(transactionId : Text) : async ?Bool {
    // Public verification endpoint for receipt authenticity
    // No authentication required - this is intentional for public verification
    switch (merkleProofs.get(transactionId)) {
      case (null) { null };
      case (?proof) { ?proof.isValid };
    };
  };

  // Sitemap management functions
  public shared ({ caller }) func addPage(slug : Text, pageType : PageType) : async () {
    // Only allow admin to add pages
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add pages");
    };

    // Validate page identifier
    validatePageSlug(slug);

    // Check if page already exists
    if (pages.containsKey(slug)) {
      Runtime.trap("Page already exists");
    };

    // Create new page record
    let timestamp = Time.now();
    let page = {
      slug;
      createdBy = caller;
      createdAt = timestamp;
      lastModified = timestamp;
      pageType;
    };

    // Add new page to map
    pages.add(slug, page);

    // Update Merkle root
    let newMerkleRoot = generateMerkleRoot(caller);
    sitemapMerkleRoots.add(sitemapMerkleRoots.size(), newMerkleRoot);
  };

  public query func getPage(slug : Text) : async ?Page {
    // Public access to view individual pages
    // No authentication required - pages are public information
    pages.get(slug);
  };

  public query func getAllPages() : async [Page] {
    // Public access to all pages
    // No authentication required - pages are public information
    pages.values().toArray();
  };

  public query func getSitemap() : async SitemapResponse {
    // Public access to sitemap for transparency
    // No authentication required - sitemap is public information
    let runtimeControlledRoutes = ["broadcast", "remote", "live"];

    let reservedRoutes = [
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

    // Get latest Merkle root if any exist
    let latestMerkleRoot = if (sitemapMerkleRoots.size() > 0) {
      sitemapMerkleRoots.get((sitemapMerkleRoots.size() - 1) : Nat);
    } else {
      null;
    };

    {
      pages = pages.values().toArray();
      merkleRoot = latestMerkleRoot;
      reservedRoutes;
      runtimeControlledRoutes;
    };
  };

  func validatePageSlug(slug : Text) : () {
    if (slug.size() == 0) {
      Runtime.trap("Page slug cannot be empty");
    };

    // Check for lowercase and no spaces
    for (char in slug.chars()) {
      let charCode = Nat32.toNat(char.toNat32());
      // Check if character is lowercase letter (a-z), digit (0-9), or hyphen (-)
      let isLowercase = charCode >= 97 and charCode <= 122; // a-z
      let isDigit = charCode >= 48 and charCode <= 57; // 0-9
      let isHyphen = charCode == 45; // -

      if (not (isLowercase or isDigit or isHyphen)) {
        Runtime.trap("Page slug must contain only lowercase letters, digits, and hyphens");
      };
    };

    let reservedRoutes = [
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

    // Check if slug is a reserved keyword
    for (reserved in reservedRoutes.vals()) {
      if (slug == reserved) {
        Runtime.trap("Page slug is a reserved keyword");
      };
    };
  };

  func generateMerkleRoot(caller : Principal) : SitemapMerkleRoot {
    let pagesArray = pages.values().toArray();
    var combinedText = "";
    for (page in pagesArray.vals()) {
      combinedText := combinedText # page.slug;
    };
    let rootHash = combinedText.encodeUtf8();
    let timestamp = Time.now();
    {
      rootHash;
      timestamp;
      createdBy = caller;
    };
  };

  // HTTP outcall transformation
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Delegation system - reserved routes only managed by admin
  public shared ({ caller }) func assignReservedRoute(route : Text) : async () {
    // Only admin can assign reserved routes
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign reserved routes");
    };
    validateReservedRoute(route);
  };

  func validateReservedRoute(route : Text) : () {
    // Allow dynamic updates for dynamic routes
    var allowedDynamic = false;
    for (char in route.chars()) {
      if (char == '-') { allowedDynamic := true };
    };

    // Check if route is a reserved keyword (except dynamic ones)
    let reservedRoutes = [
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

    // Check if route is a reserved keyword
    for (reserved in reservedRoutes.vals()) {
      if (route == reserved) {
        if (not allowedDynamic) {
          Runtime.trap("Route is a reserved keyword");
        };
      };
    };
  };
};
