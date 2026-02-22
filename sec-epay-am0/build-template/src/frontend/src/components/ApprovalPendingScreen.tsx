import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerApproved, useIsCallerAdmin, useRequestApproval } from '../hooks/useQueries';
import { useRouterState } from '@tanstack/react-router';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';

// Define restricted routes that require approval
const RESTRICTED_ROUTES = [
  '/admin',
  '/main-form',
  '/subscriptions',
  '/leaderboard',
  '/dashboard',
  '/transactions',
];

export default function ApprovalPendingScreen() {
  const { identity } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const requestApproval = useRequestApproval();

  const isAuthenticated = !!identity;
  const isRestrictedRoute = RESTRICTED_ROUTES.includes(currentPath);
  
  // Only show approval screen on restricted routes for authenticated non-admin users who aren't approved
  const showApprovalScreen = isAuthenticated && isRestrictedRoute && !approvalLoading && !adminLoading && !isApproved && !isAdmin;

  const handleRequestApproval = async () => {
    try {
      await requestApproval.mutateAsync();
      toast.success('Approval request submitted successfully!');
    } catch (error: any) {
      if (error.message?.includes('already requested')) {
        toast.info('You have already requested approval');
      } else {
        toast.error('Failed to request approval');
      }
    }
  };

  if (!showApprovalScreen) return null;

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Clock className="h-12 w-12 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">Approval Required</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your account needs to be approved by an administrator before you can access this feature.
            Please request approval to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col space-y-2">
          <Button onClick={handleRequestApproval} disabled={requestApproval.isPending} className="w-full">
            {requestApproval.isPending ? 'Requesting...' : 'Request Approval'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            An administrator will review your request shortly. You can browse public pages while waiting.
          </p>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
