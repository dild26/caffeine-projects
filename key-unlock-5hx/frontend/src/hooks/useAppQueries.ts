import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, UserRole, SecoinfiAppEntry, Page, ShareSelectedResult } from '../backend';

export function useGetCallerUserProfile() {
    const { actor, isFetching: actorFetching } = useActor();

    const query = useQuery<UserProfile | null>({
        queryKey: ['currentUserProfile'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserProfile();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });

    return {
        ...query,
        isLoading: actorFetching || query.isLoading,
        isFetched: !!actor && query.isFetched,
        isPending: query.isLoading, // Alias for compatibility
    };
}

export function useSaveCallerUserProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: UserProfile) => {
            if (!actor) throw new Error('Actor not available');
            return actor.saveCallerUserProfile(profile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
        },
    });
}

export function useGetCallerUserRole() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<string>({
        queryKey: ['currentUserRole'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserRole();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useIsCallerAdmin() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<boolean>({
        queryKey: ['isAdmin'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.isCallerAdmin();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useGetAllSecoinfiAppsEntries() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<SecoinfiAppEntry[]>({
        queryKey: ['secoinfiAppsEntries'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllSecoinfiAppsEntries();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useAddSecoinfiAppEntry() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (entry: Partial<SecoinfiAppEntry>) => {
            if (!actor) throw new Error('Actor not available');
            return actor.addSecoinfiAppEntry(
                entry.appName || '',
                entry.subdomain || '',
                entry.canonicalUrl || '',
                entry.categoryTags || '',
                entry.status || 'Active'
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
        },
    });
}

export function useUpdateSecoinfiAppEntry() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: { id: bigint } & Partial<SecoinfiAppEntry>) => {
            if (!actor) throw new Error('Actor not available');
            return actor.updateSecoinfiAppEntry(
                id,
                updates.appName || '',
                updates.canonicalUrl || ''
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
        },
    });
}

export function useDeleteSecoinfiAppEntry() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: bigint) => {
            if (!actor) throw new Error('Actor not available');
            return actor.deleteSecoinfiAppEntry(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
        },
    });
}

export function useBulkDeleteSecoinfiAppEntries() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: bigint[]) => {
            if (!actor) throw new Error('Actor not available');
            return actor.bulkDeleteSecoinfiAppEntries(ids);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['secoinfiAppsEntries'] });
        },
    });
}

export function useShareSelectedPages() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async (ids: bigint[]) => {
            if (!actor) throw new Error('Actor not available');
            return actor.shareSelectedPages(ids);
        },
    });
}

export function useGetAllSecoinfiApps() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<Page[]>({
        queryKey: ['secoinfiApps'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllSecoinfiApps();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useGetOverviewPages() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<Page[]>({
        queryKey: ['overviewPages'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getOverviewPages();
        },
        enabled: !!actor && !actorFetching,
    });
}

// Mocks for missing backend features
export interface NavItem {
    title: string;
    path: string;
    adminOnly?: boolean;
    children?: NavItem[];
}

export function useGetNavItems() {
    return useQuery<NavItem[]>({
        queryKey: ['navItems'],
        queryFn: async () => [
            { title: 'Home', path: '/' },
            { title: 'Blog', path: '/blog' },
            { title: 'About Us', path: '/about' },
            { title: 'Pros of SECoin', path: '/pros' },
            { title: 'What We Do', path: '/what-we-do' },
            { title: 'Why Us', path: '/why-us' },
            { title: 'Contact Us', path: '/contact' },
            { title: 'FAQ', path: '/faq' },
            { title: 'Terms & Conditions', path: '/terms' },
            { title: 'Referral', path: '/referral' },
            { title: 'Proof of Trust', path: '/proof-of-trust' },
        ],
        initialData: [],
    });
}

export function useGetCurrentTheme() {
    return useQuery<string>({
        queryKey: ['currentTheme'],
        queryFn: async () => 'dark',
        initialData: 'dark',
    });
}

export function useToggleTheme() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            // Mock toggle
            return 'dark';
        },
        onSuccess: (newTheme) => {
            queryClient.setQueryData(['currentTheme'], newTheme);
        },
    });
}

