import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import AccessControl "authorization/access-control";



persistent actor {

  type UserId = Principal;
  type User = {
    id : UserId;
    name : Text;
    email : Text;
  };

  type ProductId = Nat;
  type Product = {
    id : ProductId;
    name : Text;
    price : Nat;
  };

  type OrderId = Nat;
  type Order = {
    id : OrderId;
    userId : UserId;
    productIds : [ProductId];
    total : Nat;
  };

  type UserProfile = {
    name : Text;
  };

  type ContactInfo = {
    ceoName : Text;
    email : Text;
    phone : Text;
    whatsapp : Text;
    businessAddress : Text;
    paypal : Text;
    upi : Text;
    eth : Text;
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
  };

  type SiteId = Nat;
  type Site = {
    id : SiteId;
    name : Text;
    domain : Text;
    category : Text;
    description : Text;
    features : [Text];
    mlSeeds : [Text];
    mvpChecklist : [Text];
    notes : Text;
    legalStatus : Text;
    uspAnalysis : Text;
    businessTrends : Text;
    priority : Nat;
    clickCount : Nat;
    voteCount : Nat;
    hash : Text;
  };

  type SitemapEntry = {
    id : Nat;
    name : Text;
    url : Text;
    category : Text;
    parentId : ?Nat;
    children : [Nat];
    hash : Text;
    lastUpdated : Nat;
  };

  type ProsEntry = {
    id : Nat;
    project : Text;
    title : Text;
    description : Text;
    advantages : [Text];
    benefits : [Text];
    uniqueSellingPoints : [Text];
    lastUpdated : Nat;
  };

  type ReferralEntry = {
    id : Nat;
    referrer : Text;
    subscriber : Text;
    hash : Text;
    timestamp : Nat;
    remuneration : Nat;
  };

  type MenuItem = {
    id : Nat;
    name : Text;
    url : Text;
    category : Text;
    position : Nat;
    parentId : ?Nat;
    isVisible : Bool;
    isFooter : Bool;
    isTopNav : Bool;
    isBottomNav : Bool;
    hash : Text;
  };

  type LeaderboardEntry = {
    id : Nat;
    domain : Text;
    clickCount : Nat;
    voteCount : Nat;
    ranking : Nat;
    hash : Text;
  };

  type Template = {
    id : Nat;
    name : Text;
    type_ : Text;
    content : Text;
    lastUpdated : Nat;
  };

  type Config = {
    id : Nat;
    name : Text;
    value : Text;
    type_ : Text;
    lastUpdated : Nat;
  };

  type FaqEntry = {
    id : Nat;
    question : Text;
    answer : Text;
    category : Text;
    lastUpdated : Nat;
  };

  type BlogEntry = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    category : Text;
    tags : [Text];
    lastUpdated : Nat;
  };

  type LegalDocument = {
    id : Nat;
    title : Text;
    content : Text;
    type_ : Text;
    lastUpdated : Nat;
  };

  type AboutUs = {
    id : Nat;
    companyName : Text;
    description : Text;
    mission : Text;
    vision : Text;
    values : [Text];
    history : Text;
    lastUpdated : Nat;
  };

  type WhatWeDo = {
    id : Nat;
    title : Text;
    description : Text;
    services : [Text];
    lastUpdated : Nat;
  };

  type WhyUs = {
    id : Nat;
    title : Text;
    description : Text;
    advantages : [Text];
    lastUpdated : Nat;
  };

  type ProofOfTrust = {
    id : Nat;
    title : Text;
    description : Text;
    credentials : [Text];
    testimonials : [Text];
    lastUpdated : Nat;
  };

  type PaymentInfo = {
    paypal : Text;
    upi : Text;
    eth : Text;
  };

  type SocialLinks = {
    facebook : Text;
    linkedin : Text;
    telegram : Text;
    discord : Text;
    blogspot : Text;
    instagram : Text;
    twitter : Text;
    youtube : Text;
  };

  type Location = {
    address : Text;
    mapLink : Text;
  };

  type ContactSection = {
    ceoName : Text;
    email : Text;
    phone : Text;
    whatsapp : Text;
    businessAddress : Text;
    paymentInfo : PaymentInfo;
    socialLinks : SocialLinks;
    location : Location;
  };

  type MenuHierarchy = {
    id : Nat;
    name : Text;
    url : Text;
    category : Text;
    position : Nat;
    isVisible : Bool;
    isFooter : Bool;
    isTopNav : Bool;
    isBottomNav : Bool;
    hash : Text;
    children : [MenuHierarchy];
  };

  type App = {
    id : Nat;
    name : Text;
    url : Text;
    description : Text;
    status : Text;
    features : [Text];
    integration : [Text];
    lastUpdated : Nat;
    isVerified : Bool;
  };

  type Feature = {
    id : Nat;
    name : Text;
    description : Text;
    status : Text;
    aiCheck : Bool;
    manualCheck : Bool;
    value : Nat;
    lastUpdated : Nat;
  };

  type VerificationResult = {
    appId : Nat;
    url : Text;
    isVerified : Bool;
    status : Text;
    lastChecked : Nat;
  };

  type VerificationLog = {
    id : Nat;
    appId : Nat;
    url : Text;
    result : Bool;
    status : Text;
    timestamp : Nat;
    error : ?Text;
  };

  type SitemapInput = {
    entries : [SitemapEntry];
  };

  type SitemapTree = {
    entry : SitemapEntry;
    children : [SitemapTree];
  };

  type SitemapImport = {
    url : Text;
    format : Text;
    content : Text;
  };

  type SitemapValidation = {
    id : Nat;
    url : Text;
    format : Text;
    isValid : Bool;
    error : ?Text;
    timestamp : Nat;
  };

  type SitemapComparison = {
    id : Nat;
    url : Text;
    status : Text;
    isMatch : Bool;
    lastChecked : Nat;
  };

  type SitemapVerification = {
    id : Nat;
    url : Text;
    isVerified : Bool;
    status : Text;
    lastChecked : Nat;
  };

  type SitemapEntryWithChildren = {
    entry : SitemapEntry;
    children : [SitemapEntryWithChildren];
  };

  type SitemapImportResult = {
    entries : [SitemapEntry];
    errors : [Text];
  };

  type SitemapValidationResult = {
    isValid : Bool;
    errors : [Text];
  };

  type SitemapComparisonResult = {
    isMatch : Bool;
    differences : [Text];
  };

  type SitemapVerificationResult = {
    isVerified : Bool;
    errors : [Text];
  };

  type SitemapProcessingResult = {
    importResult : SitemapImportResult;
    validationResult : SitemapValidationResult;
    comparisonResult : SitemapComparisonResult;
    verificationResult : SitemapVerificationResult;
  };

  type SitemapProcessingInput = {
    importData : SitemapImport;
    validationData : SitemapValidation;
    comparisonData : SitemapComparison;
    verificationData : SitemapVerification;
  };

  type SitemapProcessing = {
    id : Nat;
    input : SitemapProcessingInput;
    result : SitemapProcessingResult;
    timestamp : Nat;
  };

  type PaymentPlan = {
    id : Nat;
    appId : Nat;
    name : Text;
    description : Text;
    price : Nat;
    currency : Text;
    paypalPlanId : Text;
    status : Text;
    lastUpdated : Nat;
  };

  type PaymentTransaction = {
    id : Nat;
    userId : UserId;
    appId : Nat;
    planId : Nat;
    amount : Nat;
    currency : Text;
    status : Text;
    timestamp : Nat;
    paypalTransactionId : Text;
  };

  type PaymentSection = {
    id : Nat;
    appId : Nat;
    name : Text;
    description : Text;
    paypalButtonCode : Text;
    status : Text;
    lastUpdated : Nat;
  };

  type FilterOption = {
    id : Nat;
    keyword : Text;
    value : Text;
    isActive : Bool;
    isArchived : Bool;
    isAiGenerated : Bool;
    createdAt : Nat;
    updatedAt : Nat;
  };

  type FilterInput = {
    keyword : Text;
    value : Text;
    isAiGenerated : Bool;
  };

  type FilterUpdateInput = {
    id : Nat;
    keyword : Text;
    value : Text;
    isActive : Bool;
    isArchived : Bool;
    isAiGenerated : Bool;
  };

  type FilterArchiveInput = {
    id : Nat;
    isArchived : Bool;
  };

  type FilterResetInput = {
    resetType : Text;
  };

  type FilterBulkInput = {
    filters : [FilterInput];
  };

  type FilterBulkUpdateInput = {
    updates : [FilterUpdateInput];
  };

  type FilterBulkArchiveInput = {
    archives : [FilterArchiveInput];
  };

  type FilterBulkResetInput = {
    resetType : Text;
  };

  type FilterResult = {
    filters : [FilterOption];
    message : Text;
  };

  type FilterOperation = {
    operation : Text;
    input : ?FilterInput;
    updateInput : ?FilterUpdateInput;
    archiveInput : ?FilterArchiveInput;
    resetInput : ?FilterResetInput;
    bulkInput : ?FilterBulkInput;
    bulkUpdateInput : ?FilterBulkUpdateInput;
    bulkArchiveInput : ?FilterBulkArchiveInput;
    bulkResetInput : ?FilterBulkResetInput;
  };

  type FilterOperationResult = {
    operation : Text;
    result : FilterResult;
  };

  type TableCell = {
    value : Text;
    formula : ?Text;
    isEditable : Bool;
    isSelected : Bool;
    comments : [Text];
    emojis : [Text];
    lastUpdated : Nat;
  };

  type TableRow = {
    id : Nat;
    cells : [TableCell];
    isSelected : Bool;
    isArchived : Bool;
    lastUpdated : Nat;
  };

  type TableColumn = {
    id : Nat;
    header : Text;
    isSelected : Bool;
    isArchived : Bool;
    lastUpdated : Nat;
  };

  type TableConfig = {
    id : Nat;
    name : Text;
    columns : [TableColumn];
    rows : [TableRow];
    isArchived : Bool;
    lastUpdated : Nat;
  };

  type TableOperation = {
    operation : Text;
    configId : Nat;
    columnId : ?Nat;
    rowId : ?Nat;
    cellIndex : ?Nat;
    value : ?Text;
    formula : ?Text;
    isSelected : ?Bool;
    isArchived : ?Bool;
    comment : ?Text;
    emoji : ?Text;
  };

  type TableOperationResult = {
    operation : Text;
    config : TableConfig;
    message : Text;
  };

  type SitemapDiscoveryResult = {
    domain : Text;
    discoveredPages : [Text];
    status : Text;
    timestamp : Nat;
  };

  type SitemapDiscoveryLog = {
    id : Nat;
    domain : Text;
    result : SitemapDiscoveryResult;
    timestamp : Nat;
  };

  type RemotePageData = {
    id : Nat;
    subdomain : Text;
    url : Text;
    contactInfo : ?ContactInfo;
    fetchedAt : Nat;
    status : Text;
    error : ?Text;
  };

  type AppManagementEntry = {
    id : Nat;
    subdomain : Text;
    url : Text;
    name : Text;
    description : Text;
    status : Text;
    progressPercentage : Nat;
    lastUpdated : Nat;
    createdBy : Principal;
  };

  type ComparisonAnalysis = {
    id : Nat;
    appId : Nat;
    features : [Text];
    functionalities : [Text];
    accuracyScore : Nat;
    comparisonData : Text;
    analyzedAt : Nat;
  };

  type ManifestLog = {
    id : Nat;
    operation : Text;
    userId : Principal;
    timestamp : Nat;
    details : Text;
    hash : Text;
  };

  type YAMLConfig = {
    id : Nat;
    content : Text;
    version : Nat;
    lastUpdated : Nat;
    updatedBy : Principal;
    isValid : Bool;
    validationErrors : [Text];
  };

  type InvestmentSection = {
    id : Nat;
    title : Text;
    content : Text;
    anchor : Text;
    order : Nat;
    lastUpdated : Nat;
  };

  type CallToAction = {
    id : Nat;
    ctaLabel : Text;
    type_ : Text;
    url : Text;
    status : Text;
    lastUpdated : Nat;
  };

  type InvestmentPage = {
    id : Nat;
    title : Text;
    subtitle : Text;
    heroImage : Text;
    sections : [InvestmentSection];
    callToActions : [CallToAction];
    lastUpdated : Nat;
  };

  type BroadcastPage = {
    id : Nat;
    name : Text;
    url : Text;
    content : Text;
    broadcastStatus : Text;
    targetApps : [Text];
    lastUpdated : Nat;
    createdBy : Principal;
  };

  type AppWithFeatures = {
    app : App;
    features : [Feature];
  };

  type ComparisonRow = {
    feature : Feature;
    appResults : [(Nat, Bool)];
  };

  type ComparisonTable = {
    apps : [App];
    features : [Feature];
    rows : [ComparisonRow];
  };

  type SitemapCategory = {
    id : Nat;
    name : Text;
    description : Text;
    parentId : ?Nat;
    children : [Nat];
    hash : Text;
    lastUpdated : Nat;
  };

  type SitemapCategoryTree = {
    category : SitemapCategory;
    children : [SitemapCategoryTree];
  };

  type SelectAllState = {
    appId : Nat;
    isSelected : Bool;
  };

  type MenuSearchResult = {
    id : Nat;
    name : Text;
    url : Text;
    category : Text;
    icon : Text;
    isInternal : Bool;
    isVisible : Bool;
    isFooter : Bool;
    isTopNav : Bool;
    isBottomNav : Bool;
    hash : Text;
  };

  type AppDiscoveryInput = {
    appIdentifiers : [Text];
  };

  type AppDiscoveryResult = {
    appIdentifier : Text;
    discoveredPages : [Text];
    status : Text;
    timestamp : Nat;
  };

  type SecoinfiApp = {
    appName : Text;
    subdomain : Text;
    status : Text;
  };

  type Page = {
    name : Text;
    url : Text;
    category : Text;
    topApp : ?Text;
    topAppUrl : ?Text;
    rank : ?Nat;
  };

  type RankingMetric = {
    id : Nat;
    seoRank : Nat;
    visitors : Nat;
    avgSessionDuration : Nat;
    totalPagesIndexed : Nat;
    popularityScore : Nat;
    loadSpeed : Nat;
    revisitRate : Nat;
    searchEngineSource : Text;
    crawledPages : Nat;
    rankDelta : Int;
    ppcIndicator : Bool;
    ttl : Nat;
    searchVolume : Nat;
    contentQualityScore : Nat;
    dataSource : Text;
    lastUpdated : Nat;
    isAiCollected : Bool;
    isAdminVerified : Bool;
  };

  type RankingDataSource = {
    id : Nat;
    name : Text;
    apiEndpoint : Text;
    authToken : Text;
    refreshInterval : Nat;
    weight : Nat;
    isActive : Bool;
    lastUpdated : Nat;
    createdBy : Principal;
  };

  type LiveMonitoringAlert = {
    id : Nat;
    metricType : Text;
    threshold : Nat;
    currentValue : Nat;
    severity : Text;
    message : Text;
    timestamp : Nat;
    isResolved : Bool;
  };

  type LiveMonitoringConfig = {
    id : Nat;
    autoRefreshInterval : Nat;
    isPaused : Bool;
    enableAlerts : Bool;
    alertThresholds : [(Text, Nat)];
    lastUpdated : Nat;
    updatedBy : Principal;
  };

  type RankingWeightingRule = {
    id : Nat;
    name : Text;
    description : Text;
    sourceWeights : [(Nat, Nat)];
    formula : Text;
    isActive : Bool;
    lastUpdated : Nat;
    createdBy : Principal;
  };

  type ManualOverride = {
    id : Nat;
    metricId : Nat;
    fieldName : Text;
    originalValue : Text;
    overrideValue : Text;
    reason : Text;
    timestamp : Nat;
    overriddenBy : Principal;
  };

  type ShareSelectedResult = {
    overview : [Page];
    compare : [Page];
    sites : [Page];
    apps : [Page];
    message : Text;
  };

  // Secoinfi Apps Registry - upgradable empty array as per user request
  var secRegistry : [Page] = [];

  transient let productMap = OrderedMap.Make<ProductId>(Nat.compare);
  transient let orderMap = OrderedMap.Make<OrderId>(Nat.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  transient let siteMap = OrderedMap.Make<SiteId>(Nat.compare);
  transient let sitemapEntryMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let prosEntryMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let referralEntryMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let menuItemMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let leaderboardEntryMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let templateMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let configMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let faqEntryMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let blogEntryMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let legalDocumentMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let aboutUsMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let whatWeDoMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let whyUsMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let proofOfTrustMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let appMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let featureMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let verificationResultMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let verificationLogMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let sitemapImportMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let sitemapValidationMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let sitemapComparisonMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let sitemapVerificationMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let sitemapProcessingMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let paymentPlanMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let paymentTransactionMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let paymentSectionMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let filterOptionMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let tableConfigMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let sitemapDiscoveryLogMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let remotePageDataMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let appManagementEntryMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let comparisonAnalysisMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let manifestLogMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let yamlConfigMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let investmentSectionMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let callToActionMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let investmentPageMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let broadcastPageMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let sitemapCategoryMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let selectAllStateMap = OrderedMap.Make<Nat>(Nat.compare);

  transient let rankingMetricMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let rankingDataSourceMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let liveMonitoringAlertMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let liveMonitoringConfigMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let rankingWeightingRuleMap = OrderedMap.Make<Nat>(Nat.compare);
  transient let manualOverrideMap = OrderedMap.Make<Nat>(Nat.compare);

  var products : OrderedMap.Map<ProductId, Product> = productMap.empty();
  var orders : OrderedMap.Map<OrderId, Order> = orderMap.empty();
  var userProfiles = principalMap.empty<UserProfile>();
  var sites : OrderedMap.Map<SiteId, Site> = siteMap.empty();
  var sitemapEntries : OrderedMap.Map<Nat, SitemapEntry> = sitemapEntryMap.empty();
  var prosEntries : OrderedMap.Map<Nat, ProsEntry> = prosEntryMap.empty();
  var referralEntries : OrderedMap.Map<Nat, ReferralEntry> = referralEntryMap.empty();
  var menuItems : OrderedMap.Map<Nat, MenuItem> = menuItemMap.empty();
  var leaderboardEntries : OrderedMap.Map<Nat, LeaderboardEntry> = leaderboardEntryMap.empty();
  var templates : OrderedMap.Map<Nat, Template> = templateMap.empty();
  var configs : OrderedMap.Map<Nat, Config> = configMap.empty();
  var faqEntries : OrderedMap.Map<Nat, FaqEntry> = faqEntryMap.empty();
  var blogEntries : OrderedMap.Map<Nat, BlogEntry> = blogEntryMap.empty();
  var legalDocuments : OrderedMap.Map<Nat, LegalDocument> = legalDocumentMap.empty();
  var aboutUsEntries : OrderedMap.Map<Nat, AboutUs> = aboutUsMap.empty();
  var whatWeDoEntries : OrderedMap.Map<Nat, WhatWeDo> = whatWeDoMap.empty();
  var whyUsEntries : OrderedMap.Map<Nat, WhyUs> = whyUsMap.empty();
  var proofOfTrustEntries : OrderedMap.Map<Nat, ProofOfTrust> = proofOfTrustMap.empty();
  var apps : OrderedMap.Map<Nat, App> = appMap.empty();
  var features : OrderedMap.Map<Nat, Feature> = featureMap.empty();
  var verificationResults : OrderedMap.Map<Nat, VerificationResult> = verificationResultMap.empty();
  var verificationLogs : OrderedMap.Map<Nat, VerificationLog> = verificationLogMap.empty();
  var sitemapImports : OrderedMap.Map<Nat, SitemapImport> = sitemapImportMap.empty();
  var sitemapValidations : OrderedMap.Map<Nat, SitemapValidation> = sitemapValidationMap.empty();
  var sitemapComparisons : OrderedMap.Map<Nat, SitemapComparison> = sitemapComparisonMap.empty();
  var sitemapVerifications : OrderedMap.Map<Nat, SitemapVerification> = sitemapVerificationMap.empty();
  var sitemapProcessings : OrderedMap.Map<Nat, SitemapProcessing> = sitemapProcessingMap.empty();
  var paymentPlans : OrderedMap.Map<Nat, PaymentPlan> = paymentPlanMap.empty();
  var paymentTransactions : OrderedMap.Map<Nat, PaymentTransaction> = paymentTransactionMap.empty();
  var paymentSections : OrderedMap.Map<Nat, PaymentSection> = paymentSectionMap.empty();
  var filterOptions : OrderedMap.Map<Nat, FilterOption> = filterOptionMap.empty();
  var tableConfigs : OrderedMap.Map<Nat, TableConfig> = tableConfigMap.empty();
  var sitemapDiscoveryLogs : OrderedMap.Map<Nat, SitemapDiscoveryLog> = sitemapDiscoveryLogMap.empty();
  var remotePageData : OrderedMap.Map<Nat, RemotePageData> = remotePageDataMap.empty();
  var appManagementEntries : OrderedMap.Map<Nat, AppManagementEntry> = appManagementEntryMap.empty();
  var comparisonAnalyses : OrderedMap.Map<Nat, ComparisonAnalysis> = comparisonAnalysisMap.empty();
  var manifestLogs : OrderedMap.Map<Nat, ManifestLog> = manifestLogMap.empty();
  var yamlConfigs : OrderedMap.Map<Nat, YAMLConfig> = yamlConfigMap.empty();
  var investmentSections : OrderedMap.Map<Nat, InvestmentSection> = investmentSectionMap.empty();
  var callToActions : OrderedMap.Map<Nat, CallToAction> = callToActionMap.empty();
  var investmentPages : OrderedMap.Map<Nat, InvestmentPage> = investmentPageMap.empty();
  var broadcastPages : OrderedMap.Map<Nat, BroadcastPage> = broadcastPageMap.empty();
  var sitemapCategories : OrderedMap.Map<Nat, SitemapCategory> = sitemapCategoryMap.empty();
  var selectAllStates : OrderedMap.Map<Nat, SelectAllState> = selectAllStateMap.empty();

  var rankingMetrics : OrderedMap.Map<Nat, RankingMetric> = rankingMetricMap.empty();
  var rankingDataSources : OrderedMap.Map<Nat, RankingDataSource> = rankingDataSourceMap.empty();
  var liveMonitoringAlerts : OrderedMap.Map<Nat, LiveMonitoringAlert> = liveMonitoringAlertMap.empty();
  var liveMonitoringConfigs : OrderedMap.Map<Nat, LiveMonitoringConfig> = liveMonitoringConfigMap.empty();
  var rankingWeightingRules : OrderedMap.Map<Nat, RankingWeightingRule> = rankingWeightingRuleMap.empty();
  var manualOverrides : OrderedMap.Map<Nat, ManualOverride> = manualOverrideMap.empty();

  var contactInfo : ?ContactInfo = ?{
    ceoName = "Dileep Kumar";
    email = "dileep@secoinfi.com";
    phone = "+91 974 000 0000";
    whatsapp = "+91 974 000 0000";
    businessAddress = "Sudha Enterprises, 560097, India";
    paypal = "newgoldenjewel@gmail.com";
    upi = "dileep@upi";
    eth = "0x1234567890abcdef";
    socialMedia = {
      facebook = "https://facebook.com/dild26";
      linkedin = "https://www.linkedin.com/in/dild26";
      telegram = "https://t.me/dilee";
      discord = "https://discord.com/users/dild26";
      blogspot = "https://dildiva.blogspot.com";
      instagram = "https://instagram.com/newgoldenjewel";
      twitter = "https://twitter.com/dil_sec";
      youtube = "https://m.youtube.com/@dileepkumard4484/videos";
    };
  };
  var menuHierarchy : [MenuHierarchy] = [];
  var lastUpdated : Nat = 0;
  var nextId : Nat = 1;

  let accessControlState = AccessControl.initState();

  // -----------------------------------------------------------------------------
  // REQUIRED ACCESS CONTROL FUNCTIONS
  // -----------------------------------------------------------------------------

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

  // -----------------------------------------------------------------------------
  // HELPER FUNCTIONS (No authorization needed - internal use only)
  // -----------------------------------------------------------------------------

  func normalizeUrl(url : Text) : Text {
    let trimmedUrl = Text.trim(url, #char(' '));

    let normalized = if (
      Text.startsWith(trimmedUrl, #text("http://http://")) or Text.startsWith(trimmedUrl, #text("https://http://"))
    ) {
      Text.replace(trimmedUrl, #text("http://"), "");
    } else if (
      Text.startsWith(trimmedUrl, #text("https://https://")) or Text.startsWith(trimmedUrl, #text("http://https://"))
    ) {
      Text.replace(trimmedUrl, #text("https://"), "");
    } else if (Text.startsWith(trimmedUrl, #text("evolved-ai app."))) {
      Text.replace(trimmedUrl, #text("evolved-ai app."), "");
    } else {
      trimmedUrl;
    };

    let singleProtocol = if (Text.startsWith(normalized, #text("http"))) {
      if (Text.startsWith(normalized, #text("https"))) {
        Text.trimStart(normalized, #text("https://"));
      } else {
        Text.trimStart(normalized, #text("http://"));
      };
    } else {
      normalized;
    };

    let httpsUrl = if (
      Text.startsWith(singleProtocol, #text("http")) or Text.startsWith(singleProtocol, #text("www"))
    ) {
      singleProtocol;
    } else {
      "https://" # singleProtocol;
    };

    if (Text.endsWith(httpsUrl, #text("/"))) {
      httpsUrl;
    } else {
      httpsUrl # "/";
    };
  };

  func validateUrl(url : Text) : Bool {
    Text.startsWith(url, #text("https://")) and Text.contains(url, #text(".caffeine.xyz"));
  };

  func validateAndResolveUrl(url : Text, appName : Text) : Text {
    let trimmedUrl = Text.trim(url, #char(' '));
    let normalizedUrl = normalizeUrl(trimmedUrl);

    if (validateUrl(normalizedUrl)) {
      normalizedUrl;
    } else {
      let canonicalUrl = switch (resolveTopAppUrl(appName)) {
        case (?resolvedUrl) { resolvedUrl };
        case (null) { "https://" # normalizeSubdomain(appName) # ".caffeine.xyz/" };
      };
      canonicalUrl;
    };
  };

  func normalizeSubdomain(subdomain : Text) : Text {
    let trimmed = Text.trim(subdomain, #char(' '));
    let parts = Iter.toArray(Text.split(trimmed, #char('.')));
    if (parts.size() > 0) { parts[0] } else { trimmed };
  };

  func resolveTopAppUrl(topAppName : Text) : ?Text {
    let normalizedTopApp = Text.toLowercase(topAppName);
    let baseDomain = "caffeine.xyz";

    switch (Array.find<Page>(
      secRegistry,
      func(page) {
        let normalizedName = Text.toLowercase(page.name);
        Text.contains(normalizedName, #text(normalizedTopApp));
      },
    )) {
      case (?matchingPage) { ?("https://" # normalizeSubdomain(matchingPage.name) # "." # baseDomain # "/") };
      case (null) { null };
    };
  };

  func deduplicatePages(pagesArray : [Page]) : [Page] {
    var seen : [Text] = [];
    var result : [Page] = [];

    for (page in pagesArray.vals()) {
      if (Array.find(seen, func(url) { url == page.url }) == null) {
        seen := Array.append(seen, [page.url]);
        result := Array.append(result, [page]);
      };
    };

    result;
  };

  func sortPages(pagesArray : [Page]) : [Page] {
    Array.sort<Page>(pagesArray, func(a, b) { Text.compare(a.name, b.name) });
  };

  func isValidUrlFormat(url : Text) : Bool {
    let trimmed = Text.trim(url, #char(' '));
    if (Text.size(trimmed) == 0) {
      return false;
    };
    Text.startsWith(trimmed, #text("http://")) or Text.startsWith(trimmed, #text("https://"));
  };

  func isNonEmpty(text : Text) : Bool {
    Text.size(Text.trim(text, #char(' '))) > 0;
  };

  // ---------------------------------------------------------------------------
  // OVERVIEW & APP REGISTRY FUNCTIONS (User-level read access)
  // ---------------------------------------------------------------------------

  public query ({ caller }) func getOverviewPages() : async [Page] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view overview pages");
    };

    let originalPages = [
      {
        name = "Overview Page 1";
        url = "https://example.com/overview1";
        category = "category1";
        topApp = null;
        topAppUrl = null;
        rank = null;
      },
      {
        name = "Overview Page 2";
        url = "https://example.com/overview2";
        category = "category2";
        topApp = null;
        topAppUrl = null;
        rank = null;
      },
    ];

    let appendedPages = Array.append(originalPages, secRegistry);
    deduplicatePages(appendedPages);
  };

  public query ({ caller }) func getComparisonPages() : async [Page] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view comparison pages");
    };

    let originalPages = [
      {
        name = "Comparison Page 1";
        url = "https://example.com/comparison1";
        category = "category1";
        topApp = null;
        topAppUrl = null;
        rank = null;
      },
      {
        name = "Comparison Page 2";
        url = "https://example.com/comparison2";
        category = "category2";
        topApp = null;
        topAppUrl = null;
        rank = null;
      },
    ];

    let appendedPages = Array.append(originalPages, secRegistry);
    deduplicatePages(appendedPages);
  };

  public query ({ caller }) func getAppManagementPages() : async [Page] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view app management pages");
    };

    let originalPages = [
      {
        name = "App Management Page 1";
        url = "https://example.com/app1";
        category = "category1";
        topApp = null;
        topAppUrl = null;
        rank = null;
      },
      {
        name = "App Management Page 2";
        url = "https://example.com/app2";
        category = "category2";
        topApp = null;
        topAppUrl = null;
        rank = null;
      },
    ];

    let appendedPages = Array.append(originalPages, secRegistry);
    deduplicatePages(appendedPages);
  };

  public query ({ caller }) func getAllSecoinfiApps() : async [Page] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view Secoinfi apps registry");
    };

    var normalizedRegistry : [Page] = [];
    for (registryPage in secRegistry.vals()) {
      normalizedRegistry := Array.append(
        normalizedRegistry,
        [{
          registryPage with url = normalizeUrl(registryPage.url);
        }],
      );
    };

    let deduplicatedRegistry = deduplicatePages(normalizedRegistry);

    let sortedPages = Array.sort<Page>(deduplicatedRegistry, func(a, b) {
      switch (a.rank, b.rank) {
        case (?rankA, ?rankB) {
          if (rankA < rankB) { #less } else if (rankA > rankB) { #greater } else {
            Text.compare(a.name, b.name);
          };
        };
        case (?_rankA, null) { #less };
        case (null, ?_rankB) { #greater };
        case (null, null) { Text.compare(a.name, b.name) };
      };
    });

    var remainingPages : [Page] = [];
    for (registryPage in secRegistry.vals()) {
      let isIncluded = Array.find(sortedPages, func(page : Page) : Bool { page.url == registryPage.url });
      if (isIncluded == null) {
        remainingPages := Array.append(remainingPages, [registryPage]);
      };
    };

    let mergedPages = Array.append(sortedPages, remainingPages);
    let finalDeduplicated = deduplicatePages(mergedPages);

    finalDeduplicated;
  };

  public query ({ caller }) func getSafeRegistrySize() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view registry size");
    };

    let registryCount = secRegistry.size();
    if (registryCount > 0) { registryCount } else {
      let canonicalPages = Iter.toArray(OrderedMap.Make<Nat>(Nat.compare).vals(OrderedMap.Make<Nat>(Nat.compare).empty()));
      canonicalPages.size();
    };
  };

  public query ({ caller }) func getSafeRegistryState() : async {
    registry : [Page];
    size : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view registry state");
    };

    let registry = if (secRegistry.size() > 0) {
      sortPages(Array.map<Page, Page>(secRegistry, func(page) { page }));
    } else {
      let canonicalPages = Iter.toArray(OrderedMap.Make<Nat>(Nat.compare).vals(OrderedMap.Make<Nat>(Nat.compare).empty()));
      sortPages(deduplicatePages(canonicalPages));
    };

    {
      registry;
      size = registry.size();
    };
  };

  public query ({ caller }) func isRegistryInitialized() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can check registry initialization");
    };
    secRegistry.size() > 0;
  };

  // ---------------------------------------------------------------------------
  // SECOINFI APPS MANAGEMENT TABLE OPERATIONS (Admin-only)
  // ---------------------------------------------------------------------------

  type SecoinfiAppEntry = {
    id : Nat;
    appName : Text;
    subdomain : Text;
    canonicalUrl : Text;
    categoryTags : Text;
    status : Text;
    createdAt : Nat;
    updatedAt : Nat;
    createdBy : Principal;
  };

  transient let secoinfiAppMap = OrderedMap.Make<Nat>(Nat.compare);
  var secoinfiApps : OrderedMap.Map<Nat, SecoinfiAppEntry> = secoinfiAppMap.empty();

  public shared ({ caller }) func bulkDeleteSecoinfiAppEntries(ids : [Nat]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can bulk delete entries");
    };

    for (id in ids.vals()) {
      secoinfiApps := secoinfiAppMap.delete(secoinfiApps, id);
    };
  };

  public shared ({ caller }) func updateRegistryAndSyncTabs(newEntries : [SecoinfiAppEntry]) : async {
    overview : [Page];
    compare : [Page];
    sites : [Page];
    apps : [Page];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update registry and sync tabs");
    };

    var tempApps = secoinfiAppMap.empty<SecoinfiAppEntry>();
    var id = 1;
    for (entry in newEntries.vals()) {
      tempApps := secoinfiAppMap.put(tempApps, id, entry);
      id += 1;
    };
    secoinfiApps := tempApps;

    func sortAndRank(pages : [Page]) : [Page] {
      Array.sort<Page>(pages, func(a, b) {
        switch (a.rank, b.rank) {
          case (?rankA, ?rankB) {
            if (rankA < rankB) { #less } else if (rankA > rankB) { #greater } else {
              Text.compare(a.name, b.name);
            };
          };
          case (?_rankA, null) { #less };
          case (null, ?_rankB) { #greater };
          case (null, null) { Text.compare(a.name, b.name) };
        };
      });
    };

    func entryToPage(entry : SecoinfiAppEntry) : Page {
      {
        name = entry.appName;
        url = entry.canonicalUrl;
        category = entry.categoryTags;
        topApp = ?entry.appName;
        topAppUrl = ?entry.canonicalUrl;
        rank = ?entry.id;
      };
    };

    var pagesArray : [Page] = [];
    for (entry in newEntries.vals()) {
      pagesArray := Array.append(pagesArray, [entryToPage(entry)]);
    };

    var overviewPages : [Page] = [];
    var comparePages : [Page] = [];
    var sitesPages : [Page] = [];
    var appsPages : [Page] = [];

    for (page in pagesArray.vals()) {
      let lowerName = Text.toLowercase(page.name);
      switch (page.category) {
        case ("Overview" : Text) { overviewPages := Array.append(overviewPages, [page]) };
        case ("Compare" : Text) { comparePages := Array.append(comparePages, [page]) };
        case ("Sites" : Text) { sitesPages := Array.append(sitesPages, [page]) };
        case ("Apps" : Text) { appsPages := Array.append(appsPages, [page]) };
        case (_ : Text) {
          if (
            Text.contains(lowerName, #text("overview")) or
            Text.contains(lowerName, #text("dashboard"))
          ) {
            overviewPages := Array.append(overviewPages, [page]);
          } else if (
            Text.contains(lowerName, #text("compare")) or
            Text.contains(lowerName, #text("analysis")) or
            Text.contains(lowerName, #text("evaluation"))
          ) {
            comparePages := Array.append(comparePages, [page]);
          } else if (
            Text.contains(lowerName, #text("site")) or
            Text.contains(lowerName, #text("domain")) or
            Text.contains(lowerName, #text("location"))
          ) {
            sitesPages := Array.append(sitesPages, [page]);
          } else if (
            Text.contains(lowerName, #text("application")) or
            Text.contains(lowerName, #text("app")) or
            Text.contains(lowerName, #text("utility"))
          ) {
            appsPages := Array.append(appsPages, [page]);
          } else {
            overviewPages := Array.append(overviewPages, [page]);
            comparePages := Array.append(comparePages, [page]);
            sitesPages := Array.append(sitesPages, [page]);
            appsPages := Array.append(appsPages, [page]);
          };
        };
      };
    };

    overviewPages := sortAndRank(overviewPages);
    comparePages := sortAndRank(comparePages);
    sitesPages := sortAndRank(sitesPages);
    appsPages := sortAndRank(appsPages);

    overviewPages := Array.map<Page, Page>(overviewPages, func(page) { page });
    comparePages := Array.map<Page, Page>(comparePages, func(page) { page });
    sitesPages := Array.map<Page, Page>(sitesPages, func(page) { page });
    appsPages := Array.map<Page, Page>(appsPages, func(page) { page });

    {
      overview = overviewPages;
      compare = comparePages;
      sites = sitesPages;
      apps = appsPages;
    };
  };

  public query ({ caller }) func getAllSecoinfiAppsEntries() : async [SecoinfiAppEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view Secoinfi apps");
    };
    Iter.toArray(secoinfiAppMap.vals(secoinfiApps));
  };

  // ---------------------------------------------------------------------------
  // INLINE EDITING OPERATIONS FOR PAGES REGISTRY TABLE (Admin-only)
  // ---------------------------------------------------------------------------

  public query ({ caller }) func getSecoinfiAppEntry(id : Nat) : async ?SecoinfiAppEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view individual app entries");
    };
    secoinfiAppMap.get(secoinfiApps, id);
  };

  public shared ({ caller }) func updateSecoinfiAppEntry(
    id : Nat,
    appName : Text,
    canonicalUrl : Text,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update app entries");
    };

    if (not isNonEmpty(appName)) {
      Debug.trap("Validation error: App name cannot be empty");
    };

    if (not isValidUrlFormat(canonicalUrl)) {
      Debug.trap("Validation error: Invalid URL format");
    };

    switch (secoinfiAppMap.get(secoinfiApps, id)) {
      case (?existingEntry) {
        let updatedEntry : SecoinfiAppEntry = {
          existingEntry with
          appName;
          canonicalUrl = normalizeUrl(canonicalUrl);
          updatedAt = lastUpdated;
        };
        secoinfiApps := secoinfiAppMap.put(secoinfiApps, id, updatedEntry);
        true;
      };
      case (null) {
        false;
      };
    };
  };

  public shared ({ caller }) func addSecoinfiAppEntry(
    appName : Text,
    subdomain : Text,
    canonicalUrl : Text,
    categoryTags : Text,
    status : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add app entries");
    };

    if (not isNonEmpty(appName)) {
      Debug.trap("Validation error: App name cannot be empty");
    };

    if (not isValidUrlFormat(canonicalUrl)) {
      Debug.trap("Validation error: Invalid URL format");
    };

    let newId = nextId;
    nextId += 1;

    let newEntry : SecoinfiAppEntry = {
      id = newId;
      appName;
      subdomain;
      canonicalUrl = normalizeUrl(canonicalUrl);
      categoryTags;
      status;
      createdAt = lastUpdated;
      updatedAt = lastUpdated;
      createdBy = caller;
    };

    secoinfiApps := secoinfiAppMap.put(secoinfiApps, newId, newEntry);
    newId;
  };

  public shared ({ caller }) func deleteSecoinfiAppEntry(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete app entries");
    };

    switch (secoinfiAppMap.get(secoinfiApps, id)) {
      case (?_entry) {
        secoinfiApps := secoinfiAppMap.delete(secoinfiApps, id);
        true;
      };
      case (null) {
        false;
      };
    };
  };

  public shared ({ caller }) func clearAndRepopulateSecoinfiApps(newEntries : [SecoinfiAppEntry]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can clear and repopulate app entries");
    };

    secoinfiApps := secoinfiAppMap.empty();

    for (entry in newEntries.vals()) {
      secoinfiApps := secoinfiAppMap.put(secoinfiApps, entry.id, entry);
    };
  };

  public shared ({ caller }) func setRegistry(newRegistry : [Page]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can set registry");
    };
    secRegistry := newRegistry;
  };

  // ---------------------------------------------------------------------------
  // NEW: SHARE SELECTED PAGES FUNCTIONALITY (Admin-only)
  // ---------------------------------------------------------------------------

  public shared ({ caller }) func shareSelectedPages(selectedIds : [Nat]) : async ShareSelectedResult {
    // Admin-only authorization check
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can share selected pages across tabs");
    };

    // Validate input
    if (selectedIds.size() == 0) {
      Debug.trap("Validation error: No pages selected for sharing");
    };

    // Collect selected pages from secoinfiApps registry
    var selectedPages : [Page] = [];
    for (id in selectedIds.vals()) {
      switch (secoinfiAppMap.get(secoinfiApps, id)) {
        case (?entry) {
          let page : Page = {
            name = entry.appName;
            url = normalizeUrl(entry.canonicalUrl);
            category = entry.categoryTags;
            topApp = ?entry.appName;
            topAppUrl = ?normalizeUrl(entry.canonicalUrl);
            rank = ?entry.id;
          };
          selectedPages := Array.append(selectedPages, [page]);
        };
        case (null) {
          // Skip invalid IDs
        };
      };
    };

    // Validate that we found at least some pages
    if (selectedPages.size() == 0) {
      Debug.trap("Validation error: No valid pages found for selected IDs");
    };

    // Deduplicate and sort selected pages
    let deduplicatedPages = deduplicatePages(selectedPages);
    let sortedPages = sortPages(deduplicatedPages);

    // Categorize pages for each tab based on category and name
    var overviewPages : [Page] = [];
    var comparePages : [Page] = [];
    var sitesPages : [Page] = [];
    var appsPages : [Page] = [];

    for (page in sortedPages.vals()) {
      let lowerName = Text.toLowercase(page.name);
      let lowerCategory = Text.toLowercase(page.category);

      // Categorize based on category field
      if (Text.contains(lowerCategory, #text("overview")) or Text.contains(lowerName, #text("overview"))) {
        overviewPages := Array.append(overviewPages, [page]);
      };

      if (Text.contains(lowerCategory, #text("compare")) or Text.contains(lowerName, #text("compare"))) {
        comparePages := Array.append(comparePages, [page]);
      };

      if (Text.contains(lowerCategory, #text("site")) or Text.contains(lowerName, #text("site"))) {
        sitesPages := Array.append(sitesPages, [page]);
      };

      if (Text.contains(lowerCategory, #text("app")) or Text.contains(lowerName, #text("app"))) {
        appsPages := Array.append(appsPages, [page]);
      };

      // If no specific category match, add to all tabs
      if (
        not Text.contains(lowerCategory, #text("overview")) and
        not Text.contains(lowerCategory, #text("compare")) and
        not Text.contains(lowerCategory, #text("site")) and
        not Text.contains(lowerCategory, #text("app"))
      ) {
        overviewPages := Array.append(overviewPages, [page]);
        comparePages := Array.append(comparePages, [page]);
        sitesPages := Array.append(sitesPages, [page]);
        appsPages := Array.append(appsPages, [page]);
      };
    };

    // Return categorized pages for frontend to update tabs
    {
      overview = overviewPages;
      compare = comparePages;
      sites = sitesPages;
      apps = appsPages;
      message = "Selected data has been shared across Overview, Compare, Sites, and Apps tabs.";
    };
  };

};

