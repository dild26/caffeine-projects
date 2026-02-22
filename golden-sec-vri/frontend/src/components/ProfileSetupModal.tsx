import { useState } from 'react';
import { useSaveCallerUserProfile, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { auditLogger } from '../lib/auditLogger';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState('');
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending, isError, error, isSuccess } = useSaveCallerUserProfile();

  const isAuthenticated = !!identity;

  // Only show modal if user is authenticated, profile is loaded, and no profile exists
  const showModal = isAuthenticated && !profileLoading && isFetched && userProfile === null && !isSuccess;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationError('');

    // Trim whitespace
    const trimmedName = name.trim();

    // Validate name is not empty
    if (!trimmedName) {
      setValidationError('Please enter your name');
      return;
    }

    // Validate name length
    if (trimmedName.length < 2) {
      setValidationError('Name must be at least 2 characters long');
      return;
    }

    if (trimmedName.length > 100) {
      setValidationError('Name must be less than 100 characters');
      return;
    }

    // Start audit logging
    const { correlationId, startTime } = auditLogger.startOperation(
      'authentication',
      'profile_setup',
      { nameLength: trimmedName.length }
    );

    // Save profile
    saveProfile(
      { name: trimmedName },
      {
        onSuccess: () => {
          auditLogger.endOperation(
            'authentication',
            'profile_setup',
            correlationId,
            startTime,
            true,
            { name: trimmedName }
          );
          
          toast.success('Profile Created', {
            description: `Welcome, ${trimmedName}! Your profile has been set up successfully.`,
          });

          // Clear form
          setName('');
          setValidationError('');
        },
        onError: (err) => {
          const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
          
          auditLogger.endOperation(
            'authentication',
            'profile_setup',
            correlationId,
            startTime,
            false,
            { error: errorMessage }
          );

          auditLogger.error(
            'authentication',
            'profile_setup_failed',
            err instanceof Error ? err : new Error(errorMessage),
            { name: trimmedName },
            correlationId
          );

          setValidationError(errorMessage);
          
          toast.error('Profile Setup Failed', {
            description: errorMessage,
          });
        },
      }
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <Dialog open={true}>
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to SECoin!</DialogTitle>
          <DialogDescription className="text-base">
            Please enter your name to complete your profile setup and start exploring property investments.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={handleNameChange}
              disabled={isPending}
              autoFocus
              autoComplete="name"
              className={validationError ? 'border-destructive focus-visible:ring-destructive' : ''}
              aria-invalid={!!validationError}
              aria-describedby={validationError ? 'name-error' : undefined}
            />
            {validationError && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription id="name-error" className="text-sm">
                  {validationError}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {isError && error && !validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!name.trim() || isPending}
            aria-label={isPending ? 'Saving profile...' : 'Continue to complete profile setup'}
          >
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving Profile...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Continue
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your profile information is stored securely on the Internet Computer blockchain.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

