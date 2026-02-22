import { useState } from 'react';
import { useGetAllFormSubmissions, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Calendar, User } from 'lucide-react';
import SubmissionDetailDialog from './SubmissionDetailDialog';
import type { FormSubmission } from '../backend';

export default function SubmissionsViewer() {
  const { data: submissions = [], isLoading } = useGetAllFormSubmissions();
  const { data: isAdmin } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'schema'>('date');

  const userSubmissions = isAdmin
    ? submissions
    : submissions.filter((s) => s.user.toString() === identity?.getPrincipal().toString());

  const filteredSubmissions = userSubmissions.filter((submission) =>
    submission.schemaId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sortBy === 'date') {
      return Number(b.timestamp - a.timestamp);
    }
    return a.schemaId.localeCompare(b.schemaId);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Form Submissions</h2>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? 'View all form submissions' : 'View your form submissions'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter & Sort</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search" className="font-bold">
                Search by Schema
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort" className="font-bold">
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val as 'date' | 'schema')}>
                <SelectTrigger id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest First)</SelectItem>
                  <SelectItem value="schema">Schema Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {sortedSubmissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No submissions found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm ? 'Try adjusting your search criteria' : 'Submit a form to see it here'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-lg">{submission.schemaId}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(Number(submission.timestamp) / 1000000).toLocaleDateString()}
                    </Badge>
                    {isAdmin && (
                      <Badge variant="outline" className="gap-1">
                        <User className="h-3 w-3" />
                        {submission.user.toString().slice(0, 8)}...
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => setSelectedSubmission(submission)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedSubmission && (
        <SubmissionDetailDialog
          submission={selectedSubmission}
          open={!!selectedSubmission}
          onOpenChange={(open) => !open && setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
