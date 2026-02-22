import { useState } from 'react';
import { useSaveCallerUserProfile, useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BusinessRole, UserRole } from '../backend';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessRole, setBusinessRole] = useState<BusinessRole>(BusinessRole.viewer);
  const [tenantId, setTenantId] = useState('');

  const saveProfile = useSaveCallerUserProfile();
  const { refetch } = useGetCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !tenantId.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        role: UserRole.user,
        businessRole,
        tenantId: tenantId.trim(),
      });
      toast.success('Profile created successfully!');
      await refetch();
    } catch (error) {
      toast.error('Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Tell us a bit about yourself to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenantId">Organization ID</Label>
              <Input
                id="tenantId"
                placeholder="my-company"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use your company identifier or create a new one
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select value={businessRole} onValueChange={(value) => setBusinessRole(value as BusinessRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BusinessRole.admin}>Admin</SelectItem>
                  <SelectItem value={BusinessRole.sales}>Sales</SelectItem>
                  <SelectItem value={BusinessRole.billing}>Billing</SelectItem>
                  <SelectItem value={BusinessRole.viewer}>Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
              {saveProfile.isPending ? 'Creating Profile...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
