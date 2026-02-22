import { useState } from 'react';
import { useIsCallerAdmin, useUploadProperty, useGetProperties } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Shield, Upload, FileJson, Settings, Navigation, Edit } from 'lucide-react';
import { toast } from 'sonner';
import type { Property } from '../backend';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import NodeManagementDialog from './NodeManagementDialog';
import PropertyEditor from './PropertyEditor';
import { validatePropertyWithUnits, toBackendUnitValue } from '../lib/unitConversion';

export default function AdminPanel() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const { data: properties = [] } = useGetProperties();
  const { mutate: uploadProperty, isPending } = useUploadProperty();
  const [jsonInput, setJsonInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showNodeManagement, setShowNodeManagement] = useState(false);
  const [showPropertyEditor, setShowPropertyEditor] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  if (isLoading || !isAdmin) {
    return null;
  }

  const handleUpload = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      // Validate with unit metadata support
      const validation = validatePropertyWithUnits(parsed);

      if (!validation.valid) {
        toast.error(`Invalid property schema: ${validation.errors.join(', ')}`);
        return;
      }

      if (validation.warnings.length > 0) {
        setValidationWarnings(validation.warnings);
        toast.warning(`Property uploaded with warnings. Check the panel for details.`);
      }

      // Convert to backend format with BigInt scaled values (Unit-Safe)
      const property: Property = {
        id: parsed.id,
        name: parsed.name,
        location: parsed.location,
        price: typeof parsed.price === 'object'
          ? toBackendUnitValue(parsed.price, 'price')
          : toBackendUnitValue({ value: parsed.price, unit: 'INR' }, 'price'),
        fractionalOwnership: parsed.fractionalOwnership.map((fo: any) => ({
          owner: fo.owner,
          percentage: BigInt(fo.percentage),
        })),
        floors: parsed.floors.map((floor: any) => ({
          floorNumber: BigInt(floor.floorNumber),
          area: BigInt(floor.area),
          price: BigInt(floor.price),
        })),
        schemaVersion: BigInt(parsed.schemaVersion || 1),
        latitude: typeof parsed.latitude === 'object'
          ? toBackendUnitValue(parsed.latitude, 'length') // Using length as proxy for degree scale factors
          : toBackendUnitValue({ value: parsed.latitude, unit: 'degree' }, 'length'),
        longitude: typeof parsed.longitude === 'object'
          ? toBackendUnitValue(parsed.longitude, 'length')
          : toBackendUnitValue({ value: parsed.longitude, unit: 'degree' }, 'length'),
        nodes: [],
        nodeCount: BigInt(0),
        nodePricing: { value: 0n, unit: 'paise', scale: 2n, editableBy: ['Admin', 'Owner'] },
        // Convert unit-aware fields to backend format (BigInt with scale)
        area: parsed.area
          ? toBackendUnitValue({ value: parsed.area.value, unit: parsed.area.unit }, 'area')
          : { value: 0n, unit: 'cm2', scale: 4n, editableBy: ['Admin', 'Owner'] },
        elevation: parsed.elevation
          ? toBackendUnitValue({ value: parsed.elevation.value, unit: parsed.elevation.unit }, 'length')
          : { value: 0n, unit: 'cm', scale: 2n, editableBy: ['Admin', 'Owner'] },
        pricePerUnit: parsed.pricePerUnit
          ? toBackendUnitValue({ value: parsed.pricePerUnit.value, unit: parsed.pricePerUnit.unit }, 'price')
          : { value: 0n, unit: 'paise', scale: 2n, editableBy: ['Admin', 'Owner'] },
        gallery: [], // Initialize empty gallery
      };

      uploadProperty(property);
      setJsonInput('');
      setValidationWarnings([]);
    } catch (error: any) {
      toast.error(`Invalid JSON: ${error.message}`);
    }
  };

  const handleManageNodes = (property: Property) => {
    setSelectedProperty(property);
    setShowNodeManagement(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyEditor(true);
  };

  const handleSaveProperty = (updatedProperty: Property) => {
    uploadProperty(updatedProperty);
    setShowPropertyEditor(false);
    setSelectedProperty(null);
  };

  const exampleSchema = {
    id: "prop-001",
    name: "Luxury Apartment Complex",
    location: "Bangalore, Karnataka",
    price: 50000000,
    schemaVersion: 1,
    latitude: 13.081828,
    longitude: 77.542533,
    area: { value: 555.7, unit: "m2" },
    elevation: { value: 920.5, unit: "m" },
    pricePerUnit: { value: 89500.25, unit: "INR/m2" },
    fractionalOwnership: [
      { owner: "Investor A", percentage: 40 },
      { owner: "Investor B", percentage: 35 },
      { owner: "Investor C", percentage: 25 }
    ],
    floors: [
      { floorNumber: 1, area: 2000, price: 15000000 },
      { floorNumber: 2, area: 2000, price: 17500000 },
      { floorNumber: 3, area: 2000, price: 17500000 }
    ]
  };

  return (
    <div className="container px-4 py-8 space-y-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="border-2 border-primary/50 shadow-lg">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Admin Panel
                    </CardTitle>
                    <CardDescription>Upload and manage property data with unit-aware fields (Float storage with metadata)</CardDescription>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {validationWarnings.length > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-semibold mb-2">Validation Warnings:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {validationWarnings.map((warning, idx) => (
                        <li key={idx} className="text-sm">{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="json-input" className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  Property JSON Data (with Unit Metadata)
                </Label>
                <Textarea
                  id="json-input"
                  placeholder="Paste property JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> All measurable values must be objects with <code>{`{ "value": <number>, "unit": "<string>" }`}</code>.
                  The system stores values as Float (number) with unit metadata and <code>editableBy: ["Admin", "Owner"]</code>.
                  Never attempt to convert the entire object to BigInt—only the <code>.value</code> field is used for calculations.
                  Nodes can be added after property creation using the node management interface.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={!jsonInput.trim() || isPending}
                  className="gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Property
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setJsonInput(JSON.stringify(exampleSchema, null, 2))}
                  disabled={isPending}
                >
                  Load Example
                </Button>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="mb-2 text-sm font-medium">Example Schema (with Unit Metadata):</p>
                <pre className="overflow-x-auto text-xs">
                  {JSON.stringify(exampleSchema, null, 2)}
                </pre>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Property Management Table */}
      <Card className="border-2 border-accent/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Navigation className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Property Management</CardTitle>
              <CardDescription>Manage nodes and edit property details with unit-aware fields</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No properties uploaded yet. Upload a property to get started.</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-center">Nodes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{property.location}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={Number(property.nodeCount) > 0 ? 'default' : 'secondary'} className="gap-1">
                          <Navigation className="h-3 w-3" />
                          {property.nodeCount.toString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProperty(property)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageNodes(property)}
                            className="gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            Nodes
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Node Management Dialog */}
      {selectedProperty && (
        <NodeManagementDialog
          property={selectedProperty}
          open={showNodeManagement}
          onOpenChange={setShowNodeManagement}
        />
      )}

      {/* Property Editor Dialog */}
      {selectedProperty && showPropertyEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <PropertyEditor
            property={selectedProperty}
            onSave={handleSaveProperty}
            onCancel={() => {
              setShowPropertyEditor(false);
              setSelectedProperty(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
