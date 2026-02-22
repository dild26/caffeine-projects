import { useState } from 'react';
import { useListTenants, useAssignTenantToUser, useListAllUsers } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { UserPlus, Info, Users, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@icp-sdk/core/principal';

export default function UserManagement() {
  const { data: tenants = [] } = useListTenants();
  const { data: allUsers = [], isLoading: usersLoading } = useListAllUsers();
  const assignTenant = useAssignTenantToUser();

  const [principalId, setPrincipalId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [principalError, setPrincipalError] = useState('');

  const validatePrincipal = (value: string): boolean => {
    if (!value.trim()) {
      setPrincipalError('');
      return false;
    }

    try {
      Principal.fromText(value.trim());
      setPrincipalError('');
      return true;
    } catch (error) {
      setPrincipalError('Invalid principal ID format');
      return false;
    }
  };

  const handlePrincipalChange = (value: string) => {
    setPrincipalId(value);
    if (value.trim()) {
      validatePrincipal(value);
    } else {
      setPrincipalError('');
    }
  };

  const handleAssignTenant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePrincipal(principalId)) {
      toast.error('Please enter a valid principal ID');
      return;
    }

    if (!selectedTenantId) {
      toast.error('Please select a tenant');
      return;
    }

    try {
      const principal = Principal.fromText(principalId.trim());
      await assignTenant.mutateAsync({ user: principal, tenantId: selectedTenantId });
      toast.success('Tenant assigned successfully! User can now upload files immediately.', {
        description: 'The tenant assignment has been confirmed and propagated.',
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
      setPrincipalId('');
      setSelectedTenantId('');
      setPrincipalError('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to assign tenant';
      toast.error('Tenant assignment failed', {
        description: errorMessage,
        icon: <AlertCircle className="h-4 w-4" />,
      });
      console.error('Tenant assignment error:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getTenantName = (tenantId: string | undefined) => {
    if (!tenantId) return 'None';
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : tenantId;
  };

  const getRoleName = (role: any) => {
    if (typeof role === 'string') return role;
    return Object.keys(role)[0];
  };

  const isFormValid = principalId.trim() && !principalError && selectedTenantId;

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          As an admin, you can assign tenants to users directly. This allows users to access tenant-specific resources and storage.
          Admin users bypass storage quota checks and have unrestricted storage capabilities.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Tenant to User
          </CardTitle>
          <CardDescription>
            Enter a user's principal ID and select a tenant to assign them access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssignTenant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principalId">
                User Principal ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="principalId"
                placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                value={principalId}
                onChange={(e) => handlePrincipalChange(e.target.value)}
                className={principalError ? 'border-destructive' : ''}
              />
              {principalError && (
                <p className="text-sm text-destructive">{principalError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                The principal ID of the user you want to assign a tenant to
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenantSelect">
                Tenant <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                <SelectTrigger id="tenantSelect">
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No tenants available. Create a tenant first.
                    </div>
                  ) : (
                    tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name} ({tenant.billingPlan})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The tenant that will be assigned to the user
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || assignTenant.isPending || tenants.length === 0}
            >
              {assignTenant.isPending ? 'Assigning...' : 'Assign Tenant'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
          <CardDescription>
            View all registered users with their Principal IDs and tenant assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm text-muted-foreground">Users will appear here once they create profiles</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Principal ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map(([principal, profile]) => (
                    <TableRow key={principal.toText()}>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]" title={principal.toText()}>
                            {principal.toText()}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(principal.toText())}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{profile.name}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        {profile.tenantId.length > 0 ? (
                          <Badge variant="outline">{getTenantName(profile.tenantId[0])}</Badge>
                        ) : (
                          <Badge variant="secondary">No tenant</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {profile.roles.map((role) => {
                            const roleName = getRoleName(role);
                            return (
                              <Badge key={roleName} variant="default" className="text-xs">
                                {roleName}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.status === 'active' ? 'default' : 'secondary'}>
                          {profile.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Storage Privileges</CardTitle>
          <CardDescription>
            Information about admin storage capabilities and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium">Unrestricted Storage Access</h4>
            <p className="text-sm text-muted-foreground">
              Admin users automatically bypass all tenant storage limits and quota checks. This allows admins to:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
              <li>Upload files without storage quota restrictions</li>
              <li>Test storage capabilities without limitations</li>
              <li>Manage system resources without tenant constraints</li>
              <li>Access all tenant data for administrative purposes</li>
            </ul>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm">
              <strong>Note:</strong> Regular users remain subject to their tenant's storage quotas and billing plans.
              Only users with admin role have unrestricted storage access.
            </p>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-sm">
              <strong>Immediate Effect:</strong> Once a tenant is assigned to a user, they can immediately upload files
              and access tenant resources without requiring an app reload. The assignment is confirmed and propagated instantly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
