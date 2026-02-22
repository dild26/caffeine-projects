import { useState, useEffect, useCallback } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useDebouncedSave } from '../hooks/useDebouncedSave';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

type SyncStatus = 'idle' | 'pending' | 'syncing' | 'saved' | 'failed';

export default function UserProfilesTab() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();
  
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setOriginalName(userProfile.name);
    }
  }, [userProfile]);

  useEffect(() => {
    if (isPending) {
      setSyncStatus('syncing');
    }
  }, [isPending]);

  const handleSave = useCallback((profileName: string) => {
    saveProfile(
      { name: profileName.trim() },
      {
        onSuccess: () => {
          setSyncStatus('saved');
          setOriginalName(profileName.trim());
          setTimeout(() => setSyncStatus('idle'), 2000);
        },
        onError: (error) => {
          setSyncStatus('failed');
          toast.error(`Failed to update profile: ${error.message}`);
          setTimeout(() => setSyncStatus('idle'), 3000);
        },
      }
    );
  }, [saveProfile]);

  useDebouncedSave(name, (value) => {
    if (value.trim() && value.trim() !== originalName) {
      setSyncStatus('pending');
      handleSave(value);
    }
  }, 3000);

  const getSyncBadge = () => {
    switch (syncStatus) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'syncing':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Syncing</Badge>;
      case 'saved':
        return <Badge variant="default"><Check className="h-3 w-3 mr-1" />Saved</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Edit your profile information with 3-second debounced auto-save
              </CardDescription>
            </div>
            {getSyncBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (syncStatus === 'idle') {
                  setSyncStatus('pending');
                }
              }}
              placeholder="Enter your name"
            />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Auto-Save:</strong> Changes are automatically saved 3 seconds after you stop typing. 
              Status indicators show sync progress in real-time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
