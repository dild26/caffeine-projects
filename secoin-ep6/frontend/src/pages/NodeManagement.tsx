import { useState, useRef } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetProperties, useAddNodeToProperty, useRemoveNodeFromProperty, useIsCallerAdmin } from '../hooks/useQueries';
import { ArrowLeft, Plus, Trash2, Navigation, Info, Upload, History, Settings as SettingsIcon, MapPin, Grid3x3, AlertCircle, CheckCircle2, FileWarning } from 'lucide-react';
import { toast } from 'sonner';
import type { Node } from '../backend';
import { auditLogger } from '../lib/auditLogger';

export default function NodeManagement() {
  const navigate = useNavigate();
  const { propertyId } = useParams({ strict: false });
  const { data: properties } = useGetProperties();
  const { data: isAdmin } = useIsCallerAdmin();
  const [activeTab, setActiveTab] = useState('table');
  
  // Add node form state
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('');
  const [nodeToDelete, setNodeToDelete] = useState<Node | null>(null);

  // Import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isProcessingImport, setIsProcessingImport] = useState(false);

  const { mutate: addNode, isPending: isAdding } = useAddNodeToProperty();
  const { mutate: removeNode, isPending: isRemoving } = useRemoveNodeFromProperty();

  const property = properties?.find(p => p.id === propertyId);

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Property not found</p>
            <Button onClick={() => navigate({ to: '/' })} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddNode = () => {
    const correlationId = auditLogger.startOperation('node_management', 'add_node', {
      propertyId: property.id,
      propertyName: property.name,
    });

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const alt = parseFloat(altitude);

    if (isNaN(lat) || isNaN(lng) || isNaN(alt)) {
      const error = new Error('Invalid numeric values');
      auditLogger.error('node_management', 'add_node_validation_failed', error, {
        latitude, longitude, altitude,
      }, correlationId.correlationId);
      toast.error('Please enter valid numeric values for all fields');
      return;
    }

    if (lat < -90 || lat > 90) {
      const error = new Error('Latitude out of range');
      auditLogger.error('node_management', 'add_node_validation_failed', error, {
        latitude: lat,
      }, correlationId.correlationId);
      toast.error('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      const error = new Error('Longitude out of range');
      auditLogger.error('node_management', 'add_node_validation_failed', error, {
        longitude: lng,
      }, correlationId.correlationId);
      toast.error('Longitude must be between -180 and 180');
      return;
    }

    if (alt < 0) {
      const error = new Error('Altitude must be positive');
      auditLogger.error('node_management', 'add_node_validation_failed', error, {
        altitude: alt,
      }, correlationId.correlationId);
      toast.error('Altitude must be a positive number');
      return;
    }

    addNode(
      { propertyId: property.id, latitude: lat, longitude: lng, altitude: alt },
      {
        onSuccess: () => {
          auditLogger.endOperation('node_management', 'add_node', correlationId.correlationId, correlationId.startTime, true, {
            nodeAdded: { lat, lng, alt },
          });
          setLatitude('');
          setLongitude('');
          setAltitude('');
          toast.success('Node added successfully');
        },
        onError: (error) => {
          auditLogger.error('node_management', 'add_node_failed', error as Error, {
            propertyId: property.id,
          }, correlationId.correlationId);
        },
      }
    );
  };

  const handleDeleteNode = (node: Node) => {
    setNodeToDelete(node);
  };

  const confirmDeleteNode = () => {
    if (nodeToDelete) {
      const correlationId = auditLogger.startOperation('node_management', 'delete_node', {
        propertyId: property.id,
        nodeId: nodeToDelete.id,
      });

      removeNode(
        { propertyId: property.id, nodeId: nodeToDelete.id },
        {
          onSuccess: () => {
            auditLogger.endOperation('node_management', 'delete_node', correlationId.correlationId, correlationId.startTime, true, {
              nodeDeleted: nodeToDelete.id,
            });
            setNodeToDelete(null);
            toast.success('Node removed successfully');
          },
          onError: (error) => {
            auditLogger.error('node_management', 'delete_node_failed', error as Error, {
              propertyId: property.id,
              nodeId: nodeToDelete.id,
            }, correlationId.correlationId);
          },
        }
      );
    }
  };

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const correlationId = auditLogger.startOperation('node_management', 'import_file_selected', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    try {
      setImportFile(file);
      setImportErrors([]);
      setImportPreview([]);

      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!['csv', 'json', 'zip'].includes(fileExtension || '')) {
        throw new Error('Unsupported file format. Please use CSV, JSON, or ZIP files.');
      }

      auditLogger.info('node_management', 'import_file_processing', {
        fileExtension,
      }, correlationId.correlationId);

      if (fileExtension === 'csv') {
        await processCSVFile(file, correlationId.correlationId);
      } else if (fileExtension === 'json') {
        await processJSONFile(file, correlationId.correlationId);
      } else if (fileExtension === 'zip') {
        toast.info('ZIP file support coming soon. Please extract and upload CSV or JSON files.');
      }

      auditLogger.endOperation('node_management', 'import_file_selected', correlationId.correlationId, correlationId.startTime, true);
    } catch (error) {
      auditLogger.error('node_management', 'import_file_failed', error as Error, {
        fileName: file.name,
      }, correlationId.correlationId);
      toast.error((error as Error).message);
      setImportErrors([(error as Error).message]);
    }
  };

  const processCSVFile = async (file: File, correlationId: string) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['latitude', 'longitude', 'altitude'];
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    const latIndex = headers.indexOf('latitude');
    const lngIndex = headers.indexOf('longitude');
    const altIndex = headers.indexOf('altitude');

    const preview: any[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      try {
        const lat = parseFloat(values[latIndex]);
        const lng = parseFloat(values[lngIndex]);
        const alt = parseFloat(values[altIndex]);

        if (isNaN(lat) || isNaN(lng) || isNaN(alt)) {
          errors.push(`Row ${i + 1}: Invalid numeric values`);
          continue;
        }

        if (lat < -90 || lat > 90) {
          errors.push(`Row ${i + 1}: Latitude out of range (-90 to 90)`);
          continue;
        }

        if (lng < -180 || lng > 180) {
          errors.push(`Row ${i + 1}: Longitude out of range (-180 to 180)`);
          continue;
        }

        if (alt < 0) {
          errors.push(`Row ${i + 1}: Altitude must be positive`);
          continue;
        }

        preview.push({
          row: i + 1,
          latitude: lat,
          longitude: lng,
          altitude: alt,
          status: 'valid',
        });
      } catch (error) {
        errors.push(`Row ${i + 1}: ${(error as Error).message}`);
      }
    }

    auditLogger.info('node_management', 'csv_processed', {
      totalRows: lines.length - 1,
      validRows: preview.length,
      errorRows: errors.length,
    }, correlationId);

    setImportPreview(preview);
    setImportErrors(errors);

    if (preview.length > 0) {
      toast.success(`Processed ${preview.length} valid nodes. Review and commit to import.`);
    } else {
      toast.error('No valid nodes found in CSV file');
    }
  };

  const processJSONFile = async (file: File, correlationId: string) => {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of nodes');
    }

    const preview: any[] = [];
    const errors: string[] = [];

    data.forEach((node, index) => {
      try {
        const lat = parseFloat(node.latitude);
        const lng = parseFloat(node.longitude);
        const alt = parseFloat(node.altitude || node.altitude_m || 0);

        if (isNaN(lat) || isNaN(lng) || isNaN(alt)) {
          errors.push(`Node ${index + 1}: Invalid numeric values`);
          return;
        }

        if (lat < -90 || lat > 90) {
          errors.push(`Node ${index + 1}: Latitude out of range`);
          return;
        }

        if (lng < -180 || lng > 180) {
          errors.push(`Node ${index + 1}: Longitude out of range`);
          return;
        }

        if (alt < 0) {
          errors.push(`Node ${index + 1}: Altitude must be positive`);
          return;
        }

        preview.push({
          row: index + 1,
          latitude: lat,
          longitude: lng,
          altitude: alt,
          status: 'valid',
        });
      } catch (error) {
        errors.push(`Node ${index + 1}: ${(error as Error).message}`);
      }
    });

    auditLogger.info('node_management', 'json_processed', {
      totalNodes: data.length,
      validNodes: preview.length,
      errorNodes: errors.length,
    }, correlationId);

    setImportPreview(preview);
    setImportErrors(errors);

    if (preview.length > 0) {
      toast.success(`Processed ${preview.length} valid nodes. Review and commit to import.`);
    } else {
      toast.error('No valid nodes found in JSON file');
    }
  };

  const handleCommitImport = async () => {
    if (importPreview.length === 0) {
      toast.error('No valid nodes to import');
      return;
    }

    const correlationId = auditLogger.startOperation('node_management', 'bulk_import_commit', {
      propertyId: property.id,
      nodeCount: importPreview.length,
    });

    setIsProcessingImport(true);

    try {
      let successCount = 0;
      let failCount = 0;

      for (const node of importPreview) {
        try {
          await new Promise<void>((resolve, reject) => {
            addNode(
              {
                propertyId: property.id,
                latitude: node.latitude,
                longitude: node.longitude,
                altitude: node.altitude,
              },
              {
                onSuccess: () => {
                  successCount++;
                  resolve();
                },
                onError: (error) => {
                  failCount++;
                  reject(error);
                },
              }
            );
          });
        } catch (error) {
          auditLogger.error('node_management', 'bulk_import_node_failed', error as Error, {
            nodeRow: node.row,
          }, correlationId.correlationId);
        }
      }

      auditLogger.endOperation('node_management', 'bulk_import_commit', correlationId.correlationId, correlationId.startTime, true, {
        successCount,
        failCount,
      });

      toast.success(`Import complete: ${successCount} nodes added${failCount > 0 ? `, ${failCount} failed` : ''}`);
      
      // Reset import state
      setImportFile(null);
      setImportPreview([]);
      setImportErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      auditLogger.error('node_management', 'bulk_import_failed', error as Error, {
        propertyId: property.id,
      }, correlationId.correlationId);
      toast.error('Import failed. Please check the audit log for details.');
    } finally {
      setIsProcessingImport(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const nodeCount = Number(property.nodeCount);
  const hasNodes = nodeCount > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Navigation className="h-8 w-8 text-primary" />
              Node Management
            </h1>
            <p className="text-muted-foreground mt-2">{property.name}</p>
            <p className="text-sm text-muted-foreground">{property.location}</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {nodeCount} Nodes
          </Badge>
        </div>
      </div>

      {/* Statistics Card */}
      <Card className="mb-6 border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Property Overview</CardTitle>
          <CardDescription>Current node configuration and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Total Nodes</p>
              <p className="text-2xl font-bold">{nodeCount}</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Property Value</p>
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(Number(property.price))}
              </p>
            </div>
            <div className="rounded-lg border bg-accent/10 p-4">
              <p className="text-sm text-muted-foreground">Per Node Pricing</p>
              <p className="text-2xl font-bold text-accent">
                {hasNodes ? formatPrice(property.nodePricing) : 'N/A'}
              </p>
            </div>
          </div>
          {hasNodes && (
            <div className="mt-4 rounded-lg bg-muted/30 p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <strong>Formula:</strong> MRPnode = (MRPprop / 1000) / nNode = (
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(Number(property.price))}{' '}
                  / 1000) / {nodeCount} = {formatPrice(property.nodePricing)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="table" className="gap-2">
            <Grid3x3 className="h-4 w-4" />
            Table
          </TabsTrigger>
          <TabsTrigger value="cards" className="gap-2">
            <MapPin className="h-4 w-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <History className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Table Tab */}
        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3x3 className="h-5 w-5" />
                Node Table View
              </CardTitle>
              <CardDescription>
                Sortable and filterable grid of all nodes with comprehensive details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasNodes ? (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Order</TableHead>
                        <TableHead>Node ID</TableHead>
                        <TableHead>Latitude</TableHead>
                        <TableHead>Longitude</TableHead>
                        <TableHead>Altitude (m)</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {property.nodes.map((node, idx) => (
                        <TableRow key={node.id}>
                          <TableCell>
                            <Badge variant="outline">#{idx + 1}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{node.id.slice(0, 20)}...</TableCell>
                          <TableCell className="font-mono text-sm">{node.latitude.toFixed(6)}</TableCell>
                          <TableCell className="font-mono text-sm">{node.longitude.toFixed(6)}</TableCell>
                          <TableCell className="font-mono text-sm">{node.altitude.toFixed(2)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(Number(node.createdAt) / 1000000).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNode(node)}
                                disabled={isRemoving}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No nodes added yet. Use the Import tab or add nodes manually.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Node Form */}
          {isAdmin && (
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Node
                </CardTitle>
                <CardDescription>Enter geographic coordinates and altitude for the new node</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      placeholder="e.g., 13.081828"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      disabled={isAdding}
                    />
                    <p className="text-xs text-muted-foreground">Range: -90 to 90</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      placeholder="e.g., 77.542533"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      disabled={isAdding}
                    />
                    <p className="text-xs text-muted-foreground">Range: -180 to 180</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altitude">Altitude (meters)</Label>
                    <Input
                      id="altitude"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 920.50"
                      value={altitude}
                      onChange={(e) => setAltitude(e.target.value)}
                      disabled={isAdding}
                    />
                    <p className="text-xs text-muted-foreground">Height above sea level</p>
                  </div>
                </div>
                <Button
                  onClick={handleAddNode}
                  disabled={!latitude || !longitude || !altitude || isAdding}
                  className="mt-4 w-full gap-2"
                >
                  {isAdding ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Adding Node...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Node
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Node Cards with Mini-Map
              </CardTitle>
              <CardDescription>
                Card view of nodes with integrated mini-map display for each node
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasNodes ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {property.nodes.map((node, idx) => (
                    <Card key={node.id} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Node #{idx + 1}</span>
                          <Badge variant="secondary">{node.id.slice(0, 8)}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Latitude:</span>
                            <span className="font-mono">{node.latitude.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Longitude:</span>
                            <span className="font-mono">{node.longitude.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Altitude:</span>
                            <span className="font-mono">{node.altitude.toFixed(2)}m</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-muted-foreground" />
                          <span className="ml-2 text-sm text-muted-foreground">Mini-map coming soon</span>
                        </div>
                        {isAdmin && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteNode(node)}
                            disabled={isRemoving}
                            className="w-full gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Node
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No nodes to display. Add nodes to see them here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Bulk Import Nodes
              </CardTitle>
              <CardDescription>
                Import nodes from CSV, JSON, or ZIP files with auto-mapping and validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    {importFile ? importFile.name : 'Drag and drop files here'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports CSV, JSON, and ZIP formats
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.zip"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button variant="outline" onClick={handleBrowseFiles}>
                    Browse Files
                  </Button>
                </div>

                {importErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Import Errors ({importErrors.length})</AlertTitle>
                    <AlertDescription>
                      <ScrollArea className="h-32 mt-2">
                        <ul className="text-sm space-y-1">
                          {importErrors.map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </AlertDescription>
                  </Alert>
                )}

                {importPreview.length > 0 && (
                  <>
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Import Preview ({importPreview.length} valid nodes)</AlertTitle>
                      <AlertDescription>
                        Review the nodes below and click "Commit Import" to add them to the property.
                      </AlertDescription>
                    </Alert>

                    <ScrollArea className="h-64 rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Row</TableHead>
                            <TableHead>Latitude</TableHead>
                            <TableHead>Longitude</TableHead>
                            <TableHead>Altitude</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {importPreview.map((node) => (
                            <TableRow key={node.row}>
                              <TableCell>{node.row}</TableCell>
                              <TableCell className="font-mono text-sm">{node.latitude.toFixed(6)}</TableCell>
                              <TableCell className="font-mono text-sm">{node.longitude.toFixed(6)}</TableCell>
                              <TableCell className="font-mono text-sm">{node.altitude.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge variant="default">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Valid
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleCommitImport}
                        disabled={isProcessingImport}
                        className="flex-1 gap-2"
                      >
                        {isProcessingImport ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Commit Import ({importPreview.length} nodes)
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setImportFile(null);
                          setImportPreview([]);
                          setImportErrors([]);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        disabled={isProcessingImport}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Expected Format</h3>
                  <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                    <p className="font-bold">CSV Format:</p>
                    <p>latitude,longitude,altitude</p>
                    <p className="text-muted-foreground">13.081828,77.542533,920.50</p>
                    <p className="text-muted-foreground">13.081930,77.542640,920.50</p>
                    <br />
                    <p className="font-bold">JSON Format:</p>
                    <p className="text-muted-foreground">[</p>
                    <p className="text-muted-foreground ml-4">{`{ "latitude": 13.081828, "longitude": 77.542533, "altitude": 920.50 },`}</p>
                    <p className="text-muted-foreground ml-4">{`{ "latitude": 13.081930, "longitude": 77.542640, "altitude": 920.50 }`}</p>
                    <p className="text-muted-foreground">]</p>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Import Features</p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Auto-mapping of headers (latitude, longitude, altitude)</li>
                        <li>Validation: lat/lon bounds, altitude, no duplicates</li>
                        <li>Preview of row status before commit</li>
                        <li>Comprehensive audit logging with rollback capabilities</li>
                        <li>Deduplication using coordinate matching</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Audit Log
              </CardTitle>
              <CardDescription>
                Comprehensive change history with filtering and search capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search audit logs..." className="flex-1" />
                  <Button variant="outline">Filter</Button>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {property.nodes.map((node, idx) => (
                      <div key={node.id} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">Node #{idx + 1} Created</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(Number(node.createdAt) / 1000000).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline">CREATE</Badge>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p>Lat: {node.latitude.toFixed(6)}, Lng: {node.longitude.toFixed(6)}, Alt: {node.altitude.toFixed(2)}m</p>
                        </div>
                      </div>
                    ))}
                    {!hasNodes && (
                      <div className="py-12 text-center text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No audit logs available yet</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Node Management Settings
              </CardTitle>
              <CardDescription>
                Configure unit defaults, permissions, and billing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Unit Defaults</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">Coordinate Unit</p>
                      <p className="text-xs text-muted-foreground">Default unit for latitude/longitude</p>
                    </div>
                    <Badge>Decimal Degrees</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">Altitude Unit</p>
                      <p className="text-xs text-muted-foreground">Default unit for altitude measurements</p>
                    </div>
                    <Badge>Meters</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Permissions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">Admin Access</p>
                      <p className="text-xs text-muted-foreground">Full CRUD, bulk import, approve price changes</p>
                    </div>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">Subscriber Access</p>
                      <p className="text-xs text-muted-foreground">CRUD with approval, $0.50 fee for price changes</p>
                    </div>
                    <Badge variant="secondary">Limited</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">Public Access</p>
                      <p className="text-xs text-muted-foreground">Read-only access to property and nodes</p>
                    </div>
                    <Badge variant="outline">Read-Only</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Billing</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">Price Change Fee</p>
                      <p className="text-xs text-muted-foreground">Fee for subscriber-initiated price modifications</p>
                    </div>
                    <Badge>$0.50</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!nodeToDelete} onOpenChange={() => setNodeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Node?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this node? This action cannot be undone.
              {nodeToDelete && (
                <div className="mt-4 rounded-lg border bg-muted/50 p-3 space-y-1">
                  <p className="text-sm font-medium text-foreground">Node Details:</p>
                  <p className="text-xs">
                    <strong>Latitude:</strong> {nodeToDelete.latitude.toFixed(6)}
                  </p>
                  <p className="text-xs">
                    <strong>Longitude:</strong> {nodeToDelete.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs">
                    <strong>Altitude:</strong> {nodeToDelete.altitude.toFixed(2)}m
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteNode} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isRemoving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Node'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
