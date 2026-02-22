import { useGetCallerUserProfile, useListTenants, useListFiles, useListBillingRecords } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { HardDrive, Files, TrendingUp, DollarSign } from 'lucide-react';
import { formatBytes } from '../../lib/utils';

export default function OverviewTab() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: tenants = [] } = useListTenants();
  const { data: files = [] } = useListFiles();
  const { data: billingRecords = [] } = useListBillingRecords();

  const currentTenant = tenants.find(t => t.id === userProfile?.tenantId);
  const storageUsed = currentTenant ? Number(currentTenant.usedStorage) : 0;
  const storageQuota = currentTenant ? Number(currentTenant.storageQuota) : 1;
  const storagePercentage = (storageUsed / storageQuota) * 100;

  const totalFiles = files.length;
  const totalSize = files.reduce((acc, file) => acc + Number(file.size), 0);
  const totalBilling = billingRecords.reduce((acc, record) => acc + Number(record.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {userProfile?.name || 'User'}!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your storage and activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(storageUsed)}</div>
            <p className="text-xs text-muted-foreground">
              of {formatBytes(storageQuota)} total
            </p>
            <Progress value={storagePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              {formatBytes(totalSize)} total size
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {files.filter(f => {
                const fileDate = new Date(Number(f.createdAt) / 1000000);
                const now = new Date();
                return fileDate.getMonth() === now.getMonth() && fileDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">files uploaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billing</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalBilling / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {billingRecords.length} invoices
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tenant Information</CardTitle>
            <CardDescription>Your current tenant details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentTenant ? (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tenant Name:</span>
                  <span className="text-sm font-medium">{currentTenant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Billing Plan:</span>
                  <span className="text-sm font-medium capitalize">{currentTenant.billingPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm font-medium capitalize">{currentTenant.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm font-medium">
                    {new Date(Number(currentTenant.createdAt) / 1000000).toLocaleDateString()}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No tenant information available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest file operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.slice(0, 5).map((file) => (
                <div key={file.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Number(file.createdAt) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatBytes(Number(file.size))}
                  </span>
                </div>
              ))}
              {files.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
