import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WhyUs() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Why Choose Us</h1>
      <Card>
        <CardHeader>
          <CardTitle>Our Advantages</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Blockchain-based security, precision mapping, advanced features...</p>
        </CardContent>
      </Card>
    </main>
  );
}
