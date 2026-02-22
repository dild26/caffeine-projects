import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { validateUserProfile, getFieldError, ValidationError } from '../lib/validation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors([]);

    // Validate input
    const validation = validateUserProfile({ name: name.trim() });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success('Profile created successfully!');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create profile';
      toast.error(errorMessage);
      console.error('Profile setup error:', error);
    }
  };

  const nameError = getFieldError(validationErrors, 'name');

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome!</CardTitle>
        <CardDescription>Let's set up your profile to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <div key={index}>• {error.message}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name" className={nameError ? 'text-destructive' : ''}>
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name (2-100 characters)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saveProfile.isPending}
              className={nameError ? 'border-destructive' : ''}
              autoFocus
            />
            {nameError && (
              <p className="text-sm text-destructive">{nameError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Letters, spaces, hyphens, and apostrophes only
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating Profile...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
