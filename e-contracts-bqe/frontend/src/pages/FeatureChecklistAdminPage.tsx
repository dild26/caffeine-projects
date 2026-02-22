import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetAllFeatureChecklistItems, useUpdateFeatureChecklistItem, useVerifyFeatureChecklistItem, useCreateFeatureChecklistItem, useDeleteFeatureChecklistItem } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
import { FeatureStatus } from '../backend';
import { toast } from 'sonner';

export default function FeatureChecklistAdminPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const { data: checklistItems, isLoading: checklistLoading } = useGetAllFeatureChecklistItems();
  const updateFeature = useUpdateFeatureChecklistItem();
  const verifyFeature = useVerifyFeatureChecklistItem();
  const createFeature = useCreateFeatureChecklistItem();
  const deleteFeature = useDeleteFeatureChecklistItem();

  useEffect(() => {
    if (!isLoading && (!identity || !isAdmin)) {
      navigate({ to: '/access-denied' });
    }
  }, [identity, isAdmin, isLoading, navigate]);

  const handleStatusChange = async (id: string, name: string, description: string, status: FeatureStatus, isVerified: boolean) => {
    try {
      await updateFeature.mutateAsync({ id, name, description, status, isVerified });
      toast.success('Feature status updated');
    } catch (error) {
      toast.error('Failed to update feature status');
    }
  };

  const handleVerifyChange = async (id: string, isVerified: boolean) => {
    try {
      await verifyFeature.mutateAsync({ id, isVerified });
      toast.success(isVerified ? 'Feature verified' : 'Verification removed');
    } catch (error) {
      toast.error('Failed to update verification');
    }
  };

  const handleCreateFeature = async (name: string, description: string) => {
    try {
      await createFeature.mutateAsync({ name, description });
      toast.success('Feature created');
    } catch (error) {
      toast.error('Failed to create feature');
    }
  };

  const handleDeleteFeature = async (id: string) => {
    try {
      await deleteFeature.mutateAsync(id);
      toast.success('Feature deleted');
    } catch (error) {
      toast.error('Failed to delete feature');
    }
  };

  const getStatusColor = (status: FeatureStatus) => {
    switch (status) {
      case FeatureStatus.completed:
      case FeatureStatus.verified:
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case FeatureStatus.started:
      case FeatureStatus.updated:
      case FeatureStatus.upgraded:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case FeatureStatus.pending:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case FeatureStatus.failure:
      case FeatureStatus.cancelled:
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case FeatureStatus.deleted:
      case FeatureStatus.archived:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (isLoading || checklistLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!identity || !isAdmin) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Feature Checklist Admin</h1>
          <p className="text-lg text-muted-foreground">
            Manage and track all feature development with AI-powered auto-completion and verification
          </p>
        </div>

        {/* Features Checklist Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  Features Development Checklist
                </CardTitle>
                <CardDescription>
                  Track the status of all major features and functionalities with AI-powered auto-completion
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Feature
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Feature</DialogTitle>
                    <DialogDescription>
                      Create a new feature checklist item
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const name = formData.get('name') as string;
                      const description = formData.get('description') as string;
                      handleCreateFeature(name, description);
                      (e.target as HTMLFormElement).reset();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name">Feature Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" required />
                    </div>
                    <Button type="submit" className="w-full">Create Feature</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Feature Name</TableHead>
                    <TableHead className="w-[300px]">Description</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead className="w-[100px]">Verified</TableHead>
                    <TableHead className="w-[150px]">Last Updated</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checklistItems && checklistItems.length > 0 ? (
                    checklistItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                        <TableCell>
                          <Select
                            value={item.status}
                            onValueChange={(value) =>
                              handleStatusChange(item.id, item.name, item.description, value as FeatureStatus, item.isVerified)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(FeatureStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                  <Badge variant="outline" className={getStatusColor(status)}>
                                    {status}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={item.isVerified}
                            onCheckedChange={(checked) => handleVerifyChange(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(Number(item.lastUpdated) / 1000000).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteFeature(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No features in checklist. Click "Add Feature" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
