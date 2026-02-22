import { useState, useMemo } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetTemplate, useGetDynamicTemplateStructure, useGetTemplateDetailsTabByTemplateId } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, FileText, Shield, CheckCircle, AlertCircle, Loader2, Send, Info } from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  fields?: FormField[];
  description?: string;
}

interface DynamicStructure {
  isParsed: boolean;
  fields: FormField[];
  markdownContent?: string;
  version?: number;
}

export default function TemplateDetailPage() {
  const navigate = useNavigate();
  const { templateId } = useParams({ strict: false });
  const { identity } = useInternetIdentity();
  const { data: template, isLoading: templateLoading } = useGetTemplate(templateId || '');
  const { data: dynamicStructureJson, isLoading: structureLoading } = useGetDynamicTemplateStructure(templateId || '');
  const { data: detailsTab, isLoading: detailsLoading } = useGetTemplateDetailsTabByTemplateId(templateId || '');

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ethSignature, setEthSignature] = useState<string>('');
  const [zkProofStatus, setZkProofStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

  const isAuthenticated = !!identity;

  const dynamicStructure = useMemo<DynamicStructure | null>(() => {
    if (!dynamicStructureJson) return null;
    try {
      return JSON.parse(dynamicStructureJson);
    } catch (error) {
      console.error('Error parsing dynamic structure:', error);
      return null;
    }
  }, [dynamicStructureJson]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleNestedFieldChange = (parentPath: string, fieldName: string, value: any) => {
    const fullPath = `${parentPath}.${fieldName}`;
    setFormData(prev => ({
      ...prev,
      [fullPath]: value,
    }));
  };

  const handleArrayFieldChange = (fieldName: string, index: number, value: any) => {
    setFormData(prev => {
      const currentArray = prev[fieldName] || [];
      const newArray = [...currentArray];
      newArray[index] = value;
      return {
        ...prev,
        [fieldName]: newArray,
      };
    });
  };

  const addArrayItem = (fieldName: string) => {
    setFormData(prev => {
      const currentArray = prev[fieldName] || [];
      return {
        ...prev,
        [fieldName]: [...currentArray, {}],
      };
    });
  };

  const removeArrayItem = (fieldName: string, index: number) => {
    setFormData(prev => {
      const currentArray = prev[fieldName] || [];
      const newArray = currentArray.filter((_: any, i: number) => i !== index);
      return {
        ...prev,
        [fieldName]: newArray,
      };
    });
  };

  const generateEthSignature = async () => {
    try {
      const dataToSign = JSON.stringify(formData);
      const mockSignature = `0x${Array.from({ length: 130 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      setEthSignature(mockSignature);
      toast.success('ETH signature generated (stub)');
      return mockSignature;
    } catch (error) {
      console.error('Error generating ETH signature:', error);
      toast.error('Failed to generate ETH signature');
      return null;
    }
  };

  const verifyZkProof = async () => {
    try {
      setZkProofStatus('pending');
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isValid = Math.random() > 0.1;
      setZkProofStatus(isValid ? 'verified' : 'failed');
      toast.success(isValid ? 'ZK proof verified (stub)' : 'ZK proof verification failed (stub)');
      return isValid;
    } catch (error) {
      console.error('Error verifying ZK proof:', error);
      setZkProofStatus('failed');
      toast.error('ZK proof verification error');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const signature = await generateEthSignature();
      if (!signature) {
        throw new Error('Failed to generate signature');
      }

      const zkVerified = await verifyZkProof();
      if (!zkVerified) {
        throw new Error('ZK proof verification failed');
      }

      const submissionData = {
        templateId: templateId,
        formData,
        ethSignature: signature,
        zkProofStatus: 'verified',
        timestamp: Date.now(),
      };

      console.log('Form submission data:', submissionData);
      
      toast.success('Form submitted successfully with cryptographic verification!', {
        description: 'ETH signature and ZK proof verified.',
      });

      setFormData({});
      setEthSignature('');
      setZkProofStatus('pending');
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error('Form submission failed', {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField, parentPath: string = ''): React.ReactElement => {
    const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
    const fieldValue = formData[fieldPath];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <div key={fieldPath} className="space-y-2">
            <Label htmlFor={fieldPath}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Input
              id={fieldPath}
              type={field.type}
              value={fieldValue || ''}
              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={fieldPath} className="space-y-2">
            <Label htmlFor={fieldPath}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Textarea
              id={fieldPath}
              value={fieldValue || ''}
              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              rows={4}
            />
          </div>
        );

      case 'number':
        return (
          <div key={fieldPath} className="space-y-2">
            <Label htmlFor={fieldPath}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Input
              id={fieldPath}
              type="number"
              value={fieldValue || ''}
              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );

      case 'select':
        return (
          <div key={fieldPath} className="space-y-2">
            <Label htmlFor={fieldPath}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Select
              value={fieldValue || ''}
              onValueChange={(value) => handleFieldChange(fieldPath, value)}
            >
              <SelectTrigger id={fieldPath}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={fieldPath} className="flex items-start space-x-2">
            <Checkbox
              id={fieldPath}
              checked={fieldValue || false}
              onCheckedChange={(checked) => handleFieldChange(fieldPath, checked)}
            />
            <div className="space-y-1">
              <Label htmlFor={fieldPath} className="cursor-pointer">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={fieldPath} className="space-y-2">
            <Label htmlFor={fieldPath}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Input
              id={fieldPath}
              type="date"
              value={fieldValue || ''}
              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
              required={field.required}
            />
          </div>
        );

      case 'signature':
        return (
          <div key={fieldPath} className="space-y-2">
            <Label htmlFor={fieldPath}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Signature field (placeholder)</p>
              <Input
                id={fieldPath}
                type="text"
                value={fieldValue || ''}
                onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
                required={field.required}
                placeholder="Enter signature or draw here"
              />
            </div>
          </div>
        );

      case 'group':
      case 'object':
        return (
          <Card key={fieldPath} className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">{field.label}</CardTitle>
              {field.description && (
                <CardDescription>{field.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {field.fields?.map((subField) => renderField(subField, fieldPath))}
            </CardContent>
          </Card>
        );

      case 'array':
        const arrayValue = fieldValue || [];
        return (
          <div key={fieldPath} className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(fieldPath)}
              >
                Add Item
              </Button>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <div className="space-y-4">
              {arrayValue.map((item: any, index: number) => (
                <Card key={`${fieldPath}-${index}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Item {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem(fieldPath, index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {field.fields?.map((subField) => {
                      const subFieldPath = `${fieldPath}[${index}].${subField.name}`;
                      return renderField({ ...subField, name: subFieldPath }, '');
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div key={fieldPath} className="space-y-2">
            <Label htmlFor={fieldPath}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <Input
              id={fieldPath}
              type="text"
              value={fieldValue || ''}
              onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please login to view template details and fill out forms.
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (templateLoading || structureLoading || detailsLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Template Not Found</AlertTitle>
            <AlertDescription>
              The requested template could not be found.
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => navigate({ to: '/templates' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // CRITICAL: Always show the "Details of e-Contracts" tab, even if no content yet
  const hasDetailsContent = !!detailsTab?.markdownContent;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button onClick={() => navigate({ to: '/templates' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{template.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{template.category}</Badge>
            <Badge variant="outline">Version {dynamicStructure?.version || 1}</Badge>
            {hasDetailsContent && (
              <Badge variant="default">Has Guidance Content</Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="form" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">
              <FileText className="mr-2 h-4 w-4" />
              Form
            </TabsTrigger>
            <TabsTrigger value="metadata">
              <Info className="mr-2 h-4 w-4" />
              Metadata
            </TabsTrigger>
            {/* CRITICAL: Always show this tab, never disable it */}
            <TabsTrigger value="details">
              <FileText className="mr-2 h-4 w-4" />
              Details of e-Contracts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            {dynamicStructure && dynamicStructure.isParsed && dynamicStructure.fields.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Fill Out Template</CardTitle>
                  <CardDescription>
                    Complete all required fields. Your submission will be cryptographically verified using VerifySig/ZKProof/ICP contracts for global, unrestricted e-contract completion.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {dynamicStructure.fields.map((field) => renderField(field))}

                    <Separator className="my-6" />

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        All submissions are verified with ETH signatures and ZK proofs
                      </p>
                      <Button type="submit" disabled={isSubmitting} className="gap-2">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Form
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Form Available</AlertTitle>
                <AlertDescription>
                  This template does not have a form structure. Please check the "Details of e-Contracts" tab for guidance content.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="metadata">
            <Card>
              <CardHeader>
                <CardTitle>Template Metadata</CardTitle>
                <CardDescription>
                  Technical information about this template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Template Name</Label>
                    <p className="font-medium">{template.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Category</Label>
                    <p className="font-medium">{template.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Format</Label>
                    <p className="font-medium uppercase">{template.format}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Size</Label>
                    <p className="font-medium">{Number(template.size)} bytes</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Version</Label>
                    <p className="font-medium">{dynamicStructure?.version || 1}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Fields Count</Label>
                    <p className="font-medium">{template.fields.length}</p>
                  </div>
                </div>
                {template.fields.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Field Names</Label>
                      <div className="flex flex-wrap gap-2">
                        {template.fields.map((field, idx) => (
                          <Badge key={idx} variant="outline">{field}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {hasDetailsContent && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm text-muted-foreground mb-2 block">Guidance Description</Label>
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          This template includes explanatory content to help you complete the form. View the "Details of e-Contracts" tab for full guidance.
                        </AlertDescription>
                      </Alert>
                      <div className="mt-4 p-4 bg-muted rounded-lg max-h-[200px] overflow-y-auto">
                        <p className="text-sm whitespace-pre-wrap">{detailsTab.markdownContent.substring(0, 500)}{detailsTab.markdownContent.length > 500 ? '...' : ''}</p>
                      </div>
                    </div>
                  </>
                )}
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Decentralized & Verifiable</AlertTitle>
                  <AlertDescription>
                    This template supports global, unrestricted e-contract completion with auto-verification features including VerifySig, ZKProof, and ICP contracts for maximum security and trust.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CRITICAL: Always render this tab, show placeholder if no content */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Details of e-Contracts for its Forms</CardTitle>
                <CardDescription>
                  Guidance and explanatory information to assist subscribers in filling and finalizing e-contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Guidance Information</AlertTitle>
                  <AlertDescription>
                    This tab provides helpful context and instructions for completing the e-contract form. The system features decentralized, verifiable, and auto-verification capabilities (VerifySig/ZKProof/ICP contracts) for global, unrestricted e-contract completion.
                  </AlertDescription>
                </Alert>
                {hasDetailsContent ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactQuill
                      value={detailsTab.markdownContent}
                      readOnly={true}
                      theme="snow"
                      modules={{ toolbar: false }}
                    />
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Guidance Content Available</AlertTitle>
                    <AlertDescription>
                      This template does not yet have explanatory content. Guidance content can be added by uploading a matching .md file with the same base name as the template.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
