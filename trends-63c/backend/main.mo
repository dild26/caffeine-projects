import OrderedMap "mo:base/OrderedMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import List "mo:base/List";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import AccessControl "authorization/access-control";

actor LatestTrends {

  // Initialize the access control system
  let accessControlState = AccessControl.initState();

  public type Paragraph = {
    content : Text;
    sources : [Text];
  };

  public type Topic = {
    id : Nat;
    title : Text;
    slug : Text;
    category : Text;
    score : Nat;
    createdAt : Int;
    updatedAt : Int;
    status : Text;
    moderation : {
      approvalScore : Nat;
      confidenceScore : Nat;
    };
    paragraphs : [Paragraph];
    relatedQueries : [Text];
    trendIndicator : Text;
    polygonVertices : Nat;
    hashIdentifier : Text;
    merkleRoot : Text;
    upvotes : Nat;
    downvotes : Nat;
    totalVotes : Int;
    rank : Nat;
    clickCount : Nat;
  };

  public type TopicInput = {
    title : Text;
    slug : Text;
    category : Text;
    score : Nat;
    paragraphs : [Paragraph];
    relatedQueries : [Text];
    trendIndicator : Text;
    polygonVertices : Nat;
  };

  public type TopicSummary = {
    id : Nat;
    title : Text;
    slug : Text;
    category : Text;
    score : Nat;
    trendIndicator : Text;
    polygonVertices : Nat;
    status : Text;
    upvotes : Nat;
    downvotes : Nat;
    totalVotes : Int;
    rank : Nat;
    clickCount : Nat;
  };

  public type StaticPage = {
    slug : Text;
    title : Text;
    content : Text;
    metaDescription : Text;
    canonicalUrl : Text;
    lastModified : Int;
  };

  public type Pagination = {
    currentPage : Nat;
    totalPages : Nat;
    pageSize : Nat;
    totalItems : Nat;
    hasNext : Bool;
    hasPrevious : Bool;
  };

  public type PaginatedTopics = {
    topics : [TopicSummary];
    pagination : Pagination;
  };

  public type VoteAction = {
    #upvote;
    #downvote;
  };

  public type LeaderboardEntry = {
    topicId : Nat;
    title : Text;
    score : Nat;
    rank : Nat;
    totalVotes : Int;
    upvotes : Nat;
    downvotes : Nat;
    clickCount : Nat;
  };

  public type VoterStats = {
    voter : Principal;
    totalVotes : Nat;
    upvotesGiven : Nat;
    downvotesGiven : Nat;
  };

  public type Leaderboard = {
    topTopics : [LeaderboardEntry];
    topVoters : [VoterStats];
  };

  public type UserProfile = {
    name : Text;
    totalVotes : Nat;
    upvotesGiven : Nat;
    downvotesGiven : Nat;
    referralPoints : Nat;
    badges : [Text];
  };

  // Public types for access control state
  public type AccessControlRole = AccessControl.UserRole;

  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  var topics : OrderedMap.Map<Nat, Topic> = natMap.empty<Topic>();
  var slugToId : OrderedMap.Map<Text, Nat> = textMap.empty<Nat>();
  var staticPages : OrderedMap.Map<Text, StaticPage> = textMap.empty<StaticPage>();
  var userProfiles : OrderedMap.Map<Principal, UserProfile> = principalMap.empty<UserProfile>();
  var nextId : Nat = 1;

  // Access Control Functions

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

  // User Profile Functions

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

  // Topic Management Functions (Admin Only)

  public shared ({ caller }) func createTopic(input : TopicInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create topics");
    };

    let id = nextId;
    nextId += 1;

    let now = Time.now();
    let hashIdentifier = generateHashIdentifier(input.title, input.slug);
    let merkleRoot = generateMerkleRoot(hashIdentifier);

    let topic : Topic = {
      id;
      title = input.title;
      slug = input.slug;
      category = input.category;
      score = input.score;
      createdAt = now;
      updatedAt = now;
      status = "active";
      moderation = {
        approvalScore = 100;
        confidenceScore = 100;
      };
      paragraphs = input.paragraphs;
      relatedQueries = input.relatedQueries;
      trendIndicator = input.trendIndicator;
      polygonVertices = input.polygonVertices;
      hashIdentifier;
      merkleRoot;
      upvotes = 0;
      downvotes = 0;
      totalVotes = 0;
      rank = 1;
      clickCount = 0;
    };

    topics := natMap.put(topics, id, topic);
    slugToId := textMap.put(slugToId, input.slug, id);

    id;
  };

  public shared ({ caller }) func updateTopic(id : Nat, input : TopicInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update topics");
    };

    switch (natMap.get(topics, id)) {
      case null { Debug.trap("Topic not found") };
      case (?existing) {
        let updated : Topic = {
          id = existing.id;
          title = input.title;
          slug = input.slug;
          category = input.category;
          score = input.score;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
          status = existing.status;
          moderation = existing.moderation;
          paragraphs = input.paragraphs;
          relatedQueries = input.relatedQueries;
          trendIndicator = input.trendIndicator;
          polygonVertices = input.polygonVertices;
          hashIdentifier = existing.hashIdentifier;
          merkleRoot = existing.merkleRoot;
          upvotes = existing.upvotes;
          downvotes = existing.downvotes;
          totalVotes = existing.totalVotes;
          rank = existing.rank;
          clickCount = existing.clickCount;
        };

        topics := natMap.put(topics, id, updated);
        slugToId := textMap.put(slugToId, input.slug, id);
      };
    };
  };

  public shared ({ caller }) func deleteTopic(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete topics");
    };

    switch (natMap.get(topics, id)) {
      case null { Debug.trap("Topic not found") };
      case (?topic) {
        topics := natMap.delete(topics, id);
        slugToId := textMap.delete(slugToId, topic.slug);
      };
    };
  };

  public shared ({ caller }) func refreshTopics() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can refresh topics");
    };

    let allTopics = Iter.toArray(natMap.vals(topics));
    let sortedTopics = Array.sort<Topic>(
      allTopics,
      func(a, b) {
        if (a.updatedAt > b.updatedAt) { #less } else if (a.updatedAt < b.updatedAt) {
          #greater;
        } else { #equal };
      },
    );

    let topicsToKeep = Array.take(sortedTopics, 100);

    var newTopics : OrderedMap.Map<Nat, Topic> = natMap.empty<Topic>();
    var newSlugToId : OrderedMap.Map<Text, Nat> = textMap.empty<Nat>();

    for (topic in topicsToKeep.vals()) {
      newTopics := natMap.put(newTopics, topic.id, topic);
      newSlugToId := textMap.put(newSlugToId, topic.slug, topic.id);
    };

    topics := newTopics;
    slugToId := newSlugToId;
  };

  public shared ({ caller }) func hideTopic(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can hide topics");
    };

    switch (natMap.get(topics, id)) {
      case null { Debug.trap("Topic not found") };
      case (?topic) {
        let updated : Topic = {
          id = topic.id;
          title = topic.title;
          slug = topic.slug;
          category = topic.category;
          score = topic.score;
          createdAt = topic.createdAt;
          updatedAt = Time.now();
          status = "hidden";
          moderation = topic.moderation;
          paragraphs = topic.paragraphs;
          relatedQueries = topic.relatedQueries;
          trendIndicator = topic.trendIndicator;
          polygonVertices = topic.polygonVertices;
          hashIdentifier = topic.hashIdentifier;
          merkleRoot = topic.merkleRoot;
          upvotes = topic.upvotes;
          downvotes = topic.downvotes;
          totalVotes = topic.totalVotes;
          rank = topic.rank;
          clickCount = topic.clickCount;
        };

        topics := natMap.put(topics, id, updated);
      };
    };
  };

  // Public Read Functions (No Auth Required)

  public query func getTopicById(id : Nat) : async ?Topic {
    natMap.get(topics, id);
  };

  public query func getTopicBySlug(slug : Text) : async ?Topic {
    switch (textMap.get(slugToId, slug)) {
      case null { null };
      case (?id) { natMap.get(topics, id) };
    };
  };

  public query func getPaginatedTopics(page : Nat, pageSize : Nat) : async PaginatedTopics {
    let allTopics = Iter.toArray(natMap.vals(topics));
    let sortedTopics = Array.sort<Topic>(
      allTopics,
      func(a, b) {
        if (a.score > b.score) { #less } else if (a.score < b.score) {
          #greater;
        } else { #equal };
      },
    );

    let totalItems = sortedTopics.size();
    let totalPages = if (totalItems == 0) { 1 } else {
      (totalItems + pageSize - 1) / pageSize;
    };

    let currentPage = if (page == 0) { 1 } else if (page > totalPages) {
      totalPages;
    } else { page };

    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = if (startIndex + pageSize > totalItems) {
      totalItems;
    } else { startIndex + pageSize };

    let pageTopics = Array.tabulate<Topic>(
      endIndex - startIndex,
      func(i) { sortedTopics[startIndex + i] },
    );

    let topicSummaries = Array.map<Topic, TopicSummary>(
      pageTopics,
      func(topic) {
        {
          id = topic.id;
          title = topic.title;
          slug = topic.slug;
          category = topic.category;
          score = topic.score;
          trendIndicator = topic.trendIndicator;
          polygonVertices = topic.polygonVertices;
          status = topic.status;
          upvotes = topic.upvotes;
          downvotes = topic.downvotes;
          totalVotes = topic.totalVotes;
          rank = topic.rank;
          clickCount = topic.clickCount;
        };
      },
    );

    let pagination : Pagination = {
      currentPage;
      totalPages;
      pageSize;
      totalItems;
      hasNext = currentPage < totalPages;
      hasPrevious = currentPage > 1;
    };

    {
      topics = topicSummaries;
      pagination;
    };
  };

  public query func getTopicCount() : async Nat {
    natMap.size(topics);
  };

  public query func getLeaderboard() : async Leaderboard {
    let allTopics = Iter.toArray(natMap.vals(topics));
    let sortedTopics = Array.sort<Topic>(
      allTopics,
      func(a, b) {
        if (a.totalVotes > b.totalVotes) { #less } else if (a.totalVotes < b.totalVotes) {
          #greater;
        } else { #equal };
      },
    );

    let topTopics = Array.map<Topic, LeaderboardEntry>(
      Array.take(sortedTopics, 10),
      func(topic) {
        {
          topicId = topic.id;
          title = topic.title;
          score = topic.score;
          rank = topic.rank;
          totalVotes = topic.totalVotes;
          upvotes = topic.upvotes;
          downvotes = topic.downvotes;
          clickCount = topic.clickCount;
        };
      },
    );

    let allProfiles = Iter.toArray(principalMap.entries(userProfiles));
    let sortedVoters = Array.sort<(Principal, UserProfile)>(
      allProfiles,
      func(a, b) {
        if (a.1.totalVotes > b.1.totalVotes) { #less } else if (a.1.totalVotes < b.1.totalVotes) {
          #greater;
        } else { #equal };
      },
    );

    let topVoters = Array.map<(Principal, UserProfile), VoterStats>(
      Array.take(sortedVoters, 10),
      func(entry) {
        {
          voter = entry.0;
          totalVotes = entry.1.totalVotes;
          upvotesGiven = entry.1.upvotesGiven;
          downvotesGiven = entry.1.downvotesGiven;
        };
      },
    );

    {
      topTopics;
      topVoters;
    };
  };

  public query func getSitemapEntries() : async [(Text, Int, Nat)] {
    let topicEntries = List.map<Topic, (Text, Int, Nat)>(
      List.fromArray(Iter.toArray(natMap.vals(topics))),
      func(topic) {
        ("/topic/" # topic.slug, topic.updatedAt, topic.score);
      },
    );

    let pageEntries = List.map<StaticPage, (Text, Int, Nat)>(
      List.fromArray(Iter.toArray(textMap.vals(staticPages))),
      func(page) {
        ("/" # page.slug, page.lastModified, 100);
      },
    );

    let allEntries = List.append(topicEntries, pageEntries);
    List.toArray(allEntries);
  };

  // Voting Functions (User Auth Required)

  public shared ({ caller }) func voteTopic(id : Nat, action : VoteAction) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can vote on topics");
    };

    switch (natMap.get(topics, id)) {
      case null { Debug.trap("Topic not found") };
      case (?topic) {
        let (upvotes, downvotes) = switch (action) {
          case (#upvote) { (topic.upvotes + 1, topic.downvotes) };
          case (#downvote) { (topic.upvotes, topic.downvotes + 1) };
        };

        let totalVotes = upvotes - downvotes;
        let rank = calculateRank(totalVotes);

        let updated : Topic = {
          id = topic.id;
          title = topic.title;
          slug = topic.slug;
          category = topic.category;
          score = topic.score;
          createdAt = topic.createdAt;
          updatedAt = Time.now();
          status = topic.status;
          moderation = topic.moderation;
          paragraphs = topic.paragraphs;
          relatedQueries = topic.relatedQueries;
          trendIndicator = topic.trendIndicator;
          polygonVertices = topic.polygonVertices;
          hashIdentifier = topic.hashIdentifier;
          merkleRoot = topic.merkleRoot;
          upvotes;
          downvotes;
          totalVotes;
          rank;
          clickCount = topic.clickCount;
        };

        topics := natMap.put(topics, id, updated);

        // Update user profile
        updateUserVoteStats(caller, action);
      };
    };
  };

  // Click tracking is public - allows guests to track clicks for analytics
  public shared func incrementClickCount(id : Nat) : async () {
    // No authorization check - click tracking available to all users including guests
    switch (natMap.get(topics, id)) {
      case null { Debug.trap("Topic not found") };
      case (?topic) {
        let updated : Topic = {
          id = topic.id;
          title = topic.title;
          slug = topic.slug;
          category = topic.category;
          score = topic.score;
          createdAt = topic.createdAt;
          updatedAt = Time.now();
          status = topic.status;
          moderation = topic.moderation;
          paragraphs = topic.paragraphs;
          relatedQueries = topic.relatedQueries;
          trendIndicator = topic.trendIndicator;
          polygonVertices = topic.polygonVertices;
          hashIdentifier = topic.hashIdentifier;
          merkleRoot = topic.merkleRoot;
          upvotes = topic.upvotes;
          downvotes = topic.downvotes;
          totalVotes = topic.totalVotes;
          rank = topic.rank;
          clickCount = topic.clickCount + 1;
        };

        topics := natMap.put(topics, id, updated);
      };
    };
  };

  // Static Page Functions

  public shared ({ caller }) func createStaticPage(page : StaticPage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create static pages");
    };
    staticPages := textMap.put(staticPages, page.slug, page);
  };

  public query func getStaticPage(slug : Text) : async ?StaticPage {
    textMap.get(staticPages, slug);
  };

  public shared ({ caller }) func updateStaticPage(page : StaticPage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update static pages");
    };
    staticPages := textMap.put(staticPages, page.slug, page);
  };

  public shared ({ caller }) func deleteStaticPage(slug : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete static pages");
    };
    staticPages := textMap.delete(staticPages, slug);
  };

  public query func getAllStaticPages() : async [StaticPage] {
    Iter.toArray(textMap.vals(staticPages));
  };

  // Helper Functions

  func updateUserVoteStats(user : Principal, action : VoteAction) {
    let currentProfile = principalMap.get(userProfiles, user);

    let profile : UserProfile = switch (currentProfile) {
      case null {
        {
          name = "";
          totalVotes = 1;
          upvotesGiven = if (action == #upvote) { 1 } else { 0 };
          downvotesGiven = if (action == #downvote) { 1 } else { 0 };
          referralPoints = 0;
          badges = [];
        };
      };
      case (?existing) {
        {
          name = existing.name;
          totalVotes = existing.totalVotes + 1;
          upvotesGiven = if (action == #upvote) { existing.upvotesGiven + 1 } else { existing.upvotesGiven };
          downvotesGiven = if (action == #downvote) { existing.downvotesGiven + 1 } else { existing.downvotesGiven };
          referralPoints = existing.referralPoints;
          badges = existing.badges;
        };
      };
    };

    userProfiles := principalMap.put(userProfiles, user, profile);
  };

  func generateHashIdentifier(title : Text, slug : Text) : Text {
    let combined = title # slug;
    let hash = Text.hash(combined);
    Nat32.toText(hash);
  };

  func generateMerkleRoot(hashIdentifier : Text) : Text {
    if (hashIdentifier.size() < 2) {
      return hashIdentifier;
    };

    let firstChar = Text.toArray(hashIdentifier)[0];
    let lastChar = Text.toArray(hashIdentifier)[Text.toArray(hashIdentifier).size() - 1];

    let firstCharText = Text.fromChar(firstChar);
    let lastCharText = Text.fromChar(lastChar);

    firstCharText # lastCharText # hashIdentifier;
  };

  func calculateRank(totalVotes : Int) : Nat {
    if (totalVotes <= 0) {
      return 100;
    };

    let votes = if (totalVotes > 100) { 100 } else {
      Nat32.toNat(Nat32.fromIntWrap(totalVotes));
    };

    101 - votes;
  };
};
