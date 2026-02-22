import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetAllManualPages, useAddManualPage, useRemoveManualPage } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const RESERVED_PAGES = ['dashboard', 'contact', 'data-objects', 'admin', 'sitemap'];

export default function ManualPageManager() {
  const { data: manualPages, isLoading } = useGetAllManualPages();
  const addPageMutation = useAddManualPage();
  const removePageMutation = useRemoveManualPage();
  const [newPageSlug, setNewPageSlug] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateSlug = (slug: string): string | null => {
    if (!slug) return 'Page slug cannot be empty';
    if (slug.length > 50) return 'Page slug must be 50 characters or less';
    if (slug !== slug.toLowerCase()) return 'Page slug must be lowercase';
    if (/\s/.test(slug)) return 'Page slug cannot contain spaces';
    if (!/^[a-z0-9-]+$/.test(slug)) return 'Page slug can only contain lowercase letters, numbers, and hyphens';
    if (RESERVED_PAGES.includes(slug)) return 'This page slug is reserved';
    if (manualPages?.includes(slug)) return 'This page slug already exists';
    return null;
  };

  const handleSlugChange = (value: string) => {
    setNewPageSlug(value);
    const error = validateSlug(value);
    setValidationError(error);
  };

  const handleAddPage = async () => {
    const error = validateSlug(newPageSlug);
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      toast.loading('Adding manual page...', { id: 'add-page' });
      await addPageMutation.mutateAsync(newPageSlug);
      toast.success(`Page "${newPageSlug}" added successfully!`, { id: 'add-page' });
      setNewPageSlug('');
      setValidationError(null);
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to add page';
      toast.error(errorMsg, { id: 'add-page' });
      console.error('Add page error:', error);
    }
  };

  const handleRemovePage = async (slug: string) => {
    try {
      toast.loading(`Removing page "${slug}"...`, { id: 'remove-page' });
      await removePageMutation.mutateAsync(slug);
      toast.success(`Page "${slug}" removed successfully!`, { id: 'remove-page' });
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to remove page';
      toast.error(errorMsg, { id: 'remove-page' });
      console.error('Remove page error:', error);
    }
  };

  const isReserved = (slug: string) => RESERVED_PAGES.includes(slug);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-40" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Manual Page Management
        </CardTitle>
        <CardDescription>
          Add custom page slugs that will be integrated into the public navigation menu. Pages must be lowercase, unique, and contain no spaces.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-slug">New Page Slug</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="page-slug"
                  placeholder="e.g., my-custom-page"
                  value={newPageSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !validationError && newPageSlug) {
                      handleAddPage();
                    }
                  }}
                  className={validationError ? 'border-destructive' : ''}
                />
                {validationError && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validationError}
                  </p>
                )}
              </div>
              <Button
                onClick={handleAddPage}
                disabled={!!validationError || !newPageSlug || addPageMutation.isPending}
              >
                {addPageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Page
              </Button>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Validation rules:</strong> Slugs must be lowercase, contain no spaces, use only letters/numbers/hyphens, and be unique. Reserved pages cannot be added.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Existing Manual Pages</h3>
            <Badge variant="secondary">{manualPages?.length || 0} pages</Badge>
          </div>

          {manualPages && manualPages.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {manualPages.map((slug) => {
                const reserved = isReserved(slug);
                return (
                  <Card key={slug}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{slug}</span>
                          {reserved && (
                            <Badge variant="outline" className="text-xs">
                              Reserved
                            </Badge>
                          )}
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={reserved || removePageMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Manual Page</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove the page "{slug}"? This action cannot be undone and will remove the page from the navigation menu.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemovePage(slug)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No manual pages yet. Add your first custom page above.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
