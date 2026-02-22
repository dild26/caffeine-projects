import { useEffect, useState } from 'react';
import { useGetSitemapPages, useIsCallerAdmin } from '../hooks/useQueries';
import { Loader2, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MarkdownEditor from '../components/MarkdownEditor';

interface MarkdownPageProps {
  pageId: string;
}

export default function MarkdownPage({ pageId }: MarkdownPageProps) {
  const { data: pages = [], isLoading, error } = useGetSitemapPages();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [isEditing, setIsEditing] = useState(false);

  const page = pages.find((p) => p.id === pageId);

  useEffect(() => {
    if (page) {
      document.title = `${page.title} – YO-Data`;
    }
  }, [page]);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mb-4 inline-block h-8 w-8 animate-spin text-primary" role="status" aria-label="Loading" />
            <p className="text-muted-foreground">Loading page...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            Page not found or failed to load. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!page.visibility) {
    return (
      <div className="container py-12">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            This page is currently not visible. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isEditing && isAdmin) {
    return (
      <div className="container py-12">
        <MarkdownEditor
          page={page}
          onClose={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight">{page.title}</h1>
            {page.metadata && (
              <p className="text-lg text-muted-foreground">{page.metadata}</p>
            )}
          </div>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {/* Content */}
        <Card>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none p-8">
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simple markdown renderer (basic implementation)
function renderMarkdown(content: string): string {
  let html = content;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');

  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Code blocks
  html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1 py-0.5">$1</code>');

  return html;
}
