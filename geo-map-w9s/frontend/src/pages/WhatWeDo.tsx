import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WhatWeDo() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">What We Do</h1>
      <Card>
        <CardHeader>
          <CardTitle>Our Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Geospatial mapping and grid technology solutions...</p>
        </CardContent>
      </Card>
    </main>
  );
}
