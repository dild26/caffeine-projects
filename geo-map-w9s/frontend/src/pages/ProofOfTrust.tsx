import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProofOfTrust() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Proof of Trust</h1>
      <Card>
        <CardHeader>
          <CardTitle>Our Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Blockchain verification, security certifications...</p>
        </CardContent>
      </Card>
    </main>
  );
}
