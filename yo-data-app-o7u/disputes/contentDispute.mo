module {
  public type Dispute = {
    pageId : Text;
    reason : Text;
    raisedBy : Principal;
    timestamp : Nat64;
  };

  public type Resolution = {
    approved : Bool;
    rollbackToMerkle : ?Text;
  };
}