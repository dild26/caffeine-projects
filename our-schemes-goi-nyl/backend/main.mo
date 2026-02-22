import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // ============================================================================
  // ACCESS CONTROL RULES:
  // - Public (no auth): getScheme, searchSchemes, getAllSchemes, getFilteredSchemes
  // - Admin only: uploadScheme
  // - User only: saveCallerUserProfile, getCallerUserProfile
  // - User or Admin: getUserProfile (own profile or admin viewing others)
  // ============================================================================

  func getDefaultPageSize() : Nat {
    20;
  };

  type Scheme = {
    id : Nat;
    name : Text;
    ministry : Text;
    category : Text;
    description : Text;
    tags : [Text];
    eligibilityCriteria : Text;
    benefits : Text;
    sourceUrl : Text;
    blob : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    pinnedSchemes : [Nat];
  };

  let schemes = Map.empty<Nat, Scheme>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 0;

  type PaginatedSchemes = {
    schemes : [Scheme];
    totalPages : Nat;
    currentPage : Nat;
  };

  func assertPageAndSize(page : Nat, pageSize : Nat) : () {
    if (pageSize > 100) {
      Runtime.trap("Page size must not be larger than 100");
    };
  };

  // ============================================================================
  // USER PROFILE MANAGEMENT (Authenticated Users)
  // ============================================================================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be admin");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ============================================================================
  // SCHEME MANAGEMENT
  // ============================================================================

  // ADMIN ONLY: Upload new scheme
  public shared ({ caller }) func uploadScheme(
    name : Text,
    ministry : Text,
    category : Text,
    description : Text,
    tags : [Text],
    eligibilityCriteria : Text,
    benefits : Text,
    sourceUrl : Text,
    blob : Storage.ExternalBlob,
  ) : async Nat {
    // Authorization: Admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload schemes");
    };

    let id = nextId;
    nextId += 1;

    let scheme : Scheme = {
      id;
      name;
      ministry;
      category;
      description;
      tags;
      eligibilityCriteria;
      benefits;
      sourceUrl;
      blob;
    };

    schemes.add(id, scheme);
    id;
  };

  // PUBLIC: Get single scheme by ID
  public query ({ caller }) func getScheme(id : Nat) : async ?Scheme {
    // No authorization required - public access
    switch (schemes.get(id)) {
      case (?scheme) { ?scheme };
      case (null) { null };
    };
  };

  // PUBLIC: Search schemes with filters and pagination
  public query ({ caller }) func searchSchemes(
    searchText : Text,
    ministryFilter : ?Text,
    categoryFilter : ?Text,
    page : Nat,
    pageSize : Nat,
  ) : async PaginatedSchemes {
    // No authorization required - public access
    assertPageAndSize(page, pageSize);

    let filtered = schemes.values().toArray().filter(
      func(scheme) {
        let matchesText = scheme.name.toLower().contains(#text(searchText.toLower())) or
          scheme.ministry.toLower().contains(#text(searchText.toLower())) or
          scheme.tags.any(
            func(tag) { tag.toLower().contains(#text(searchText.toLower())) }
          );

        let matchesMinistry = switch (ministryFilter) {
          case (null) { true };
          case (?m) { scheme.ministry == m };
        };

        let matchesCategory = switch (categoryFilter) {
          case (null) { true };
          case (?c) { scheme.category == c };
        };

        matchesText and matchesMinistry and matchesCategory
      }
    );

    let totalResults = filtered.size();
    let totalPages = if (totalResults > 0) {
      (totalResults + getDefaultPageSize() - 1) / getDefaultPageSize();
    } else { 0 };

    if (page >= totalPages and totalPages > 0) {
      Runtime.trap("Page must be less than total pages");
    };

    let startIndex = page * getDefaultPageSize();
    let endIndex = if ((startIndex + getDefaultPageSize()) > totalResults) {
      totalResults;
    } else { startIndex + getDefaultPageSize() };

    let paginated = filtered.sliceToArray(startIndex, endIndex);

    {
      schemes = paginated;
      totalPages;
      currentPage = page;
    };
  };

  // PUBLIC: Get all schemes
  public query ({ caller }) func getAllSchemes() : async [Scheme] {
    // No authorization required - public access
    schemes.values().toArray();
  };

  // PUBLIC: Get filtered schemes
  public query ({ caller }) func getFilteredSchemes(
    ministryFilter : ?Text,
    categoryFilter : ?Text,
  ) : async [Scheme] {
    // No authorization required - public access
    schemes.values().toArray().filter(
      func(scheme) {
        let matchesMinistry = switch (ministryFilter) {
          case (null) { true };
          case (?m) { scheme.ministry == m };
        };

        let matchesCategory = switch (categoryFilter) {
          case (null) { true };
          case (?c) { scheme.category == c };
        };

        matchesMinistry and matchesCategory
      }
    );
  };
};
