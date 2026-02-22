import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield } from 'lucide-react';

export default function UserManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>View and manage platform users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold">10,234</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold">8,901</div>
              <div className="text-sm text-muted-foreground">Active Subscriptions</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold">1,333</div>
              <div className="text-sm text-muted-foreground">Free Users</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role Management
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              User roles are managed through the backend access control system. Admins have full platform access.
            </p>
            <div className="flex gap-2">
              <Badge variant="default">Admin</Badge>
              <Badge variant="secondary">User</Badge>
              <Badge variant="outline">Guest</Badge>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Advanced user management features including user search, role assignment, and subscription management are
              coming soon.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
