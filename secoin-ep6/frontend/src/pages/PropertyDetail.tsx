import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProperties, useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Layers, Users, Navigation, Settings, ArrowLeft, Image as ImageIcon, ImageOff, RefreshCw, Map, Maximize2, Minimize2 } from 'lucide-react';
import { auditLogger } from '@/lib/auditLogger';
import { generateCacheBustingUrl, validateImageUrl, invalidatePropertyImageCache } from '@/lib/imageMatching';
import { toast } from 'sonner';

export default function PropertyDetail() {
  const { propertyId } = useParams({ from: '/property/$propertyId' });
  const navigate = useNavigate();
  const { data: properties = [], isLoading, refetch: refetchProperties } = useGetProperties();
  const { data: isAdmin } = useIsCallerAdmin();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [imagesLoading, setImagesLoading] = useState(true);
  const [showFullMap, setShowFullMap] = useState(true); // Default to showing map

  const property = properties.find((p) => p.id === propertyId);

  useEffect(() => {
    const loadGalleryImages = async () => {
      if (!property) {
        setImagesLoading(false);
        return;
      }

      const correlationId = auditLogger.startOperation('property_management', 'property_detail_load_gallery', {
        propertyId: property.id,
        propertyName: property.name,
        galleryLength: property.gallery?.length || 0,
      });

      try {
        if (!property.gallery || property.gallery.length === 0) {
          auditLogger.info('property_management', 'property_detail_no_gallery_images', {
            propertyId: property.id,
            propertyName: property.name,
          }, correlationId.correlationId);
          setGalleryImages([]);
          setImagesLoading(false);
          return;
        }

        setImagesLoading(true);
        
        // CRITICAL: Generate URLs for all images in THIS property's gallery ONLY
        // Each URL is validated to ensure it belongs to this property
        const urls = property.gallery.map((blob, index) => {
          const directUrl = blob.getDirectURL();
          const cacheBustingUrl = generateCacheBustingUrl(directUrl, property.id, index);
          
          // Validate URL belongs to this property
          if (!validateImageUrl(cacheBustingUrl, property.id)) {
            auditLogger.error('property_management', 'gallery_url_validation_failed', new Error('URL validation failed'), {
              propertyId: property.id,
              imageIndex: index,
              url: cacheBustingUrl,
            }, correlationId.correlationId);
            throw new Error(`Image URL validation failed for property ${property.id}, index ${index}`);
          }
          
          return cacheBustingUrl;
        });
        
        auditLogger.info('property_management', 'property_detail_gallery_urls_generated', {
          propertyId: property.id,
          propertyName: property.name,
          imageCount: urls.length,
          allValidated: true,
        }, correlationId.correlationId);
        
        setGalleryImages(urls);
        setImageErrors(new Set());
        setImagesLoading(false);

        auditLogger.endOperation('property_management', 'property_detail_load_gallery', correlationId.correlationId, correlationId.startTime, true, {
          propertyId: property.id,
          imageCount: urls.length,
        });
      } catch (error) {
        auditLogger.error('property_management', 'property_detail_gallery_load_error', error as Error, {
          propertyId: property.id,
          propertyName: property.name,
        }, correlationId.correlationId);
        
        console.error(`Error loading gallery for property ${property.id}:`, error);
        setImagesLoading(false);

        auditLogger.endOperation('property_management', 'property_detail_load_gallery', correlationId.correlationId, correlationId.startTime, false, {
          propertyId: property.id,
          error: (error as Error).message,
        });
      }
    };

    loadGalleryImages();
  }, [property?.id, property?.gallery, property?.name]);

  const formatPrice = (price: bigint) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const formatNodePrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleManageNodes = () => {
    navigate({ to: `/property/${propertyId}/nodes` });
  };

  const handleImageError = (index: number) => {
    auditLogger.warn('property_management', 'property_detail_image_render_error', {
      propertyId: property?.id,
      propertyName: property?.name,
      imageIndex: index,
      imageUrl: galleryImages[index],
    });
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const handleRefreshGallery = async () => {
    if (!property) return;
    
    auditLogger.info('property_management', 'property_detail_manual_gallery_refresh', {
      propertyId: property.id,
    });
    
    // Invalidate cache for this property
    invalidatePropertyImageCache(property.id);
    
    // Force refetch from backend
    await refetchProperties();
    
    toast.success('Gallery refreshed with latest images');
  };

  const handleToggleMap = () => {
    setShowFullMap(!showFullMap);
    auditLogger.info('property_management', 'property_detail_map_toggled', {
      propertyId: property?.id,
      showFullMap: !showFullMap,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Property Not Found</CardTitle>
            <CardDescription>The property you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nodeCount = Number(property.nodeCount);
  const hasNodes = nodeCount > 0;
  const hasGallery = galleryImages.length > 0;
  const hasCoordinates = property.latitude !== 0 && property.longitude !== 0;

  // Generate Google Maps iframe URL for full-sized map with up-to-date iframe embed data
  const getFullMapUrl = () => {
    if (!hasCoordinates) return null;
    const encodedTitle = encodeURIComponent(property.name);
    // Use exact coordinates for this property - no defaults or substitutions
    return `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed&title=${encodedTitle}`;
  };

  const fullMapUrl = getFullMapUrl();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
        {isAdmin && (
          <Button onClick={handleManageNodes} className="gap-2">
            <Settings className="h-4 w-4" />
            Manage Nodes
          </Button>
        )}
      </div>

      {/* Map Section - Show by default when coordinates are available */}
      {hasCoordinates && showFullMap && (
        <Card className="mb-6 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Property Location Map
                </CardTitle>
                <CardDescription>
                  {property.name} - {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                </CardDescription>
              </div>
              <Button onClick={handleToggleMap} variant="outline" size="sm" className="gap-2">
                <Minimize2 className="h-4 w-4" />
                Hide Map
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-hidden rounded-lg border-2 border-primary/20">
              <iframe
                src={fullMapUrl || ''}
                width="100%"
                height="500"
                style={{ border: 0 }}
                loading="lazy"
                title={`${property.name} full location map`}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Section - Only show matched images for this property */}
      {hasGallery && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Property Gallery
                </CardTitle>
                <CardDescription>
                  {galleryImages.length} matched image{galleryImages.length !== 1 ? 's' : ''} for {property.name} (ID: {property.id})
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {hasCoordinates && !showFullMap && (
                  <Button onClick={handleToggleMap} variant="outline" size="sm" className="gap-2">
                    <Maximize2 className="h-4 w-4" />
                    Show Map
                  </Button>
                )}
                <Button onClick={handleRefreshGallery} variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {imagesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((url, index) => (
                  <div
                    key={`${property.id}-${index}`}
                    className="relative aspect-video overflow-hidden rounded-lg border bg-muted group"
                  >
                    {imageErrors.has(index) ? (
                      <div className="flex h-full flex-col items-center justify-center">
                        <ImageOff className="h-12 w-12 text-muted-foreground/50 mb-2" />
                        <p className="text-xs text-muted-foreground">Failed to load image</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">Property: {property.id}</p>
                      </div>
                    ) : (
                      <>
                        <img
                          src={url}
                          alt={`${property.name} - Image ${index + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          onError={() => handleImageError(index)}
                          loading="lazy"
                        />
                        <Badge className="absolute bottom-2 right-2 bg-background/90 text-foreground">
                          {index + 1} / {galleryImages.length}
                        </Badge>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Gallery - Show map or placeholder */}
      {!hasGallery && !imagesLoading && (
        <Card className="mb-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">No images available</p>
            <p className="text-sm text-muted-foreground">
              Upload images for this property in the Gallery page
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">Property ID: {property.id}</p>
            <div className="flex gap-2 mt-4">
              {hasCoordinates && !showFullMap && (
                <Button onClick={handleToggleMap} variant="outline" className="gap-2">
                  <Maximize2 className="h-4 w-4" />
                  Show Location Map
                </Button>
              )}
              {isAdmin && (
                <Button onClick={() => navigate({ to: '/gallery' })}>
                  Go to Gallery
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                {property.name}
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {property.location}
              </CardDescription>
              {hasCoordinates && (
                <CardDescription className="mt-1 flex items-center gap-2 text-xs">
                  <MapPin className="h-3 w-3" />
                  Coordinates: {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                </CardDescription>
              )}
            </div>
            <Badge className="text-lg px-4 py-2">v{property.schemaVersion.toString()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Property Value</p>
              <p className="text-3xl font-bold text-primary">{formatPrice(property.price)}</p>
            </div>
            {hasNodes && (
              <div className="rounded-lg bg-accent/10 p-4">
                <p className="text-sm text-muted-foreground mb-1">Per Node Pricing</p>
                <p className="text-2xl font-bold text-accent">{formatNodePrice(property.nodePricing)}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {nodeCount} nodes total
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Nodes and Floors */}
      <Tabs defaultValue="nodes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nodes" className="gap-2">
            <Navigation className="h-4 w-4" />
            Nodes ({nodeCount})
          </TabsTrigger>
          <TabsTrigger value="floors" className="gap-2">
            <Layers className="h-4 w-4" />
            Floors ({property.floors.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Property Nodes
              </CardTitle>
              <CardDescription>
                Geographic coordinates and altitude data for all property nodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasNodes ? (
                <>
                  <div className="rounded-lg border-2 border-accent/20 bg-accent/5 p-4 mb-4">
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Node Count</p>
                        <p className="text-xl font-bold">{nodeCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Per Node Pricing</p>
                        <p className="text-xl font-bold text-accent">{formatNodePrice(property.nodePricing)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="text-xl font-bold text-primary">{formatPrice(property.price)}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Formula: MRPnode = (MRPprop / 1000) / nNode = ({formatPrice(property.price)} / 1000) / {nodeCount}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Node #</TableHead>
                          <TableHead>Node ID</TableHead>
                          <TableHead>Latitude</TableHead>
                          <TableHead>Longitude</TableHead>
                          <TableHead>Altitude (m)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {property.nodes.map((node, idx) => (
                          <TableRow key={node.id}>
                            <TableCell className="font-medium">{idx + 1}</TableCell>
                            <TableCell className="font-mono text-xs">{node.id}</TableCell>
                            <TableCell className="font-mono text-sm">{node.latitude.toFixed(6)}</TableCell>
                            <TableCell className="font-mono text-sm">{node.longitude.toFixed(6)}</TableCell>
                            <TableCell className="font-mono text-sm">{node.altitude.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No nodes defined for this property</p>
                  {isAdmin && (
                    <Button onClick={handleManageNodes} className="mt-4">
                      Add Nodes
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="floors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Floor Details
              </CardTitle>
              <CardDescription>
                Area and pricing information for each floor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {property.floors.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Floor Number</TableHead>
                        <TableHead>Area (sq ft)</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {property.floors.map((floor) => (
                        <TableRow key={floor.floorNumber.toString()}>
                          <TableCell className="font-medium">Floor {floor.floorNumber.toString()}</TableCell>
                          <TableCell>{floor.area.toString()} sq ft</TableCell>
                          <TableCell className="font-semibold text-primary">{formatPrice(floor.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No floor information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fractional Ownership Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Fractional Ownership
          </CardTitle>
          <CardDescription>
            Current ownership distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {property.fractionalOwnership.length > 0 ? (
            <div className="space-y-2">
              {property.fractionalOwnership.map((ownership, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                >
                  <p className="font-medium">{ownership.owner}</p>
                  <Badge variant="secondary">{ownership.percentage.toString()}%</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No ownership information available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
