import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import {
    useGetCallerUserProfile,
    useIsCallerAdmin,
    useIsCallerApproved,
    useStoreSecureData,
    useRequestPermission,
    useGetAllSecureData,
    useGetPermissionRequests,
    useApprovePermissionRequest,
    useRejectPermissionRequest,
} from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Lock,
    Shield,
    Database,
    Hammer,
    Pickaxe,
    Share2,
    DollarSign,
    TrendingUp,
    Zap,
    Briefcase,
    BarChart3,
    Package,
    Users,
    Heart,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { SecureData, PermissionRequest, RequestStatus } from '../backend';
import { cn } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const WORKFLOW_STEPS = [
    { icon: Database, label: 'Store', description: 'Securely store your data', color: 'text-blue-500' },
    { icon: Hammer, label: 'Build', description: 'Build your applications', color: 'text-purple-500' },
    { icon: Pickaxe, label: 'Mine', description: 'Mine and process data', color: 'text-orange-500' },
    { icon: Share2, label: 'Share', description: 'Share with team members', color: 'text-green-500' },
    { icon: DollarSign, label: 'Earn', description: 'Generate revenue', color: 'text-yellow-500' },
    { icon: TrendingUp, label: 'Invest', description: 'Invest in growth', color: 'text-indigo-500' },
    { icon: Zap, label: 'Strengthen', description: 'Re-strengthen SECOINFI Apps', color: 'text-red-500' },
    { icon: Briefcase, label: 'Develop', description: 'Develop Business', color: 'text-cyan-500' },
    { icon: BarChart3, label: 'ScaleUp', description: 'Scale your operations', color: 'text-pink-500' },
    { icon: Package, label: 'Products', description: 'Launch products', color: 'text-teal-500' },
    { icon: Users, label: 'Services', description: 'Provide services', color: 'text-violet-500' },
    { icon: Heart, label: 'Public Good', description: 'Contribute as TEAM', color: 'text-rose-500' },
];

