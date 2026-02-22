import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';

interface PortalItem {
  id: string;
  app: string;
  template: string;
  title: string;
  url: string;
  created_at: string;
  content_hash: string;
  nonce: string;
  merkle_leaf: string;
  verification_status: 'verified' | 'pending' | 'failed';
}

const TEST_DATA: PortalItem[] = [
  {
    id: 'form-001',
    app: 'Healthcare',
    template: 'Patient Registration',
    title: 'New Patient Intake Form',
    url: 'https://example.com/forms/patient-001',
    created_at: '2025-01-15T10:30:00Z',
    content_hash: 'a1b2c3d4e5f6',
    nonce: 'n1o2n3c4e5',
    merkle_leaf: 'm1e2r3k4l5e6',
    verification_status: 'verified',
  },
  {
    id: 'form-002',
    app: 'Finance',
    template: 'Loan Application',
    title: 'Personal Loan Request Form',
    url: 'https://example.com/forms/loan-002',
    created_at: '2025-01-16T14:20:00Z',
    content_hash: 'b2c3d4e5f6g7',
    nonce: 'n2o3n4c5e6',
    merkle_leaf: 'm2e3r4k5l6e7',
    verification_status: 'verified',
  },
  {
    id: 'form-003',
    app: 'Education',
    template: 'Course Enrollment',
    title: 'Student Registration 2025',
    url: 'https://example.com/forms/enroll-003',
    created_at: '2025-01-17T09:15:00Z',
    content_hash: 'c3d4e5f6g7h8',
    nonce: 'n3o4n5c6e7',
    merkle_leaf: 'm3e4r5k6l7e8',
    verification_status: 'pending',
  },
  {
    id: 'form-004',
    app: 'HR',
    template: 'Employee Onboarding',
    title: 'New Hire Documentation',
    url: 'https://example.com/forms/hr-004',
    created_at: '2025-01-18T11:45:00Z',
    content_hash: 'd4e5f6g7h8i9',
    nonce: 'n4o5n6c7e8',
    merkle_leaf: 'm4e5r6k7l8e9',
    verification_status: 'verified',
  },
  {
    id: 'form-005',
    app: 'Legal',
    template: 'Contract Review',
    title: 'Vendor Agreement Form',
    url: 'https://example.com/forms/legal-005',
    created_at: '2025-01-19T16:00:00Z',
    content_hash: 'e5f6g7h8i9j0',
    nonce: 'n5o6n7c8e9',
    merkle_leaf: 'm5e6r7k8l9e0',
    verification_status: 'failed',
  },
  {
    id: 'form-006',
    app: 'Healthcare',
    template: 'Medical History',
    title: 'Patient Medical Background',
    url: 'https://example.com/forms/medical-006',
    created_at: '2025-01-20T08:30:00Z',
    content_hash: 'f6g7h8i9j0k1',
    nonce: 'n6o7n8c9e0',
    merkle_leaf: 'm6e7r8k9l0e1',
    verification_status: 'verified',
  },
  {
    id: 'form-007',
    app: 'Finance',
    template: 'Tax Filing',
    title: 'Annual Tax Return Form',
    url: 'https://example.com/forms/tax-007',
    created_at: '2025-01-21T13:20:00Z',
    content_hash: 'g7h8i9j0k1l2',
    nonce: 'n7o8n9c0e1',
    merkle_leaf: 'm7e8r9k0l1e2',
    verification_status: 'verified',
  },
  {
    id: 'form-008',
    app: 'Education',
    template: 'Scholarship Application',
    title: 'Merit Scholarship Request',
    url: 'https://example.com/forms/scholarship-008',
    created_at: '2025-01-22T10:10:00Z',
    content_hash: 'h8i9j0k1l2m3',
    nonce: 'n8o9n0c1e2',
    merkle_leaf: 'm8e9r0k1l2e3',
    verification_status: 'pending',
  },
];

const ITEMS_PER_PAGE = 6;

export default function PortalView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApp, setFilterApp] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { data: isAdmin } = useIsCallerAdmin();

  const filteredData = useMemo(() => {
    return TEST_DATA.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.app.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.template.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesApp = filterApp === 'all' || item.app === filterApp;
      const matchesStatus = filterStatus === 'all' || item.verification_status === filterStatus;
      return matchesSearch && matchesApp && matchesStatus;
    });
  }, [searchTerm, filterApp, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const apps = Array.from(new Set(TEST_DATA.map((item) => item.app)));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      verified: 'default',
      pending: 'secondary',
      failed: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'outline'} className="gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">E-Commerce Portal</h2>
        <p className="text-muted-foreground mt-1">Browse and manage form submissions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>
        <Select
          value={filterApp}
          onValueChange={(value) => {
            setFilterApp(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by app" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Apps</SelectItem>
            {apps.map((app) => (
              <SelectItem key={app} value={app}>
                {app}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterStatus}
          onValueChange={(value) => {
            setFilterStatus(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {currentItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No forms found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{item.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {item.app} • {item.template}
                      </CardDescription>
                    </div>
                    {getStatusBadge(item.verification_status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">ID:</span>
                      <span className="font-mono">{item.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Created:</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    {(isAdmin || item.verification_status === 'verified') && (
                      <>
                        <div className="flex justify-between">
                          <span className="font-semibold">Hash:</span>
                          <span className="font-mono truncate max-w-[120px]" title={item.content_hash}>
                            {item.content_hash}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Nonce:</span>
                          <span className="font-mono truncate max-w-[120px]" title={item.nonce}>
                            {item.nonce}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Merkle:</span>
                          <span className="font-mono truncate max-w-[120px]" title={item.merkle_leaf}>
                            {item.merkle_leaf}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                      View Form
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} forms
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium px-4">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
