import List "mo:base/List";
import Text "mo:base/Text";

module {
  // Define the old SitemapData type
  type OldSitemapData = {
    auto : [Text];
    manualPages : [Text];
    controlledRoutes : [(Text, Text)];
  };

  // Define the old actor type
  type OldActor = {
    sitemapData : OldSitemapData;
  };

  // Define the new SitemapData type (identical structure, but with new initial values)
  type NewSitemapData = {
    auto : [Text];
    manualPages : [Text];
    controlledRoutes : [(Text, Text)];
  };

  // Define the new actor type
  type NewActor = {
    sitemapData : NewSitemapData;
  };

  public func run(old : OldActor) : NewActor {
    // Initialize new manualPages with the predefined prioritized list
    let newManualPages = [
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

    // Merge old and new manualPages, avoiding duplicates
    let oldManualList = List.fromArray(old.sitemapData.manualPages);
    let newManualList = List.fromArray(newManualPages);

    let mergedManualList = List.foldLeft<Text, List.List<Text>>(
      oldManualList,
      newManualList,
      func(acc, page) {
        // Check if page is already in the new list
        let exists = List.some<Text>(acc, func(existingPage) { existingPage == page });
        if (exists) { acc } else { List.push(page, acc) };
      },
    );

    // Convert back to array and reverse to maintain original order
    let finalManualPages = List.toArray(List.reverse(mergedManualList));

    // Create the new sitemap data
    let newSitemapData : NewSitemapData = {
      auto = old.sitemapData.auto; // Preserve existing auto data
      manualPages = finalManualPages;
      controlledRoutes = [("broadcast", "Secoinfi-App"), ("remote", "Secoinfi-App"), ("live", "Secoinfi-App")];
    };

    // Return the new actor state
    {
      sitemapData = newSitemapData;
    };
  };
};
