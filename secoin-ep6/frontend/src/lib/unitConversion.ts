// Unit conversion utility for property numeric fields
// Supports scaled integer storage to avoid BigInt errors

import { UnitValue as BackendUnitValue } from '../backend';

export type UnitType = 'length' | 'area' | 'price';

export interface DisplayUnitValue {
  value: number; // Display value (can be decimal)
  unit: string;
}

// Supported units by type
export const UNITS = {
  length: ['m', 'ft', 'cm', 'degree'] as const,
  area: ['m2', 'ft2', 'acre', 'cm2'] as const,
  price: ['INR', 'INR/m2', 'INR/ft2', 'paise'] as const,
};

// Base units for internal storage
export const BASE_UNITS = {
  length: 'cm', // Store as centimeters
  area: 'cm2', // Store as square centimeters
  price: 'paise', // Store as paise
  degree: 'degree', // Store as degrees with high scale
} as const;

// Default scales for types
export const DEFAULT_SCALES = {
  length: 2n, // 10^2 = 100 (centimeters)
  area: 4n,   // 10^4 = 10000 (square centimeters)
  price: 2n,  // 10^2 = 100 (paise)
  degree: 6n, // 10^6 (for coordinate precision)
} as const;

// Scale factors for converting to base units (multipliers for the numeric FLOAT value)
const SCALE_FACTORS: Record<string, number> = {
  // Length: convert to centimeters
  'm': 100, // 1 meter = 100 cm
  'ft': 30.48, // 1 foot = 30.48 cm
  'cm': 1, // 1 cm = 1 cm

  // Area: convert to square centimeters
  'm2': 10000, // 1 m² = 10000 cm²
  'ft2': 929.03, // 1 ft² = 929.03 cm²
  'acre': 40468600, // 1 acre = 40468600 cm²
  'cm2': 1, // 1 cm² = 1 cm²

  // Price: convert to paise
  'INR': 100, // 1 INR = 100 paise
  'INR/m2': 100,
  'INR/ft2': 100,
  'paise': 1,
  'degree': 1000000, // Scale by 10^6
};

// Conversion factors between units (for display conversions to a common base, e.g., meters, square meters, INR)
const CONVERSION_FACTORS: Record<string, number> = {
  // Length conversions to meters
  'm': 1,
  'ft': 0.3048,
  'cm': 0.01,

  // Area conversions to square meters
  'm2': 1,
  'ft2': 0.092903,
  'acre': 4046.86,
  'cm2': 0.0001,

  // Price conversions (to INR)
  'INR': 1,
  'INR/m2': 1,
  'INR/ft2': 1,
  'paise': 0.01,
};

/**
 * Convert a value from one unit to another (for display)
 */
export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;

  const fromFactor = CONVERSION_FACTORS[fromUnit];
  const toFactor = CONVERSION_FACTORS[toUnit];

  if (!fromFactor || !toFactor) {
    console.warn(`Unknown unit conversion: ${fromUnit} to ${toUnit}`);
    return value;
  }

  // Convert to base unit, then to target unit
  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

/**
 * Convert a DisplayUnitValue to backend format with scaled bigint
 */
export function toBackendUnitValue(unitValue: DisplayUnitValue, unitType: UnitType): BackendUnitValue {
  const scaleFactor = SCALE_FACTORS[unitValue.unit];
  const scale = DEFAULT_SCALES[unitType];

  if (!scaleFactor) {
    console.warn(`Unknown scale factor for unit: ${unitValue.unit}, defaulting to 0 scale`);
    return {
      value: BigInt(Math.round(unitValue.value)),
      unit: unitValue.unit,
      scale: 0n,
      editableBy: ['Admin', 'Owner'],
    };
  }

  // Scale the value (e.g., 555.7 m → 55570 cm, stored as 55570 with scale 2)
  const scaledValue = BigInt(Math.round(unitValue.value * scaleFactor));

  return {
    value: scaledValue,
    unit: BASE_UNITS[unitType],
    scale: scale,
    editableBy: ['Admin', 'Owner'],
  };
}

