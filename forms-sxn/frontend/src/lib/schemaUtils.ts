import type { FormSchema, FormField, ValidationRule, CalculationRule, VisibilityRule, FieldType, ValidationRuleType } from '../backend';

/**
 * Normalizes a form schema to ensure all required arrays are present and valid.
 * This prevents runtime errors when working with imported or incomplete schemas.
 */
export function normalizeFormSchema(schema: Partial<FormSchema>): Partial<FormSchema> {
  return {
    ...schema,
    fields: normalizeArray(schema.fields).map(normalizeFormField) as any,
    validations: normalizeArray(schema.validations) as any,
    calculations: normalizeArray(schema.calculations) as any,
    visibilityRules: normalizeArray(schema.visibilityRules) as any,
  };
}

/**
 * Normalizes a form field to ensure all required arrays are present.
 */
export function normalizeFormField(field: Partial<FormField>): Partial<FormField> {
  return {
    ...field,
    options: field.options ? normalizeArray(field.options) : undefined,
    enumValues: field.enumValues ? normalizeArray(field.enumValues) : undefined,
  };
}

/**
 * Ensures a value is an array. If undefined, null, or not an array, returns empty array.
 */
export function normalizeArray<T>(value: T[] | undefined | null): T[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    console.warn('Expected array but got:', typeof value, value);
    return [];
  }
  return value;
}

/**
 * Validates that a schema has the minimum required structure.
 * Returns an array of error messages, or empty array if valid.
 */
export function validateSchemaStructure(schema: any): string[] {
  const errors: string[] = [];

  if (!schema || typeof schema !== 'object') {
    errors.push('Schema must be an object');
    return errors;
  }

  if (!schema.id || typeof schema.id !== 'string') {
    errors.push('Schema must have a valid "id" string');
  }

  if (!schema.name || typeof schema.name !== 'string') {
    errors.push('Schema must have a valid "name" string');
  }

  if (!schema.description || typeof schema.description !== 'string') {
    errors.push('Schema must have a valid "description" string');
  }

  if (!schema.fields) {
    errors.push('Schema must have a "fields" array');
  } else if (!Array.isArray(schema.fields)) {
    errors.push('"fields" must be an array');
  } else if (schema.fields.length === 0) {
    errors.push('Schema must have at least one field');
  } else {
    // Validate each field
    schema.fields.forEach((field: any, index: number) => {
      if (!field || typeof field !== 'object') {
        errors.push(`Field at index ${index} must be an object`);
        return;
      }
      if (!field.id || typeof field.id !== 'string') {
        errors.push(`Field at index ${index} must have a valid "id" string`);
      }
      if (!field.fieldLabel || typeof field.fieldLabel !== 'string') {
        errors.push(`Field at index ${index} must have a valid "fieldLabel" string`);
      }
      if (!field.fieldType || typeof field.fieldType !== 'string') {
        errors.push(`Field at index ${index} must have a valid "fieldType" string`);
      }
    });
  }

  return errors;
}

/**
 * Attempts to convert a Form.io schema to our internal schema format.
 * Returns normalized schema or throws error with details.
 */
export function convertFormIoSchema(formIoSchema: any): Partial<FormSchema> {
  if (!formIoSchema || typeof formIoSchema !== 'object') {
    throw new Error('Invalid Form.io schema: must be an object');
  }

  // Extract basic info
  const id = formIoSchema.name || formIoSchema.path || `imported-${Date.now()}`;
  const name = formIoSchema.title || formIoSchema.name || 'Imported Form';
  const description = formIoSchema.display || 'Imported from Form.io';

  // Convert components to fields
  const components = normalizeArray(formIoSchema.components);
  const fields: any[] = [];
  const validations: any[] = [];

  components.forEach((component: any) => {
    if (!component || typeof component !== 'object') return;

    const field: any = {
      id: component.key || `field-${fields.length}`,
      fieldLabel: component.label || component.key || 'Untitled Field',
      fieldType: mapFormIoType(component.type),
      helpText: component.description || component.tooltip || undefined,
      required: component.validate?.required || false,
      pattern: component.validate?.pattern || undefined,
      min: component.validate?.min !== undefined ? Number(component.validate.min) : undefined,
      max: component.validate?.max !== undefined ? Number(component.validate.max) : undefined,
    };

    // Handle options for select/radio fields
    if (component.values && Array.isArray(component.values)) {
      field.options = component.values.map((v: any) => ({
        value: v.value || v.label || String(v),
        optionLabel: v.label || v.value || String(v),
      }));
    } else if (component.data && component.data.values && Array.isArray(component.data.values)) {
      field.options = component.data.values.map((v: any) => ({
        value: v.value || v.label || String(v),
        optionLabel: v.label || v.value || String(v),
      }));
    }

    fields.push(field);

    // Add validation rules
    if (component.validate?.required) {
      validations.push({
        fieldId: field.id,
        ruleType: { __kind__: 'required', required: null } as ValidationRuleType,
        message: `${field.fieldLabel} is required`,
      });
    }
  });

  return {
    id,
    name,
    description,
    fields: fields as any,
    validations: validations as any,
    calculations: [] as any,
    visibilityRules: [] as any,
  };
}

/**
 * Maps Form.io component types to our internal field types.
 */
function mapFormIoType(formIoType: string): FieldType {
  const typeMap: { [key: string]: FieldType } = {
    textfield: 'text' as FieldType,
    textarea: 'text' as FieldType,
    email: 'email' as FieldType,
    number: 'number' as FieldType,
    checkbox: 'checkbox' as FieldType,
    radio: 'radio' as FieldType,
    select: 'select' as FieldType,
    selectboxes: 'checkbox' as FieldType,
    button: 'text' as FieldType,
    content: 'text' as FieldType,
    htmlelement: 'text' as FieldType,
  };

  return typeMap[formIoType] || ('text' as FieldType);
}
