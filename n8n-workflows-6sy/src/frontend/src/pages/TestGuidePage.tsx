import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

function TestGuidePageContent() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <FileCheck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Test Guide</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive testing guide for admins and subscribers
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Testing Procedures</CardTitle>
            <CardDescription>
              Step-by-step walkthrough for testing all system features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This guide covers testing for purchase flow, payment methods, authentication,
                webhook configuration, theme toggle, validation systems, and more.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TestGuidePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <TestGuidePageContent />
    </ProtectedRoute>
  );
}
