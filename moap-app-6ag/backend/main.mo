import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";

actor {
  type AppRegistry = {
    apps : Map.Map<Text, App>;
  };

  type App = {
    id : Text;
    name : Text;
    description : Text;
    features : [Text];
    rank : Nat;
    url : Text;
    archived : Bool;
  };

  type CompareMatrix = {
    comparisons : [Comparison];
  };

  type Comparison = {
    appId : Text;
    featureId : Text;
    supported : Bool;
  };

  type FeaturesRegistry = [Feature];

  type Feature = {
    id : Text;
    name : Text;
    description : Text;
    deprecated : Bool;
  };

  type Leaderboards = {
    rankings : [Ranking];
  };

  type Ranking = {
    appId : Text;
    rank : Nat;
    score : Nat;
  };

  type Migrations = {
    migrationHistory : [MigrationEntry];
  };

  type MigrationEntry = {
    migrationId : Text;
    description : Text;
    timestamp : Time.Time;
    affectedFields : [Text];
  };

  type OverviewCards = {
    cards : [OverviewCard];
  };

  type OverviewCard = {
    id : Text;
    title : Text;
    summary : Text;
    rank : Nat;
  };

  type Sitemap = {
    sections : [SitemapSection];
  };

  type SitemapLink = {
    id : Text;
    title : Text;
    url : Text;
  };

  type SitemapSection = {
    id : Text;
    title : Text;
    links : [SitemapLink];
  };

  type Versions = {
    versionHistory : [VersionEntry];
  };

  type VersionEntry = {
    version : Nat;
    timestamp : Time.Time;
    changes : [ChangeEntry];
  };

  type ChangeEntry = {
    field : Text;
    oldValue : Text;
    newValue : Text;
    changeType : Text;
  };

  type Root = {
    version : Nat;
    appsRegistry : AppRegistry;
    featuresRegistry : FeaturesRegistry;
    compareMatrix : CompareMatrix;
    overviewCards : OverviewCards;
    sitemap : Sitemap;
    leaderboards : Leaderboards;
    versions : Versions;
    migrations : Migrations;
    schemaVersion : Nat;
    specVersion : Nat;
    generatedAt : Time.Time;
  };

  var currentVersion = 1;
  var loadedSpec : ?Root = null;

  let appsRegistry = Map.empty<Text, App>();

  let compareMatrix = List.empty<Comparison>();
  let featuresRegistry = List.empty<Feature>();
  let leaderboards = List.empty<Ranking>();
  let migrationHistory = List.empty<MigrationEntry>();
  let overviewCards = List.empty<OverviewCard>();
  let sitemapSections = List.empty<SitemapSection>();
  let versionHistory = List.empty<VersionEntry>();

  let searchCache = Map.empty<Text, (SearchResult, Time.Time)>();

  public shared ({ caller }) func init() : async () {
    switch (loadedSpec) {
      case (null) {
        let emptyCompareMatrix : CompareMatrix = {
          comparisons = [];
        };
        let emptyOverviewCards : OverviewCards = {
          cards = [];
        };
        let emptySitemap : Sitemap = {
          sections = [];
        };
        let emptyLeaderboards : Leaderboards = {
          rankings = [];
        };
        let emptyVersions : Versions = {
          versionHistory = [];
        };
        let emptyMigrations : Migrations = {
          migrationHistory = [];
        };
        loadedSpec := ?{
          version = currentVersion;
          appsRegistry = {
            apps = appsRegistry;
          };
          featuresRegistry = [];
          compareMatrix = emptyCompareMatrix;
          overviewCards = emptyOverviewCards;
          sitemap = emptySitemap;
          leaderboards = emptyLeaderboards;
          versions = emptyVersions;
          migrations = emptyMigrations;
          schemaVersion = 1;
          specVersion = currentVersion;
          generatedAt = Time.now();
        };
      };
      case (?_) { Runtime.trap("Spec is already loaded") };
    };
  };

  func getLoadedSpec() : Root {
    switch (loadedSpec) {
      case (?loadedSpec) { loadedSpec };
      case (null) { Runtime.trap("Spec is not loaded") };
    };
  };

  public query ({ caller }) func getCompareMatrix() : async CompareMatrix {
    getLoadedSpec().compareMatrix;
  };

  public query ({ caller }) func getLeaderboard() : async Leaderboards {
    getLoadedSpec().leaderboards;
  };

  public query ({ caller }) func getOverviewCards() : async OverviewCards {
    getLoadedSpec().overviewCards;
  };

  public query ({ caller }) func getSitemap() : async Sitemap {
    getLoadedSpec().sitemap;
  };

  public query ({ caller }) func getSpecVersions() : async Versions {
    getLoadedSpec().versions;
  };

  public query ({ caller }) func getMigrations() : async Migrations {
    getLoadedSpec().migrations;
  };

  func canonicalizeUrl(rawUrl : Text) : Text {
    var lowercaseUrl = "";
    for (c in rawUrl.chars()) {
      lowercaseUrl #= c.toText();
    };
    let schema = "https://".toText();
    if (not lowercaseUrl.startsWith(#text(schema))) {
      Runtime.trap("Invalid URL format");
    };

    if (not lowercaseUrl.endsWith(#text(".caffeine.xyz".toText()))) {
      Runtime.trap("URL must be on .caffeine.xyz domain");
    };
    lowercaseUrl;
  };

  func validateSitemapLink(link : SitemapLink) : SitemapLink {
    let canonicalUrl = canonicalizeUrl(link.url);
    {
      link with url = canonicalUrl;
    };
  };

  func validateSitemapSection(section : SitemapSection) : SitemapSection {
    let validatedLinks = section.links.map(validateSitemapLink);
    {
      section with
      links = validatedLinks;
    };
  };

  func validateSitemap(sitemap : Sitemap) : Sitemap {
    let validatedSections = sitemap.sections.map(validateSitemapSection);

    var linkIds : [Text] = [];
    for (section in validatedSections.values()) {
      let links = section.links;
      for (link in links.values()) {
        linkIds := linkIds.concat([link.id]);
      };
    };

    let idMap = Map.empty<Text, Nat>();
    for (linkId in linkIds.values()) {
      switch (idMap.get(linkId)) {
        case (?_) { Runtime.trap("Duplicate link id found: " # linkId) };
        case (null) { idMap.add(linkId, 1) };
      };
    };

    let sectionIds = validatedSections.map(func(section) { section.id });
    let sectionIdMap = Map.empty<Text, Nat>();
    for (sectionId in sectionIds.values()) {
      switch (sectionIdMap.get(sectionId)) {
        case (?_) { Runtime.trap("Duplicate section id found: " # sectionId) };
        case (null) { sectionIdMap.add(sectionId, 1) };
      };
    };

    {
      sections = validatedSections;
    };
  };

  public shared ({ caller }) func updateSitemap(input : [SitemapSection]) : async () {
    let newSitemap : Sitemap = {
      sections = input;
    };

    let validatedSitemap = validateSitemap(newSitemap);
    switch (loadedSpec) {
      case (?currentSpec) {
        let updatedSpec : Root = {
          currentSpec with
          sitemap = validatedSitemap;
        };
        loadedSpec := ?updatedSpec;
      };
      case (null) { Runtime.trap("Spec is not loaded") };
    };
  };

  public query ({ caller }) func getApp(appId : Text) : async App {
    switch (appsRegistry.get(appId)) {
      case (null) { Runtime.trap("App with id " # appId # " not found") };
      case (?app) { app };
    };
  };

  public query ({ caller }) func getApps(filterArchived : Bool) : async [App] {
    let appsArray = appsRegistry.toArray();
    let filteredAppsArray = appsArray.filter(
      func((_, app)) {
        if (app.archived) { filterArchived } else { true };
      }
    );
    filteredAppsArray.map(func((_, app)) { app });
  };

  type SearchResult = {
    apps : [App];
    features : [Feature];
    rank : ?Nat;
  };

  type UpdatePayload = {
    field : Text;
    appId : ?Text;
    searchType : ?Text;
    name : ?Text;
    description : ?Text;
    features : ?[Text];
    rank : ?Nat;
    url : ?Text;
    archived : ?Bool;
    id : ?Text;
    featureId : ?Text;
    supported : ?Bool;
    title : ?Text;
    summary : ?Text;
    links : ?[SitemapLink];
    rankToUpdate : ?Nat;
    score : ?Nat;
    version : ?Nat;
    oldValue : ?Text;
    newValue : ?Text;
    changeType : ?Text;
    migrationId : ?Text;
    changes : ?[ChangeEntry];
    supportedComps : ?Bool;
    cards : ?[OverviewCard];
  };

  func mergeAppData(oldApp : App, update : UpdatePayload) : App {
    {
      oldApp with
      name = switch (update.name) {
        case (?name) { name };
        case (null) { oldApp.name };
      };
      description = switch (update.description) {
        case (?desc) { desc };
        case (null) { oldApp.description };
      };
      features = switch (update.features) {
        case (?features) { features };
        case (null) { oldApp.features };
      };
      rank = switch (update.rank) {
        case (?rank) { rank };
        case (null) { oldApp.rank };
      };
      url = switch (update.url) {
        case (?url) {
          let canonicalUrl = canonicalizeUrl(url);
          canonicalUrl;
        };
        case (null) { oldApp.url };
      };
      archived = switch (update.archived) {
        case (?archived) { archived };
        case (null) { oldApp.archived };
      };
    };
  };

  public shared ({ caller }) func updateApp(input : UpdatePayload) : async App {
    let currentAppsRegistry = appsRegistry;
    let newApp : App = {
      id = switch (input.appId) {
        case (?id) { id };
        case (null) { Runtime.trap("App id is required") };
      };
      name = switch (input.name) {
        case (?name) { name };
        case (null) { Runtime.trap("App name is required") };
      };
      description = switch (input.description) {
        case (?desc) { desc };
        case (null) { "" };
      };
      features = switch (input.features) {
        case (?features) { features };
        case (null) { [] };
      };
      rank = switch (input.rank) {
        case (?rank) { rank };
        case (null) { 0 };
      };
      url = switch (input.url) {
        case (?url) { url };
        case (null) { "" };
      };
      archived = switch (input.archived) {
        case (?archived) { archived };
        case (null) { false };
      };
    };
    currentAppsRegistry.add(newApp.id, newApp);
    newApp;
  };

  public shared ({ caller }) func updateCompareMatrix(input : [Comparison]) : async () {
    compareMatrix.clear();
    compareMatrix.addAll(input.values());
  };

  public shared ({ caller }) func updateFeatures(input : [Feature]) : async () {
    featuresRegistry.clear();
    featuresRegistry.addAll(input.values());
  };

  public shared ({ caller }) func updateLeaderboard(input : [Ranking]) : async () {
    leaderboards.clear();
    leaderboards.addAll(input.values());
  };

  public shared ({ caller }) func updateOverviewCards(input : [OverviewCard]) : async () {
    overviewCards.clear();
    overviewCards.addAll(input.values());
  };

  public shared ({ caller }) func updateSpecVersions(input : [VersionEntry]) : async () {
    versionHistory.clear();
    versionHistory.addAll(input.values());
  };

  public shared ({ caller }) func updateMigrations(input : [MigrationEntry]) : async () {
    migrationHistory.clear();
    migrationHistory.addAll(input.values());
  };

  public shared ({ caller }) func applyDiffUpdates(diffs : [UpdatePayload]) : async () {
    for (update in diffs.values()) {
      let _ = await updateApp(update);
    };
  };

  // Secoinfi Apps support (will be implemented fully in the TypeScript frontend)
  public shared ({ caller }) func getSecoinfiApps() : async {} {
    {}; // Dummy placeholder until direct YAML HTTP outcall support is added
  };
};
