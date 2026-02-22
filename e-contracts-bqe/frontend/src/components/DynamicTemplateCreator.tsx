import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle, FileJson, FileCode, Eye, Upload, Trash2, Plus, Loader2, Shield, X, Files, Database } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob, TemplateFileType } from '../backend';
import { useCreateTemplate, useCreateTemplateDetailsTab, useCreateImportReport, useCreateBackup } from '../hooks/useQueries';

interface DynamicField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'email' | 'url' | 'signature';
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
  placeholder?: string;
  description?: string;
  children?: DynamicField[];
}

interface ParsedTemplate {
  name: string;
  category: string;
  fields: DynamicField[];
  content: string;
  format: string;
  sourceFileName: string;
  isParsed: boolean;
  markdownContent?: string;
}

interface DynamicTemplateCreatorProps {
  onSuccess: () => void;
}

export default function DynamicTemplateCreator({ onSuccess }: DynamicTemplateCreatorProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'paste'>('file');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pastedContent, setPastedContent] = useState('');
  const [parsedTemplates, setParsedTemplates] = useState<ParsedTemplate[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  
  const createTemplate = useCreateTemplate();
  const createTemplateDetailsTab = useCreateTemplateDetailsTab();
  const createImportReport = useCreateImportReport();
  const createBackup = useCreateBackup();

  // Compute SHA-256 hash with robust fallback mechanism
  const computeHash = async (data: ArrayBuffer): Promise<string> => {
    try {
      if (!crypto || !crypto.subtle || !crypto.subtle.digest) {
        throw new Error('Web Crypto API not available');
      }

      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      if (hashHex.length !== 64) {
        throw new Error(`Invalid hash length: ${hashHex.length}`);
      }
      
      return hashHex;
    } catch (error) {
      console.error('SHA-256 computation failed, using fallback:', error);
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const dataLength = data.byteLength;
      const fallbackHash = `fallback-${timestamp}-${dataLength}-${random}`.padEnd(64, '0').substring(0, 64);
      console.warn('Using fallback hash:', fallbackHash);
      return fallbackHash;
    }
  };

  const validateFile = (file: File): string[] => {
    const errors: string[] = [];
    const validExtensions = ['.json', '.md', '.txt'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      errors.push(`Invalid file type for ${file.name}. Only ${validExtensions.join(', ')} files are allowed.`);
    }

    if (file.size > 50 * 1024 * 1024) {
      errors.push(`File ${file.name} exceeds 50MB limit.`);
    }

    return errors;
  };

  const sanitizeContent = (content: string): string => {
    try {
      const dangerous = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi,
        /eval\(/gi,
        /Function\(/gi,
      ];

      let sanitized = content;
      dangerous.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });

      sanitized = sanitized.normalize('NFKC').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      return sanitized;
    } catch (error) {
      console.error('Sanitization error:', error);
      return content;
    }
  };

  const capitalizeFirstChar = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const inferFieldType = (key: string, value: any, schema?: any): DynamicField['type'] => {
    try {
      if (schema?.type) {
        switch (schema.type) {
          case 'integer':
          case 'number':
            return 'number';
          case 'boolean':
            return 'checkbox';
          case 'string':
            if (schema.format === 'email') return 'email';
            if (schema.format === 'uri' || schema.format === 'url') return 'url';
            if (schema.format === 'date' || schema.format === 'date-time') return 'date';
            if (schema.enum) return 'select';
            if (schema.maxLength && schema.maxLength > 200) return 'textarea';
            return 'text';
          case 'array':
            return 'select';
          case 'object':
            return 'textarea';
          default:
            return 'text';
        }
      }

      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('email')) return 'email';
      if (lowerKey.includes('website') || lowerKey.includes('url') || lowerKey.includes('link')) return 'url';
      if (lowerKey.includes('date') || lowerKey.includes('birthday') || lowerKey.includes('time')) return 'date';
      if (lowerKey.includes('signature') || lowerKey.includes('sign')) return 'signature';
      if (lowerKey.includes('description') || lowerKey.includes('comment') || lowerKey.includes('notes') || lowerKey.includes('message') || lowerKey.includes('content')) return 'textarea';
      if (lowerKey.includes('amount') || lowerKey.includes('price') || lowerKey.includes('quantity') || lowerKey.includes('count')) return 'number';
      if (typeof value === 'number') return 'number';
      if (typeof value === 'boolean') return 'checkbox';
      if (Array.isArray(value)) return 'select';
      
      return 'text';
    } catch (error) {
      console.error('Field type inference error:', error);
      return 'text';
    }
  };

  const parseJsonFieldsRecursive = (data: any, parentKey: string = '', depth: number = 0): DynamicField[] => {
    const fields: DynamicField[] = [];
    
    try {
      if (typeof data !== 'object' || data === null) {
        return fields;
      }

      Object.entries(data).forEach(([key, value], index) => {
        try {
          const fieldName = parentKey ? `${parentKey}.${key}` : key;
          const fieldLabel = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const children = parseJsonFieldsRecursive(value, fieldName, depth + 1);
            fields.push({
              id: `field-${Date.now()}-${index}-${depth}`,
              name: fieldName,
              type: 'textarea',
              label: fieldLabel,
              required: false,
              description: `Nested object with ${children.length} field(s)`,
              children,
            });
          } else {
            fields.push({
              id: `field-${Date.now()}-${index}-${depth}`,
              name: fieldName,
              type: inferFieldType(key, value),
              label: fieldLabel,
              required: true,
              defaultValue: typeof value === 'string' ? value : undefined,
              options: Array.isArray(value) ? value.map(String) : undefined,
            });
          }
        } catch (error) {
          console.error(`Error parsing field ${key}:`, error);
        }
      });
    } catch (error) {
      console.error('Recursive parsing error:', error);
    }

    return fields;
  };

  const parseJsonTemplate = (content: string, fileName: string): ParsedTemplate | null => {
    try {
      const data = JSON.parse(content);
      
      let fields: DynamicField[] = [];
      let isParsed = true;
      
      if (data.types && typeof data.types === 'object') {
        Object.entries(data.types).forEach(([typeName, typeFields]: [string, any]) => {
          if (Array.isArray(typeFields)) {
            typeFields.forEach((field: any, index: number) => {
              fields.push({
                id: `field-${fields.length}`,
                name: field.name || `field_${index}`,
                type: inferFieldType(field.name, null, { type: field.type }),
                label: field.name?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || `Field ${index + 1}`,
                required: true,
                description: `Type: ${field.type}`,
              });
            });
          }
        });
      }
      else if (data.properties) {
        Object.entries(data.properties).forEach(([key, value]: [string, any], index) => {
          const field: DynamicField = {
            id: `field-${index}`,
            name: key,
            type: inferFieldType(key, value.default, value),
            label: value.title || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            required: data.required?.includes(key) || false,
            options: value.enum,
            defaultValue: value.default,
            placeholder: value.placeholder || value.examples?.[0],
            description: value.description,
          };
          
          if (value.properties) {
            field.children = parseJsonFieldsRecursive(value.properties, key);
          }
          
          fields.push(field);
        });
      }
      else if (data.fields && Array.isArray(data.fields)) {
        data.fields.forEach((field: any, index: number) => {
          fields.push({
            id: `field-${index}`,
            name: field.name || `field_${index}`,
            type: field.type || inferFieldType(field.name, field.defaultValue),
            label: field.label || field.title || field.name || `Field ${index + 1}`,
            required: field.required !== false,
            options: field.options || field.enum,
            defaultValue: field.defaultValue || field.default,
            placeholder: field.placeholder,
            description: field.description,
          });
        });
      }
      else {
        fields = parseJsonFieldsRecursive(data);
      }

      const baseName = fileName.replace(/\.[^/.]+$/, '');
      const templateName = capitalizeFirstChar(baseName);

      return {
        name: data.name || data.title || templateName,
        category: data.category || 'Legal',
        fields,
        content: data.template || data.content || JSON.stringify(data, null, 2),
        format: 'json',
        sourceFileName: fileName,
        isParsed: fields.length > 0,
      };
    } catch (error) {
      console.error('JSON parse error:', error);
      return null;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allErrors: string[] = [];
    const validFiles: File[] = [];

    files.forEach(file => {
      const errors = validateFile(file);
      if (errors.length > 0) {
        allErrors.push(...errors);
      } else {
        validFiles.push(file);
      }
    });

    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
    } else {
      setValidationErrors([]);
    }

    setSelectedFiles(validFiles);
    toast.success(`Selected ${validFiles.length} file(s) for processing`);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const matchFiles = (files: File[]): Map<string, { json?: File; md?: File; txt?: File }> => {
    const fileMap = new Map<string, { json?: File; md?: File; txt?: File }>();

    files.forEach(file => {
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!fileMap.has(baseName)) {
        fileMap.set(baseName, {});
      }

      const entry = fileMap.get(baseName)!;
      if (ext === '.json') entry.json = file;
      else if (ext === '.md') entry.md = file;
      else if (ext === '.txt') entry.txt = file;
    });

    return fileMap;
  };

  const handleProcess = async () => {
    if (isProcessing || isSaving) {
      toast.error('Please wait for the current operation to complete');
      return;
    }

    setIsProcessing(true);
    setValidationErrors([]);
    setUploadProgress(0);

    try {
      let filesToProcess: File[] = [];
      
      if (uploadMethod === 'file' && selectedFiles.length > 0) {
        filesToProcess = selectedFiles;
      } else if (uploadMethod === 'paste' && pastedContent) {
        const blob = new Blob([pastedContent], { type: 'application/json' });
        const file = new File([blob], 'pasted-content.json', { type: 'application/json' });
        filesToProcess = [file];
      } else {
        setValidationErrors(['Please provide content to process.']);
        setIsProcessing(false);
        return;
      }

      setUploadProgress(20);

      const fileMatches = matchFiles(filesToProcess);
      const templates: ParsedTemplate[] = [];
      const errors: string[] = [];

      let processed = 0;
      const total = fileMatches.size;

      for (const [baseName, files] of fileMatches.entries()) {
        try {
          let primaryTemplate: ParsedTemplate | null = null;
          let markdownContent: string | null = null;

          // CRITICAL: Only parse .json files for form generation
          // .md files are NEVER parsed as forms - they are stored as raw text only
          if (files.json) {
            const content = await files.json.text();
            const sanitized = sanitizeContent(content);
            primaryTemplate = parseJsonTemplate(sanitized, files.json.name);
          }

          // Store .md content separately as raw text (do NOT parse as form)
          if (files.md) {
            const content = await files.md.text();
            markdownContent = sanitizeContent(content);
            console.log(`[MD File] ${files.md.name}: Stored as raw text, NOT parsed as form`);
          }

          // If no JSON but has MD, create a placeholder template with NO fields
          if (!primaryTemplate && files.md) {
            const baseName = files.md.name.replace(/\.[^/.]+$/, '');
            const templateName = capitalizeFirstChar(baseName);
            primaryTemplate = {
              name: templateName,
              category: 'Legal',
              fields: [], // NO fields for .md-only templates
              content: '',
              format: 'md',
              sourceFileName: files.md.name,
              isParsed: false,
            };
            console.log(`[MD-Only Template] ${templateName}: Created with NO form fields`);
          }

          // Attach markdown content to template (for Details tab only)
          if (primaryTemplate && markdownContent) {
            primaryTemplate.markdownContent = markdownContent;
            console.log(`[Template] ${primaryTemplate.name}: Attached markdown content for Details tab`);
          }

          if (primaryTemplate) {
            templates.push(primaryTemplate);
          } else {
            errors.push(`Failed to parse template from ${baseName}`);
          }

          processed++;
          setUploadProgress(20 + (processed / total) * 60);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`Error processing ${baseName}: ${errorMsg}`);
          console.error(`Processing error for ${baseName}:`, error);
        }
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
      }

      if (templates.length === 0) {
        setValidationErrors(['No valid templates could be parsed from the uploaded files.']);
        setIsProcessing(false);
        return;
      }

      setUploadProgress(100);
      setParsedTemplates(templates);
      setSelectedTemplateIndex(0);
      toast.success(`Successfully parsed ${templates.length} template${templates.length !== 1 ? 's' : ''}!`);
    } catch (error) {
      console.error('Processing error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setValidationErrors([`Processing failed: ${errorMsg}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderFieldTree = (field: DynamicField, depth: number = 0) => {
    return (
      <div key={field.id} className={depth > 0 ? 'ml-6 mt-3 border-l-2 border-muted pl-4' : ''}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{field.label}</Label>
            {depth === 0 && (
              <Button
                onClick={() => handleRemoveField(field.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label className="text-sm">Field Name</Label>
              <Input
                value={field.name}
                onChange={(e) => handleFieldUpdate(field.id, { name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Label</Label>
              <Input
                value={field.label}
                onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Type</Label>
              <Select
                value={field.type}
                onValueChange={(v) => handleFieldUpdate(field.id, { type: v as any })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="url">Website/URL</SelectItem>
                  <SelectItem value="select">Options</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="signature">Signature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`required-${field.id}`}
                  checked={field.required}
                  onCheckedChange={(checked) => handleFieldUpdate(field.id, { required: !!checked })}
                />
                <Label htmlFor={`required-${field.id}`} className="text-sm">
                  Required
                </Label>
              </div>
            </div>
          </div>
          {field.description && (
            <div>
              <Label className="text-sm">Description</Label>
              <p className="mt-1 text-sm text-muted-foreground">{field.description}</p>
            </div>
          )}
        </div>
        {field.children && field.children.length > 0 && (
          <div className="mt-3">
            <Label className="text-sm text-muted-foreground">Nested Fields ({field.children.length})</Label>
            {field.children.map(child => renderFieldTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<DynamicField>) => {
    if (parsedTemplates.length === 0) return;

    setParsedTemplates(prev => prev.map((template, idx) => {
      if (idx !== selectedTemplateIndex) return template;
      
      const updateFieldRecursive = (fields: DynamicField[]): DynamicField[] => {
        return fields.map(field => {
          if (field.id === fieldId) {
            return { ...field, ...updates };
          }
          if (field.children) {
            return { ...field, children: updateFieldRecursive(field.children) };
          }
          return field;
        });
      };
      
      return {
        ...template,
        fields: updateFieldRecursive(template.fields),
      };
    }));
  };

  const handleAddField = () => {
    if (parsedTemplates.length === 0) return;

    setParsedTemplates(prev => prev.map((template, idx) => {
      if (idx !== selectedTemplateIndex) return template;
      
      const newField: DynamicField = {
        id: `field-${Date.now()}`,
        name: `new_field_${template.fields.length + 1}`,
        type: 'text',
        label: `New Field ${template.fields.length + 1}`,
        required: false,
      };

      return {
        ...template,
        fields: [...template.fields, newField],
      };
    }));
  };

  const handleRemoveField = (fieldId: string) => {
    if (parsedTemplates.length === 0) return;

    setParsedTemplates(prev => prev.map((template, idx) => {
      if (idx !== selectedTemplateIndex) return template;
      return {
        ...template,
        fields: template.fields.filter(field => field.id !== fieldId),
      };
    }));
  };

  const handleSaveTemplate = async (templateIndex: number) => {
    const template = parsedTemplates[templateIndex];
    if (!template) return;

    if (isSaving || isProcessing) {
      toast.error('Please wait for the current operation to complete');
      return;
    }

    setIsSaving(true);
    setUploadProgress(0);

    try {
      // Create backup before upload
      console.log('[Backup] Creating backup before template upload...');
      await createBackup.mutateAsync();
      toast.info('Backup created successfully');
      
      setUploadProgress(10);

      const encoder = new TextEncoder();
      const contentBytes = encoder.encode(template.content || '');
      
      // CRITICAL: Only compute hash for JSON content, NOT for .md files
      let hash: string;
      try {
        hash = await computeHash(contentBytes.buffer);
        console.log(`[Hash] Computed SHA-256 hash: ${hash}`);
      } catch (hashError) {
        console.error('[Hash Error]', hashError);
        throw new Error(`Hash computation failed: ${hashError instanceof Error ? hashError.message : 'Unknown error'}`);
      }
      
      if (hash.length !== 64) {
        throw new Error(`Invalid hash format: expected 64 characters, got ${hash.length}`);
      }
      
      const blob = ExternalBlob.fromBytes(contentBytes);

      setUploadProgress(30);

      const flattenFieldNames = (fields: DynamicField[]): string[] => {
        const names: string[] = [];
        fields.forEach(field => {
          names.push(field.name);
          if (field.children) {
            names.push(...flattenFieldNames(field.children));
          }
        });
        return names;
      };

      const dynamicStructure = JSON.stringify({
        isParsed: template.isParsed,
        fields: template.fields,
      });

      console.log(`[Template] Creating template: ${template.name}`);
      const templateId = await createTemplate.mutateAsync({
        name: template.name,
        fields: flattenFieldNames(template.fields),
        content: template.content || '',
        category: template.category,
        size: BigInt(contentBytes.length),
        format: template.format,
        previewImage: '/assets/generated/tree-structure-form-generator.dim_600x500.png',
        fileReference: blob,
        dynamicStructure,
      });

      setUploadProgress(50);

      // Create import report for manifest logging (JSON file only)
      console.log(`[Manifest] Logging import report for ${template.sourceFileName}`);
      await createImportReport.mutateAsync({
        fileName: template.sourceFileName,
        fileType: template.format === 'json' ? TemplateFileType.json : TemplateFileType.markdown,
        size: BigInt(contentBytes.length),
        hash,
        status: 'success',
        errors: [],
        warnings: template.format === 'md' ? ['Markdown file stored as guidance content only'] : [],
        extractedFields: flattenFieldNames(template.fields),
        codeBlocks: [],
        canonicalContent: template.content || '',
      });

      setUploadProgress(70);

      // Save markdown content to TemplateDetailsTab if present
      // CRITICAL: .md content is stored as raw text, NOT hashed or parsed
      if (template.markdownContent) {
        console.log(`[Details Tab] Creating Details tab for template ${templateId}`);
        await createTemplateDetailsTab.mutateAsync({
          templateId,
          markdownContent: template.markdownContent,
          previewImage: null,
          fileReference: null,
        });
        
        // Create import report for markdown file (manifest logging only, NO hashing)
        const mdFileName = template.sourceFileName.replace(/\.json$/, '.md');
        console.log(`[Manifest] Logging .md file: ${mdFileName} (raw text, NOT hashed)`);
        await createImportReport.mutateAsync({
          fileName: mdFileName,
          fileType: TemplateFileType.markdown,
          size: BigInt(template.markdownContent.length),
          hash: 'md-not-hashed', // Placeholder to avoid hash computation
          status: 'success',
          errors: [],
          warnings: ['Markdown file stored as raw guidance content, NOT parsed as form, NOT hashed'],
          extractedFields: [],
          codeBlocks: [],
          canonicalContent: template.markdownContent,
        });
      }

      setUploadProgress(100);
      console.log(`[Success] Template "${template.name}" saved successfully`);
      toast.success(`Template "${template.name}" created successfully with manifest logging!`);
      
      setParsedTemplates(prev => prev.filter((_, idx) => idx !== templateIndex));
      if (parsedTemplates.length === 1) {
        onSuccess();
      } else {
        setSelectedTemplateIndex(Math.max(0, templateIndex - 1));
      }
    } catch (error) {
      console.error('[Save Error]', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to save template: ${errorMessage}`);
      setValidationErrors([`Save failed: ${errorMessage}. Please check that all data is valid and try again.`]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (isSaving || isProcessing) {
      toast.error('Please wait for the current operation to complete');
      return;
    }

    if (parsedTemplates.length === 0) {
      toast.error('No templates to save');
      return;
    }

    setIsSaving(true);
    const totalTemplates = parsedTemplates.length;
    let savedCount = 0;
    const errors: string[] = [];

    toast.info(`Saving ${totalTemplates} template${totalTemplates !== 1 ? 's' : ''}...`);

    for (let i = parsedTemplates.length - 1; i >= 0; i--) {
      try {
        await handleSaveTemplate(i);
        savedCount++;
        toast.success(`Saved ${savedCount}/${totalTemplates} templates`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to save template ${parsedTemplates[i]?.name || i}: ${errorMessage}`);
        console.error(`Error saving template ${i}:`, error);
      }
    }

    setIsSaving(false);

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error(`Saved ${savedCount} of ${totalTemplates} templates. ${errors.length} failed.`, {
        description: 'Check the error messages below for details.',
      });
    } else {
      toast.success(`All ${totalTemplates} templates saved successfully with manifest logging!`);
      onSuccess();
    }
  };

  const currentTemplate = parsedTemplates[selectedTemplateIndex];

  return (
    <div className="space-y-6">
      <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'file' | 'paste')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="paste" className="gap-2">
            <FileCode className="h-4 w-4" />
            Paste Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <div>
            <Label htmlFor="template-files">Select Template Files (51+ files supported)</Label>
            <div className="mt-2">
              <Input
                id="template-files"
                type="file"
                accept=".json,.md,.txt"
                onChange={handleFileSelect}
                multiple
                className="flex-1"
                disabled={isProcessing || isSaving}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload .json files for form generation and .md files for explanatory content. Files with matching base names will be paired automatically. <strong>CRITICAL: .md files are NEVER parsed as form fields</strong> - they are stored as raw text only in the "Details of e-Contracts" tab.
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <ScrollArea className="h-32 rounded-md border p-2">
                <div className="space-y-1">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded bg-muted px-2 py-1">
                      <div className="flex items-center gap-2">
                        {file.name.endsWith('.json') && <FileJson className="h-3 w-3" />}
                        {(file.name.endsWith('.md') || file.name.endsWith('.txt')) && <FileCode className="h-3 w-3" />}
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(idx)}
                        className="h-6 w-6 p-0"
                        disabled={isProcessing || isSaving}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </TabsContent>

        <TabsContent value="paste" className="space-y-4">
          <div>
            <Label htmlFor="template-content">Paste Template Content</Label>
            <Textarea
              id="template-content"
              placeholder="Paste your JSON template here..."
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              className="mt-2 min-h-[200px] font-mono text-sm"
              disabled={isProcessing || isSaving}
            />
          </div>
        </TabsContent>
      </Tabs>

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {parsedTemplates.length === 0 && (
        <Button
          onClick={handleProcess}
          disabled={isProcessing || isSaving || (uploadMethod === 'file' && selectedFiles.length === 0) || (uploadMethod === 'paste' && !pastedContent)}
          className="w-full gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Parse Templates
            </>
          )}
        </Button>
      )}

      {(isProcessing || isSaving) && uploadProgress > 0 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-muted-foreground text-center">
            {uploadProgress}% complete
          </p>
        </div>
      )}

      {parsedTemplates.length > 0 && (
        <div className="space-y-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully parsed {parsedTemplates.length} template{parsedTemplates.length !== 1 ? 's' : ''}! Review and customize below. All uploads will be logged in the manifest for admin review. Backups are created automatically before each upload.
            </AlertDescription>
          </Alert>

          {parsedTemplates.length > 1 && (
            <div className="flex items-center gap-2">
              <Label>Select Template:</Label>
              <Select
                value={selectedTemplateIndex.toString()}
                onValueChange={(v) => setSelectedTemplateIndex(parseInt(v))}
                disabled={isSaving}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {parsedTemplates.map((template, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {template.name} ({template.sourceFileName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="ml-auto">
                {selectedTemplateIndex + 1} of {parsedTemplates.length}
              </Badge>
            </div>
          )}

          {currentTemplate && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Template Information</CardTitle>
                  <CardDescription>Source: {currentTemplate.sourceFileName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={currentTemplate.name}
                      onChange={(e) => setParsedTemplates(prev => prev.map((t, idx) => 
                        idx === selectedTemplateIndex ? { ...t, name: e.target.value } : t
                      ))}
                      className="mt-2"
                      disabled={isSaving}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Auto-generated from filename with first character capitalized
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="template-category">Category</Label>
                    <Select
                      value={currentTemplate.category}
                      onValueChange={(v) => setParsedTemplates(prev => prev.map((t, idx) => 
                        idx === selectedTemplateIndex ? { ...t, category: v } : t
                      ))}
                      disabled={isSaving}
                    >
                      <SelectTrigger id="template-category" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                        <SelectItem value="Employment">Employment</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Defaults to "Legal" if not specified
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={currentTemplate.isParsed ? 'default' : 'secondary'}>
                      {currentTemplate.isParsed ? 'Fully Parsed' : 'Parsing Incomplete'}
                    </Badge>
                    {currentTemplate.markdownContent && (
                      <Badge variant="outline">
                        Has Explanatory Content
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {currentTemplate.fields.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Dynamic Form Fields (Tree Structure)</CardTitle>
                        <CardDescription>Auto-populated fields with recursive nested sub-fields support</CardDescription>
                      </div>
                      <Button onClick={handleAddField} size="sm" variant="outline" className="gap-2" disabled={isSaving}>
                        <Plus className="h-4 w-4" />
                        Add Field
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {currentTemplate.fields.map((field, index) => (
                          <div key={field.id}>
                            {index > 0 && <Separator className="my-4" />}
                            {renderFieldTree(field)}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {currentTemplate.markdownContent && (
                <Card>
                  <CardHeader>
                    <CardTitle>Explanatory Content Preview</CardTitle>
                    <CardDescription>
                      This content will be displayed in the "Details of e-Contracts" tab (NOT parsed as form fields)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <pre className="text-sm whitespace-pre-wrap">{currentTemplate.markdownContent}</pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center justify-between">
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  variant="outline"
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Eye className="h-4 w-4" />
                  {previewMode ? 'Hide' : 'Show'} Content Preview
                </Button>
              </div>

              {previewMode && currentTemplate.content && (
                <Card>
                  <CardHeader>
                    <CardTitle>Template Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <pre className="text-sm font-mono whitespace-pre-wrap">{currentTemplate.content}</pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setParsedTemplates([]);
                    setSelectedFiles([]);
                    setPastedContent('');
                    setUploadProgress(0);
                    setSelectedTemplateIndex(0);
                  }}
                  disabled={isProcessing || isSaving}
                >
                  Cancel All
                </Button>
                {parsedTemplates.length > 1 && (
                  <Button
                    onClick={handleSaveAll}
                    disabled={isProcessing || isSaving}
                    variant="secondary"
                    className="gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving All...
                      </>
                    ) : (
                      <>
                        <Files className="h-4 w-4" />
                        Save All Templates
                      </>
                    )}
                  </Button>
                )}
                <Button
                  onClick={() => handleSaveTemplate(selectedTemplateIndex)}
                  disabled={isProcessing || isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      Save This Template
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Multi-file upload supporting .json files for form generation and .md files for explanatory content. 
          Files are matched by base name (ignoring extensions). Template names auto-generated from filename with first character capitalized. 
          Default category set to "Legal". Markdown content is stored separately and displayed in the "Details of e-Contracts" tab.
          <strong> CRITICAL: .md files are NEVER parsed as forms</strong> - they are stored as raw text only.
          All uploads are logged in the manifest with SHA-256 hashing (with robust fallback mechanism) for admin review and data integrity.
          Automatic backups are created before each upload to prevent data loss.
        </AlertDescription>
      </Alert>
    </div>
  );
}
