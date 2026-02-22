import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MultiTaskAuthButtonProps {
  onSubscribe?: () => void;
  className?: string;
}

export default function MultiTaskAuthButton({ onSubscribe, className }: MultiTaskAuthButtonProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [isHovering, setIsHovering] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutConfirmTimer, setLogoutConfirmTimer] = useState<NodeJS.Timeout | null>(null);

  const isAuthenticated = !!identity;
  const isLoading = loginStatus === 'logging-in' || isSubscribing || isLoggingOut;

  useEffect(() => {
    return () => {
      if (logoutConfirmTimer) {
        clearTimeout(logoutConfirmTimer);
      }
    };
  }, [logoutConfirmTimer]);

  const handleLogin = async () => {
    try {
      await login();
      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first to subscribe');
      return;
    }

    setIsSubscribing(true);
    
    // 3-5 second delay for user confirmation
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    if (onSubscribe) {
      onSubscribe();
    } else {
      toast.success('Subscription activated!');
    }
    
    setIsSubscribing(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // 3-5 second delay for user confirmation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await clear();
    queryClient.clear();
    toast.info('Logged out successfully');
    setIsLoggingOut(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      handleLogin();
    } else {
      handleSubscribe();
    }
  };

  const handleDoubleClick = () => {
    if (isAuthenticated) {
      handleLogout();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isAuthenticated) {
      handleLogout();
    }
  };

  const getButtonText = () => {
    if (isLoggingOut) return 'Logging out...';
    if (isSubscribing) return 'Subscribing...';
    if (loginStatus === 'logging-in') return 'Logging in...';
    if (!isAuthenticated) return isHovering ? 'Click to Login' : 'Register/Login';
    return isHovering ? 'Click to Subscribe' : 'Subscribed';
  };

  const getButtonIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (!isAuthenticated) return <LogIn className="h-4 w-4" />;
    if (isHovering) return <CreditCard className="h-4 w-4" />;
    return <LogOut className="h-4 w-4" />;
  };

  return (
    <Button
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isLoading}
      className={`relative transition-all duration-300 ${className}`}
      variant={isAuthenticated ? 'default' : 'outline'}
    >
      {getButtonIcon()}
      <span className="ml-2">{getButtonText()}</span>
      {isAuthenticated && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
          Double-click or Enter to logout
        </span>
      )}
    </Button>
  );
}
