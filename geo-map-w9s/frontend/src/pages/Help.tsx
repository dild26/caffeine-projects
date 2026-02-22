import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Help() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Help & Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Documentation and support resources coming soon...</p>
        </CardContent>
      </Card>
    </main>
  );
}
