import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useCreateCheckoutSession, useIsStripeConfigured, useIsCallerAdmin } from '../hooks/useQueries';
import PaymentCredentialsModal from '../components/PaymentCredentialsModal';

interface CartItem {
  templateId: string;
  title: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { data: isStripeConfigured } = useIsStripeConfigured();
  const { data: isAdmin } = useIsCallerAdmin();
  const createCheckoutSession = useCreateCheckoutSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentConfig, setShowPaymentConfig] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('econtract-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('econtract-cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (templateId: string, delta: number) => {
    setCart(prev => prev.map(item =>
      item.templateId === templateId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeItem = (templateId: string) => {
    setCart(prev => prev.filter(item => item.templateId !== templateId));
    toast.success('Item removed from cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!isStripeConfigured) {
      toast.error('Payment system not configured. Please contact administrator.');
      if (isAdmin) {
        setShowPaymentConfig(true);
      }
      return;
    }

    if (cartTotal < 0.5) {
      toast.error('Minimum order amount is $0.50');
      return;
    }

    // Validate minimum price per item
    const invalidItems = cart.filter(item => item.price < 0.5);
    if (invalidItems.length > 0) {
      toast.error(`Some items do not meet the minimum price of $0.50: ${invalidItems.map(i => i.title).join(', ')}`);
      return;
    }

    setIsProcessing(true);
    try {
      const items = cart.map(item => ({
        productName: item.title,
        productDescription: `E-Contract template: ${item.title}`,
        priceInCents: BigInt(Math.round(item.price * 100)),
        quantity: BigInt(item.quantity),
        currency: 'USD',
      }));

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const session = await createCheckoutSession.mutateAsync({
        items,
        successUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/payment-failure`,
      });

      window.location.href = session.url;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create checkout session';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground">Review your selected contracts</p>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: '/contracts' })}>
          Continue Shopping
        </Button>
      </div>

      {cart.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Browse our contract templates and add items to your cart
            </p>
            <Button className="rounded-full" onClick={() => navigate({ to: '/contracts' })}>
              Browse Contracts
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartCount})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.templateId} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      {item.price < 0.5 && (
                        <p className="text-xs text-destructive">Below minimum price of $0.50</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.templateId, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.templateId, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(item.templateId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                {cartTotal < 0.5 && (
                  <p className="text-xs text-destructive">
                    Minimum order amount is $0.50
                  </p>
                )}
                <Button
                  className="w-full rounded-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing || cartTotal < 0.5}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                {!isStripeConfigured && isAdmin && (
                  <div className="space-y-2">
                    <p className="text-xs text-destructive text-center">
                      Payment system not configured
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowPaymentConfig(true)}
                    >
                      Configure Payment Gateway
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {isAdmin && (
        <PaymentCredentialsModal
          open={showPaymentConfig}
          onClose={() => setShowPaymentConfig(false)}
        />
      )}
    </div>
  );
}
