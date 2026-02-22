import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, AlertCircle } from 'lucide-react';
import { useUploadWorkflow, useSetWorkflowPricing } from '../hooks/useQueries';
import { toast } from 'sonner';
import { WorkflowMetadata, Variant_payPerRun_subscription, WorkflowPricing } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WorkflowUploadDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [triggerType, setTriggerType] = useState('');
  const [accessType, setAccessType] = useState<'payPerRun' | 'subscription'>('payPerRun');
  const [price, setPrice] = useState('0.10');
  const [userMultiplier, setUserMultiplier] = useState('1');
  const [priceError, setPriceError] = useState('');
  const [multiplierError, setMultiplierError] = useState('');
  
  const uploadWorkflow = useUploadWorkflow();
  const setWorkflowPricing = useSetWorkflowPricing();
  const { identity } = useInternetIdentity();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.name) setTitle(json.name);
          if (json.nodes && json.nodes.length > 0) {
            const trigger = json.nodes.find((n: any) => n.type?.includes('Trigger'));
            if (trigger) setTriggerType(trigger.type);
          }
        } catch (error) {
          console.error('Failed to parse workflow JSON:', error);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      toast.error('Please select a valid JSON file');
    }
  };

  const validatePrice = (value: string): boolean => {
    setPriceError('');
    
    if (!value) {
      setPriceError('Price is required');
      return false;
    }
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setPriceError('Price must be a valid number');
      return false;
    }
    
    if (numValue < 0.10) {
      setPriceError('Minimum price is $0.10');
      return false;
    }
    
    if (numValue > 10000) {
      setPriceError('Maximum price is $10,000');
      return false;
    }
    
    if (value.includes('.') && value.split('.')[1].length > 2) {
      setPriceError('Price can have at most 2 decimal places');
      return false;
    }
    
    return true;
  };

  const validateMultiplier = (value: string): boolean => {
    setMultiplierError('');
    
    if (!value) {
      setMultiplierError('Multiplier is required');
      return false;
    }
    
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue) || !Number.isInteger(parseFloat(value))) {
      setMultiplierError('Multiplier must be a whole number');
      return false;
    }
    
    if (numValue < 1) {
      setMultiplierError('Minimum multiplier is 1');
      return false;
    }
    
    if (numValue > 1000) {
      setMultiplierError('Maximum multiplier is 1000');
      return false;
    }
    
    return true;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    if (value) {
      validatePrice(value);
    } else {
      setPriceError('');
    }
  };

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setUserMultiplier(value);
      if (value) {
        validateMultiplier(value);
      } else {
        setMultiplierError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !category || !description || !triggerType || !price || !userMultiplier) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!identity) {
      toast.error('You must be logged in to upload workflows');
      return;
    }

    const isPriceValid = validatePrice(price);
    const isMultiplierValid = validateMultiplier(userMultiplier);
    
    if (!isPriceValid || !isMultiplierValid) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const jsonContent = event.target?.result as string;
        
        const workflowId = `workflow-${Date.now()}`;
        
        const priceInDollars = parseFloat(price);
        const priceInCents = Math.round(priceInDollars * 100);
        const finalPriceInCents = Math.max(10, priceInCents);
        
        const metadata: WorkflowMetadata = {
          id: workflowId,
          title,
          category,
          description,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          triggerType,
          accessType: accessType as Variant_payPerRun_subscription,
          priceInCents: BigInt(finalPriceInCents),
          version: BigInt(1),
          creator: identity.getPrincipal(),
        };

        await uploadWorkflow.mutateAsync({ metadata, json: jsonContent });
        
        const multiplierValue = parseInt(userMultiplier, 10);
        const pricingData: WorkflowPricing = {
          workflowId,
          basePriceInCents: BigInt(finalPriceInCents),
          userMultiplier: BigInt(multiplierValue),
          totalUnitsOrdered: BigInt(0),
          priceHistory: [],
          lastUpdated: BigInt(Date.now()),
        };
        
        await setWorkflowPricing.mutateAsync(pricingData);
        
        toast.success('Workflow uploaded successfully with pricing configuration!');
        setOpen(false);
        resetForm();
      };
      reader.readAsText(file);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to upload workflow';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setCategory('');
    setDescription('');
    setTags('');
    setTriggerType('');
    setAccessType('payPerRun');
    setPrice('0.10');
    setUserMultiplier('1');
    setPriceError('');
    setMultiplierError('');
  };

  const calculateFinalPrice = () => {
    if (!price || !userMultiplier) return null;
    
    const priceValue = parseFloat(price);
    const multiplierValue = parseInt(userMultiplier, 10);
    
    if (isNaN(priceValue) || isNaN(multiplierValue)) return null;
    
    const basePrice = Math.max(0.10, priceValue);
    const finalPrice = basePrice * multiplierValue;
    
    return finalPrice.toFixed(2);
  };

  const finalPrice = calculateFinalPrice();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload n8n Workflow</DialogTitle>
          <DialogDescription>
            Upload your n8n workflow JSON file and configure pricing with multiplier.
          </DialogDescription>
        </DialogHeader>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Pricing System:</strong> Set a base price (min $0.10) and multiplier (1-1000). 
            Price automatically increases by $0.10 for every 10 units ordered using robust integer math.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Workflow JSON File *</Label>
            <Input
              id="file"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Customer Onboarding Automation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="E.g., Marketing, Sales, Support"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow does..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="automation, email, crm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="triggerType">Trigger Type *</Label>
            <Input
              id="triggerType"
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value)}
              placeholder="E.g., Webhook, Schedule, Manual"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessType">Access Type *</Label>
            <Select value={accessType} onValueChange={(value: 'payPerRun' | 'subscription') => setAccessType(value)}>
              <SelectTrigger id="accessType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payPerRun">Pay per Run</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Base Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.10"
                max="10000"
                value={price}
                onChange={handlePriceChange}
                placeholder="0.10"
                required
                className={priceError ? 'border-red-500' : ''}
              />
              {priceError && (
                <p className="text-xs text-red-600">{priceError}</p>
              )}
              <p className="text-xs text-muted-foreground">Minimum: $0.10 (enforced)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="multiplier">Price Multiplier *</Label>
              <Input
                id="multiplier"
                type="text"
                value={userMultiplier}
                onChange={handleMultiplierChange}
                placeholder="1"
                required
                className={multiplierError ? 'border-red-500' : ''}
              />
              {multiplierError && (
                <p className="text-xs text-red-600">{multiplierError}</p>
              )}
              <p className="text-xs text-muted-foreground">Whole number (1-1000)</p>
            </div>
          </div>

          {finalPrice && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Final Price:</span>
                <span className="text-2xl font-bold text-primary">${finalPrice}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Price increases by $0.10 automatically for every 10 units ordered (integer math)
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={uploadWorkflow.isPending || setWorkflowPricing.isPending || !!priceError || !!multiplierError}
            >
              {(uploadWorkflow.isPending || setWorkflowPricing.isPending) ? 'Uploading...' : 'Upload Workflow'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
