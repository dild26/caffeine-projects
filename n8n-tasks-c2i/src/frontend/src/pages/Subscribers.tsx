import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetPublicWorkflows, useGetWorkflows } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Search, Download } from 'lucide-react';
import ProfileSetup from '../components/ProfileSetup';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 12;

export default function Subscribers() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: allWorkflows, isLoading: allLoading } = useGetWorkflows();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Require authentication for Subscribers page
  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to access the workflow catalog</p>
        <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
      </div>
    );
  }

  const showProfileSetup = !profileLoading && isFetched && userProfile === null;
  const isSubscriber = userProfile?.subscriptionStatus === 'active';

  const filteredWorkflows = allWorkflows?.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil((filteredWorkflows?.length || 0) / ITEMS_PER_PAGE);
  const paginatedWorkflows = filteredWorkflows?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDownload = async (workflow: any) => {
    try {
      const bytes = await workflow.file.getBytes();
      const blob = new Blob([bytes], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workflow.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (showProfileSetup) {
    return <ProfileSetup open={true} />;
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Workflow Catalog</h1>
        <p className="text-muted-foreground mb-6">
          {isSubscriber
            ? 'Access all premium workflows with your subscription'
            : 'Browse our collection of workflow templates. Subscribe to unlock all workflows.'}
        </p>

        {!isSubscriber && (
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 text-white p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-2">Unlock All Workflows</h3>
            <p className="mb-4">Subscribe now to get unlimited access to all premium workflows</p>
            <Button variant="secondary" onClick={() => navigate({ to: '/dashboard' })}>
              Subscribe Now
            </Button>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      {allLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {paginatedWorkflows?.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    {workflow.isPublic ? (
                      <Badge variant="outline">Free</Badge>
                    ) : (
                      <Badge className="bg-gradient-to-r from-violet-600 to-blue-600">Premium</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {workflow.isPublic || isSubscriber ? (
                    <Button className="w-full" onClick={() => handleDownload(workflow)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      <Lock className="mr-2 h-4 w-4" />
                      Subscribe to Access
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
