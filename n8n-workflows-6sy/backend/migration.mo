module {
  type SitemapEntry = {
    slug : Text;
    routeType : {
      #manual;
      #appControlled;
      #systemPreset;
    };
    timestamp : Int;
    createdBy : ?Principal;
    status : {
      #active;
      #deleted;
      #pendingApproval;
    };
    hash : Text;
    version : Nat;
    approvedBy : ?Principal;
  };

  type SitemapSnapshot = {
    id : Text;
    entries : [SitemapEntry];
    timestamp : Int;
    createdBy : Principal;
    description : Text;
  };

  type AppControlledRouteRequest = {
    appId : Text;
    route : Text;
    requestedBy : Principal;
    timestamp : Int;
    status : {
      #pending;
      #approved;
      #rejected;
    };
  };

  type OldActor = {
    sitemapEntries : [SitemapEntry];
    sitemapSnapshots : [SitemapSnapshot];
    whitelistedApps : [Text];
    appRouteRequests : [AppControlledRouteRequest];
    pages : [Text];
  };

  type NewActor = {
    sitemapEntries : [SitemapEntry];
    sitemapSnapshots : [SitemapSnapshot];
    whitelistedApps : [Text];
    appRouteRequests : [AppControlledRouteRequest];
    pages : [Text];
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      pages = [
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
    };
  };
};
