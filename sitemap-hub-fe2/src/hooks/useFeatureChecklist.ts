import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { FeatureChecklistItem, FeatureChecklistUpdate, FeatureChecklistSummary, FeaturePriority, FeatureStatus } from '@/backend';
import { toast } from 'sonner';

// Get all feature checklist items
export function useGetFeatureChecklist() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FeatureChecklistItem[]>({
    queryKey: ['featureChecklist'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeatureChecklist();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Get feature checklist by priority
export function useGetFeatureChecklistByPriority() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (priority: FeaturePriority) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeatureChecklistByPriority(priority);
    },
  });
}

// Get feature checklist summary
export function useGetFeatureChecklistSummary() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FeatureChecklistSummary[]>({
    queryKey: ['featureChecklistSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeatureChecklistSummary();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Get overall progress
export function useGetFeatureChecklistProgress() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['featureChecklistProgress'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeatureChecklistProgress();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Add feature checklist item
export function useAddFeatureChecklistItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: FeatureChecklistItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFeatureChecklistItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureChecklist'] });
      queryClient.invalidateQueries({ queryKey: ['featureChecklistSummary'] });
      queryClient.invalidateQueries({ queryKey: ['featureChecklistProgress'] });
      toast.success('Feature added successfully');
    },
  });
}

// Update feature status
export function useUpdateFeatureChecklistStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (update: FeatureChecklistUpdate) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFeatureChecklistStatus(update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureChecklist'] });
      queryClient.invalidateQueries({ queryKey: ['featureChecklistSummary'] });
      queryClient.invalidateQueries({ queryKey: ['featureChecklistProgress'] });
      toast.success('Feature status updated');
    },
  });
}

