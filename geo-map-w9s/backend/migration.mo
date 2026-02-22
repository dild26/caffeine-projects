import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldCoordinate = {
    latitude : Float;
    longitude : Float;
    altitude : Float;
  };

  type OldPin = {
    id : Text;
    coordinates : OldCoordinate;
    gridCellId : Text;
    timestamp : Time.Time;
    userId : Principal;
  };

  type OldPolygon = {
    id : Text;
    vertices : [OldCoordinate];
    triangulation : [[Nat]];
    gridCellIds : [Text];
    timestamp : Time.Time;
    userId : Principal;
  };

  type OldOperationType = {
    #pinPlacement;
    #gridSnap;
    #arcCreation;
    #radiusCreation;
    #polygonCreation;
    #osmImport;
    #osmTransformation;
    #osmSnapOperation;
    #imageAdjustment;
    #osmBulkImport;
    #osmSchemaChange;
  };

  type OldManifestLogEntry = {
    timestamp : Time.Time;
    userId : Principal;
    operationType : OldOperationType;
    inputs : Text;
    outputs : Text;
    srs : Text;
    resolution : Nat;
    signature : Text;
  };

  type OldImageAdjustment = {
    id : Text;
    position : { x : Float; y : Float; z : Float };
    scale : Float;
    rotation : Float;
    timestamp : Time.Time;
    userId : Principal;
    isPermanent : Bool;
  };

  type OldOSMRasterTile = {
    id : Text;
    url : Text;
    zoomLevel : Nat;
    x : Nat;
    y : Nat;
    timestamp : Time.Time;
    userId : Principal;
  };

  type OldOSMVectorFeature = {
    id : Text;
    featureType : Text;
    coordinates : [OldCoordinate];
    properties : Text;
    timestamp : Time.Time;
    userId : Principal;
  };

  type OldOSMLabel = {
    id : Text;
    text : Text;
    position : OldCoordinate;
    timestamp : Time.Time;
    userId : Principal;
  };

  type OldOSMGPSTrace = {
    id : Text;
    coordinates : [OldCoordinate];
    timestamp : Time.Time;
    userId : Principal;
  };

  type OldOSMAdminBoundary = {
    id : Text;
    name : Text;
    coordinates : [OldCoordinate];
    timestamp : Time.Time;
    userId : Principal;
  };

  type OldOverlayType = {
    #roads;
    #railways;
    #rivers;
    #vegetation;
    #climate;
    #floodAlerts;
    #disasterAlerts;
    #borders;
  };

  type OldOverlayLayer = {
    id : Text;
    overlayType : OldOverlayType;
    source : Text;
    isEnabled : Bool;
    timestamp : Time.Time;
    userId : Principal;
  };

  type OldPageAuditEntry = {
    page : Text;
    action : Text;
    timestamp : Time.Time;
    adminId : Principal;
    merkleRoot : Text;
  };

  type OldControlledRoute = {
    path : Text;
    delegate : Text;
    adminOnly : Bool;
  };

  type OldActor = {
    pins : Map.Map<Text, OldPin>;
    polygons : Map.Map<Text, OldPolygon>;
    manifestLog : List.List<OldManifestLogEntry>;
    imageAdjustments : Map.Map<Text, OldImageAdjustment>;
    osmRasterTiles : Map.Map<Text, OldOSMRasterTile>;
    osmVectorFeatures : Map.Map<Text, OldOSMVectorFeature>;
    osmLabels : Map.Map<Text, OldOSMLabel>;
    osmGPSTraces : Map.Map<Text, OldOSMGPSTrace>;
    osmAdminBoundaries : Map.Map<Text, OldOSMAdminBoundary>;
    overlayLayers : Map.Map<Text, OldOverlayLayer>;
    stripeSessions : Map.Map<Text, Principal>;
    pages : [Text];
    pageAuditLog : List.List<OldPageAuditEntry>;
    controlledRoutes : [OldControlledRoute];
  };

  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    old;
  };
};
