import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Zap, ShoppingCart, User, Download, FileCode, Lock, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { useGetWorkflow, useCreateCheckoutSession, useIsCallerAdmin, useGetWorkflowPricing, useIsStripeConfigured, useHandleJsonError } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ShoppingItem, TransactionId } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function WorkflowDetailPage() {
  const { id } = useParams({ from: '/workflow/$id' });
  const navigate = useNavigate();
  const { data: workflow, isLoading } = useGetWorkflow(id);
  const { data: workflowPricing } = useGetWorkflowPricing(id);
  const { data: isStripeConfigured } = useIsStripeConfigured();
  const createCheckout = useCreateCheckoutSession();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { actor } = useActor();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const handleJsonError = useHandleJsonError();

  const isSubscriber = !!identity;
  const canAccessFullCode = isSubscriber || isAdmin;
  const isAuthorized: boolean = canAccessFullCode || false;

  const formatPrice = (cents: bigint) => {
    const priceInCents = Number(cents);
    const minPriceInCents = 10;
    const finalPrice = Math.max(minPriceInCents, priceInCents);
    return `$${(finalPrice / 100).toFixed(2)}`;
  };

  const logErrorToBackend = async (errorMessage: string, errorType: string, context?: string) => {
    try {
      if (actor && identity) {
        await handleJsonError.mutateAsync({
          message: errorMessage,
          file: context || `workflow-${id}`,
          errorType,
          suggestedFix: null,
        });
        console.log(`Error logged to backend: [${errorType}] ${errorMessage}`);
      }
    } catch (logError) {
      console.error('Failed to log error to backend:', logError);
    }
  };

  const handlePurchase = async () => {
    console.log('=== Starting Purchase Flow ===');
    
    // Step 1: Validate workflow data
    if (!workflow) {
      const errorMsg = 'Workflow data not available';
      console.error(errorMsg);
      toast.error(errorMsg);
      await logErrorToBackend(errorMsg, 'WORKFLOW_NOT_FOUND', 'purchase-flow');
      return;
    }
    
    // Step 2: Validate authentication
    if (!identity) {
      const errorMsg = 'User not authenticated';
      console.error(errorMsg);
      toast.error('Please login to purchase workflows');
      return;
    }

    // Step 3: Validate Stripe configuration
    if (!isStripeConfigured) {
      const errorMsg = 'Payment system is not configured';
      console.error(errorMsg);
      toast.error('Payment system is not configured. Please contact the administrator.');
      await logErrorToBackend(errorMsg, 'STRIPE_NOT_CONFIGURED', 'purchase-flow');
      return;
    }

    setIsPurchasing(true);

    try {
      // Step 4: Validate and enforce minimum price
      const priceInCents = Number(workflow.metadata.priceInCents);
      const minPriceInCents = 10;
      const finalPriceInCents = Math.max(minPriceInCents, priceInCents);

      console.log('Price validation:', {
        original: priceInCents,
        minimum: minPriceInCents,
        final: finalPriceInCents,
      });

      if (finalPriceInCents < 10) {
        const errorMsg = `Invalid price: ${finalPriceInCents} cents is below minimum of 10 cents ($0.10)`;
        console.error(errorMsg);
        toast.error('Invalid price: minimum is $0.10');
        await logErrorToBackend(errorMsg, 'PRICE_VALIDATION_FAILED', `workflow-${id}`);
        setIsPurchasing(false);
        return;
      }

      if (finalPriceInCents > 10000000) {
        const errorMsg = `Invalid price: ${finalPriceInCents} cents exceeds maximum`;
        console.error(errorMsg);
        toast.error('Invalid price: exceeds maximum allowed');
        await logErrorToBackend(errorMsg, 'PRICE_VALIDATION_FAILED', `workflow-${id}`);
        setIsPurchasing(false);
        return;
      }

      if (!Number.isInteger(finalPriceInCents)) {
        const errorMsg = `Invalid price: ${finalPriceInCents} is not an integer`;
        console.error(errorMsg);
        toast.error('Invalid price: must be in cents (integer)');
        await logErrorToBackend(errorMsg, 'PRICE_VALIDATION_FAILED', `workflow-${id}`);
        setIsPurchasing(false);
        return;
      }

      // Step 5: Create shopping item with validated price
      const item: ShoppingItem = {
        productName: workflow.metadata.title,
        productDescription: workflow.metadata.description,
        priceInCents: BigInt(finalPriceInCents),
        quantity: BigInt(1),
        currency: 'usd',
      };

      console.log('Shopping item created:', {
        name: item.productName,
        price: `$${(Number(item.priceInCents) / 100).toFixed(2)}`,
        priceInCents: Number(item.priceInCents),
        quantity: Number(item.quantity),
        currency: item.currency,
      });

      // Step 6: Create checkout session
      console.log('Calling createCheckoutSession...');
      let sessionResult: string;
      try {
        sessionResult = await createCheckout.mutateAsync([item]);
        console.log('Checkout session result received:', sessionResult ? 'non-empty' : 'EMPTY');
      } catch (checkoutError: any) {
        const errorMsg = checkoutError?.message || 'Failed to create checkout session';
        console.error('Checkout session creation error:', checkoutError);
        toast.error(`Payment error: ${errorMsg}`);
        await logErrorToBackend(
          `Checkout failed: ${errorMsg}`,
          'CHECKOUT_SESSION_FAILED',
          `workflow-${id}`
        );
        setIsPurchasing(false);
        return;
      }

      // Step 7: Validate session result is not empty
      if (!sessionResult || sessionResult.trim() === '') {
        const errorMsg = 'Empty checkout session response from backend';
        console.error(errorMsg);
        toast.error('Failed to create checkout session. Please try again.');
        await logErrorToBackend(errorMsg, 'CHECKOUT_SESSION_EMPTY', `workflow-${id}`);
        setIsPurchasing(false);
        return;
      }

      // Step 8: Parse session data
      let sessionData: { id?: string; url?: string };
      try {
        sessionData = JSON.parse(sessionResult);
        console.log('Parsed checkout session:', {
          hasId: !!sessionData.id,
          hasUrl: !!sessionData.url,
          urlPreview: sessionData.url ? sessionData.url.substring(0, 50) + '...' : 'N/A',
        });
      } catch (parseError: any) {
        const errorMsg = `Failed to parse session data: ${parseError.message}`;
        console.error('JSON parse error:', parseError);
        console.error('Raw session result:', sessionResult);
        toast.error('Invalid checkout session response. Please try again.');
        await logErrorToBackend(errorMsg, 'JSON_PARSE_ERROR', `workflow-${id}`);
        setIsPurchasing(false);
        return;
      }

      // Step 9: Validate session URL exists
      if (!sessionData.url) {
        const errorMsg = 'Checkout session URL not provided in response';
        console.error(errorMsg, 'Session data:', sessionData);
        toast.error('Checkout session URL not available. Please contact support.');
        await logErrorToBackend(
          `${errorMsg}. Session data: ${JSON.stringify(sessionData)}`,
          'CHECKOUT_URL_MISSING',
          `workflow-${id}`
        );
        setIsPurchasing(false);
        return;
      }

      // Step 10: Validate URL format
      if (typeof sessionData.url !== 'string') {
        const errorMsg = `Invalid URL type: ${typeof sessionData.url}`;
        console.error(errorMsg);
        toast.error('Invalid checkout session URL format.');
        await logErrorToBackend(errorMsg, 'CHECKOUT_URL_INVALID_TYPE', `workflow-${id}`);
        setIsPurchasing(false);
        return;
      }

      if (!sessionData.url.startsWith('http://') && !sessionData.url.startsWith('https://')) {
        const errorMsg = `Invalid URL format: ${sessionData.url}`;
        console.error(errorMsg);
        toast.error('Invalid checkout session URL format.');
        await logErrorToBackend(errorMsg, 'CHECKOUT_URL_INVALID_FORMAT', `workflow-${id}`);
        setIsPurchasing(false);
        return;
      }

      // Step 11: Log transaction
      if (actor && identity) {
        try {
          const transactionId: TransactionId = {
            uid: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 18)}`,
            nonce: BigInt(Date.now()),
            userId: identity.getPrincipal(),
            timestamp: BigInt(Date.now()),
          };
          await actor.addTransactionId(transactionId);
          console.log('Transaction logged successfully:', transactionId.uid);
        } catch (txnError) {
          console.error('Failed to log transaction (non-critical):', txnError);
        }
      }

      // Step 12: Redirect to Stripe
      console.log('Redirecting to Stripe checkout URL:', sessionData.url);
      toast.success('Redirecting to secure payment...');
      
      setTimeout(() => {
        window.location.href = sessionData.url!;
      }, 500);

    } catch (error: any) {
      console.error('Unexpected purchase error:', error);
      const errorMessage = error?.message || 'An unexpected error occurred during checkout';
      toast.error(`Error: ${errorMessage}`);
      await logErrorToBackend(
        `Unexpected error: ${errorMessage}. Stack: ${error?.stack || 'N/A'}`,
        'PURCHASE_UNEXPECTED_ERROR',
        `workflow-${id}`
      );
      setIsPurchasing(false);
    }
  };

  const handleDownloadCode = async () => {
    if (!workflow) return;
    
    if (!canAccessFullCode) {
      toast.error('Download access restricted to Admins and Subscribers only');
      return;
    }
    
    if (actor && identity) {
      try {
        const downloadId: TransactionId = {
          uid: `download_${Date.now()}_${Math.random().toString(36).substring(2, 18)}`,
          nonce: BigInt(Date.now()),
          userId: identity.getPrincipal(),
          timestamp: BigInt(Date.now()),
        };
        await actor.addTransactionId(downloadId);
      } catch (error) {
        console.error('Failed to log download:', error);
      }
    }
    
    const automationCode = `
// 1-Min Automation Setup
// Workflow: ${workflow.metadata.title}
// Downloaded by: ${identity?.getPrincipal().toString() || 'Anonymous'}
// Download ID: download_${Date.now()}_${Math.random().toString(36).substring(2, 18)}

const workflow = ${workflow.json};

// Execute workflow
async function runWorkflow() {
  console.log('Starting workflow: ${workflow.metadata.title}');
  // Add your execution logic here
  return workflow;
}

runWorkflow().then(() => {
  console.log('Workflow completed successfully');
}).catch(error => {
  console.error('Workflow execution failed:', error);
});
`;

    const blob = new Blob([automationCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.metadata.title.replace(/\s+/g, '-').toLowerCase()}-automation.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Automation code downloaded successfully');
  };

  const parseWorkflowFields = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const fields: Array<{ name: string; type: string; value: any }> = [];
      
      const extractFields = (obj: any, prefix = '') => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              extractFields(value, fullKey);
            } else {
              fields.push({
                name: fullKey,
                type: typeof value,
                value: Array.isArray(value) ? JSON.stringify(value) : value,
              });
            }
          }
        }
      };
      
      extractFields(parsed);
      return fields;
    } catch (error) {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="container py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Workflow not found</h2>
          <Button onClick={() => navigate({ to: '/catalog' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  const accessTypeLabel = workflow.metadata.accessType === 'payPerRun' ? 'Pay per Run' : 'Subscription';
  const workflowFields = parseWorkflowFields(workflow.json);

  return (
    <div className="container py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/catalog' })}
        className="mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Catalog
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl font-bold tracking-tight">{workflow.metadata.title}</h1>
              <Badge variant={workflow.metadata.accessType === 'payPerRun' ? 'default' : 'secondary'}>
                {accessTypeLabel}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{workflow.metadata.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Workflow Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Category</div>
                <div className="text-base">{workflow.metadata.category}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Trigger Type</div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="text-base">{workflow.metadata.triggerType}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Version</div>
                <div className="text-base">v{workflow.metadata.version.toString()}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Creator</div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-xs truncate">{workflow.metadata.creator.toString()}</span>
                </div>
              </div>
            </div>
          </div>

          {workflow.metadata.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {workflow.metadata.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Workflow Preview</h2>
            
            {!isAuthorized && (
              <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>Access Restricted:</strong> Public users can only view the web-form. 
                  Subscribe or login as admin to access the full JSON code and download workflows.
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="form" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="json" disabled={!isAuthorized}>
                  {isAuthorized ? 'JSON View' : 'JSON View (Locked)'}
                  {!isAuthorized && <Lock className="ml-2 h-3 w-3" />}
                </TabsTrigger>
                <TabsTrigger value="form">Web-Form View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="json" className="space-y-4">
                {isAuthorized ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>JSON Structure</CardTitle>
                          <CardDescription>Full JSON preview available for Admins and Subscribers</CardDescription>
                        </div>
                        <Eye className="h-5 w-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                        <code>{JSON.stringify(JSON.parse(workflow.json), null, 2)}</code>
                      </pre>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-muted">
                    <CardContent className="pt-6">
                      <div className="text-center py-12 space-y-4">
                        <Lock className="h-16 w-16 mx-auto text-muted-foreground" />
                        <h3 className="text-xl font-semibold">JSON Code View Restricted</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          The JSON code preview is only available to Admins and Subscribers. 
                          Please subscribe to access the full workflow code.
                        </p>
                        <Button onClick={() => navigate({ to: '/subscribers' })}>
                          Subscribe Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="form" className="space-y-4">
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <img
                        src="/assets/generated/web-form-interface.dim_600x450.png"
                        alt="Web Form"
                        className="h-12 w-auto rounded"
                      />
                      <div className="flex-1">
                        <CardTitle>Secure Web-Form View</CardTitle>
                        <CardDescription>
                          {canAccessFullCode
                            ? 'Fill out the form fields to customize this workflow'
                            : 'Public preview available. Subscribe to fill and submit forms.'}
                        </CardDescription>
                      </div>
                      {!canAccessFullCode && (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {workflowFields.length > 0 ? (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {workflowFields.slice(0, 10).map((field, idx) => (
                          <div key={idx} className="space-y-2">
                            <Label htmlFor={`field-${idx}`}>
                              {field.name}
                              <span className="text-xs text-muted-foreground ml-2">({field.type})</span>
                            </Label>
                            {field.type === 'string' && field.value.length > 50 ? (
                              <Textarea
                                id={`field-${idx}`}
                                placeholder={String(field.value)}
                                disabled={!canAccessFullCode}
                                value={formData[field.name] || ''}
                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                className={!canAccessFullCode ? 'cursor-not-allowed opacity-60' : ''}
                              />
                            ) : (
                              <Input
                                id={`field-${idx}`}
                                type="text"
                                placeholder={String(field.value)}
                                disabled={!canAccessFullCode}
                                value={formData[field.name] || ''}
                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                className={!canAccessFullCode ? 'cursor-not-allowed opacity-60' : ''}
                              />
                            )}
                          </div>
                        ))}
                        {workflowFields.length > 10 && (
                          <p className="text-sm text-muted-foreground text-center">
                            Showing 10 of {workflowFields.length} fields
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No form fields available for this workflow
                      </p>
                    )}
                    
                    {!canAccessFullCode && (
                      <div className="pt-4 border-t">
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-center text-muted-foreground">
                            🔒 Form filling and submission restricted to Admins and Subscribers
                          </p>
                        </div>
                        <Button className="w-full" onClick={() => navigate({ to: '/subscribers' })}>
                          Subscribe to Publish
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-3xl">{formatPrice(workflow.metadata.priceInCents)}</CardTitle>
              <CardDescription>{accessTypeLabel}</CardDescription>
              
              {workflowPricing && (
                <div className="pt-4 space-y-2 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Base Price:</span>{' '}
                    <span className="font-semibold">
                      ${Math.max(0.10, Number(workflowPricing.basePriceInCents) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Multiplier:</span>{' '}
                    <span className="font-semibold">{workflowPricing.userMultiplier.toString()}x</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total Units Ordered:</span>{' '}
                    <span className="font-semibold">{workflowPricing.totalUnitsOrdered.toString()}</span>
                  </div>
                  {workflowPricing.priceHistory.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Price has increased {workflowPricing.priceHistory.length} time(s)
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    💡 Price increases by $0.10 every 10 units (integer math)
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handlePurchase}
                disabled={isPurchasing || !isStripeConfigured || !identity}
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Purchase Now
                  </>
                )}
              </Button>
              
              {!identity && (
                <Alert className="border-amber-500">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
                    Please login to purchase workflows
                  </AlertDescription>
                </Alert>
              )}
              
              {!isStripeConfigured && identity && (
                <Alert className="border-destructive">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-xs text-destructive">
                    Payment system not configured. Contact admin.
                  </AlertDescription>
                </Alert>
              )}
              
              {canAccessFullCode ? (
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={handleDownloadCode}
                >
                  <Download className="mr-2 h-5 w-5" />
                  <img
                    src="/assets/generated/download-code-icon-transparent.dim_32x32.png"
                    alt="Download"
                    className="h-5 w-5 mr-2"
                  />
                  Download Code
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  disabled
                >
                  <Lock className="mr-2 h-5 w-5" />
                  Download (Subscribers Only)
                </Button>
              )}
              
              <div className="text-xs text-muted-foreground text-center">
                Secure payment powered by Stripe
              </div>
              
              {canAccessFullCode && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileCode className="h-4 w-4" />
                    <span>1-Min Automation Ready</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    All downloads are logged with UID, Nonce, and UserID for security
                  </p>
                </div>
              )}
              
              {!canAccessFullCode && (
                <div className="pt-4 border-t">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-xs text-center text-muted-foreground">
                      🔒 Access Control: Download restricted to verified subscribers and admins
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
