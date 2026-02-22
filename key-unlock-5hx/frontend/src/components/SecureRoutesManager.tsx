import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Unlock, Eye, EyeOff, Shield, Key } from 'lucide-react';
import { useState } from 'react';

interface SecureRoute {
  path: string;
  roles: string[];
  hiddenFromPublic: boolean;
  description: string;
}

const SECURE_ROUTES: SecureRoute[] = [
  {
    path: '/secure',
    roles: ['admin'],
    hiddenFromPublic: true,
    description: 'Secure administrative area with sensitive operations'
  },
  {
    path: '/features',
    roles: ['admin', 'user'],
    hiddenFromPublic: true,
    description: 'Feature management with dual validation system'
  },
  {
    path: '/admin',
    roles: ['admin'],
    hiddenFromPublic: true,
    description: 'Administrative dashboard and controls'
  },
  {
    path: '/vault',
    roles: ['admin'],
    hiddenFromPublic: true,
    description: 'Secure vault for sensitive data storage'
  },
  {
    path: '/secoinfi',
    roles: ['admin'],
    hiddenFromPublic: true,
    description: 'SECOINFI integration management'
  }
];

interface SecureRoutesManagerProps {
  isAdmin: boolean;
  userRole: string;
}

export default function SecureRoutesManager({ isAdmin, userRole }: SecureRoutesManagerProps) {
  const [showHidden, setShowHidden] = useState(false);

  const hasAccess = (route: SecureRoute) => {
    return route.roles.includes(userRole);
  };

  const visibleRoutes = showHidden 
    ? SECURE_ROUTES 
    : SECURE_ROUTES.filter(route => !route.hiddenFromPublic || hasAccess(route));

  return (
    <div className="space-y-6">
      <Card className="card-3d">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gradient">
                <Shield className="w-6 h-6" />
                Secure Routes Manager
              </CardTitle>
              <CardDescription>
                RBAC-protected routes with role-based access control
              </CardDescription>
            </div>
            <img 
              src="/assets/generated/lock-icon-transparent.dim_32x32.png" 
              alt="Lock" 
              className="w-8 h-8"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Key className="w-3 h-3" />
                Your Role: {userRole}
              </Badge>
              {isAdmin && (
                <Badge className="gap-1">
                  <Shield className="w-3 h-3" />
                  Admin Access
                </Badge>
              )}
            </div>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHidden(!showHidden)}
                className="gap-2"
              >
                {showHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showHidden ? 'Hide' : 'Show'} Hidden Routes
              </Button>
            )}
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Restricted routes are hidden from public sitemaps and display lock icons for authenticated users.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {visibleRoutes.map((route) => {
              const userHasAccess = hasAccess(route);
              
              return (
                <Card key={route.path} className={`${userHasAccess ? 'border-primary/50' : 'border-muted'}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {userHasAccess ? (
                            <Unlock className="w-4 h-4 text-green-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {route.path}
                          </code>
                          {route.hiddenFromPublic && (
                            <Badge variant="secondary" className="text-xs">
                              Hidden from Public
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {route.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Required Roles:</span>
                          {route.roles.map((role) => (
                            <Badge 
                              key={role} 
                              variant={role === userRole ? "default" : "outline"}
                              className="text-xs"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        {userHasAccess ? (
                          <Badge className="gap-1 bg-green-500">
                            <Unlock className="w-3 h-3" />
                            Access Granted
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="w-3 h-3" />
                            Access Denied
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="text-lg">RBAC Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Role Hierarchy</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge>admin</Badge>
                  <span className="text-sm text-muted-foreground">Full access to all routes and operations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">user</Badge>
                  <span className="text-sm text-muted-foreground">Access to user-level features and content</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">guest</Badge>
                  <span className="text-sm text-muted-foreground">Read-only access to public content</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Security Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• YAML-driven RBAC configuration</li>
                <li>• Cryptographic route protection</li>
                <li>• Hidden routes from public sitemaps</li>
                <li>• Lock icon indicators for authenticated users</li>
                <li>• Audit trail for all access attempts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
