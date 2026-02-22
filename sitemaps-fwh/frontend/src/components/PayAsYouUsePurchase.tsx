import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePurchasePayAsYouUseBatch, useGetPayAsYouUsePurchases, useIsStripeConfigured } from '@/hooks/useQueries';
import { createPayAsYouUseShoppingItem } from '@/hooks/useStripePayment';
import StripePaymentModal from './StripePaymentModal';
import { ShoppingCart, Loader2, CheckCircle, Package, Zap, Star, TrendingUp, Clock, Shield, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const BATCH_OPTIONS = [
  { 
    size: 10, 
    price: 0.01, 
    label: 'Top 10',
    description: 'One-time/lifetime access to top 10 highest quality domains with instant access, full sitemap data, quality scores, and backlink info.',
    features: ['Instant access', 'Full sitemap data', 'Quality scores', 'Backlink info'],
    popular: false
  },
  { 
    size: 100, 
    price: 0.1, 
    label: 'Top 100',
    description: 'One-time/lifetime access to top 100 highest quality domains with instant access, full sitemap data, quality scores, and backlink info.',
    features: ['Instant access', 'Full sitemap data', 'Quality scores', 'Backlink info'],
    popular: true
  },
  { 
    size: 1000, 
    price: 1, 
    label: 'Top 1,000',
    description: 'One-time/lifetime access to top 1,000 highest quality domains with instant access, full sitemap data, quality scores, and backlink info.',
    features: ['Instant access', 'Full sitemap data', 'Quality scores', 'Backlink info'],
    popular: false
  },
  { 
    size: 10000, 
    price: 10, 
    label: 'Top 10,000',
    description: 'One-time/lifetime access to top 10,000 highest quality domains with instant access, full sitemap data, quality scores, and backlink info.',
    features: ['Instant access', 'Full sitemap data', 'Quality scores', 'Backlink info'],
    popular: false
  },
  { 
    size: 100000, 
    price: 100, 
    label: 'Top 100,000',
    description: 'One-time/lifetime access to top 100,000 highest quality domains with instant access, full sitemap data, quality scores, and backlink info.',
    features: ['Instant access', 'Full sitemap data', 'Quality scores', 'Backlink info'],
    popular: false
  },
  { 
    size: 1000000, 
    price: 1000, 
    label: 'Top 1,000,000',
    description: 'One-time/lifetime access to top 1,000,000 highest quality domains with instant access, full sitemap data, quality scores, and backlink info.',
    features: ['Instant access', 'Full sitemap data', 'Quality scores', 'Backlink info'],
    popular: false
  },
];

export default function PayAsYouUsePurchase() {
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  const { data: purchases = [], refetch } = useGetPayAsYouUsePurchases();
  const purchaseMutation = usePurchasePayAsYouUseBatch();
  const { data: isStripeConfigured = false } = useIsStripeConfigured();

  const selectedOption = BATCH_OPTIONS.find(option => option.size === selectedBatch);
  
  const totalQuota = purchases.reduce((total, purchase) => total + Number(purchase.remainingQuota), 0);
  const totalPurchased = purchases.reduce((total, purchase) => total + Number(purchase.batchSize), 0);

  const handlePurchase = async () => {
    if (!selectedBatch) return;

    if (!isStripeConfigured) {
      toast.error('Payment system is not configured. Please contact support.');
      return;
    }

    setPaymentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Pay As You Use Header */}
      <Card className="cyber-gradient border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-primary" />
            Pay As You Use - Domain Batch Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg font-medium">
              Choose from our carefully curated domain batches with one-time payment and lifetime access
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              All batch options provide one-time/lifetime access to the highest quality domains with instant access, 
              full sitemap data, quality scores, and backlink information. No recurring fees, just pay once and access forever.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Quota Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Your Current Quota Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-3xl font-bold text-primary">{totalQuota.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Remaining Domain Searches</div>
              <div className="text-xs text-muted-foreground mt-1">Ready to use immediately</div>
            </div>
            <div className="text-center p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="text-3xl font-bold text-accent">{totalPurchased.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Domains Purchased</div>
              <div className="text-xs text-muted-foreground mt-1">Lifetime purchase history</div>
            </div>
            <div className="text-center p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
              <div className="text-3xl font-bold text-green-500">{purchases.length}</div>
              <div className="text-sm text-muted-foreground">Active Batch Purchases</div>
              <div className="text-xs text-muted-foreground mt-1">Current active batches</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Batch Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Choose Your Domain Batch Size</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Batch Selection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {BATCH_OPTIONS.map((option) => (
              <div
                key={option.size}
                className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
                  selectedBatch === option.size
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-muted hover:border-primary/50 hover:bg-primary/2'
                } ${option.popular ? 'ring-2 ring-accent/30' : ''}`}
                onClick={() => setSelectedBatch(option.size)}
              >
                {option.popular && (
                  <Badge className="absolute -top-2 left-4 bg-accent text-accent-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Best Value
                  </Badge>
                )}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{option.label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-primary">${option.price}</div>
                      <div className="text-xs text-muted-foreground">
                        One-time payment
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      {option.size.toLocaleString()} highest quality domains
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {option.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Option Details */}
          {selectedOption && (
            <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-xl text-primary">{selectedOption.label}</h3>
                  <p className="text-sm text-muted-foreground">{selectedOption.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">${selectedOption.price}</div>
                  <div className="text-sm text-muted-foreground">
                    One-time/Lifetime Access
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-background/50 rounded border">
                  <span className="text-muted-foreground block">Domains</span>
                  <div className="font-bold text-primary">{selectedOption.size.toLocaleString()}</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded border">
                  <span className="text-muted-foreground block">Access</span>
                  <div className="font-bold text-accent">Instant</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded border">
                  <span className="text-muted-foreground block">Quality</span>
                  <div className="font-bold text-green-500">Highest</div>
                </div>
                <div className="text-center p-3 bg-background/50 rounded border">
                  <span className="text-muted-foreground block">Duration</span>
                  <div className="font-bold text-purple-500">Lifetime</div>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <Button 
            onClick={handlePurchase}
            disabled={!selectedBatch || purchaseMutation.isPending || !isStripeConfigured}
            className="w-full neon-glow"
            size="lg"
          >
            {purchaseMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Your Purchase...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Purchase {selectedOption ? selectedOption.label : 'Selected Batch'}
                {selectedOption && ` - $${selectedOption.price}`}
              </>
            )}
          </Button>

          {showSuccess && (
            <Alert className="border-green-500 bg-green-500/5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                🎉 Batch purchased successfully! Your quota has been updated and you can start processing domains immediately. 
                Check your dashboard for the latest quota information.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Purchase History */}
      {purchases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Purchase History & Active Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {purchases.map((purchase, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{Number(purchase.batchSize).toLocaleString()} Domain Batch</div>
                      <div className="text-sm text-muted-foreground">
                        Purchased: {new Date(Number(purchase.purchaseDate) / 1000000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary text-lg">{Number(purchase.remainingQuota).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      of {Number(purchase.batchSize).toLocaleString()} remaining
                    </div>
                    <div className="text-xs text-green-600">
                      {Math.round((Number(purchase.remainingQuota) / Number(purchase.batchSize)) * 100)}% available
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Why Choose Pay As You Use */}
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Why Choose Pay As You Use?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-4xl">💰</div>
              <h3 className="font-semibold">No Recurring Fees</h3>
              <p className="text-sm text-muted-foreground">
                Pay once and access your purchased domains forever. No monthly subscriptions or hidden costs.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">⚡</div>
              <h3 className="font-semibold">Instant Access</h3>
              <p className="text-sm text-muted-foreground">
                Get immediate access to your domain data with lightning-fast processing and real-time results.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🔒</div>
              <h3 className="font-semibold">Lifetime Access</h3>
              <p className="text-sm text-muted-foreground">
                Your purchased domain data remains accessible forever with lifetime access to all features.
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-green-600">Key Benefits</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <ul className="space-y-1">
                <li>• One-time payment for lifetime access</li>
                <li>• Top highest quality domains only</li>
                <li>• Instant access to full sitemap data</li>
                <li>• Complete quality scores included</li>
              </ul>
              <ul className="space-y-1">
                <li>• Comprehensive backlink information</li>
                <li>• No monthly subscriptions required</li>
                <li>• Perfect for project-based work</li>
                <li>• Transparent, upfront pricing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stripe Payment Modal */}
      {selectedBatch && (
        <StripePaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          shoppingItem={createPayAsYouUseShoppingItem(selectedBatch)}
          paymentType="payAsYouUse"
        />
      )}
    </div>
  );
}
