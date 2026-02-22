import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAddNodeToProperty, useRemoveNodeFromProperty } from '../hooks/useQueries';
import { Plus, Trash2, Navigation, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { Property, Node } from '../backend';
import { fromBackendUnitValue, toBackendUnitValue } from '../lib/unitConversion';

interface NodeManagementDialogProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NodeManagementDialog({ property, open, onOpenChange }: NodeManagementDialogProps) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('');
  const [nodeToDelete, setNodeToDelete] = useState<Node | null>(null);

  const { mutate: addNode, isPending: isAdding } = useAddNodeToProperty();
  const { mutate: removeNode, isPending: isRemoving } = useRemoveNodeFromProperty();

  const handleAddNode = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const alt = parseFloat(altitude);

    if (isNaN(lat) || isNaN(lng) || isNaN(alt)) {
      toast.error('Please enter valid numeric values for all fields');
      return;
    }

    if (lat < -90 || lat > 90) {
      toast.error('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      toast.error('Longitude must be between -180 and 180');
      return;
    }

    if (alt < 0) {
      toast.error('Altitude must be a positive number');
      return;
    }

    addNode(
      {
        propertyId: property.id,
        latitude: toBackendUnitValue({ value: lat, unit: 'degree' }, 'length'),
        longitude: toBackendUnitValue({ value: lng, unit: 'degree' }, 'length'),
        altitude: toBackendUnitValue({ value: alt, unit: 'm' }, 'length')
      },
      {
        onSuccess: () => {
          setLatitude('');
          setLongitude('');
          setAltitude('');
        },
      }
    );
  };

  const handleDeleteNode = (node: Node) => {
    setNodeToDelete(node);
  };

  const confirmDeleteNode = () => {
    if (nodeToDelete) {
      removeNode(
        { propertyId: property.id, nodeId: nodeToDelete.id },
        {
          onSuccess: () => {
            setNodeToDelete(null);
          },
        }
      );
    }
  };

  const formatPrice = (price: any) => {
    const displayPrice = fromBackendUnitValue(price, 'INR');
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(displayPrice.value);
  };

  const nodeCount = Number(property.nodeCount);
  const hasNodes = nodeCount > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Navigation className="h-6 w-6 text-primary" />
              Manage Nodes - {property.name}
            </DialogTitle>
            <DialogDescription>
              Add, update, or remove geographic nodes for this property. Each node represents a specific location point with coordinates and altitude.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-200px)]">
            <div className="space-y-6 pr-4">
              {/* Node Statistics */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Node Statistics</CardTitle>
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
                        }).format(fromBackendUnitValue(property.price, 'INR').value)}
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
                          }).format(fromBackendUnitValue(property.price, 'INR').value)}{' '}
                          / 1000) / {nodeCount} = {formatPrice(property.nodePricing)}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Separator />

              {/* Add New Node */}
              <Card className="border-2 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
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

              <Separator />

              {/* Existing Nodes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center gap-2">
                      <Navigation className="h-5 w-5" />
                      Existing Nodes ({nodeCount})
                    </span>
                    {hasNodes && <Badge variant="secondary">{nodeCount} nodes</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {hasNodes
                      ? 'Manage existing nodes - update order or remove nodes as needed'
                      : 'No nodes added yet. Add your first node using the form above.'}
                  </CardDescription>
                </CardHeader>
                {hasNodes && (
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Order</TableHead>
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
                              <TableCell className="font-medium">
                                <Badge variant="outline">#{idx + 1}</Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{fromBackendUnitValue(node.latitude, 'degree').value.toFixed(6)}</TableCell>
                              <TableCell className="font-mono text-sm">{fromBackendUnitValue(node.longitude, 'degree').value.toFixed(6)}</TableCell>
                              <TableCell className="font-mono text-sm">{fromBackendUnitValue(node.altitude, 'm').value.toFixed(2)}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(Number(node.createdAt) / 1000000).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={idx === 0}
                                    className="h-8 w-8 p-0"
                                    title="Move up"
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={idx === property.nodes.length - 1}
                                    className="h-8 w-8 p-0"
                                    title="Move down"
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteNode(node)}
                                    disabled={isRemoving}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    title="Delete node"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Info Note */}
              <div className="rounded-lg border border-muted bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Node Management Notes</p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>All changes are saved immediately and reflected in real-time</li>
                      <li>Node pricing is automatically recalculated when nodes are added or removed</li>
                      <li>Use the arrow buttons to reorder nodes (coming soon)</li>
                      <li>Deleting a node is permanent and cannot be undone</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
                    <strong>Latitude:</strong> {fromBackendUnitValue(nodeToDelete.latitude, 'degree').value.toFixed(6)}
                  </p>
                  <p className="text-xs">
                    <strong>Longitude:</strong> {fromBackendUnitValue(nodeToDelete.longitude, 'degree').value.toFixed(6)}
                  </p>
                  <p className="text-xs">
                    <strong>Altitude:</strong> {fromBackendUnitValue(nodeToDelete.altitude, 'm').value.toFixed(2)}m
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
    </>
  );
}
