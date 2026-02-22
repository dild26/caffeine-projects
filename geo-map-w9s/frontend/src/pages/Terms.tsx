import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: November 6, 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              By accessing and using GPS Grid Maps, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Use License</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Permission is granted to temporarily use GPS Grid Maps for personal or commercial purposes under the terms of your subscription plan.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Data Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We are committed to protecting your privacy. All user data is stored securely on the Internet Computer blockchain.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Subscription and Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Subscription fees are billed monthly. You may cancel your subscription at any time through your account settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
