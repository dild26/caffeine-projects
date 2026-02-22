import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Download, 
  Upload, 
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Zap,
  Lock
} from 'lucide-react';
import { useGetLiveApps } from '../hooks/useApps';

// PayPal SDK type declarations
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        style?: {
          shape?: string;
          color?: string;
          layout?: string;
          label?: string;
        };
        createSubscription: (data: any, actions: any) => Promise<string>;
        onApprove: (data: any, actions: any) => void;
        onError: (err: any) => void;
      }) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

interface PaymentPageProps {
  appId: string;
}

// PayPal Plan ID mappings for each SECOINFI app
const PAYPAL_PLAN_IDS: Record<string, string> = {
  'infitask': 'P-XXXXXXXXXXXKEI', // infytask-mia
  'moap': 'P-XXXXXXXXXXXP7Y', // map-56b
  'n8n-tasks': 'P-XXXXXXXXXXXA6Q', // n8n-tasks-c2i
  'n8n-workflows': 'P-XXXXXXXXXXXKUA', // n8n-workflows-6sy
  'sitemapai': 'P-XXXXXXXXXXXZYQ', // sitemaps-fwh
  'e-contracts': 'P-XXXXXXXXXXXCDI', // e-contracts-bqe
  'secoin': 'P-XXXXXXXXXXXBEY', // secoin-ep6
};

export default function PaymentPage({ appId }: PaymentPageProps) {
  const { data: apps = [] } = useGetLiveApps();
  const app = apps.find(a => a.id === appId);
  const planId = PAYPAL_PLAN_IDS[appId];
  
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&vault=true&intent=subscription';
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => setPaymentError('Failed to load PayPal SDK. Please refresh the page.');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (paypalLoaded && planId && window.paypal) {
      // Render PayPal button
      const buttonContainer = document.getElementById(`paypal-button-container-${appId}`);
      if (buttonContainer && buttonContainer.children.length === 0) {
        window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              plan_id: planId
            });
          },
          onApprove: function(data: any, actions: any) {
            alert('Subscription successful! Subscription ID: ' + data.subscriptionID);
            setPaymentError(null);
          },
          onError: function(err: any) {
            console.error('PayPal error:', err);
            setPaymentError('Payment processing failed. Please try again.');
          }
        }).render(`#paypal-button-container-${appId}`);
      }
    }
  }, [paypalLoaded, planId, appId]);

  if (!app) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Application Not Found</AlertTitle>
          <AlertDescription>
            The requested application could not be found. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!planId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Configuration Error</AlertTitle>
          <AlertDescription>
            Payment plan not configured for this application. Please contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <img 
            src="/assets/generated/paypal-logo-transparent.dim_200x200.png" 
            alt="PayPal" 
            className="w-16 h-16"
          />
          <h1 className="text-4xl font-bold text-gradient">Payment Portal</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Subscribe to <span className="font-semibold text-primary">{app.name}</span>
        </p>
        <Badge variant="default" className="neon-glow text-lg px-4 py-2">
          <Shield className="w-4 h-4 mr-2" />
          Secure Payment Processing
        </Badge>
      </div>

      {/* Error Alert */}
      {paymentError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Error</AlertTitle>
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Zap className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45ms</div>
            <p className="text-xs text-muted-foreground">Lightning fast</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Lock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">A+</div>
            <p className="text-xs text-muted-foreground">SSL Encrypted</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        {/* Subscription Plans */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="card-3d border-4 border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-gradient">{app.name} Subscription</CardTitle>
                  <CardDescription className="mt-2">
                    Subscribe to unlock all premium features and capabilities
                  </CardDescription>
                </div>
                <img 
                  src="/assets/generated/paypal-logo-transparent.dim_200x200.png" 
                  alt="PayPal" 
                  className="w-20 h-20"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* App Description */}
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">About {app.name}</h3>
                <p className="text-muted-foreground">{app.description}</p>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Key Features:</h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {app.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* PayPal Button Container */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 border-2 border-primary/20">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Subscribe Now</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure payment processing powered by PayPal
                  </p>
                </div>
                
                {/* PayPal Button */}
                <div 
                  id={`paypal-button-container-${appId}`}
                  className="max-w-md mx-auto"
                >
                  {!paypalLoaded && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-sm text-muted-foreground">Loading PayPal...</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    Plan ID: <span className="font-mono">{planId}</span>
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <h4 className="font-semibold text-sm">Instant Access</h4>
                  <p className="text-xs text-muted-foreground">
                    Get immediate access to all features
                  </p>
                </div>
                <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold text-sm">Secure Payment</h4>
                  <p className="text-xs text-muted-foreground">
                    SSL encrypted and PCI DSS compliant
                  </p>
                </div>
                <div className="text-center space-y-2 p-4 rounded-lg bg-muted/30">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 text-purple-500" />
                  </div>
                  <h4 className="font-semibold text-sm">Cancel Anytime</h4>
                  <p className="text-xs text-muted-foreground">
                    No long-term commitment required
                  </p>
                </div>
              </div>

              {/* Integration Info */}
              {app.integration.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                  <h4 className="font-semibold text-sm">Integrations:</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.integration.map((integration, index) => (
                      <Badge key={index} variant="outline">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History */}
        <TabsContent value="history" className="space-y-6">
          <Card className="card-3d">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View and manage your past transactions
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No payment history yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your transactions will appear here after your first payment
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Security Features */}
      <Card className="card-3d border-2 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-500" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="font-semibold">SSL Encrypted</h4>
              <p className="text-sm text-muted-foreground">
                All data transmitted is encrypted with 256-bit SSL
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="font-semibold">PCI DSS Compliant</h4>
              <p className="text-sm text-muted-foreground">
                Payment Card Industry Data Security Standard certified
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-semibold">Money-Back Guarantee</h4>
              <p className="text-sm text-muted-foreground">
                30-day money-back guarantee on all subscriptions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
