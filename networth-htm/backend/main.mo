import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import List "mo:base/List";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Array "mo:base/Array";




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
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    skills : [Text];
    experiences : [Text];
    qualifications : [Text];
    specializations : [Text];
    pros : [Text];
    usps : [Text];
    referralId : Text;
    totalVotes : Nat;
    referralEarnings : Nat;
    isPublic : Bool;
    visibleTopics : [Text];
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view profiles");
    };

    // Allow viewing own profile, admin can view any profile
    if (caller == user or AccessControl.isAdmin(accessControlState, caller)) {
      return principalMap.get(userProfiles, user);
    };

    // For other users, check if profile is public
    switch (principalMap.get(userProfiles, user)) {
      case null { null };
      case (?profile) {
        if (profile.isPublic) {
          ?profile;
        } else {
          Debug.trap("Unauthorized: This profile is private");
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public type Topic = {
    id : Text;
    creator : Principal;
    content : Text;
    description : Text;
    votes : Nat;
    reactions : [Text];
    hashtags : [Text];
    createdAt : Time.Time;
    category : Text;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var topics = textMap.empty<Topic>();

  // Track user votes to prevent multiple votes on same topic
  type VoteKey = Text; // Format: "userId-topicId"
  var userVotes = textMap.empty<Bool>();

  public shared ({ caller }) func createTopic(content : Text, description : Text, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create topics");
    };

    let hashtags = extractHashtags(content);
    let topic : Topic = {
      id = Text.concat(Principal.toText(caller), Nat.toText(Int.abs(Time.now())));
      creator = caller;
      content;
      description;
      votes = 0;
      reactions = [];
      hashtags;
      createdAt = Time.now();
      category;
    };

    topics := textMap.put(topics, topic.id, topic);
  };

  public query ({ caller }) func getAllTopics() : async [Topic] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view topics");
    };

    // Filter topics based on creator's visibility settings
    let allTopics = Iter.toArray(textMap.vals(topics));
    let visibleTopics = List.filter<Topic>(
      List.fromArray(allTopics),
      func(topic : Topic) : Bool {
        // Own topics are always visible
        if (topic.creator == caller) {
          return true;
        };

        // Admin can see all topics
        if (AccessControl.isAdmin(accessControlState, caller)) {
          return true;
        };

        // Check creator's profile visibility settings
        switch (principalMap.get(userProfiles, topic.creator)) {
          case null { true }; // If no profile, topic is visible by default
          case (?profile) {
            // If profile is public, check if topic is in visibleTopics list
            if (profile.isPublic) {
              if (profile.visibleTopics.size() == 0) {
                true; // Empty list means all topics visible
              } else {
                List.some<Text>(
                  List.fromArray(profile.visibleTopics),
                  func(topicId : Text) : Bool { topicId == topic.id },
                );
              };
            } else {
              false; // Private profile, topics not visible
            };
          };
        };
      },
    );
    List.toArray(visibleTopics);
  };

  public shared ({ caller }) func voteTopic(topicId : Text, upvote : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can vote");
    };

    let voteKey = Text.concat(Principal.toText(caller), Text.concat("-", topicId));

    // Check if user already voted on this topic
    switch (textMap.get(userVotes, voteKey)) {
      case (?_) Debug.trap("You have already voted on this topic");
      case null {
        // Verify topic exists and is visible to caller
        switch (textMap.get(topics, topicId)) {
          case null Debug.trap("Topic not found");
          case (?topic) {
            // Check if caller can access this topic
            if (topic.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              switch (principalMap.get(userProfiles, topic.creator)) {
                case null {}; // No profile, allow vote
                case (?profile) {
                  if (not profile.isPublic) {
                    Debug.trap("Unauthorized: Cannot vote on private profile's topics");
                  };
                  if (profile.visibleTopics.size() > 0) {
                    let isVisible = List.some<Text>(
                      List.fromArray(profile.visibleTopics),
                      func(id : Text) : Bool { id == topicId },
                    );
                    if (not isVisible) {
                      Debug.trap("Unauthorized: This topic is not visible");
                    };
                  };
                };
              };
            };

            // Record the vote
            userVotes := textMap.put(userVotes, voteKey, true);

            let newVotes = if (upvote) topic.votes + 1 else Nat.sub(topic.votes, 1);
            let updatedTopic = { topic with votes = newVotes };
            topics := textMap.put(topics, topicId, updatedTopic);

            // Update creator's total votes in profile
            switch (principalMap.get(userProfiles, topic.creator)) {
              case null {};
              case (?profile) {
                let updatedProfile = {
                  profile with totalVotes = profile.totalVotes + (if upvote { 1 } else { 0 })
                };
                userProfiles := principalMap.put(userProfiles, topic.creator, updatedProfile);
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func addReaction(topicId : Text, reaction : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can react");
    };

    switch (textMap.get(topics, topicId)) {
      case null Debug.trap("Topic not found");
      case (?topic) {
        // Check if caller can access this topic
        if (topic.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          switch (principalMap.get(userProfiles, topic.creator)) {
            case null {}; // No profile, allow reaction
            case (?profile) {
              if (not profile.isPublic) {
                Debug.trap("Unauthorized: Cannot react to private profile's topics");
              };
              if (profile.visibleTopics.size() > 0) {
                let isVisible = List.some<Text>(
                  List.fromArray(profile.visibleTopics),
                  func(id : Text) : Bool { id == topicId },
                );
                if (not isVisible) {
                  Debug.trap("Unauthorized: This topic is not visible");
                };
              };
            };
          };
        };

        let reactionsList = List.fromArray<Text>(topic.reactions);
        let updatedReactions = List.toArray(List.push(reaction, reactionsList));
        let updatedTopic = { topic with reactions = updatedReactions };
        topics := textMap.put(topics, topicId, updatedTopic);
      };
    };
  };

  public query ({ caller }) func searchTopicsByHashtag(hashtag : Text) : async [Topic] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can search topics");
    };

    let allTopics = Iter.toArray(textMap.vals(topics));
    let filtered = List.filter<Topic>(
      List.fromArray(allTopics),
      func(topic : Topic) : Bool {
        // Check hashtag match
        let hasHashtag = List.some<Text>(
          List.fromArray(topic.hashtags),
          func(h : Text) : Bool { h == hashtag },
        );

        if (not hasHashtag) {
          return false;
        };

        // Check visibility
        if (topic.creator == caller or AccessControl.isAdmin(accessControlState, caller)) {
          return true;
        };

        switch (principalMap.get(userProfiles, topic.creator)) {
          case null { true };
          case (?profile) {
            if (profile.isPublic) {
              if (profile.visibleTopics.size() == 0) {
                true;
              } else {
                List.some<Text>(
                  List.fromArray(profile.visibleTopics),
                  func(topicId : Text) : Bool { topicId == topic.id },
                );
              };
            } else {
              false;
            };
          };
        };
      },
    );
    List.toArray(filtered);
  };

  public query ({ caller }) func searchTopicsByCategory(category : Text) : async [Topic] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can search topics");
    };

    let allTopics = Iter.toArray(textMap.vals(topics));
    let filtered = List.filter<Topic>(
      List.fromArray(allTopics),
      func(topic : Topic) : Bool {
        // Check category match
        if (topic.category != category) {
          return false;
        };

        // Check visibility
        if (topic.creator == caller or AccessControl.isAdmin(accessControlState, caller)) {
          return true;
        };

        switch (principalMap.get(userProfiles, topic.creator)) {
          case null { true };
          case (?profile) {
            if (profile.isPublic) {
              if (profile.visibleTopics.size() == 0) {
                true;
              } else {
                List.some<Text>(
                  List.fromArray(profile.visibleTopics),
                  func(topicId : Text) : Bool { topicId == topic.id },
                );
              };
            } else {
              false;
            };
          };
        };
      },
    );
    List.toArray(filtered);
  };

  public query ({ caller }) func getLeaderboard() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view leaderboard");
    };

    // Only show public profiles in leaderboard
    let profiles = Iter.toArray(principalMap.vals(userProfiles));
    let publicProfiles = List.filter<UserProfile>(
      List.fromArray(profiles),
      func(profile : UserProfile) : Bool {
        profile.isPublic;
      },
    );

    let profilesArray = List.toArray(publicProfiles);
    let sortedArray = sortUserProfiles(profilesArray);

    sortedArray;
  };

  // Custom sorting function for UserProfile array
  func sortUserProfiles(profiles : [UserProfile]) : [UserProfile] {
    if (profiles.size() <= 1) {
      return profiles;
    };

    let pivot = profiles[0];
    let rest = Array.tabulate<UserProfile>(profiles.size() - 1, func(i : Nat) : UserProfile { profiles[i + 1] });

    let greater = List.filter<UserProfile>(
      List.fromArray(rest),
      func(profile : UserProfile) : Bool {
        profile.totalVotes > pivot.totalVotes;
      },
    );

    let lesser = List.filter<UserProfile>(
      List.fromArray(rest),
      func(profile : UserProfile) : Bool {
        profile.totalVotes <= pivot.totalVotes;
      },
    );

    let greaterArray = sortUserProfiles(List.toArray(greater));
    let lesserArray = sortUserProfiles(List.toArray(lesser));

    // Concatenate arrays
    let result = List.push(pivot, List.fromArray(lesserArray));
    List.toArray(List.append(List.fromArray(greaterArray), result));
  };

  public type Referral = {
    referrer : Principal;
    referred : Principal;
    earnings : Nat;
    timestamp : Time.Time;
  };

  var referrals = textMap.empty<Referral>();

  public shared ({ caller }) func addReferral(referred : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add referrals");
    };

    let referral : Referral = {
      referrer = caller;
      referred;
      earnings = 0;
      timestamp = Time.now();
    };

    referrals := textMap.put(referrals, Text.concat(Principal.toText(caller), Principal.toText(referred)), referral);
  };

  public query ({ caller }) func getCallerReferrals() : async [Referral] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view referrals");
    };

    let filtered = List.filter<Referral>(
      List.fromArray(Iter.toArray(textMap.vals(referrals))),
      func(referral : Referral) : Bool {
        referral.referrer == caller;
      },
    );
    List.toArray(filtered);
  };

  public type PaymentRecord = {
    user : Principal;
    amount : Nat;
    method : Text;
    timestamp : Time.Time;
    status : Text;
  };

  var payments = textMap.empty<PaymentRecord>();

  public shared ({ caller }) func addPaymentRecord(amount : Nat, method : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add payments");
    };

    let payment : PaymentRecord = {
      user = caller;
      amount;
      method;
      timestamp = Time.now();
      status;
    };

    payments := textMap.put(payments, Text.concat(Principal.toText(caller), Nat.toText(Int.abs(Time.now()))), payment);
  };

  public query ({ caller }) func getCallerPayments() : async [PaymentRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view payments");
    };

    let filtered = List.filter<PaymentRecord>(
      List.fromArray(Iter.toArray(textMap.vals(payments))),
      func(payment : PaymentRecord) : Bool {
        payment.user == caller;
      },
    );
    List.toArray(filtered);
  };

  public type BlogPost = {
    id : Text;
    author : Principal;
    title : Text;
    content : Text;
    createdAt : Time.Time;
  };

  var blogPosts = textMap.empty<BlogPost>();

  public shared ({ caller }) func createBlogPost(title : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create blog posts");
    };

    let post : BlogPost = {
      id = Text.concat(Principal.toText(caller), Nat.toText(Int.abs(Time.now())));
      author = caller;
      title;
      content;
      createdAt = Time.now();
    };

    blogPosts := textMap.put(blogPosts, post.id, post);
  };

  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can view blog posts");
    };
    Iter.toArray(textMap.vals(blogPosts));
  };

  // Stripe integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query ({ caller }) func isStripeConfigured() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can check Stripe configuration");
    };
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  private func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func extractHashtags(content : Text) : [Text] {
    let words = Iter.toArray(Text.split(content, #char ' '));
    let hashtags = List.mapFilter<Text, Text>(
      List.fromArray(words),
      func(word : Text) : ?Text {
        if (Text.startsWith(word, #char '#')) ?word else null;
      },
    );
    List.toArray(hashtags);
  };
};

