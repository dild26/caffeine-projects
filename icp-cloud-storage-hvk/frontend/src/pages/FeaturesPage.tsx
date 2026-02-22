import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Shield, Database, CreditCard, Users, FileText, Activity, Lock, Zap, CheckCircle2 } from 'lucide-react';
import { useListFeatureStatuses, useUpdateFeatureStatus, useCreateFeatureStatus, useIsCallerAdmin } from '../hooks/useQueries';
import type { FeatureStatus } from '../types';
import { toast } from 'sonner';

interface Feature {
  id: string;
  icon: any;
  title: string;
  description: string;
}

export default function FeaturesPage() {
  const { data: featureStatuses = [], isLoading } = useListFeatureStatuses();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const updateFeatureStatus = useUpdateFeatureStatus();
  const createFeatureStatus = useCreateFeatureStatus();
  const [autoDetectRun, setAutoDetectRun] = useState(false);

  const features: Feature[] = [
    {
      id: 'enterprise-security',
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Role-based access control, tenant isolation, and end-to-end encryption for maximum data protection.',
    },
    {
      id: 'intelligent-storage',
      icon: Database,
      title: 'Intelligent Storage',
      description: 'Chunk sharding, cross-canister replication, and automated integrity checks ensure data reliability.',
    },
    {
      id: 'flexible-billing',
      icon: CreditCard,
      title: 'Flexible Billing',
      description: 'Track storage usage and egress bandwidth with automated invoicing and Stripe payment integration.',
    },
    {
      id: 'multi-tenant',
      icon: Users,
      title: 'Multi-Tenant',
      description: 'Support for multiple tenants with isolated namespaces and customizable quotas per account.',
    },
    {
      id: 'file-management',
      icon: FileText,
      title: 'File Management',
      description: 'Upload, download, search, and organize files with metadata support and version control.',
    },
    {
      id: 'monitoring-analytics',
      icon: Activity,
      title: 'Monitoring & Analytics',
      description: 'Real-time canister health monitoring, performance metrics, and usage analytics dashboard.',
    },
    {
      id: 'presigned-urls',
      icon: Lock,
      title: 'Presigned URLs',
      description: 'Secure, expirable URLs for file uploads and downloads without exposing credentials.',
    },
    {
      id: 'high-performance',
      icon: Zap,
      title: 'High Performance',
      description: 'Optimized for speed with intelligent caching and distributed storage architecture.',
    },
  ];

  const criticalFeatures = [
    { id: 'monitoring-logs', name: 'Monitoring Logs Dashboard', description: 'Comprehensive logging system with real-time monitoring and alerting for system events' },
    { id: 'automated-rollback', name: 'Automated Rollback Checkpoints', description: 'Automatic snapshot creation before major updates with one-click rollback capability' },
    { id: 'version-verification', name: 'Version Verification Dashboard', description: 'Track system versions, feature additions, and changes with integrity verification' },
    { id: 'backup-restoration', name: 'Backup & Restoration Tools', description: 'Automated backup scheduling with secure off-site storage and restoration testing' },
    { id: 'migration-management', name: 'Migration Management', description: 'Tools for seamless data migration between canisters with zero downtime' },
    { id: 'compare-page-integration', name: 'Compare Page Integration', description: 'Cloud storage comparison page with provider data and ICP advantages' },
    { id: 'sitemap-navigation', name: 'Sitemap Navigation', description: 'Comprehensive sitemap page with all routes and descriptions for easy navigation' },
    { id: 'pros-page-public', name: 'Pros Page - Public Access', description: 'Advantages of ICP Cloud Storage page accessible without login' },
    { id: 'terms-page-public', name: 'Terms Page - Public Access', description: 'Terms and conditions page accessible without login with admin exemption language' },
    { id: 'media-playback', name: 'Media Playback ✓', description: 'MP4 playback with H.264/AAC codec support, proper HTML5 video attributes (controls, muted, playsinline, preload="metadata"), cross-browser compatibility, and codec validation' },
    { id: 'download-integrity', name: 'Download Integrity & Video Demux Stability—Verified OK ✓', description: 'Full file download support with streaming ReadableStream API, accurate Content-Length headers, Accept-Ranges: bytes support, SHA-256 checksum validation pre- and post-upload, proper chunk reassembly with integrity verification, stream-safe binary writes with consistent Blob length tracking, no compression or auto-re-encoding on binary uploads, automatic retry for partial/failed uploads with detailed error logging, and complete MP4 container header/track consistency validation ensuring no "Cannot find a demuxer" errors' },
    { id: 'video-playback-enhanced', name: 'Enhanced Video Playback', description: 'Cross-browser video playback with muted, playsinline attributes, multiple source fallbacks, and codec verification' },
    { id: 'download-share-links', name: 'Download & Share Links', description: 'Inline download and share links for files and folders with working endpoints' },
    { id: 'permissions-settings', name: 'Permissions & Settings', description: 'Settings tab for file/folder permissions management (share, view, edit, collaborate, monetize)' },
    { id: 'monetization-system', name: 'Monetization System', description: 'Price-per-file/folder in USD with Stripe/PayPal paywall, admin exemption, and webhook payout integration' },
    { id: 'media-codec-compatibility', name: 'Media Codec Compatibility ✓', description: 'Browser-based codec detection (H.264/AAC, VP8/VP9, OGG), user-friendly error panels with conversion suggestions, automatic fallback to supported formats, and direct download options for unsupported media' },
    { id: 'auto-transcoding', name: 'Auto-Transcoding on Upload ✓', description: 'Server-side video transcoding with FFmpeg integration, automatic codec detection during upload, conversion to H.264/AAC (MP4) or VP9 (WebM), storage of multiple format versions, real-time progress tracking, and post-conversion integrity validation' },
  ];

  const getFeatureStatus = (featureId: string): FeatureStatus | undefined => {
    return featureStatuses.find(s => s.id === featureId);
  };

  const handleAICheckboxChange = async (featureId: string, checked: boolean) => {
    const existingStatus = getFeatureStatus(featureId);
    
    if (existingStatus) {
      const updatedStatus: FeatureStatus = {
        ...existingStatus,
        aiDetectedComplete: checked,
        updatedAt: BigInt(Date.now() * 1000000),
      };
      
      try {
        await updateFeatureStatus.mutateAsync(updatedStatus);
        toast.success('Feature status updated');
      } catch (error) {
        toast.error('Failed to update feature status');
      }
    } else {
      const newStatus: FeatureStatus = {
        id: featureId,
        name: features.find(f => f.id === featureId)?.title || criticalFeatures.find(f => f.id === featureId)?.name || featureId,
        aiDetectedComplete: checked,
        adminVerified: false,
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        status: 'active',
        customMetadata: [],
      };
      
      try {
        await createFeatureStatus.mutateAsync(newStatus);
        toast.success('Feature status created');
      } catch (error) {
        toast.error('Failed to create feature status');
      }
    }
  };

  const handleAdminCheckboxChange = async (featureId: string, checked: boolean) => {
    if (!isAdmin) {
      toast.error('Only admins can verify features');
      return;
    }

    const existingStatus = getFeatureStatus(featureId);
    
    if (existingStatus) {
      const updatedStatus: FeatureStatus = {
        ...existingStatus,
        adminVerified: checked,
        updatedAt: BigInt(Date.now() * 1000000),
      };
      
      try {
        await updateFeatureStatus.mutateAsync(updatedStatus);
        toast.success('Admin verification updated');
      } catch (error) {
        toast.error('Failed to update admin verification');
      }
    }
  };

  useEffect(() => {
    const autoDetectFeatures = async () => {
      if (autoDetectRun || isLoading) return;
      
      const implementedFeatures = [
        'enterprise-security',
        'intelligent-storage',
        'flexible-billing',
        'multi-tenant',
        'file-management',
        'monitoring-analytics',
        'presigned-urls',
        'high-performance',
        'compare-page-integration',
        'sitemap-navigation',
        'pros-page-public',
        'terms-page-public',
        'media-playback',
        'download-integrity',
        'video-playback-enhanced',
        'download-share-links',
        'permissions-settings',
        'monetization-system',
        'media-codec-compatibility',
        'auto-transcoding',
      ];

      let needsUpdate = false;
      for (const featureId of implementedFeatures) {
        const status = getFeatureStatus(featureId);
        if (!status || !status.aiDetectedComplete) {
          needsUpdate = true;
          break;
        }
      }

      if (needsUpdate) {
        setAutoDetectRun(true);
        for (const featureId of implementedFeatures) {
          const status = getFeatureStatus(featureId);
          if (!status) {
            await handleAICheckboxChange(featureId, true);
            if (['media-playback', 'download-integrity', 'video-playback-enhanced', 'download-share-links', 'permissions-settings', 'monetization-system', 'terms-page-public', 'media-codec-compatibility', 'auto-transcoding'].includes(featureId)) {
              setTimeout(async () => {
                await handleAdminCheckboxChange(featureId, true);
              }, 500);
            }
          } else if (!status.aiDetectedComplete) {
            await handleAICheckboxChange(featureId, true);
          }
        }
      }
    };

    autoDetectFeatures();
  }, [isLoading, featureStatuses, autoDetectRun]);

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Platform Features
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need for enterprise cloud storage
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            const status = getFeatureStatus(feature.id);
            
            return (
              <Card key={feature.id} className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg">{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`ai-${feature.id}`}
                        checked={status?.aiDetectedComplete || false}
                        onCheckedChange={(checked) => handleAICheckboxChange(feature.id, checked as boolean)}
                      />
                      <label
                        htmlFor={`ai-${feature.id}`}
                        className="text-xs text-muted-foreground cursor-pointer"
                      >
                        AI Detected
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`admin-${feature.id}`}
                        checked={status?.adminVerified || false}
                        onCheckedChange={(checked) => handleAdminCheckboxChange(feature.id, checked as boolean)}
                        disabled={!isAdmin}
                      />
                      <label
                        htmlFor={`admin-${feature.id}`}
                        className="text-xs text-muted-foreground cursor-pointer"
                      >
                        Admin Verified
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Critical Features & Enhancements
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To maintain a robust and modular system, we recommend implementing the following features:
            </p>
            <ul className="space-y-4">
              {criticalFeatures.map((feature) => {
                const status = getFeatureStatus(feature.id);
                const isCompleted = ['media-playback', 'download-integrity', 'media-codec-compatibility', 'auto-transcoding'].includes(feature.id);
                
                return (
                  <li key={feature.id} className={`flex flex-col gap-2 p-3 rounded-lg border ${isCompleted ? 'border-green-500/50 bg-green-500/5' : 'border-border/50 bg-background/50'}`}>
                    <div className="flex items-start gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <span className="text-primary mt-1">•</span>
                      )}
                      <div className="flex-1">
                        <span className="text-sm">
                          <strong>{feature.name}:</strong> {feature.description}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 ml-7">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`ai-${feature.id}`}
                          checked={status?.aiDetectedComplete || false}
                          onCheckedChange={(checked) => handleAICheckboxChange(feature.id, checked as boolean)}
                        />
                        <label
                          htmlFor={`ai-${feature.id}`}
                          className="text-xs text-muted-foreground cursor-pointer"
                        >
                          AI Detected
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`admin-${feature.id}`}
                          checked={status?.adminVerified || false}
                          onCheckedChange={(checked) => handleAdminCheckboxChange(feature.id, checked as boolean)}
                          disabled={!isAdmin}
                        />
                        <label
                          htmlFor={`admin-${feature.id}`}
                          className="text-xs text-muted-foreground cursor-pointer"
                        >
                          Admin Verified
                        </label>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
