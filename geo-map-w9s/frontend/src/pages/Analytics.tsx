import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Analytics() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Analytics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </main>
  );
}
