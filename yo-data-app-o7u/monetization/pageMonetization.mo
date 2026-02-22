module {
  public type PageAccessPlan = {
    pageId : Text;
    priceE8s : Nat;
    revenueSplit : {owner : Nat; platform : Nat};
  };
}