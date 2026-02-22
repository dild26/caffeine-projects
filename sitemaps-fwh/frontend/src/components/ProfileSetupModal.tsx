import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '@/hooks/useQueries';
import { UserProfile } from '@/backend';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched, error } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      createdAt: BigInt(Date.now() * 1000000), // Convert to nanoseconds
    };

    try {
      await saveProfileMutation.mutateAsync(profile);
      toast.success('Profile created successfully!');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

  // Always return a valid React element to prevent React.Children.only errors
  if (!showProfileSetup) {
    return <div className="profile-setup-placeholder" style={{ display: 'none' }} />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 max-w-sm z-50">
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Profile setup error. Please refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to SitemapAI</DialogTitle>
          <DialogDescription className="text-center">
            Please set up your profile to get started with our sitemap subscription platform.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full neon-glow"
            disabled={saveProfileMutation.isPending}
          >
            {saveProfileMutation.isPending ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
