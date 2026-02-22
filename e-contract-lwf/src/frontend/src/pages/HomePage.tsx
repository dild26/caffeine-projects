import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, FileCode2, BarChart3, Shield, Zap, Database, Lock } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

export default function HomePage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  if (isInitializing || (isAuthenticated && (profileLoading || adminLoading))) {
    return <LoadingScreen />;
  }

  const features = [
    {
      icon: FileText,
      title: 'Contract Management',
      description: 'Complete lifecycle management for all your contracts with version control and approval workflows.',
      action: () => navigate({ to: '/contracts' }),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Upload,
      title: 'Advanced File Upload',
      description: 'Upload 51+ files with chunking, SHA-256 deduplication, and real-time progress tracking.',
      action: () => navigate({ to: '/upload' }),
      color: 'from-green-500 to-green-600',
    },
    {
      icon: FileCode2,
      title: 'Dynamic Templates',
      description: 'Recursive JSON schema parsing with three-tab detail view and cross-referencing capabilities.',
      action: () => navigate({ to: '/templates' }),
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time analytics, usage statistics, and comprehensive reporting tools.',
      action: () => navigate({ to: '/analytics' }),
      color: 'from-orange-500 to-orange-600',
      adminOnly: true,
    },
    {
      icon: Shield,
      title: 'Blockchain Integration',
      description: 'Ethereum signatures and Zero-Knowledge proofs for enhanced security and privacy.',
      action: () => {},
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Database,
      title: 'Backup & Restore',
      description: 'Comprehensive backup system with audit trails and rollback capabilities.',
      action: () => navigate({ to: '/backup' }),
      color: 'from-cyan-500 to-cyan-600',
      adminOnly: true,
    },
  ];

  const stats = [
    { label: 'Contracts', value: '0', icon: FileText },
    { label: 'Files Uploaded', value: '0', icon: Upload },
    { label: 'Templates', value: '0', icon: FileCode2 },
    { label: 'Active Users', value: '0', icon: Shield },
  ];

  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Zap className="h-4 w-4" />
          Real-time Updates Enabled
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          E-Contracts Management System
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced contract management platform with blockchain integration, file processing, 
          template engine, and comprehensive analytics.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          {isAuthenticated ? (
            <>
              <Button size="lg" onClick={() => navigate({ to: '/contracts' })} className="rounded-full">
                <FileText className="mr-2 h-5 w-5" />
                View Contracts
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/upload' })} className="rounded-full">
                <Upload className="mr-2 h-5 w-5" />
                Upload Files
              </Button>
            </>
          ) : (
            <Button size="lg" onClick={() => navigate({ to: '/contracts' })} className="rounded-full">
              Get Started
            </Button>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {isAuthenticated && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* Features Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
          <p className="text-muted-foreground">
            Everything you need for comprehensive contract management
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features
            .filter((feature) => !feature.adminOnly || isAdmin)
            .map((feature) => (
              <Card
                key={feature.title}
                className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                onClick={feature.action}
              >
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="rounded-lg border bg-card p-8 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Enterprise-Grade Security</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Built on the Internet Computer with role-based access control, blockchain verification, 
          and Zero-Knowledge proofs for maximum security and privacy.
        </p>
      </section>
    </div>
  );
}
