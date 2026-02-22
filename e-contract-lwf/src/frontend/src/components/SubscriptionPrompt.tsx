import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface SubscriptionPromptProps {
  message?: string;
  className?: string;
}

export default function SubscriptionPrompt({ 
  message = "Subscribe to unlock interactive template features and participate in the referral program!",
  className = ""
}: SubscriptionPromptProps) {
  const navigate = useNavigate();

  return (
    <Alert className={`border-primary bg-primary/5 ${className}`}>
      <Crown className="h-5 w-5 text-primary" />
      <AlertDescription className="ml-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-base mb-1">Unlock Premium Features</p>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <Button 
            className="ml-4 shrink-0"
            onClick={() => navigate({ to: '/dashboard' })}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Subscribe Now
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
