import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Templates() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Templates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Map Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Pre-configured map templates coming soon...</p>
        </CardContent>
      </Card>
    </main>
  );
}
