import { useState } from 'react';
import { Property } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  DisplayUnitValue,
  parseNumericValue,
  convertUnit,
  toBackendUnitValue,
  fromBackendUnitValue,
  isValidUnit,
  formatUnitValue,
  createConversionWarning,
  isDecimalValue,
  getUnitsForType,
} from '../lib/unitConversion';

interface PropertyEditorProps {
  property: Property;
  onSave: (property: Property) => void;
  onCancel: () => void;
}

export default function PropertyEditor({ property, onSave, onCancel }: PropertyEditorProps) {
  // Convert backend UnitValues to frontend format for display
  const [area, setArea] = useState<DisplayUnitValue>(
    property.area ? fromBackendUnitValue(property.area, 'm2') : { value: 0, unit: 'm2' }
  );
  const [elevation, setElevation] = useState<DisplayUnitValue>(
    property.elevation ? fromBackendUnitValue(property.elevation, 'm') : { value: 0, unit: 'm' }
  );
  const [pricePerUnit, setPricePerUnit] = useState<DisplayUnitValue>(
    property.pricePerUnit ? fromBackendUnitValue(property.pricePerUnit, 'INR/m2') : { value: 0, unit: 'INR/m2' }
  );

  const [latitude, setLatitude] = useState<DisplayUnitValue>(
    fromBackendUnitValue(property.latitude, 'degree')
  );
  const [longitude, setLongitude] = useState<DisplayUnitValue>(
    fromBackendUnitValue(property.longitude, 'degree')
  );
  const [price, setPrice] = useState<DisplayUnitValue>(
    fromBackendUnitValue(property.price, 'INR')
  );

  const [warnings, setWarnings] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Handle area value change
  const handleAreaValueChange = (value: string) => {
    try {
      const parsed = parseNumericValue(value);
      const newArea = { ...area, value: parsed };
      setArea(newArea);

      if (isDecimalValue(parsed)) {
        const warning = createConversionWarning(value, parsed, area.unit, true);
        setWarnings([...warnings.filter(w => !w.includes('area')), warning]);
      } else {
        setWarnings(warnings.filter(w => !w.includes('area')));
      }
      setErrors(errors.filter(e => !e.includes('area')));
    } catch (error: any) {
      setErrors([...errors.filter(e => !e.includes('area')), `Invalid area value: ${error.message}`]);
    }
  };

  // Handle area unit change with conversion
  const handleAreaUnitChange = (newUnit: string) => {
    if (!isValidUnit(newUnit, 'area')) {
      setErrors([...errors, `Invalid area unit: ${newUnit}`]);
      return;
    }

    const convertedValue = convertUnit(area.value, area.unit, newUnit);
    setArea({ value: convertedValue, unit: newUnit });

    toast.info(`Area converted: ${formatUnitValue(area)} → ${formatUnitValue({ value: convertedValue, unit: newUnit })}`);
  };

  // Handle elevation value change
  const handleElevationValueChange = (value: string) => {
    try {
      const parsed = parseNumericValue(value);
      const newElevation = { ...elevation, value: parsed };
      setElevation(newElevation);

      if (isDecimalValue(parsed)) {
        const warning = createConversionWarning(value, parsed, elevation.unit, true);
        setWarnings([...warnings.filter(w => !w.includes('elevation')), warning]);
      } else {
        setWarnings(warnings.filter(w => !w.includes('elevation')));
      }
      setErrors(errors.filter(e => !e.includes('elevation')));
    } catch (error: any) {
      setErrors([...errors.filter(e => !e.includes('elevation')), `Invalid elevation value: ${error.message}`]);
    }
  };

  // Handle elevation unit change with conversion
  const handleElevationUnitChange = (newUnit: string) => {
    if (!isValidUnit(newUnit, 'length')) {
      setErrors([...errors, `Invalid elevation unit: ${newUnit}`]);
      return;
    }

    const convertedValue = convertUnit(elevation.value, elevation.unit, newUnit);
    setElevation({ value: convertedValue, unit: newUnit });

    toast.info(`Elevation converted: ${formatUnitValue(elevation)} → ${formatUnitValue({ value: convertedValue, unit: newUnit })}`);
  };

  // Handle price per unit value change
  const handlePricePerUnitValueChange = (value: string) => {
    try {
      const parsed = parseNumericValue(value);
      const newPricePerUnit = { ...pricePerUnit, value: parsed };
      setPricePerUnit(newPricePerUnit);

      if (isDecimalValue(parsed)) {
        const warning = createConversionWarning(value, parsed, pricePerUnit.unit, true);
        setWarnings([...warnings.filter(w => !w.includes('price per unit')), warning]);
      } else {
        setWarnings(warnings.filter(w => !w.includes('price per unit')));
      }
      setErrors(errors.filter(e => !e.includes('price per unit')));
    } catch (error: any) {
      setErrors([...errors.filter(e => !e.includes('price per unit')), `Invalid price per unit value: ${error.message}`]);
    }
  };

  // Handle price per unit unit change
  const handlePricePerUnitUnitChange = (newUnit: string) => {
    setPricePerUnit({ ...pricePerUnit, unit: newUnit });
  };

  // Handle coordinate changes (support decimals)
  const handleLatitudeChange = (value: string) => {
    try {
      const parsed = parseNumericValue(value);
      setLatitude({ ...latitude, value: parsed });

      if (isDecimalValue(parsed)) {
        const warning = createConversionWarning(value, parsed, 'degree', true);
        setWarnings([...warnings.filter(w => !w.includes('latitude')), warning]);
      } else {
        setWarnings(warnings.filter(w => !w.includes('latitude')));
      }
      setErrors(errors.filter(e => !e.includes('latitude')));
    } catch (error: any) {
      setErrors([...errors.filter(e => !e.includes('latitude')), `Invalid latitude: ${error.message}`]);
    }
  };

  const handleLongitudeChange = (value: string) => {
    try {
      const parsed = parseNumericValue(value);
      setLongitude({ ...longitude, value: parsed });

      if (isDecimalValue(parsed)) {
        const warning = createConversionWarning(value, parsed, 'degree', true);
        setWarnings([...warnings.filter(w => !w.includes('longitude')), warning]);
      } else {
        setWarnings(warnings.filter(w => !w.includes('longitude')));
      }
      setErrors(errors.filter(e => !e.includes('longitude')));
    } catch (error: any) {
      setErrors([...errors.filter(e => !e.includes('longitude')), `Invalid longitude: ${error.message}`]);
    }
  };

  // Handle save
  const handleSave = () => {
    if (errors.length > 0) {
      toast.error('Please fix all errors before saving');
      return;
    }

    // Convert to backend format with BigInt scaled values (Unit-Safe)
    const areaBackend = toBackendUnitValue(area, 'area');
    const elevationBackend = toBackendUnitValue(elevation, 'length');
    const pricePerUnitBackend = toBackendUnitValue(pricePerUnit, 'price');
    const latitudeBackend = toBackendUnitValue(latitude, 'length'); // Using length as proxy for degree
    const longitudeBackend = toBackendUnitValue(longitude, 'length');
    const priceBackend = toBackendUnitValue(price, 'price');

    const updatedProperty: Property = {
      ...property,
      area: areaBackend,
      elevation: elevationBackend,
      pricePerUnit: pricePerUnitBackend,
      latitude: latitudeBackend,
      longitude: longitudeBackend,
      price: priceBackend,
    };

    onSave(updatedProperty);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Edit Property: {property.name}</CardTitle>
        <CardDescription>
          Update property details with unit-aware fields. All numeric values are stored as Float with unit metadata to avoid BigInt errors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warnings */}
        {warnings.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area-value">Area (editable by Admin/Owner)</Label>
          <div className="flex gap-2">
            <Input
              id="area-value"
              type="number"
              step="any"
              value={area.value}
              onChange={(e) => handleAreaValueChange(e.target.value)}
              placeholder="Enter area"
              className="flex-1"
            />
            <Select value={area.unit} onValueChange={handleAreaUnitChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getUnitsForType('area').map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Display: {formatUnitValue(area)} | Storage: {toBackendUnitValue(area, 'area').value.toString()} {toBackendUnitValue(area, 'area').unit} (Scaled BigInt)
          </p>
        </div>

        {/* Elevation */}
        <div className="space-y-2">
          <Label htmlFor="elevation-value">Elevation (editable by Admin/Owner)</Label>
          <div className="flex gap-2">
            <Input
              id="elevation-value"
              type="number"
              step="any"
              value={elevation.value}
              onChange={(e) => handleElevationValueChange(e.target.value)}
              placeholder="Enter elevation"
              className="flex-1"
            />
            <Select value={elevation.unit} onValueChange={handleElevationUnitChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getUnitsForType('length').map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Display: {formatUnitValue(elevation)} | Storage: {toBackendUnitValue(elevation, 'length').value.toString()} {toBackendUnitValue(elevation, 'length').unit} (Scaled BigInt)
          </p>
        </div>

        {/* Price Per Unit */}
        <div className="space-y-2">
          <Label htmlFor="price-per-unit-value">Price Per Unit (editable by Admin/Owner)</Label>
          <div className="flex gap-2">
            <Input
              id="price-per-unit-value"
              type="number"
              step="any"
              value={pricePerUnit.value}
              onChange={(e) => handlePricePerUnitValueChange(e.target.value)}
              placeholder="Enter price per unit"
              className="flex-1"
            />
            <Select value={pricePerUnit.unit} onValueChange={handlePricePerUnitUnitChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getUnitsForType('price').map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Display: {formatUnitValue(pricePerUnit)} | Storage: {toBackendUnitValue(pricePerUnit, 'price').value.toString()} {toBackendUnitValue(pricePerUnit, 'price').unit} (Scaled BigInt)
          </p>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude (decimal degrees)</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={latitude.value}
              onChange={(e) => handleLatitudeChange(e.target.value)}
              placeholder="e.g., 13.081828"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude (decimal degrees)</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={longitude.value}
              onChange={(e) => handleLongitudeChange(e.target.value)}
              placeholder="e.g., 77.542533"
            />
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Total Price (INR)</Label>
          <Input
            id="price"
            type="number"
            step="any"
            value={price.value}
            onChange={(e) => setPrice({ ...price, value: parseFloat(e.target.value) || 0 })}
            placeholder="Enter total price"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={errors.length > 0} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

