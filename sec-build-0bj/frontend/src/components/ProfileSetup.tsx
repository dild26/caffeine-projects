import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: undefined,
        preferences: undefined
      });
      toast.success('Profile created successfully!');
    } catch (err: any) {
      console.error('Profile setup error:', err);
      setError(err.message || 'Failed to create profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome!</CardTitle>
          </div>
          <CardDescription>
            Let's set up your profile to get started with Ethereum Visual Sandbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saveProfile.isPending}
                autoFocus
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                This name will be used to identify your workspaces and custom blocks
              </p>
            </div>

            <Button
              type="submit"
              disabled={saveProfile.isPending || !name.trim()}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {saveProfile.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started
                </>
              )}
            </Button>

            <div className="pt-4 border-t space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>What's next?</strong>
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Explore 35+ blockchain function blocks</li>
                <li>Create visual workflows with drag-and-drop</li>
                <li>Experience GPU-accelerated 3D rendering</li>
                <li>Save and share your blockchain designs</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