// Comprehensive hook that combines all feature checklist functionality
export function useFeatureChecklist() {
  const { data: featureChecklist = [], isLoading } = useGetFeatureChecklist();
  const { data: featureChecklistSummary = [] } = useGetFeatureChecklistSummary();
  const { data: overallProgress = 0 } = useGetFeatureChecklistProgress();
  const addFeature = useAddFeatureChecklistItem();
  const updateStatus = useUpdateFeatureChecklistStatus();

  const updateFeatureStatus = async (id: number, status: FeatureStatus) => {
    await updateStatus.mutateAsync({
      id: BigInt(id),
      status,
      updatedAt: BigInt(Date.now() * 1000000),
    });
  };

  const bulkUpdateFeatures = async (ids: number[], status: FeatureStatus) => {
    for (const id of ids) {
      await updateFeatureStatus(id, status);
    }
    toast.success(`Updated ${ids.length} features to ${status}`);
  };

  const exportChecklistData = async () => {
    const data = {
      features: featureChecklist,
      summary: featureChecklistSummary,
      overallProgress,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feature-checklist-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Feature checklist exported successfully');
  };

  const initializeDefaultFeatures = async () => {
    const defaultFeatures: Omit<FeatureChecklistItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
      // P1 - Critical Features
      {
        title: 'Internet Identity Authentication',
        description: 'Secure user login and registration with Internet Identity integration',
        priority: FeaturePriority.p1,
        status: FeatureStatus.complete,
        moduleName: 'Authentication',
        page: 'Dashboard',
        documentation: 'Internet Identity provides secure, passwordless authentication',
        tooltip: 'Core authentication system for user access',
        integrationGuidelines: 'Use useInternetIdentity hook for login/logout',
        developmentNotes: 'Fully integrated with session management',
      },
      {
        title: 'Subscription System',
        description: 'Three-tier subscription system with Basic ($9), Pro ($45), and Enterprise ($99) plans',
        priority: FeaturePriority.p1,
        status: FeatureStatus.complete,
        moduleName: 'Subscription System',
        page: 'Subscription',
        documentation: 'Comprehensive subscription management with tier-based access control',
        tooltip: 'Core monetization system',
        integrationGuidelines: 'Use subscription hooks for tier management',
        developmentNotes: 'Integrated with Stripe payment processing',
      },
      {
        title: 'Enhanced Search Functionality',
        description: 'Complete URL indexing with debounced search, TLD filtering, and unlimited admin access',
        priority: FeaturePriority.p1,
        status: FeatureStatus.complete,
        moduleName: 'Search Functionality',
        page: 'Sitemaps',
        documentation: 'Advanced search with complete TLD support and URL count display',
        tooltip: 'Core search engine for sitemap discovery',
        integrationGuidelines: 'Use debounced search hooks with 2-second delay',
        developmentNotes: 'Optimized for large datasets (90,000+ URLs)',
      },
      {
        title: 'Stripe Payment Integration',
        description: 'Secure payment processing with admin-only configuration and environment variable management',
        priority: FeaturePriority.p1,
        status: FeatureStatus.complete,
        moduleName: 'Payment Processing',
        page: 'Admin Panel',
        documentation: 'Secure Stripe integration with secret key protection',
        tooltip: 'Payment gateway for subscriptions and Pay As You Use',
        integrationGuidelines: 'Never expose secret keys in frontend',
        developmentNotes: 'Environment variable-based key management',
      },
      // P2 - High Priority Features
      {
        title: 'Multi-Level Referral System',
        description: 'Advanced referral hierarchy with unlimited depth and conversion tracking',
        priority: FeaturePriority.p2,
        status: FeatureStatus.complete,
        moduleName: 'Referral System',
        page: 'Referrals',
        documentation: 'Complete referral tree visualization with performance metrics',
        tooltip: 'Network marketing and growth system',
        integrationGuidelines: 'Use referral hooks for link generation and tracking',
        developmentNotes: 'Real-time hierarchy updates and analytics',
      },
      {
        title: 'Commission Tracking System',
        description: 'Dynamic multi-level commission calculation with configurable profit share',
        priority: FeaturePriority.p2,
        status: FeatureStatus.complete,
        moduleName: 'Commission Tracking',
        page: 'Referrals',
        documentation: 'Automated commission distribution with detailed history',
        tooltip: 'Earnings tracking and payout management',
        integrationGuidelines: 'Use commission hooks for earnings display',
        developmentNotes: 'Integrated with referral system',
      },
      {
        title: 'Comprehensive Analytics System',
        description: 'Platform-wide analytics with user activity, revenue, and performance metrics',
        priority: FeaturePriority.p2,
        status: FeatureStatus.complete,
        moduleName: 'Analytics',
        page: 'Analytics',
        documentation: 'Real-time analytics with interactive charts and trend analysis',
        tooltip: 'Business intelligence and reporting',
        integrationGuidelines: 'Use analytics hooks for data visualization',
        developmentNotes: 'Optimized for millions of data points',
      },
      {
        title: 'Auto-Backup System',
        description: 'Automatic backup creation before updates with .zip archive storage',
        priority: FeaturePriority.p2,
        status: FeatureStatus.complete,
        moduleName: 'Backup System',
        page: 'Admin Panel',
        documentation: 'Comprehensive data preservation with auto-restore functionality',
        tooltip: 'Data protection and disaster recovery',
        integrationGuidelines: 'Automatic triggers before bulk operations',
        developmentNotes: 'Integrated with upgrade management',
      },
      {
        title: 'Enhanced Admin Panel',
        description: 'Full-page field management with global search & replace and auto-save',
        priority: FeaturePriority.p2,
        status: FeatureStatus.complete,
        moduleName: 'Admin Panel',
        page: 'Admin Panel',
        documentation: 'Comprehensive admin controls with checkbox selection and bulk operations',
        tooltip: 'Central management interface',
        integrationGuidelines: 'Admin-only access with role verification',
        developmentNotes: 'Real-time field updates with 30-second auto-save',
      },
      // P3 - Medium Priority Features
      {
        title: 'XML Sitemap Import',
        description: 'Admin-only XML sitemap import with URL input and automatic processing',
        priority: FeaturePriority.p3,
        status: FeatureStatus.complete,
        moduleName: 'XML Import',
        page: 'Admin Panel',
        documentation: 'Automatic conversion from XML to JSON with domain extraction',
        tooltip: 'Bulk sitemap data import',
        integrationGuidelines: 'Use XML import hooks for processing',
        developmentNotes: 'Validates against hardcoded TLD list',
      },
      {
        title: 'Click Tracking Analytics',
        description: 'CPC analytics with leaderboard tracking for domains and URLs',
        priority: FeaturePriority.p3,
        status: FeatureStatus.complete,
        moduleName: 'Click Tracking',
        page: 'Analytics',
        documentation: 'Real-time click tracking with performance metrics',
        tooltip: 'Link engagement analytics',
        integrationGuidelines: 'Automatic tracking on all preview interactions',
        developmentNotes: 'Accessible to all users',
      },
      {
        title: 'Advanced Export System',
        description: 'Multi-format export (CSV, XLSX, JSON, ZIP) with scheduled exports',
        priority: FeaturePriority.p3,
        status: FeatureStatus.complete,
        moduleName: 'Export System',
        page: 'Exports',
        documentation: 'Comprehensive data export with queue management',
        tooltip: 'Data extraction and reporting',
        integrationGuidelines: 'Use export hooks for file generation',
        developmentNotes: 'Optimized for large datasets',
      },
      {
        title: 'Enhanced Link Preview System',
        description: 'Full-screen preview with Internet Archive fallback and screenshot support',
        priority: FeaturePriority.p3,
        status: FeatureStatus.complete,
        moduleName: 'Link Preview',
        page: 'Sitemaps',
        documentation: 'Scalable object-based rendering with automatic fallback hierarchy',
        tooltip: 'Secure external content preview',
        integrationGuidelines: 'Automatic URL protocol handling',
        developmentNotes: 'Optimized for all device sizes',
      },
      {
        title: 'Enterprise Upgrade Management',
        description: 'Versioned data persistence with preupgrade/postupgrade hooks',
        priority: FeaturePriority.p3,
        status: FeatureStatus.complete,
        moduleName: 'Upgrade Management',
        page: 'Admin Panel',
        documentation: 'Safe data migration with rollback capabilities',
        tooltip: 'System upgrade and version control',
        integrationGuidelines: 'Automatic backup before upgrades',
        developmentNotes: 'Stable variable implementation',
      },
      // P4 - Low Priority Features
      {
        title: 'Feature Checklist System',
        description: 'Implementation tracking with status management and progress visualization',
        priority: FeaturePriority.p4,
        status: FeatureStatus.complete,
        moduleName: 'Feature Checklist',
        page: 'Feature Checklist',
        documentation: 'Comprehensive feature tracking with public progress transparency',
        tooltip: 'Development progress tracking',
        integrationGuidelines: 'Admin-only management with public read access',
        developmentNotes: 'Real-time status updates',
      },
      {
        title: 'Token-Based Payout Management',
        description: 'Self-service commission withdrawal with threshold enforcement',
        priority: FeaturePriority.p4,
        status: FeatureStatus.complete,
        moduleName: 'Payout Management',
        page: 'Referrals',
        documentation: 'Secure payout system with token-based security',
        tooltip: 'Commission withdrawal system',
        integrationGuidelines: 'Use payout hooks for withdrawal management',
        developmentNotes: 'Integrated with commission tracking',
      },
      {
        title: 'Pay As You Use System',
        description: 'Domain batch purchasing with lifetime access (Top 10 to Top 1M)',
        priority: FeaturePriority.p4,
        status: FeatureStatus.complete,
        moduleName: 'Pay As You Use',
        page: 'Subscription',
        documentation: 'One-time purchase options with instant access',
        tooltip: 'Alternative to subscription model',
        integrationGuidelines: 'Use PAYU hooks for batch purchases',
        developmentNotes: 'Integrated with Stripe payment',
      },
      {
        title: 'God\'s Eye Summary',
        description: 'Public-facing platform overview with aggregated financial data',
        priority: FeaturePriority.p4,
        status: FeatureStatus.complete,
        moduleName: 'God\'s Eye Summary',
        page: 'God\'s Eye Summary',
        documentation: 'Real-time platform statistics and business information',
        tooltip: 'Platform transparency dashboard',
        integrationGuidelines: 'Auto-updates with admin changes',
        developmentNotes: 'Global search and replace integration',
      },
      {
        title: 'Bottom Navigation Bar',
        description: 'Persistent bottom navigation with integrated sitemap display',
        priority: FeaturePriority.p4,
        status: FeatureStatus.complete,
        moduleName: 'Bottom Navigation',
        page: 'All Pages',
        documentation: 'Fixed bottom navigation with sitemap card display',
        tooltip: 'Secondary navigation system',
        integrationGuidelines: 'Appears on all pages with proper spacing',
        developmentNotes: 'Responsive design for all devices',
      },
      {
        title: 'Color Scheme Accessibility',
        description: 'Maximum contrast implementation meeting WCAG 2.1 AA standards',
        priority: FeaturePriority.p4,
        status: FeatureStatus.complete,
        moduleName: 'UI/UX',
        page: 'All Pages',
        documentation: 'High contrast color palette for both dark and light themes',
        tooltip: 'Accessibility compliance',
        integrationGuidelines: 'Use theme-aware color tokens',
        developmentNotes: 'Comprehensive audit completed',
      },
      {
        title: 'Robust Sidebar Navigation',
        description: 'Decoupled sidebar with error boundaries and fallback UI',
        priority: FeaturePriority.p4,
        status: FeatureStatus.complete,
        moduleName: 'Navigation',
        page: 'All Pages',
        documentation: 'Portal-based rendering with comprehensive error handling',
        tooltip: 'Primary navigation system',
        integrationGuidelines: 'Toggle positioned in middle of sidebar',
        developmentNotes: 'Never causes blank pages or crashes',
      },
    ];

    for (const feature of defaultFeatures) {
      await addFeature.mutateAsync({
        ...feature,
        id: BigInt(Date.now() + Math.random()),
        createdAt: BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
      });
    }

    toast.success('Default features initialized successfully');
  };

  return {
    featureChecklist,
    featureChecklistSummary,
    overallProgress,
    isLoading,
    updateFeatureStatus,
    bulkUpdateFeatures,
    exportChecklistData,
    initializeDefaultFeatures,
  };
}