// Additional Mocks for Dashboard.tsx
import type { FileCheckStatus, FileUpload, AuthMetric, RouteStatus } from '../backend';

export function useSubscribeToKeyUnlock() {
    return useMutation({
        mutationFn: async (data: { merkleRoot: string, nonce: bigint }) => {
            return true;
        }
    });
}

export function useGetFileCheckStatus() {
    return useQuery<FileCheckStatus>({
        queryKey: ['fileCheckStatus'],
        queryFn: async () => ({
            expectedFiles: [
                { fileName: 'server.js', isPresent: true },
                { fileName: 'manifest.yaml', isPresent: true }
            ],
            isComplete: true
        }),
        initialData: {
            expectedFiles: [],
            isComplete: true
        }
    });
}

export function useUploadFileMetadata() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fileUploads'] });
        }
    });
}

export function useGetFileUploads() {
    return useQuery<FileUpload[]>({
        queryKey: ['fileUploads'],
        queryFn: async () => [],
        initialData: []
    });
}

export function useGetAuthMetrics() {
    return useQuery<AuthMetric[]>({
        queryKey: ['authMetrics'],
        queryFn: async () => [],
        initialData: []
    });
}

export function useGetRouteStatuses() {
    return useQuery<RouteStatus[]>({
        queryKey: ['routeStatuses'],
        queryFn: async () => [],
        initialData: []
    });
}

export function useCheckRouteStatus() {
    return useMutation({
        mutationFn: async (url: string) => {
            return 'ok';
        }
    });
}

export function useUpdateRouteStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['routeStatuses'] });
        }
    });
}

export function useUpdateFilePresence() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fileCheckStatus'] });
        }
    });
}

// Contact Info Mock
import type { ContactInfo } from '../backend';
export function useGetContactInfo() {
    return useQuery<ContactInfo>({
        queryKey: ['contactInfo'],
        queryFn: async () => ({
            ceoName: 'Dilip Kumar',
            email: 'dild26@gmail.com',
            phone: '+91-962-005-8644',
            whatsapp: '+919620058644',
            address: 'Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097',
            mapLink: 'https://www.openstreetmap.org/way/1417238145',
            googleMapLink: 'https://www.google.com/maps/place/Sudha+Enterprises/@13.0818168,77.5425331,228m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bae229442d2afb9:0x1ef57e487d50ee1f!8m2!3d13.0818168!4d77.5425331!16s%2Fg%2F1v6p798y?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D',
            paymentMethods: {
                paypal: 'newgoldenjewel@gmail.com',
                upi: 'secoin@uboi',
                eth: '0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7'
            },
            socialLinks: {
                facebook: 'https://facebook.com/dild26',
                linkedin: 'https://www.linkedin.com/in/dild26',
                telegram: 'https://t.me/dilee',
                discord: 'https://discord.com/users/dild26',
                blogspot: 'https://dildiva.blogspot.com/',
                instagram: 'https://www.instagram.com/newgoldenjewel',
                twitter: 'https://x.com/dil_sec',
                youtube: 'https://www.youtube.com/@dileepkumard4484'
            }
        }),
        initialData: undefined
    });
}

// Sitemap Mocks
export function useDiscoverAllApps() {
    return useQuery({
        queryKey: ['discoverAllApps'],
        queryFn: async () => [],
        initialData: []
    });
}

export function useAddSitemapPage() {
    return useMutation({ mutationFn: async (data: any) => true });
}

export function useDeleteSitemapPage() {
    return useMutation({ mutationFn: async (id: any) => true });
}

export function useSetSelectAllState() {
    return useMutation({ mutationFn: async (state: any) => true });
}

export function useGetSelectAllState() {
    return useQuery({
        queryKey: ['selectAllState'],
        queryFn: async () => false,
        initialData: false
    });
}

export function useDiscoverSitemapPages() {
    return useMutation({ mutationFn: async () => true });
}

