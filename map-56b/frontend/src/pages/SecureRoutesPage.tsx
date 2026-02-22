import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';

interface SecureRoute {
  path: string;
  requiredRoles: string[];
  authMethod: string;
  sitemapVisibility: string;
  description: string;
}

const secureRoutes: SecureRoute[] = [
  {
    path: '/secure',
    requiredRoles: ['Admin', 'AppOwner'],
    authMethod: 'Passkey/WebAuthn',
    sitemapVisibility: 'Hidden from public, visible to authenticated users',
    description: 'P2P Data-Sharing dashboard with create/revoke/approve shares functionality',
  },
  {
    path: '/features',
    requiredRoles: ['Admin'],
    authMethod: 'Passkey/WebAuthn',
    sitemapVisibility: 'Hidden from public, visible to admins',
    description: 'Features management with dual AI and Admin validation',
  },
  {
    path: '/admin',
    requiredRoles: ['Admin'],
    authMethod: 'Passkey/WebAuthn + TOTP',
    sitemapVisibility: 'Hidden from public, visible to admins',
    description: 'Admin control panel for platform management',
  },
  {
    path: '/vault',
    requiredRoles: ['Admin'],
    authMethod: 'Passkey/WebAuthn + TOTP',
    sitemapVisibility: 'Hidden from public, visible to admins',
    description: 'Secure vault for cryptographic operations and key management',
  },
  {
    path: '/secoinfi',
    requiredRoles: ['Admin', 'AppOwner'],
    authMethod: 'Passkey/WebAuthn',
    sitemapVisibility: 'Hidden from public, visible to app owners',
    description: 'SECOINFI integration framework management',
  },
  {
    path: '/manifest',
    requiredRoles: ['Admin'],
    authMethod: 'Passkey/WebAuthn + TOTP',
    sitemapVisibility: 'Hidden from public, visible to admins',
    description: 'Manifest logs and audit trail viewer',
  },
];

export default function SecureRoutesPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Secure Routes Manager
        </h1>
        <p className="text-muted-foreground text-lg">
          Route protection and RBAC configuration for all critical platform routes
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Protected Routes Configuration
          </CardTitle>
          <CardDescription>
            All routes with required roles, authentication methods, and sitemap visibility rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {secureRoutes.map((route) => (
            <Card key={route.path} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <code className="text-primary">{route.path}</code>
                  </CardTitle>
                  <div className="flex gap-2">
                    {route.requiredRoles.map((role) => (
                      <Badge key={role} variant="default">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardDescription>{route.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Authentication Method:</span>
                  <Badge variant="outline">{route.authMethod}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {route.sitemapVisibility.includes('Hidden') ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">Sitemap Visibility:</span>
                  <span className="text-sm text-muted-foreground">{route.sitemapVisibility}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">RBAC Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Guest</span>
              <Badge variant="secondary">Public Access</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Subscriber</span>
              <Badge variant="secondary">Limited Access</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>AppOwner</span>
              <Badge variant="default">App Management</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Admin</span>
              <Badge variant="default">Full Access</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Authentication Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">Passkey/WebAuthn</span>
              <Badge variant="outline">Primary</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium">OAuth2 + TOTP</span>
              <Badge variant="outline">Fallback</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="font-medium">Short-lived JWTs</span>
              <Badge variant="outline">Session</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
