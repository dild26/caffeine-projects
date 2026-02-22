import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, ExternalLink, MessageCircle, CreditCard, Shield, Zap, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Check subscription status from localStorage
    const subscriptionStatus = localStorage.getItem('eth-sandbox-subscription');
    if (subscriptionStatus === 'active') {
      setIsSubscribed(true);
    }
  }, []);

  const handleSubscribeClick = () => {
    // Open PayPal subscription in new tab
    window.open('https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-47K9560054107011CNEBHZYQ', '_blank');
    setShowConfirmation(true);
    toast.info('Complete your subscription on PayPal, then confirm your receipt via WhatsApp.');
  };

  const handleConfirmSubscription = () => {
    // Set subscription status in localStorage
    localStorage.setItem('eth-sandbox-subscription', 'active');
    setIsSubscribed(true);
    toast.success('Subscription confirmed! You now have full access to the SEC-Visual Builder Dashboard.');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919620058644', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl mb-12">
          <img 
            src="/assets/generated/subscription-hero-banner.dim_800x400.png" 
            alt="PAYU Subscription" 
            className="w-full h-64 object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-secondary/70 to-accent/60 flex items-center justify-center">
            <div className="text-center space-y-4 px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                Pay-As-You-Use Subscription
              </h1>
              <p className="text-xl text-white/90 drop-shadow">
                Unlock full access to the SEC-Visual Builder Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Status Alert */}
        {isSubscribed && (
          <Alert className="mb-8 border-success bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <AlertTitle className="text-success">Active Subscription</AlertTitle>
            <AlertDescription>
              You have full access to the SEC-Visual Builder Dashboard. Thank you for subscribing!
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Plan Details Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src="/assets/generated/payu-plan-icon-transparent.dim_64x64.png" 
                  alt="PAYU Plan" 
                  className="w-12 h-12"
                />
                <div>
                  <CardTitle className="text-2xl">PAYU Plan</CardTitle>
                  <Badge variant="secondary" className="mt-1">Pay-As-You-Use</Badge>
                </div>
              </div>
              <CardDescription className="text-lg">
                Flexible subscription with daily minimum recharge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">$0.01</span>
                <span className="text-muted-foreground">/day minimum recharge</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Full access to SEC-Visual Builder Dashboard</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited workspace creation and management</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">GPU-accelerated 3D visualization</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Advanced blockchain function blocks</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">AI-powered connectivity validation</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Custom block creation and sharing</span>
                </div>
              </div>

              {!isSubscribed && (
                <Button 
                  size="lg" 
                  className="w-full text-lg"
                  onClick={handleSubscribeClick}
                >
                  <img 
                    src="/assets/generated/subscribe-button-icon-transparent.dim_32x32.png" 
                    alt="" 
                    className="w-5 h-5 mr-2"
                  />
                  Subscribe Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}

              {isSubscribed && (
                <Link to="/workspace">
                  <Button size="lg" className="w-full text-lg" variant="secondary">
                    <Zap className="w-5 h-5 mr-2" />
                    Access Dashboard
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Confirmation Process Card */}
          <Card className="border-2 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Confirmation Process</CardTitle>
              <CardDescription>
                Simple steps to activate your subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Subscribe via PayPal</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the "Subscribe Now" button to complete payment through PayPal's secure platform
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Send Receipt Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      After payment, send a copy of your receipt to our WhatsApp for verification
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Confirm & Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Once verified, confirm your subscription below to unlock full dashboard access
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleWhatsAppClick}
                >
                  <img 
                    src="/assets/generated/whatsapp-confirm-icon-transparent.dim_32x32.png" 
                    alt="" 
                    className="w-5 h-5 mr-2"
                  />
                  Send Receipt via WhatsApp
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>

                {showConfirmation && !isSubscribed && (
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={handleConfirmSubscription}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    I've Sent My Receipt - Confirm Subscription
                  </Button>
                )}
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  WhatsApp: +91 96200 58644
                  <br />
                  Please include your payment receipt and email address for verification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CreditCard className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Flexible Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pay only for what you use with our daily minimum recharge model. No long-term commitments required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-secondary mb-2" />
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All transactions processed through PayPal's secure payment gateway with buyer protection.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageCircle className="w-10 h-10 text-accent mb-2" />
              <CardTitle>Quick Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Direct WhatsApp support for subscription verification and any questions you may have.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What happens after I subscribe?</h4>
              <p className="text-sm text-muted-foreground">
                After completing payment via PayPal, send your receipt to our WhatsApp number. Once verified, you can confirm your subscription on this page to unlock full access to the SEC-Visual Builder Dashboard.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How long does verification take?</h4>
              <p className="text-sm text-muted-foreground">
                Verification is typically completed within a few hours during business hours. You'll receive confirmation via WhatsApp once your subscription is activated.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I cancel my subscription?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time through your PayPal account. Contact us via WhatsApp if you need assistance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What features are included?</h4>
              <p className="text-sm text-muted-foreground">
                Full access includes unlimited workspace creation, GPU-accelerated 3D visualization, all blockchain function blocks, AI-powered connectivity validation, custom block creation, and advanced CAD-style interface features.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        {!isSubscribed && (
          <div className="mt-12 text-center">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-8">
                <img 
                  src="/assets/generated/subscription-success-icon-transparent.dim_64x64.png" 
                  alt="" 
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6">
                  Join now and unlock the full power of visual blockchain programming
                </p>
                <Button size="lg" onClick={handleSubscribeClick}>
                  Subscribe Now - $0.01/day
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
