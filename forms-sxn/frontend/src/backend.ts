export type Principal = {
    toText(): string;
};

export type UserProfile = {
    name: string;
    email: string;
    organization: string | null;
    role: string;
};

// FieldType as a Value Object (acting like an Enum)
export const FieldType = {
    text: 'text',
    number_: 'number', // Mapped to 'number' to handle the usage in DynamicForm.tsx
    email: 'email',
    checkbox: 'checkbox',
    radio: 'radio',
    toggle: 'toggle',
    select: 'select',
    array: 'array'
} as const;

export type FieldType = typeof FieldType[keyof typeof FieldType];

export type FormSchema = {
    id: string;
    name: string;
    description: string;
    fields: FormField[];
    validations: ValidationRule[];
    calculations: CalculationRule[];
    visibilityRules: VisibilityRule[];
    createdBy: Principal;
    createdAt: bigint;
};

export type FormField = {
    id: string;
    fieldLabel: string;
    fieldType: FieldType;
    helpText: string | null;
    defaultValue: FieldValue | null;
    options: FieldOption[] | null;
    arrayCount: bigint | null;
    required: boolean;
    pattern: string | null;
    min: number | null;
    max: number | null;
    enumValues: string[] | null;
    units: string | null;
    rounding: bigint | null;
};

// FieldValue with __kind__ discriminator as expected by DynamicForm.tsx
export type FieldValue =
    | { __kind__: 'text'; text: string }
    | { __kind__: 'number'; number: number }
    | { __kind__: 'boolean'; boolean: boolean }
    | { __kind__: 'array'; array: FieldValue[] };

export type FieldOption = {
    value: string;
    optionLabel: string;
};

export type ValidationRule = {
    fieldId: string;
    ruleType: ValidationRuleType;
    message: string;
};

export type ValidationRuleType =
    | { required: null }
    | { pattern: string }
    | { min: number }
    | { max: number }
    | { enum: string[] }
    | { unique: null }
    | { crossField: CrossFieldValidation };

export type CrossFieldValidation = {
    fieldIds: string[];
    validationType: string;
};

export type CalculationRule = {
    fieldId: string;
    formula: string;
    dependencies: string[];
    resultType: FieldType;
    units: string | null;
    rounding: bigint | null;
};

export type VisibilityRule = {
    fieldId: string;
    condition: string;
    dependencies: string[];
};

export type FormSubmission = {
    id: string;
    schemaId: string;
    values: FieldValueEntry[];
    manifestHash: Uint8Array;
    merkleRoot: Uint8Array;
    nonces: FieldNonce[];
    timestamp: bigint;
    user: Principal;
    signature: Uint8Array;
    adminCounterSign: Uint8Array | null;
    merkleProofs: MerkleProof[];
};

export type FieldValueEntry = {
    fieldId: string;
    value: FieldValue;
    nonce: Uint8Array;
};

export type FieldNonce = {
    fieldId: string;
    nonce: Uint8Array;
};

export type MerkleProof = {
    fieldId: string;
    proofPath: Uint8Array[];
    root: Uint8Array;
};

export type AuditLogEntry = {
    id: bigint;
    timestamp: bigint;
    eventType: string;
    targetId: string;
    user: Principal;
};

export type ThemePreference =
    | { light: null }
    | { dark: null }
    | { vibgyor: null };

export type TabState = {
    id: string;
    tabLabel: string;
    contentId: string;
    isActive: boolean;
    createdAt: bigint;
    updatedAt: bigint;
};

export interface BackendActor {
    initializeAccessControl: () => Promise<void>;
    getCallerUserRole: () => Promise<any>;
    isCallerAdmin: () => Promise<boolean>;
    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    getAllFormSchemas: () => Promise<FormSchema[]>;
    getFormSchema: (id: string) => Promise<FormSchema | null>;
    createFormSchema: (schema: FormSchema) => Promise<void>;
    updateFormSchema: (schema: FormSchema) => Promise<void>;
    deleteFormSchema: (id: string) => Promise<void>;
    submitForm: (submission: FormSubmission) => Promise<void>;
    getAllFormSubmissions: () => Promise<FormSubmission[]>;
    getFormSubmission: (id: string) => Promise<FormSubmission | null>;
    getAuditLogs: () => Promise<AuditLogEntry[]>;
    importJsonSchema: (url: string) => Promise<string>;
}
