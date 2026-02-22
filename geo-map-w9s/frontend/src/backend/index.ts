// Mock backend types to unblock frontend build
export type UserProfile = any;
export type Pin = {
    id: string;
    userId: any;
    coordinates: Coordinate;
    title?: string;
    description?: string;
    timestamp: bigint;
    gridCellId: string;
};
export type Polygon = {
    id: string;
    userId: any;
    vertices: Coordinate[];
    fillColor: string;
    strokeColor: string;
    timestamp: bigint;
    triangulation: number[][];
    gridCellIds: string[];
};
export type ManifestLogEntry = any;
export type Coordinate = {
    latitude: number;
    longitude: number;
    altitude: number;
};
export type OperationType = any;
export type StripeConfiguration = any;
export type ShoppingItem = any;
export type ImageAdjustment = any;
export type SitemapEntry = any;
export type PageAuditEntry = any;
export type ControlledRoute = any;
export type ECEFCoordinate = {
    x: number;
    y: number;
    z: number;
};
export type WebMercatorCoordinate = {
    x: number;
    y: number;
};
