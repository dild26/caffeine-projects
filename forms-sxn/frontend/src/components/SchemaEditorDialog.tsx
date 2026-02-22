import { useState } from 'react';
import { useCreateFormSchema } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { FormSchema } from '../backend';
import { normalizeFormSchema, validateSchemaStructure, convertFormIoSchema } from '../lib/schemaUtils';

interface SchemaEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSchema?: string;
  isFormIoSchema?: boolean;
}

const exampleSchema = {
  id: 'contact-form',
  name: 'Contact Form',
  description: 'A simple contact form with name, email, and message',
  fields: [
    {
      id: 'name',
      fieldLabel: 'Full Name',
      fieldType: 'text',
      required: true,
      helpText: 'Enter your full name',
    },
    {
      id: 'email',
      fieldLabel: 'Email Address',
      fieldType: 'email',
      required: true,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    },
    {
      id: 'message',
      fieldLabel: 'Message',
      fieldType: 'text',
      required: true,
    },
  ],
  validations: [
    {
      fieldId: 'name',
      ruleType: { required: null },
      message: 'Name is required',
    },
    {
      fieldId: 'email',
      ruleType: { required: null },
      message: 'Email is required',
    },
  ],
  calculations: [],
  visibilityRules: [],
};

export default function SchemaEditorDialog({ 
  open, 
  onOpenChange, 
  initialSchema,
  isFormIoSchema = false 
}: SchemaEditorDialogProps) {
  const [schemaJson, setSchemaJson] = useState(initialSchema || JSON.stringify(exampleSchema, null, 2));
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { mutate: createSchema, isPending } = useCreateFormSchema();
  const { identity } = useInternetIdentity();

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(schemaJson);
      
      let schemaToValidate = parsed;
      
      // If it's a Form.io schema, try to convert it first
      if (isFormIoSchema) {
        try {
          schemaToValidate = convertFormIoSchema(parsed);
          setSchemaJson(JSON.stringify(schemaToValidate, null, 2));
          toast.success('Form.io schema converted successfully');
        } catch (error: any) {
          setValidationErrors([error.message || 'Failed to convert Form.io schema']);
          return;
        }
      }

      // Normalize the schema to ensure all arrays are present
      const normalized = normalizeFormSchema(schemaToValidate);
      
      // Validate structure
      const errors = validateSchemaStructure(normalized);
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        toast.error('Schema validation failed');
      } else {
        setValidationErrors([]);
        setSchemaJson(JSON.stringify(normalized, null, 2));
        toast.success('Schema is valid!');
      }
    } catch (error: any) {
      setValidationErrors([`Invalid JSON: ${error.message}`]);
      toast.error('Invalid JSON format');
    }
  };

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(schemaJson);

      if (!identity) {
        toast.error('Not authenticated');
        return;
      }

      // Normalize the schema before validation
      let normalizedSchema = normalizeFormSchema(parsed);

      // If it's a Form.io schema, convert it
      if (isFormIoSchema) {
        try {
          normalizedSchema = convertFormIoSchema(parsed);
        } catch (error: any) {
          toast.error(`Conversion failed: ${error.message}`);
          return;
        }
      }

      // Validate structure
      const errors = validateSchemaStructure(normalizedSchema);
      if (errors.length > 0) {
        setValidationErrors(errors);
        toast.error('Please fix validation errors before submitting');
        return;
      }

      const schema: FormSchema = {
        ...normalizedSchema,
        id: normalizedSchema.id!,
        name: normalizedSchema.name!,
        description: normalizedSchema.description!,
        fields: normalizedSchema.fields!.map(f => ({
          ...f,
          id: f.id!,
          fieldLabel: f.fieldLabel!,
          fieldType: f.fieldType as any,
          required: f.required ?? false,
        })),
        validations: normalizedSchema.validations!.map(v => ({
          ...v,
          fieldId: v.fieldId!,
          ruleType: v.ruleType as any,
          message: v.message!,
        })),
        calculations: normalizedSchema.calculations!.map(c => ({
          ...c,
          fieldId: c.fieldId!,
          formula: c.formula!,
          dependencies: c.dependencies!,
          resultType: c.resultType as any,
        })),
        visibilityRules: normalizedSchema.visibilityRules!.map(vr => ({
          ...vr,
          fieldId: vr.fieldId!,
          condition: vr.condition!,
          dependencies: vr.dependencies!,
        })),
        createdBy: identity.getPrincipal(),
        createdAt: BigInt(Date.now() * 1000000),
      };

      createSchema(schema, {
        onSuccess: () => {
          onOpenChange(false);
          setSchemaJson(JSON.stringify(exampleSchema, null, 2));
          setValidationErrors([]);
        },
        onError: (error: any) => {
          toast.error(`Failed to create schema: ${error.message}`);
        },
      });
    } catch (error: any) {
      toast.error(`Invalid JSON format: ${error.message}`);
      setValidationErrors([`JSON Parse Error: ${error.message}`]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isFormIoSchema ? 'Import Form.io Schema' : 'Create Form Schema'}
          </DialogTitle>
          <DialogDescription>
            {isFormIoSchema 
              ? 'Review and import the Form.io schema. It will be converted to our internal format.'
              : 'Define your form schema in JSON format'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">Validation Errors:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validationErrors.length === 0 && schemaJson !== JSON.stringify(exampleSchema, null, 2) && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Schema structure looks good! Click "Create Schema" to save.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="schema-json" className="font-bold">
              Schema JSON
            </Label>
            <Textarea
              id="schema-json"
              value={schemaJson}
              onChange={(e) => {
                setSchemaJson(e.target.value);
                setValidationErrors([]);
              }}
              className="font-mono text-sm min-h-[400px]"
              placeholder="Enter schema JSON..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleValidate}>
              Validate Schema
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || validationErrors.length > 0}>
              {isPending ? 'Creating...' : 'Create Schema'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