export function SecurePage() {
    const { identity } = useInternetIdentity();
    const { data: userProfile } = useGetCallerUserProfile();
    const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
    const { data: isApproved, isLoading: isApprovedLoading } = useIsCallerApproved();
    const { data: secureDataList, isLoading: secureDataLoading } = useGetAllSecureData();
    const { data: permissionRequests, isLoading: requestsLoading } = useGetPermissionRequests();

    const storeSecureData = useStoreSecureData();
    const requestPermission = useRequestPermission();
    const approveRequest = useApprovePermissionRequest();
    const rejectRequest = useRejectPermissionRequest();

    const [dataId, setDataId] = useState('');
    const [dataContent, setDataContent] = useState('');
    const [requestDataId, setRequestDataId] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    const isAuthenticated = !!identity;
    const isLoading = isAdminLoading || isApprovedLoading;

    const handleStoreData = async () => {
        if (!dataId.trim() || !dataContent.trim()) {
            toast.error('Please provide both ID and data content');
            return;
        }

        try {
            await storeSecureData.mutateAsync({ id: dataId, data: dataContent });
            toast.success('Data stored securely with encryption');
            setDataId('');
            setDataContent('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to store data');
        }
    };

    const handleRequestPermission = async () => {
        if (!requestDataId.trim()) {
            toast.error('Please provide a data ID');
            return;
        }

        try {
            await requestPermission.mutateAsync(requestDataId);
            toast.success('Permission request submitted for admin approval');
            setRequestDataId('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to request permission');
        }
    };

    const handleApproveRequest = async () => {
        if (!selectedRequest) return;

        try {
            await approveRequest.mutateAsync(selectedRequest.id);
            toast.success('Permission request approved');
            setShowApproveDialog(false);
            setSelectedRequest(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to approve request');
        }
    };

    const handleRejectRequest = async () => {
        if (!selectedRequest) return;

        try {
            await rejectRequest.mutateAsync(selectedRequest.id);
            toast.success('Permission request rejected');
            setShowRejectDialog(false);
            setSelectedRequest(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to reject request');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container py-16">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-destructive/10">
                                <Lock className="h-12 w-12 text-destructive" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Access Restricted</CardTitle>
                        <CardDescription>
                            Please log in to access the secure data sharing system
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container py-8">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (!isApproved && !isAdmin) {
        return (
            <div className="container py-16">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-warning/10">
                                <AlertTriangle className="h-12 w-12 text-warning" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Approval Required</CardTitle>
                        <CardDescription>
                            Your account needs admin approval to access the secure data sharing system
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Secure Data Sharing</h2>
                </div>
                <p className="text-muted-foreground">
                    Encrypted P2P data sharing with admin-controlled access and ZKProof verification
                </p>
            </div>

            {/* Workflow Steps */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>SECOINFI Workflow</CardTitle>
                    <CardDescription>
                        Complete workflow for subscribers - each step requires admin approval
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {WORKFLOW_STEPS.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                >
                                    <div className={cn('p-3 rounded-full bg-muted mb-2', step.color)}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-semibold text-sm mb-1">{step.label}</h4>
                                    <p className="text-xs text-muted-foreground text-center">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Store Secure Data */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Store Secure Data
                        </CardTitle>
                        <CardDescription>
                            All data is automatically hashed and encrypted for P2P sharing
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="dataId">Data ID</Label>
                            <Input
                                id="dataId"
                                placeholder="Enter unique data identifier"
                                value={dataId}
                                onChange={(e) => setDataId(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dataContent">Data Content</Label>
                            <Textarea
                                id="dataContent"
                                placeholder="Enter data to be encrypted and stored"
                                value={dataContent}
                                onChange={(e) => setDataContent(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <Button
                            onClick={handleStoreData}
                            disabled={storeSecureData.isPending}
                            className="w-full"
                        >
                            {storeSecureData.isPending ? 'Storing...' : 'Store Data Securely'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Request Permission */}
                {!isAdmin && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="h-5 w-5" />
                                Request Data Access
                            </CardTitle>
                            <CardDescription>
                                Submit a request to access secure data - requires admin approval
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="requestDataId">Data ID</Label>
                                <Input
                                    id="requestDataId"
                                    placeholder="Enter data ID to request access"
                                    value={requestDataId}
                                    onChange={(e) => setRequestDataId(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleRequestPermission}
                                disabled={requestPermission.isPending}
                                className="w-full"
                                variant="outline"
                            >
                                {requestPermission.isPending ? 'Requesting...' : 'Request Permission'}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Admin: Permission Requests */}
                {isAdmin && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Permission Requests
                            </CardTitle>
                            <CardDescription>
                                Approve or reject data access requests from subscribers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                                {requestsLoading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-20 w-full" />
                                        <Skeleton className="h-20 w-full" />
                                    </div>
                                ) : permissionRequests && permissionRequests.length > 0 ? (
                                    <div className="space-y-3">
                                        {permissionRequests.map((request) => (
                                            <div
                                                key={request.id}
                                                className="p-4 rounded-lg border bg-card"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">
                                                            Data ID: {request.dataId}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Requester: {request.requester.toString().slice(0, 10)}...
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(Number(request.timestamp) / 1000000).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            request.status === RequestStatus.approved
                                                                ? 'default'
                                                                : request.status === RequestStatus.rejected
                                                                ? 'destructive'
                                                                : 'outline'
                                                        }
                                                    >
                                                        {request.status}
                                                    </Badge>
                                                </div>
                                                {request.status === RequestStatus.pending && (
                                                    <div className="flex gap-2 mt-3">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setShowApproveDialog(true);
                                                            }}
                                                            className="flex-1"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setShowRejectDialog(true);
                                                            }}
                                                            className="flex-1"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                                        No permission requests
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                )}

                {/* Stored Secure Data */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Stored Secure Data
                        </CardTitle>
                        <CardDescription>
                            All data is encrypted and requires verification for access
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            {secureDataLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                </div>
                            ) : secureDataList && secureDataList.length > 0 ? (
                                <div className="space-y-3">
                                    {secureDataList.map((data) => (
                                        <div
                                            key={data.id}
                                            className="p-4 rounded-lg border bg-card"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <p className="font-medium">ID: {data.id}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Owner: {data.owner.toString().slice(0, 20)}...
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(Number(data.timestamp) / 1000000).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-2 items-end">
                                                    <Badge variant={data.encrypted ? 'default' : 'outline'}>
                                                        {data.encrypted ? 'Encrypted' : 'Plain'}
                                                    </Badge>
                                                    <Badge variant={data.approved ? 'default' : 'secondary'}>
                                                        {data.approved ? 'Approved' : 'Pending'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Separator className="my-2" />
                                            <div className="bg-muted/50 p-3 rounded text-xs font-mono break-all">
                                                {data.data.slice(0, 100)}
                                                {data.data.length > 100 && '...'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-40 text-muted-foreground">
                                    No secure data stored yet
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Approval Dialog */}
            <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Permission Request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve this permission request? The requester will gain access to the specified data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApproveRequest}>
                            Approve
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Dialog */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Permission Request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject this permission request? The requester will not gain access to the specified data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRejectRequest} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
