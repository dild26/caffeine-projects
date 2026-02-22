import List "mo:base/List";

module {
  // Old NavItem type without the 'restricted' field
  type OldNavItem = {
    title : Text;
    path : Text;
    adminOnly : Bool;
  };

  // Old actor state
  type OldActor = {
    navItems : List.List<OldNavItem>;
  };

  // New NavItem type with the 'restricted' field
  type NewNavItem = {
    title : Text;
    path : Text;
    adminOnly : Bool;
    restricted : Bool;
  };

  // New actor state
  type NewActor = {
    navItems : List.List<NewNavItem>;
  };

  // Migration function to add the 'restricted' field with a default value of false
  public func run(old : OldActor) : NewActor {
    let navItems = List.map<OldNavItem, NewNavItem>(old.navItems, func(item) { { item with restricted = false } });
    { navItems };
  };
};
