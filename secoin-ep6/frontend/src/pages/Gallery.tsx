import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useGetProperties, useAddImageToPropertyGallery, useIsCallerAdmin } from '@/hooks/useQueries';
import { ExternalBlob } from '@/backend';
import { Upload, Image as ImageIcon, CheckCircle2, AlertTriangle, Info, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { auditLogger } from '@/lib/auditLogger';
import { normalizeFilename, normalizePropertyIdentifier, matchesPropertyId, invalidatePropertyImageCache } from '@/lib/imageMatching';

export default function Gallery() {
  const { data: properties = [], isLoading: propertiesLoading, refetch: refetchProperties } = useGetProperties();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const addImageMutation = useAddImageToPropertyGallery();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'].includes(ext || '');
    });

    if (validFiles.length !== files.length) {
      toast.error('Some files were skipped. Only image formats (PNG, JPG, JPEG, WEBP, GIF, BMP) are supported.');
      auditLogger.warn('property_management', 'invalid_file_format', {
        totalFiles: files.length,
        validFiles: validFiles.length,
      });
    }

    setSelectedFiles(validFiles);
    auditLogger.info('property_management', 'files_selected', {
      fileCount: validFiles.length,
      filenames: validFiles.map(f => f.name),
    });
  };

  /**
   * Match a filename to a property using robust, case-insensitive matching
   * Matches against both property ID and property name
   */
  const matchPropertyByFilename = (filename: string) => {
    const normalizedFilename = normalizeFilename(filename);
    
    auditLogger.debug('property_management', 'matching_filename', {
      filename,
      normalizedFilename,
      availableProperties: properties.map(p => ({ id: p.id, name: p.name })),
    });
    
    // Try to match by property ID first (most reliable)
    let matched = properties.find((prop) => matchesPropertyId(filename, prop.id));
    
    // If no match by ID, try matching by property name
    if (!matched) {
      const normalizedPropNames = properties.map(p => ({
        property: p,
        normalized: normalizePropertyIdentifier(p.name),
      }));
      
      const nameMatch = normalizedPropNames.find(({ normalized }) => {
        const exactMatch = normalized === normalizedFilename;
        const substringMatch = 
          (normalizedFilename.length >= 4 && normalized.length >= 4) &&
          (normalizedFilename.includes(normalized) || normalized.includes(normalizedFilename));
        return exactMatch || substringMatch;
      });
      
      matched = nameMatch?.property;
    }
    
    if (matched) {
      auditLogger.info('property_management', 'filename_matched', {
        filename,
        normalizedFilename,
        propertyId: matched.id,
        propertyName: matched.name,
      });
    } else {
      auditLogger.warn('property_management', 'filename_no_match', {
        filename,
        normalizedFilename,
        availablePropertyIds: properties.map(p => p.id),
        availablePropertyNames: properties.map(p => p.name),
      });
    }
    
    return matched;
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    if (!isAdmin) {
      toast.error('Only admins can upload images');
      return;
    }

    setIsUploading(true);
    const correlationId = auditLogger.startOperation('property_management', 'bulk_gallery_upload', {
      fileCount: selectedFiles.length,
      filenames: selectedFiles.map(f => f.name),
    });

    let successCount = 0;
    let failureCount = 0;
    const matchedProperties: string[] = [];
    const unmatchedFiles: string[] = [];
    const propertiesToInvalidate = new Set<string>();

    try {
      for (const file of selectedFiles) {
        const matchedProp = matchPropertyByFilename(file.name);
        
        if (!matchedProp) {
          unmatchedFiles.push(file.name);
          failureCount++;
          auditLogger.warn('property_management', 'image_upload_no_match', {
            filename: file.name,
            normalizedFilename: normalizeFilename(file.name),
          }, correlationId.correlationId);
          continue;
        }

        try {
          const bytes = new Uint8Array(await file.arrayBuffer());
          
          // Create blob with upload progress tracking
          const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
            setUploadProgress((prev) => ({ ...prev, [file.name]: percentage }));
            auditLogger.debug('property_management', 'upload_progress', {
              filename: file.name,
              propertyId: matchedProp.id,
              percentage,
            }, correlationId.correlationId);
          });
          
          // Upload to the matched property's gallery ONLY
          await addImageMutation.mutateAsync({
            propertyId: matchedProp.id,
            image: blob,
          });
          
          matchedProperties.push(`${file.name} → ${matchedProp.name}`);
          propertiesToInvalidate.add(matchedProp.id);
          successCount++;
          
          auditLogger.info('property_management', 'image_uploaded_successfully', {
            filename: file.name,
            propertyId: matchedProp.id,
            propertyName: matchedProp.name,
            timestamp: Date.now(),
          }, correlationId.correlationId);
          
        } catch (error) {
          failureCount++;
          auditLogger.error('property_management', 'image_upload_failed', error as Error, {
            filename: file.name,
            propertyId: matchedProp.id,
            propertyName: matchedProp.name,
          }, correlationId.correlationId);
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }

      // Invalidate cache for all affected properties
      propertiesToInvalidate.forEach(propId => {
        invalidatePropertyImageCache(propId);
        auditLogger.info('property_management', 'property_cache_invalidated', {
          propertyId: propId,
        }, correlationId.correlationId);
      });

      // Force refresh properties to show new images with cache invalidation
      auditLogger.info('property_management', 'forcing_cache_refresh', {
        successCount,
        failureCount,
        propertiesAffected: propertiesToInvalidate.size,
      }, correlationId.correlationId);
      
      await refetchProperties();
      
      auditLogger.endOperation('property_management', 'bulk_gallery_upload', correlationId.correlationId, correlationId.startTime, true, {
        successCount,
        failureCount,
        unmatchedCount: unmatchedFiles.length,
        matchedProperties,
        unmatchedFiles,
        propertiesAffected: propertiesToInvalidate.size,
      });

      if (successCount > 0) {
        toast.success(`${successCount} image${successCount !== 1 ? 's' : ''} uploaded successfully`, {
          description: matchedProperties.slice(0, 3).join(', ') + (matchedProperties.length > 3 ? '...' : ''),
          duration: 5000,
        });
      }

      if (unmatchedFiles.length > 0) {
        toast.warning(`${unmatchedFiles.length} file${unmatchedFiles.length !== 1 ? 's' : ''} could not be matched to properties`, {
          description: unmatchedFiles.slice(0, 3).join(', ') + (unmatchedFiles.length > 3 ? '...' : ''),
          duration: 7000,
        });
      }

      if (failureCount > 0 && unmatchedFiles.length === 0) {
        toast.error(`${failureCount} upload${failureCount !== 1 ? 's' : ''} failed. Check console for details.`);
      }

      setSelectedFiles([]);
      setUploadProgress({});
      
    } catch (error) {
      auditLogger.error('property_management', 'bulk_upload_critical_failure', error as Error, {
        fileCount: selectedFiles.length,
      }, correlationId.correlationId);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefresh = async () => {
    auditLogger.info('property_management', 'manual_gallery_refresh', {
      timestamp: Date.now(),
    });
    
    // Invalidate cache for all properties
    properties.forEach(prop => invalidatePropertyImageCache(prop.id));
    
    await refetchProperties();
    toast.success('Gallery refreshed with latest images');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-primary">Gallery Management</h1>
          <p className="text-lg text-muted-foreground">
            Upload and manage property images with automatic matching and real-time updates
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {!isAdmin && (
        <Alert variant="destructive" className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertTitle>Admin Access Required</AlertTitle>
          <AlertDescription>
            Only administrators can upload and manage gallery images.
          </AlertDescription>
        </Alert>
      )}

      <Alert className="mb-6 border-primary/30 bg-primary/5">
        <Info className="h-4 w-4" />
        <AlertTitle>Image Upload Guidelines</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>• <strong>Supported formats:</strong> PNG, JPG, JPEG, WEBP, GIF, BMP</p>
          <p>• <strong>Filename matching:</strong> Images are automatically matched to properties by filename</p>
          <p>• <strong>Examples:</strong> "prop-004.png" matches property ID "prop-004", "Burj-Khalifa.jpg" matches property name "Burj Khalifa"</p>
          <p>• <strong>Matching rules:</strong> Case-insensitive, extension-agnostic, ignores hyphens/underscores/spaces</p>
          <p>• <strong>Cache handling:</strong> Images are cached with timestamps and property IDs to ensure correct display</p>
          <p>• <strong>Error handling:</strong> Unmatched files are reported, failed uploads are logged for admin review</p>
          <p>• <strong>Validation:</strong> Each image URL is validated to ensure it belongs to the correct property</p>
        </AlertDescription>
      </Alert>

      <Card className="mb-6 border-3d shadow-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Image Upload
          </CardTitle>
          <CardDescription>
            Upload multiple property images at once with automatic matching and cache invalidation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select Images</Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.webp,.gif,.bmp"
              onChange={handleFileSelect}
              disabled={!isAdmin || isUploading}
              className="mt-2"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Select one or more images (PNG, JPG, JPEG, WEBP, GIF, BMP)
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 rounded-lg border p-3">
                {selectedFiles.map((file) => {
                  const matchedProp = matchPropertyByFilename(file.name);
                  const progress = uploadProgress[file.name] || 0;
                  
                  return (
                    <div key={file.name} className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <ImageIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                        {matchedProp && (
                          <Badge variant="secondary" className="flex-shrink-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {matchedProp.name}
                          </Badge>
                        )}
                        {!matchedProp && (
                          <Badge variant="outline" className="flex-shrink-0 border-destructive text-destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            No match
                          </Badge>
                        )}
                      </div>
                      {progress > 0 && progress < 100 && (
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!isAdmin || selectedFiles.length === 0 || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-3d shadow-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Property Gallery Overview
          </CardTitle>
          <CardDescription>
            Current gallery status for all properties with image counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {propertiesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No properties found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((property) => {
                const imageCount = property.gallery?.length || 0;
                
                return (
                  <div
                    key={property.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {property.id}</p>
                    </div>
                    <Badge variant={imageCount > 0 ? 'default' : 'outline'}>
                      {imageCount > 0 ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {imageCount} image{imageCount !== 1 ? 's' : ''}
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          No images
                        </>
                      )}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

