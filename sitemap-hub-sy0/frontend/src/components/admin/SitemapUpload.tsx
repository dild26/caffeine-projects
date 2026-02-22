import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddSitemap } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Upload, FileJson, FileCode } from 'lucide-react';

export default function SitemapUpload() {
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState('');
  const [category, setCategory] = useState('');
  const [tld, setTld] = useState('');
  const { mutateAsync: addSitemap, isPending } = useAddSitemap();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim() || !tld.trim()) {
      toast.error('URL and TLD are required');
      return;
    }

    try {
      await addSitemap({
        url: url.trim(),
        metadata: metadata.trim(),
        category: category.trim() || 'General',
        tld: tld.trim(),
        createdAt: BigInt(Date.now() * 1000000),
      });
      toast.success('Sitemap entry added successfully');
      setUrl('');
      setMetadata('');
      setCategory('');
      setTld('');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to add sitemap entry');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Sitemap Entry
        </CardTitle>
        <CardDescription>Add individual sitemap entries to the database</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              placeholder="https://example.com/page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tld">TLD *</Label>
            <Input
              id="tld"
              placeholder="com, org, net, etc."
              value={tld}
              onChange={(e) => setTld(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Technology, Business, etc."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadata">Metadata</Label>
            <Textarea
              id="metadata"
              placeholder="Additional information about this URL"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Adding...' : 'Add Sitemap Entry'}
          </Button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Bulk Upload (Coming Soon)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload JSON or XML files containing multiple sitemap entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled className="gap-2">
                <FileJson className="h-4 w-4" />
                Upload JSON
              </Button>
              <Button variant="outline" disabled className="gap-2">
                <FileCode className="h-4 w-4" />
                Upload XML
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
