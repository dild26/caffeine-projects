import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, DollarSign, Users } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

function SubscribersPageContent() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Subscribers</h1>
            <p className="text-lg text-muted-foreground">
              Manage your subscription and access exclusive features
            </p>
          </div>
        </div>

        {/* PAYU Fee Structure */}
        <Card>
          <CardHeader>
            <CardTitle>PAYU Fee Structure</CardTitle>
            <CardDescription>
              Pay As You Use pricing tiers for workflow executions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-4 p-6 rounded-lg border-2 hover:border-primary transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Top 10</Badge>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-primary">$1</p>
                  <p className="text-sm text-muted-foreground">per execution</p>
                </div>
                <p className="text-xs text-muted-foreground">For light usage up to 10 executions</p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border-2 border-accent hover:border-accent/70 transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Top 100</Badge>
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-accent">$10</p>
                  <p className="text-sm text-muted-foreground">per execution</p>
                </div>
                <p className="text-xs text-muted-foreground">For regular usage up to 100 executions</p>
              </div>

              <div className="space-y-4 p-6 rounded-lg border-2 hover:border-primary transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Top 1000</Badge>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-primary">$100</p>
                  <p className="text-sm text-muted-foreground">per execution</p>
                </div>
                <p className="text-xs text-muted-foreground">For power usage up to 1000 executions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Benefits</CardTitle>
            <CardDescription>
              Exclusive features available to subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-primary/10 mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Web-Form Access</p>
                  <p className="text-sm text-muted-foreground">
                    Fill and customize workflow templates with our intuitive web interface
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-primary/10 mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">1-Min Automation</p>
                  <p className="text-sm text-muted-foreground">
                    Download and deploy workflows in under a minute
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-primary/10 mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Priority Support</p>
                  <p className="text-sm text-muted-foreground">
                    Get help faster with dedicated subscriber support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-primary/10 mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Exclusive Workflows</p>
                  <p className="text-sm text-muted-foreground">
                    Access premium workflows not available to non-subscribers
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>
              Your current subscription and usage information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div>
                  <p className="font-medium">Subscription Status</p>
                  <p className="text-sm text-muted-foreground">Active subscriber</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SubscribersPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <SubscribersPageContent />
    </ProtectedRoute>
  );
}
