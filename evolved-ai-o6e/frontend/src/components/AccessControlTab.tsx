import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AccessControlTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Access Control System</CardTitle>
          <CardDescription>
            Role-based access control with admin and user permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Admin Role</h3>
              <p className="text-sm text-muted-foreground text-center mb-3">
                Full system access with configuration and management capabilities
              </p>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
              <Users className="h-12 w-12 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">User Role</h3>
              <p className="text-sm text-muted-foreground text-center mb-3">
                Standard access with read permissions and profile management
              </p>
              <Badge variant="secondary">Active</Badge>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg border bg-card">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Guest Role</h3>
              <p className="text-sm text-muted-foreground text-center mb-3">
                Limited access for unauthenticated users
              </p>
              <Badge variant="outline">Restricted</Badge>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold">Permission Matrix</h4>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Action</th>
                    <th className="text-center p-3 font-medium">Admin</th>
                    <th className="text-center p-3 font-medium">User</th>
                    <th className="text-center p-3 font-medium">Guest</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3">View Modules</td>
                    <td className="text-center p-3">✓</td>
                    <td className="text-center p-3">✓</td>
                    <td className="text-center p-3">✗</td>
                  </tr>
                  <tr>
                    <td className="p-3">Edit Modules</td>
                    <td className="text-center p-3">✓</td>
                    <td className="text-center p-3">✗</td>
                    <td className="text-center p-3">✗</td>
                  </tr>
                  <tr>
                    <td className="p-3">Manage Blueprints</td>
                    <td className="text-center p-3">✓</td>
                    <td className="text-center p-3">✗</td>
                    <td className="text-center p-3">✗</td>
                  </tr>
                  <tr>
                    <td className="p-3">Import Fixtures</td>
                    <td className="text-center p-3">✓</td>
                    <td className="text-center p-3">✗</td>
                    <td className="text-center p-3">✗</td>
                  </tr>
                  <tr>
                    <td className="p-3">Assign Roles</td>
                    <td className="text-center p-3">✓</td>
                    <td className="text-center p-3">✗</td>
                    <td className="text-center p-3">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> The first caller to initialize the system automatically becomes an admin. 
              Additional admins can be assigned through the role management system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
