import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Property } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Layers, Users, Navigation, ImageOff, Map, Image as ImageIcon } from 'lucide-react';
import { auditLogger } from '@/lib/auditLogger';
import { generateCacheBustingUrl, validateImageUrl } from '@/lib/imageMatching';
import { fromBackendUnitValue } from '../lib/unitConversion';

interface PropertyCardProps {
  property: Property;
  onHover?: (coords: { lat: number; lng: number }) => void;
  onLeave?: () => void;
}

export default function PropertyCard({ property, onHover, onLeave }: PropertyCardProps) {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setImageLoading(true);
      setImageError(false);
      setImageUrl(null);

      const correlationId = auditLogger.startOperation('property_management', 'property_card_load_image', {
        propertyId: property.id,
        propertyName: property.name,
        galleryLength: property.gallery?.length || 0,
        hasCoordinates: Number(property.latitude.value) !== 0 && Number(property.longitude.value) !== 0,
      });

      try {
        if (!property.gallery || property.gallery.length === 0) {
          auditLogger.info('property_management', 'property_card_no_gallery_images', {
            propertyId: property.id,
            propertyName: property.name,
          }, correlationId.correlationId);
          setImageLoading(false);
          return;
        }

        // CRITICAL: Get the first image from THIS property's gallery ONLY
        // Never use images from other properties
        const firstImage = property.gallery[0];

        // Generate cache-busting URL with property validation
        const directUrl = firstImage.getDirectURL();
        const cacheBustingUrl = generateCacheBustingUrl(directUrl, property.id, 0);

        // Validate that the URL belongs to this property
        if (!validateImageUrl(cacheBustingUrl, property.id)) {
          throw new Error(`Image URL validation failed for property ${property.id}`);
        }

        auditLogger.info('property_management', 'property_card_image_url_generated', {
          propertyId: property.id,
          propertyName: property.name,
          url: directUrl,
          cacheBustingUrl,
          validated: true,
        }, correlationId.correlationId);

        setImageUrl(cacheBustingUrl);
        setImageLoading(false);

        auditLogger.endOperation('property_management', 'property_card_load_image', correlationId.correlationId, correlationId.startTime, true, {
          propertyId: property.id,
          hasImage: true,
        });
      } catch (error) {
        auditLogger.error('property_management', 'property_card_image_load_error', error as Error, {
          propertyId: property.id,
          propertyName: property.name,
        }, correlationId.correlationId);

        console.error(`Error loading image for property ${property.id}:`, error);
        setImageError(true);
        setImageLoading(false);

        auditLogger.endOperation('property_management', 'property_card_load_image', correlationId.correlationId, correlationId.startTime, false, {
          propertyId: property.id,
          error: (error as Error).message,
        });
      }
    };

    loadImage();
  }, [property.id, property.gallery, property.name, property.latitude.value, property.longitude.value]);

  const formatPrice = (price: any) => {
    const displayPrice = fromBackendUnitValue(price, 'INR');
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(displayPrice.value);
  };

  const formatNodePrice = (price: any) => {
    const displayPrice = fromBackendUnitValue(price, 'INR');
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(displayPrice.value);
  };

  const handleMouseEnter = () => {
    const lat = fromBackendUnitValue(property.latitude, 'degree').value;
    const lng = fromBackendUnitValue(property.longitude, 'degree').value;
    if (onHover && lat !== 0 && lng !== 0) {
      onHover({ lat, lng });
    }
  };

  const handleMouseLeave = () => {
    if (onLeave) {
      onLeave();
    }
  };

  const handleClick = () => {
    auditLogger.info('property_management', 'property_card_clicked', {
      propertyId: property.id,
      propertyName: property.name,
      hasCoordinates: Number(property.latitude.value) !== 0 && Number(property.longitude.value) !== 0,
    });
    // Fixed: Use singular /property/:id path to match route definition
    navigate({ to: `/property/${property.id}` });
  };

  const handleImageError = () => {
    auditLogger.warn('property_management', 'property_card_image_render_error', {
      propertyId: property.id,
      propertyName: property.name,
      imageUrl,
    });
    setImageError(true);
    setImageLoading(false);
  };

  const nodeCount = Number(property.nodeCount);
  const hasNodes = nodeCount > 0;
  const hasImage = imageUrl && !imageError;
  const hasGallery = property.gallery && property.gallery.length > 0;

  const displayLat = fromBackendUnitValue(property.latitude, 'degree').value;
  const displayLng = fromBackendUnitValue(property.longitude, 'degree').value;
  const hasCoordinates = displayLat !== 0 && displayLng !== 0;

  // Generate Google Maps iframe URL for minimap preview with dynamic generation per property
  const getMinimapUrl = () => {
    if (!hasCoordinates) return null;
    const encodedTitle = encodeURIComponent(property.name);
    // Use exact coordinates for this property - no defaults or substitutions
    return `https://maps.google.com/maps?q=${displayLat},${displayLng}&t=&z=13&ie=UTF8&iwloc=&output=embed&title=${encodedTitle}`;
  };

  const minimapUrl = getMinimapUrl();

  // PRIORITY SYSTEM: Minimap (if coordinates) > Image (if available) > Placeholder
  const shouldShowMinimap = hasCoordinates;
  const shouldShowImage = !shouldShowMinimap && hasImage;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-2 shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        {imageLoading && !hasCoordinates ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : shouldShowMinimap ? (
          // PRIORITY 1: Show minimap preview when coordinates are available
          <div className="relative h-full w-full">
            <iframe
              src={minimapUrl || ''}
              width="100%"
              height="192"
              style={{ border: 0 }}
              loading="lazy"
              title={`${property.name} minimap preview`}
              className="h-full w-full pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <Badge className="absolute top-2 left-2 bg-primary/90 gap-1">
              <Map className="h-3 w-3" />
              Minimap
            </Badge>
            {hasImage && (
              <Badge className="absolute top-2 right-2 bg-background/90 text-foreground gap-1">
                <ImageIcon className="h-3 w-3" />
                {property.gallery.length} image{property.gallery.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        ) : shouldShowImage ? (
          // PRIORITY 2: Show image when no coordinates but image is available
          <div className="relative h-full w-full">
            <img
              src={imageUrl}
              alt={`${property.name} - Property Image`}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
            <Badge className="absolute top-2 left-2 bg-primary/90 gap-1">
              <ImageIcon className="h-3 w-3" />
              Image View
            </Badge>
            {property.gallery.length > 1 && (
              <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
                +{property.gallery.length - 1} more
              </Badge>
            )}
          </div>
        ) : (
          // PRIORITY 3: Show placeholder when no coordinates and no images
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {imageError ? (
              <>
                <ImageOff className="h-16 w-16 text-muted-foreground/50 mb-2" />
                <p className="text-xs text-muted-foreground">Image unavailable</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Property: {property.id}</p>
              </>
            ) : !hasGallery ? (
              <>
                <Building2 className="h-16 w-16 text-primary/30 mb-2" />
                <p className="text-xs text-muted-foreground">No image or map</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Property: {property.id}</p>
              </>
            ) : (
              <>
                <Building2 className="h-16 w-16 text-primary/30 mb-2" />
                <p className="text-xs text-muted-foreground">Loading...</p>
              </>
            )}
          </div>
        )}
        <Badge className="absolute right-3 bottom-3 bg-primary/90">
          v{property.schemaVersion.toString()}
        </Badge>
        {hasNodes && (
          <Badge className="absolute left-3 bottom-3 bg-accent/90 gap-1">
            <Navigation className="h-3 w-3" />
            {nodeCount} Nodes
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span className="line-clamp-1">{property.name}</span>
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {property.location}
        </CardDescription>
        {hasCoordinates && (
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <MapPin className="h-3 w-3" />
            {displayLat.toFixed(6)}, {displayLng.toFixed(6)}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
            <p className="text-xs text-muted-foreground">Total Property Value</p>
          </div>
          {hasNodes && (
            <div className="rounded-lg bg-accent/10 p-2">
              <p className="text-sm font-semibold text-accent">{formatNodePrice(property.nodePricing)}</p>
              <p className="text-xs text-muted-foreground">Per Node Pricing</p>
            </div>
          )}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span>{property.floors.length} Floors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{property.fractionalOwnership.length} Owners</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
