import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';

function GalleryPageContent() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Image className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Gallery</h1>
            <p className="text-lg text-muted-foreground">
              Manage unmatched uploaded images
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Unmatched Images</CardTitle>
            <CardDescription>
              Images that don't match any workflow filenames
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              No unmatched images found
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <GalleryPageContent />
    </ProtectedRoute>
  );
}
