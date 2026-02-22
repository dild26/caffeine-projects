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
import { FileText, Mic, Volume2, Shield, Zap, Globe, Users, Lock, Cloud, CheckCircle, Plus, Trash2, RefreshCw } from 'lucide-react';
import { FeatureStatus } from '../backend';
import { toast } from 'sonner';

export default function FeaturesPage() {
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

  const features = [
    {
      icon: FileText,
      title: 'Contract Management',
      description: 'Create, edit, and manage digital contracts with an intuitive interface.',
      details: ['Template library', 'Custom fields', 'Version control', 'Status tracking'],
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Control the platform using natural voice commands.',
      details: ['Navigate pages', 'Create contracts', 'Search functionality', 'Hands-free operation'],
    },
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Listen to contract content and system responses.',
      details: ['Contract previews', 'AI responses', 'Accessibility support', 'Multiple languages'],
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Decentralized storage ensures data integrity and security.',
      details: ['Immutable records', 'Cryptographic signatures', 'Tamper-proof', 'Audit trail'],
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Lightning-fast processing and real-time updates.',
      details: ['Instant search', 'Quick loading', 'Real-time sync', 'Optimized queries'],
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your contracts from anywhere in the world.',
      details: ['Cloud-based', 'Multi-device', 'Offline support', '24/7 availability'],
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Work together with multiple parties on contracts.',
      details: ['Multi-party contracts', 'Role-based access', 'Comments', 'Notifications'],
    },
    {
      icon: Lock,
      title: 'Privacy Controls',
      description: 'Advanced privacy settings to protect sensitive information.',
      details: ['Encryption', 'Access control', 'Data privacy', 'GDPR compliant'],
    },
    {
      icon: Cloud,
      title: 'Cloud Integration',
      description: 'Seamless integration with cloud storage and services.',
      details: ['Auto backup', 'Export options', 'API access', 'Third-party integrations'],
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Platform Features</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Discover the powerful features that make E-Contracts the leading platform for digital contract management
          </p>
        </div>

        {/* Features Checklist Section */}
        <Card className="mb-12">
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

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Need More Information?</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Contact our team to learn more about how E-Contracts can transform your workflow
          </p>
        </div>
      </div>
    </div>
  );
}