/**
 * Convert backend UnitValue to display format
 */
export function fromBackendUnitValue(backendValue: BackendUnitValue, displayUnit: string): DisplayUnitValue {
  const scaledValue = Number(backendValue.value);
  const scaleFactor = SCALE_FACTORS[displayUnit];

  if (!scaleFactor) {
    console.warn(`Unknown scale factor for display unit: ${displayUnit}, using raw value`);
    return {
      value: scaledValue,
      unit: displayUnit,
    };
  }

  // Descale the value (e.g., 55570 cm with scale 2 → 555.7 m)
  const displayValue = scaledValue / scaleFactor;

  return {
    value: displayValue,
    unit: displayUnit,
  };
}

/**
 * Parse a numeric input that may be float or integer
 */
export function parseNumericValue(input: string | number): number {
  if (typeof input === 'number') return input;

  const parsed = parseFloat(input);
  if (isNaN(parsed)) {
    throw new Error(`Invalid numeric value: ${input}`);
  }

  return parsed;
}

/**
 * Validate a unit for a given unit type
 */
export function isValidUnit(unit: string, unitType: UnitType): boolean {
  const validUnits = UNITS[unitType];
  return (validUnits as readonly string[]).includes(unit);
}

/**
 * Format a DisplayUnitValue for display
 */
export function formatUnitValue(unitValue: DisplayUnitValue, decimals: number = 2): string {
  return `${unitValue.value.toFixed(decimals)} ${unitValue.unit}`;
}

/**
 * Create a contextual warning message for decimal-to-integer scaling
 */
export function createConversionWarning(
  originalValue: string | number,
  parsedValue: number,
  unit: string,
  isDecimal: boolean
): string {
  if (isDecimal) {
    const scaleFactor = SCALE_FACTORS[unit] || 1;
    const scaledValue = parsedValue * scaleFactor;
    const baseUnit = getBaseUnitForDisplayUnit(unit);
    return `⚠️ Unit conversion notice: '${originalValue}' ${unit} will be stored as ${scaledValue.toFixed(0)} ${baseUnit} (Unit-Safe BigInt). Decimals are preserved; values remain editable.`;
  }
  return `✓ Value '${originalValue}' interpreted as ${parsedValue} ${unit}.`;
}

/**
 * Get base unit for a display unit
 */
function getBaseUnitForDisplayUnit(displayUnit: string): string {
  if (displayUnit === 'm' || displayUnit === 'ft') return 'cm';
  if (displayUnit === 'm2' || displayUnit === 'ft2' || displayUnit === 'acre') return 'cm2';
  if (displayUnit.includes('INR')) return 'paise';
  return displayUnit;
}

/**
 * Detect if a value is a decimal (float)
 */
export function isDecimalValue(value: number): boolean {
  return value % 1 !== 0;
}

/**
 * Get available units for a unit type
 */
export function getUnitsForType(unitType: UnitType): readonly string[] {
  return UNITS[unitType];
}

/**
 * Validate and parse a property JSON with unit metadata
 */