export function useGetSitemapDiscoveryLogs() {
    return useQuery({
        queryKey: ['discoveryLogs'],
        queryFn: async () => [],
        initialData: []
    });
}

export function useGetAppsFromPages() {
    return useQuery({
        queryKey: ['appsFromPages'],
        queryFn: async () => [],
        initialData: []
    });
}

export function useGetSitemapPages() {
    return useQuery<string[]>({
        queryKey: ['sitemapPages'],
        queryFn: async () => [
            'home', 'dashboard', 'features', 'profile', 'settings', 'help',
            'about', 'contact', 'sitemap', 'blog', 'faq', 'terms',
            'referral', 'proof-of-trust', 'pros', 'what-we-do', 'why-us'
        ],
        initialData: []
    });
}

export function useGetControlledRoutes() {
    return useQuery<[string, string][]>({
        queryKey: ['controlledRoutes'],
        queryFn: async () => [
            ['login', 'Admin'],
            ['admin', 'Admin Control'],
            ['live', 'System Monitoring'],
            ['apps', 'App Discovery'],
            ['payment', 'Financial Services']
        ],
        initialData: []
    });
}

export function useAddManualPage() {
    return useMutation({ mutationFn: async (data: any) => true });
}

export function useRemoveManualPage() {
    return useMutation({ mutationFn: async (id: any) => true });
}

// Integration Mocks
export function useGetIntegrationDocs() {
    return useQuery({
        queryKey: ['integrationDocs'],
        queryFn: async () => [],
        initialData: []
    });
}

// Pros Mocks
export function useGetPros() {
    return useQuery({
        queryKey: ['pros'],
        queryFn: async () => [
            { id: 1, title: "Secure", description: "Advanced security features to protect your data and identity.", link: "/secure" },
            { id: 2, title: "Private", description: "Your information remains confidential and protected.", link: "/private" },
            { id: 3, title: "Decentralised", description: "No single point of failure, ensuring reliability and security.", link: "/decentralised" },
            { id: 4, title: "Universal", description: "Works across multiple devices and platforms seamlessly.", link: "/universal" },
            { id: 5, title: "Profile", description: "Manage your profile securely and efficiently.", link: "/profile" },
            { id: 6, title: "Identity", description: "Protect and manage your digital identity with ease.", link: "/identity" },
            { id: 7, title: "Authenticated", description: "Ensure secure and verified access to your accounts.", link: "/authenticated" },
            { id: 8, title: "Blockchain-based", description: "Leverage blockchain technology for enhanced security.", link: "/blockchain-based" },
            { id: 9, title: "Cryptographic Security", description: "Utilize advanced cryptographic methods for data protection.", link: "/cryptographic-security" },
            { id: 10, title: "Multi-device Support", description: "Access your data securely from any device.", link: "/multi-device-support" },
            { id: 11, title: "Protected Identity", description: "Keep your identity safe from unauthorized access.", link: "/protected-identity" }
        ],
        initialData: []
    });
}

export function useGetProById() {
    return () => ({ data: null, isLoading: false });
}

export function useGetRelatedPros() {
    return useQuery({
        queryKey: ['relatedPros'],
        queryFn: async () => [],
        initialData: []
    });
}

// Test Input Mocks
export function useSubmitTestInput() {
    return useMutation({ mutationFn: async (data: any) => true });
}

export function useGetValidationRules() {
    return useQuery({
        queryKey: ['validationRules'],
        queryFn: async () => [],
        initialData: []
    });
}

// Features Mocks
export function useGetFeatures() {
    return useQuery({
        queryKey: ['features'],
        queryFn: async () => [],
        initialData: []
    });
}

export function useGetPendingTasks() {
    return useQuery({
        queryKey: ['pendingTasks'],
        queryFn: async () => [],
        initialData: []
    });
}

export function useAffirmFeatureAdmin() {
    return useMutation({ mutationFn: async () => true });
}

export function useAssignFeatureAction() {
    return useMutation({ mutationFn: async (data: any) => true });
}
