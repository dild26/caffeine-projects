import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Blog() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Latest updates, tutorials, and insights
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Blog posts will be available soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stay tuned for articles about geospatial mapping, grid systems, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
