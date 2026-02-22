export type UnitType = 'currency' | 'time' | 'count';

export interface DisplayUnitValue {
    value: number;
    unit: string;
}

export interface BackendUnitValue {
    value: bigint;
    unit: string;
    scale: bigint;
    editableBy: string[];
}

const SCALE_FACTORS: Record<string, number> = {
    'INR': 1,
    'USD': 1,
    'INR/USD': 1,
};

const DEFAULT_SCALES: Record<UnitType, bigint> = {
    currency: 0n,
    time: 0n,
    count: 0n,
};

const BASE_UNITS: Record<UnitType, string> = {
    currency: 'INR',
    time: 's',
    count: 'pcs',
};

export function toBackendUnitValue(unitValue: DisplayUnitValue, unitType: UnitType): BackendUnitValue {
    const scaleFactor = SCALE_FACTORS[unitValue.unit] || 1;
    const scale = DEFAULT_SCALES[unitType];

    const scaledValue = BigInt(Math.round(unitValue.value * scaleFactor));

    return {
        value: scaledValue,
        unit: unitValue.unit,
        scale: scale,
        editableBy: ['Admin'],
    };
}

export function fromBackendUnitValue(backendValue: BackendUnitValue): DisplayUnitValue {
    const scaleFactor = SCALE_FACTORS[backendValue.unit] || 1;
    const numericValue = Number(backendValue.value) / scaleFactor;

    return {
        value: numericValue,
        unit: backendValue.unit,
    };
}

export function formatUnitValue(backendValue: BackendUnitValue): string {
    if (!backendValue) return 'N/A';
    const display = fromBackendUnitValue(backendValue);
    return `${display.value.toLocaleString()} ${display.unit}`;
}