export function validatePropertyWithUnits(propertyJson: any): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required fields
  if (!propertyJson.id) errors.push('Missing required field: id');
  if (!propertyJson.name) errors.push('Missing required field: name');
  if (!propertyJson.location) errors.push('Missing required field: location');

  // Validate price (can be number or DisplayUnitValue)
  if (typeof propertyJson.price === 'undefined') {
    errors.push('Missing required field: price');
  } else if (typeof propertyJson.price === 'object') {
    if (typeof propertyJson.price.value !== 'number') {
      errors.push('price.value must be a number, not an object or BigInt');
    }
    if (!propertyJson.price.unit) {
      errors.push('price.unit is required when price is an object');
    }
  } else if (typeof propertyJson.price !== 'number') {
    errors.push('price must be a number or DisplayUnitValue object with numeric value');
  }

  // Validate area if present
  if (propertyJson.area) {
    if (typeof propertyJson.area === 'object') {
      if (typeof propertyJson.area.value !== 'number') {
        errors.push('area.value must be a number (not an object or BigInt)');
      } else {
        if (!isValidUnit(propertyJson.area.unit, 'area')) {
          warnings.push(`area.unit '${propertyJson.area.unit}' is not a standard area unit`);
        }
        const scaleFactor = SCALE_FACTORS[propertyJson.area.unit] || 1;
        const scaledValue = propertyJson.area.value * scaleFactor;
        warnings.push(`area: ${propertyJson.area.value} ${propertyJson.area.unit} → ${scaledValue.toFixed(0)} ${getBaseUnitForDisplayUnit(propertyJson.area.unit)} (Unit-Safe storage)`);
      }
    } else {
      errors.push('area must be a DisplayUnitValue object with { value: number, unit: string }');
    }
  }

  // Validate elevation if present
  if (propertyJson.elevation) {
    if (typeof propertyJson.elevation === 'object') {
      if (typeof propertyJson.elevation.value !== 'number') {
        errors.push('elevation.value must be a number (not an object or BigInt)');
      } else {
        if (!isValidUnit(propertyJson.elevation.unit, 'length')) {
          warnings.push(`elevation.unit '${propertyJson.elevation.unit}' is not a standard length unit`);
        }
        const scaleFactor = SCALE_FACTORS[propertyJson.elevation.unit] || 1;
        const scaledValue = propertyJson.elevation.value * scaleFactor;
        warnings.push(`elevation: ${propertyJson.elevation.value} ${propertyJson.elevation.unit} → ${scaledValue.toFixed(0)} ${getBaseUnitForDisplayUnit(propertyJson.elevation.unit)} (Unit-Safe storage)`);
      }
    } else {
      errors.push('elevation must be a DisplayUnitValue object with { value: number, unit: string }');
    }
  }

  // Validate pricePerUnit if present
  if (propertyJson.pricePerUnit) {
    if (typeof propertyJson.pricePerUnit === 'object') {
      if (typeof propertyJson.pricePerUnit.value !== 'number') {
        errors.push('pricePerUnit.value must be a number (not an object or BigInt)');
      } else {
        const scaleFactor = SCALE_FACTORS[propertyJson.pricePerUnit.unit] || 1;
        const scaledValue = propertyJson.pricePerUnit.value * scaleFactor;
        warnings.push(`pricePerUnit: ${propertyJson.pricePerUnit.value} ${propertyJson.pricePerUnit.unit} → ${scaledValue.toFixed(0)} ${getBaseUnitForDisplayUnit(propertyJson.pricePerUnit.unit)} (Unit-Safe storage)`);
      }
    } else {
      errors.push('pricePerUnit must be a DisplayUnitValue object with { value: number, unit: string }');
    }
  }

  // Validate latitude and longitude (now UnitValue in backend, but keep supporting number in JSON for convenience)
  if (typeof propertyJson.latitude !== 'undefined' && typeof propertyJson.latitude !== 'number' && typeof propertyJson.latitude !== 'object') {
    errors.push('latitude must be a number or DisplayUnitValue');
  }
  if (typeof propertyJson.longitude !== 'undefined' && typeof propertyJson.longitude !== 'number' && typeof propertyJson.longitude !== 'object') {
    errors.push('longitude must be a number or DisplayUnitValue');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get unit type from unit string
 */
export function getUnitType(unit: string): UnitType | null {
  if (UNITS.length.includes(unit as any)) return 'length';
  if (UNITS.area.includes(unit as any)) return 'area';
  if (UNITS.price.includes(unit as any)) return 'price';
  return null;
}

