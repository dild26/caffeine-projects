import { useState, useEffect } from 'react';
import { useSubmitForm } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Send } from 'lucide-react';
import type { FormSchema, FieldValue, FormSubmission, FieldValueEntry } from '../backend';
import { FieldType } from '../backend';
import { generateMerkleTree, generateNonce, hashData } from '../lib/crypto';
import { normalizeArray } from '../lib/schemaUtils';

interface DynamicFormProps {
  schema: FormSchema;
}

interface FormValues {
  [fieldId: string]: FieldValue;
}

interface FormErrors {
  [fieldId: string]: string;
}

export default function DynamicForm({ schema }: DynamicFormProps) {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [calculations, setCalculations] = useState<{ [fieldId: string]: number }>({});
  const { mutate: submitForm, isPending } = useSubmitForm();
  const { identity } = useInternetIdentity();

  // Normalize schema arrays to prevent runtime errors
  const fields = normalizeArray(schema.fields);
  const validations = normalizeArray(schema.validations);
  const calculations_rules = normalizeArray(schema.calculations);
  const visibilityRules = normalizeArray(schema.visibilityRules);

  useEffect(() => {
    const initialValues: FormValues = {};
    fields.forEach((field) => {
      if (field.defaultValue) {
        initialValues[field.id] = field.defaultValue;
      } else if (field.fieldType === FieldType.checkbox || field.fieldType === FieldType.toggle) {
        initialValues[field.id] = { __kind__: 'boolean', boolean: false };
      } else if (field.fieldType === FieldType.number_) {
        initialValues[field.id] = { __kind__: 'number', number: 0 };
      } else {
        initialValues[field.id] = { __kind__: 'text', text: '' };
      }
    });
    setValues(initialValues);
  }, [schema]);

  useEffect(() => {
    const newCalculations: { [fieldId: string]: number } = {};
    calculations_rules.forEach((calc) => {
      try {
        const result = evaluateFormula(calc.formula, normalizeArray(calc.dependencies), values);
        if (typeof result === 'number') {
          newCalculations[calc.fieldId] = calc.rounding
            ? Number(result.toFixed(Number(calc.rounding)))
            : result;
        }
      } catch (error) {
        console.error(`Calculation error for ${calc.fieldId}:`, error);
      }
    });
    setCalculations(newCalculations);
  }, [values, calculations_rules]);

  const evaluateFormula = (formula: string, dependencies: string[], formValues: FormValues): number => {
    const context: { [key: string]: number } = {};
    dependencies.forEach((dep) => {
      const value = formValues[dep];
      if (value && value.__kind__ === 'number') {
        context[dep] = value.number;
      }
    });

    try {
      const func = new Function(...Object.keys(context), `return ${formula}`);
      return func(...Object.values(context));
    } catch {
      return 0;
    }
  };

  const isFieldVisible = (fieldId: string): boolean => {
    const rule = visibilityRules.find((r) => r.fieldId === fieldId);
    if (!rule) return true;

    try {
      const context: { [key: string]: any } = {};
      const dependencies = normalizeArray(rule.dependencies);
      dependencies.forEach((dep) => {
        const value = values[dep];
        if (value) {
          if (value.__kind__ === 'boolean') context[dep] = value.boolean;
          else if (value.__kind__ === 'number') context[dep] = value.number;
          else if (value.__kind__ === 'text') context[dep] = value.text;
        }
      });

      const func = new Function(...Object.keys(context), `return ${rule.condition}`);
      return func(...Object.values(context));
    } catch {
      return true;
    }
  };

  const validateField = (fieldId: string, value: FieldValue): string | null => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return null;

    const fieldValidations = validations.filter((v) => v.fieldId === fieldId);

    for (const validation of fieldValidations) {
      const ruleType = validation.ruleType;

      if ('required' in ruleType && ruleType.required !== undefined) {
        if (value.__kind__ === 'text' && !value.text.trim()) {
          return validation.message;
        }
        if (value.__kind__ === 'boolean' && !value.boolean) {
          return validation.message;
        }
      }

      if ('pattern' in ruleType && value.__kind__ === 'text') {
        const regex = new RegExp(ruleType.pattern);
        if (!regex.test(value.text)) {
          return validation.message;
        }
      }

      if ('min' in ruleType && value.__kind__ === 'number') {
        if (value.number < ruleType.min) {
          return validation.message;
        }
      }

      if ('max' in ruleType && value.__kind__ === 'number') {
        if (value.number > ruleType.max) {
          return validation.message;
        }
      }

      if ('enum' in ruleType && value.__kind__ === 'text') {
        if (!ruleType.enum.includes(value.text)) {
          return validation.message;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    fields.forEach((field) => {
      if (isFieldVisible(field.id)) {
        const error = validateField(field.id, values[field.id]);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!identity) return;

    const fieldEntries: FieldValueEntry[] = [];
    const nonces: { fieldId: string; nonce: Uint8Array }[] = [];

    for (const field of fields) {
      if (isFieldVisible(field.id)) {
        const nonce = generateNonce(field.id);
        fieldEntries.push({
          fieldId: field.id,
          value: values[field.id],
          nonce,
        });
        nonces.push({ fieldId: field.id, nonce });
      }
    }

    const manifestHash = hashData(JSON.stringify(schema));
    const { root, proofs } = generateMerkleTree(fieldEntries);

    const submission: FormSubmission = {
      id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      schemaId: schema.id,
      values: fieldEntries,
      manifestHash,
      merkleRoot: root,
      nonces,
      timestamp: BigInt(Date.now() * 1000000),
      user: identity.getPrincipal(),
      signature: new Uint8Array(32),
      merkleProofs: proofs,
    };

    submitForm(submission);
  };

  const renderField = (field: typeof fields[0]) => {
    if (!isFieldVisible(field.id)) return null;

    const value = values[field.id];
    const error = errors[field.id];
    const calculation = calculations[field.id];

    const fieldId = `field-${field.id}`;
    const errorId = `${fieldId}-error`;

    // Normalize field options to prevent runtime errors
    const fieldOptions = normalizeArray(field.options);

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={fieldId} className="font-bold">
          {field.fieldLabel}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>

        {field.helpText && <p className="text-sm text-muted-foreground font-bold">{field.helpText}</p>}

        {field.fieldType === FieldType.text && (
          <Input
            id={fieldId}
            value={value?.__kind__ === 'text' ? value.text : ''}
            onChange={(e) => {
              setValues({ ...values, [field.id]: { __kind__: 'text', text: e.target.value } });
              setErrors({ ...errors, [field.id]: '' });
            }}
            aria-required={field.required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
        )}

        {field.fieldType === FieldType.email && (
          <Input
            id={fieldId}
            type="email"
            value={value?.__kind__ === 'text' ? value.text : ''}
            onChange={(e) => {
              setValues({ ...values, [field.id]: { __kind__: 'text', text: e.target.value } });
              setErrors({ ...errors, [field.id]: '' });
            }}
            aria-required={field.required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
        )}

        {field.fieldType === FieldType.number_ && (
          <div className="space-y-2">
            <Input
              id={fieldId}
              type="number"
              step="any"
              value={value?.__kind__ === 'number' ? value.number : 0}
              onChange={(e) => {
                setValues({ ...values, [field.id]: { __kind__: 'number', number: parseFloat(e.target.value) || 0 } });
                setErrors({ ...errors, [field.id]: '' });
              }}
              aria-required={field.required}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
            {field.units && <p className="text-sm text-muted-foreground">Units: {field.units}</p>}
          </div>
        )}

        {field.fieldType === FieldType.checkbox && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={value?.__kind__ === 'boolean' ? value.boolean : false}
              onCheckedChange={(checked) => {
                setValues({ ...values, [field.id]: { __kind__: 'boolean', boolean: !!checked } });
                setErrors({ ...errors, [field.id]: '' });
              }}
              aria-required={field.required}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
            <Label htmlFor={fieldId} className="font-normal cursor-pointer">
              {field.fieldLabel}
            </Label>
          </div>
        )}

        {field.fieldType === FieldType.toggle && (
          <div className="flex items-center space-x-2">
            <Switch
              id={fieldId}
              checked={value?.__kind__ === 'boolean' ? value.boolean : false}
              onCheckedChange={(checked) => {
                setValues({ ...values, [field.id]: { __kind__: 'boolean', boolean: checked } });
                setErrors({ ...errors, [field.id]: '' });
              }}
              aria-required={field.required}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
            <Label htmlFor={fieldId} className="font-normal cursor-pointer">
              {field.fieldLabel}
            </Label>
          </div>
        )}

        {field.fieldType === FieldType.radio && fieldOptions.length > 0 && (
          <RadioGroup
            value={value?.__kind__ === 'text' ? value.text : ''}
            onValueChange={(val) => {
              setValues({ ...values, [field.id]: { __kind__: 'text', text: val } });
              setErrors({ ...errors, [field.id]: '' });
            }}
          >
            {fieldOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${fieldId}-${option.value}`} />
                <Label htmlFor={`${fieldId}-${option.value}`} className="font-normal cursor-pointer">
                  {option.optionLabel}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {field.fieldType === FieldType.select && fieldOptions.length > 0 && (
          <Select
            value={value?.__kind__ === 'text' ? value.text : ''}
            onValueChange={(val) => {
              setValues({ ...values, [field.id]: { __kind__: 'text', text: val } });
              setErrors({ ...errors, [field.id]: '' });
            }}
          >
            <SelectTrigger id={fieldId}>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {fieldOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.optionLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {calculation !== undefined && (
          <div className="p-3 bg-accent/50 rounded-md">
            <p className="text-sm font-bold">
              Calculated: {calculation}
              {field.units && ` ${field.units}`}
            </p>
          </div>
        )}

        {error && (
          <Alert variant="destructive" id={errorId} role="alert" aria-live="polite">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{schema.name}</CardTitle>
        <CardDescription>{schema.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map(renderField)}

          <Button type="submit" disabled={isPending} className="w-full gap-2">
            <Send className="h-4 w-4" />
            {isPending ? 'Submitting...' : 'Submit Form'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
