import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Lock, Users, Key, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function PermissionsPage() {
  const roles = [
    {
      name: 'Admin',
      color: 'bg-red-500',
      permissions: [
        'Add and manage resources',
        'Verify resource submissions',
        'Add and manage instructors',
        'View all learner data',
        'View all appointments',
        'Manage static pages',
        'Sync external content',
        'Assign user roles',
        'Access sync logs',
        'Manage contact details',
      ],
    },
    {
      name: 'User',
      color: 'bg-blue-500',
      permissions: [
        'View verified resources',
        'View all instructors',
        'Create learner profiles',
        'Book appointments',
        'View own appointments',
        'View own progress',
        'Search with hashtags',
        'View static pages',
        'View contact details',
      ],
    },
    {
      name: 'Guest',
      color: 'bg-gray-500',
      permissions: [
        'No platform access',
        'Must authenticate to use features',
      ],
    },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Shield className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Permissions & Access Control</h1>
        <p className="text-xl text-muted-foreground">
          Understanding user roles and access levels on the E-Tutorial platform.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Role-Based Access Control
            </CardTitle>
            <CardDescription>
              Security through structured permission management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The E-Tutorial platform implements a comprehensive role-based access control (RBAC) system to ensure 
              data security and appropriate feature access. Every user is assigned a role that determines their permissions.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h4 className="font-semibold">Admin</h4>
                <p className="text-xs text-muted-foreground mt-1">Full platform control</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold">User</h4>
                <p className="text-xs text-muted-foreground mt-1">Standard access</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <Key className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <h4 className="font-semibold">Guest</h4>
                <p className="text-xs text-muted-foreground mt-1">No access</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${role.color} flex items-center justify-center`}>
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>{role.name} Role</CardTitle>
                    <CardDescription>
                      {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={role.name === 'Admin' ? 'destructive' : role.name === 'User' ? 'default' : 'secondary'}>
                  {role.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {role.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-2 text-sm">
                    {role.name === 'Guest' ? (
                      <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    )}
                    <span className={role.name === 'Guest' ? 'text-muted-foreground' : ''}>{permission}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Authentication Requirements</CardTitle>
            <CardDescription>
              Internet Identity integration for secure access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              All platform features require authentication through Internet Identity, a blockchain-based authentication 
              system that provides secure, anonymous login without passwords.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">First-time users are assigned the "User" role automatically</p>
                  <p className="text-sm text-muted-foreground">The first user to authenticate becomes an admin</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">Profile setup is required after first login</p>
                  <p className="text-sm text-muted-foreground">Provide your name and email to complete registration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium text-sm">Your Principal ID is your unique identifier</p>
                  <p className="text-sm text-muted-foreground">Used for ownership and access control throughout the platform</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Privacy</CardTitle>
            <CardDescription>
              How your data is protected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Personal Data:</strong> Your learner profiles, appointments, and progress are private and only visible to you and administrators.</span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Public Data:</strong> Verified resources and instructor profiles are visible to all authenticated users.</span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Blockchain Security:</strong> All data is stored on the Internet Computer blockchain with cryptographic security.</span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>No Third Parties:</strong> Your data is never shared with external services without explicit consent.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
