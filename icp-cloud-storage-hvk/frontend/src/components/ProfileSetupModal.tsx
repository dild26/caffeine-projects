import { useState, useCallback, useMemo } from 'react';
import { useSaveCallerUserProfile, useListTenants, useIsCallerAdmin } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import type { UserProfile, Role } from '../backend';

interface ProfileSetupModalProps {
  onClose: () => void;
}

export default function ProfileSetupModal({ onClose }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tenantId, setTenantId] = useState<string>('');
  const saveProfile = useSaveCallerUserProfile();
  const { data: tenants = [], isLoading: tenantsLoading } = useListTenants();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsCallerAdmin();

  const isFormValid = useMemo(() => {
    // Name and email are always required
    const basicFieldsValid = name.trim() && email.trim();
    
    // For non-admin users with available tenants, tenant selection is required
    // For admin users or when no tenants exist, tenant is optional
    if (!basicFieldsValid) return false;
    
    // If tenants are available and user is not admin, require tenant selection
    if (tenants.length > 0 && !isAdmin && !tenantId) {
      return false;
    }
    
    return true;
  }, [name, email, tenantId, tenants.length, isAdmin]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      roles: ['user' as Role],
      tenantId: tenantId || undefined, // Convert empty string to undefined
      createdAt: BigInt(Date.now() * 1000000),
      lastLogin: BigInt(Date.now() * 1000000),
      status: 'active',
      customMetadata: [],
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success('Profile created successfully!');
      onClose();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create profile';
      toast.error(errorMessage);
      console.error('Profile creation error:', error);
    }
  }, [name, email, tenantId, isFormValid, saveProfile, onClose]);

  const isLoading = tenantsLoading || adminLoading;
  const showTenantField = tenants.length > 0;
  const tenantFieldRequired = showTenantField && !isAdmin;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your information to get started with Gateway Edge.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          {showTenantField && (
            <div className="space-y-2">
              <Label htmlFor="tenant">
                Tenant {tenantFieldRequired && <span className="text-destructive">*</span>}
                {!tenantFieldRequired && <span className="text-muted-foreground text-xs">(Optional)</span>}
              </Label>
              <Select 
                value={tenantId} 
                onValueChange={setTenantId}
                disabled={isLoading}
              >
                <SelectTrigger id="tenant">
                  <SelectValue placeholder={tenantFieldRequired ? "Select a tenant" : "Select a tenant (optional)"} />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {tenantFieldRequired && (
                <p className="text-xs text-muted-foreground">
                  Please select a tenant to continue.
                </p>
              )}
            </div>
          )}
          {!showTenantField && !isLoading && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm text-muted-foreground">
                {isAdmin 
                  ? "No tenants available yet. You can create your profile and add tenants later from the Admin panel."
                  : "No tenants available. Please contact an administrator to set up a tenant for you."}
              </p>
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={saveProfile.isPending || !isFormValid || isLoading}
          >
            {saveProfile.isPending ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
