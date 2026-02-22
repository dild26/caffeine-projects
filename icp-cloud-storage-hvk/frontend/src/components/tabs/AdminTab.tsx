import { useState } from 'react';
import { useListPolicies, useCreatePolicy, useListTenants, useCreateTenant, useIsStripeConfigured, useSetStripeConfiguration, useListAllUsers, useAssignTenantToUser } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Shield, Building2, CreditCard, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { StripeConfiguration } from '../../backend';
import type { Policy, Tenant } from '../../types';
import UserManagement from '../UserManagement';

export default function AdminTab() {
  const { data: policies = [], isLoading: policiesLoading } = useListPolicies();
  const { data: tenants = [], isLoading: tenantsLoading } = useListTenants();
  const { data: isStripeConfigured = false } = useIsStripeConfigured();
  const { data: users = [] } = useListAllUsers();
  const createPolicy = useCreatePolicy();
  const createTenant = useCreateTenant();
  const setStripeConfiguration = useSetStripeConfiguration();
  const assignTenantToUser = useAssignTenantToUser();

  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyType, setNewPolicyType] = useState('');
  const [newPolicyDescription, setNewPolicyDescription] = useState('');
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantQuota, setNewTenantQuota] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeCountries, setStripeCountries] = useState('US,CA,GB');

  const handleCreatePolicy = async () => {
    if (!newPolicyName || !newPolicyType) {
      toast.error('Policy name and type are required');
      return;
    }

    try {
      const policy: Policy = {
        id: `policy_${Date.now()}`,
        name: newPolicyName,
        type_: newPolicyType,
        rules: [],
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        status: 'active',
        description: newPolicyDescription,
        customMetadata: [],
      };

      await createPolicy.mutateAsync(policy);
      toast.success('Policy created successfully');
      setNewPolicyName('');
      setNewPolicyType('');
      setNewPolicyDescription('');
    } catch (error) {
      toast.error('Failed to create policy');
      console.error(error);
    }
  };

  const handleCreateTenant = async () => {
    if (!newTenantName || !newTenantQuota) {
      toast.error('Tenant name and quota are required');
      return;
    }

    try {
      const tenant: Tenant = {
        id: `tenant_${Date.now()}`,
        name: newTenantName,
        createdAt: BigInt(Date.now() * 1000000),
        owner: users[0]?.[0] || null as any,
        storageQuota: BigInt(parseInt(newTenantQuota) * 1024 * 1024 * 1024),
        usedStorage: BigInt(0),
        billingPlan: 'standard',
        status: 'active',
        customMetadata: [],
      };

      await createTenant.mutateAsync(tenant);
      toast.success('Tenant created successfully');
      setNewTenantName('');
      setNewTenantQuota('');
    } catch (error) {
      toast.error('Failed to create tenant');
      console.error(error);
    }
  };

  const handleConfigureStripe = async () => {
    if (!stripeSecretKey || !stripeCountries) {
      toast.error('Stripe secret key and countries are required');
      return;
    }

    try {
      const config: StripeConfiguration = {
        secretKey: stripeSecretKey,
        allowedCountries: stripeCountries.split(',').map(c => c.trim()),
      };

      await setStripeConfiguration.mutateAsync(config);
      toast.success('Stripe configured successfully');
      setStripeSecretKey('');
    } catch (error) {
      toast.error('Failed to configure Stripe');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
        <p className="text-muted-foreground">Manage system policies, tenants, users, and payment configuration</p>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">
            <Shield className="h-4 w-4 mr-2" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="tenants">
            <Building2 className="h-4 w-4 mr-2" />
            Tenants
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="stripe">
            <CreditCard className="h-4 w-4 mr-2" />
            Stripe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Policy</CardTitle>
              <CardDescription>Define new system policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="policyName">Policy Name</Label>
                  <Input
                    id="policyName"
                    placeholder="Retention Policy"
                    value={newPolicyName}
                    onChange={(e) => setNewPolicyName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="policyType">Policy Type</Label>
                  <Input
                    id="policyType"
                    placeholder="retention"
                    value={newPolicyType}
                    onChange={(e) => setNewPolicyType(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="policyDescription">Description</Label>
                  <Input
                    id="policyDescription"
                    placeholder="Policy description"
                    value={newPolicyDescription}
                    onChange={(e) => setNewPolicyDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreatePolicy} disabled={createPolicy.isPending}>
                  Create Policy
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Policies</CardTitle>
              <CardDescription>View and manage system policies</CardDescription>
            </CardHeader>
            <CardContent>
              {policiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : policies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No policies found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">{policy.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{policy.type_}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{policy.description}</TableCell>
                        <TableCell>
                          <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                            {policy.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Tenant</CardTitle>
              <CardDescription>Add a new tenant to the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="tenantName">Tenant Name</Label>
                  <Input
                    id="tenantName"
                    placeholder="Acme Corp"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tenantQuota">Storage Quota (GB)</Label>
                  <Input
                    id="tenantQuota"
                    type="number"
                    placeholder="100"
                    value={newTenantQuota}
                    onChange={(e) => setNewTenantQuota(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateTenant} disabled={createTenant.isPending}>
                  Create Tenant
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Tenants</CardTitle>
              <CardDescription>View and manage tenants</CardDescription>
            </CardHeader>
            <CardContent>
              {tenantsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : tenants.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No tenants found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Quota</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>{(Number(tenant.storageQuota) / (1024 * 1024 * 1024)).toFixed(2)} GB</TableCell>
                        <TableCell>{(Number(tenant.usedStorage) / (1024 * 1024 * 1024)).toFixed(2)} GB</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tenant.billingPlan}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                            {tenant.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="stripe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Configuration</CardTitle>
              <CardDescription>
                {isStripeConfigured ? 'Stripe is configured' : 'Configure Stripe payment processing'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="stripeKey">Secret Key</Label>
                  <Input
                    id="stripeKey"
                    type="password"
                    placeholder="sk_test_..."
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stripeCountries">Allowed Countries (comma-separated)</Label>
                  <Input
                    id="stripeCountries"
                    placeholder="US,CA,GB"
                    value={stripeCountries}
                    onChange={(e) => setStripeCountries(e.target.value)}
                  />
                </div>
                <Button onClick={handleConfigureStripe} disabled={setStripeConfiguration.isPending}>
                  {isStripeConfigured ? 'Update Configuration' : 'Configure Stripe'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
