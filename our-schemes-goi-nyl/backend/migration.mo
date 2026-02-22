module {
  public func run(canisterState : { schemes : Nat }) : { schemes : Nat } {
    { schemes = canisterState.schemes };
  };
};
