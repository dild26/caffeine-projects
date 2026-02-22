import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Lock, Sparkles } from 'lucide-react';

interface SubscriptionPromptProps {
  open: boolean;
  onClose: () => void;
}

export default function SubscriptionPrompt({ open, onClose }: SubscriptionPromptProps) {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const subscriptionStatus = localStorage.getItem('eth-sandbox-subscription');
    setIsSubscribed(subscriptionStatus === 'active');
  }, [open]);

  const handleSubscribeClick = () => {
    navigate({ to: '/subscription' });
    onClose();
  };

  if (isSubscribed) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/assets/generated/access-denied-icon-transparent.dim_48x48.png" 
              alt="Subscription Required" 
              className="w-16 h-16"
            />
          </div>
          <DialogTitle className="text-center text-2xl">
            Subscription Required
          </DialogTitle>
          <DialogDescription className="text-center">
            Full access to the SEC-Visual Builder Dashboard requires an active PAYU subscription
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-primary/30 bg-primary/5">
          <Lock className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong className="text-primary">PAYU Plan - $0.01/day</strong>
            <br />
            Unlock unlimited workspace creation, GPU-accelerated 3D visualization, and advanced blockchain tools
          </AlertDescription>
        </Alert>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Full access to all blockchain function blocks</span>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>AI-powered connectivity validation</span>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Custom block creation and sharing</span>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Professional CAD-style 3D interface</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleSubscribeClick}
          >
            View Subscription Plans
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onClose}
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
