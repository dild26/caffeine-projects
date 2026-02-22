import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetFixtures, useAddFixture, useUpdateFixtureStatus } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Fixture } from '../../backend';
import { CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

export default function FixtureManagement() {
  const { identity } = useInternetIdentity();
  const { data: fixtures, isLoading } = useGetFixtures();
  const addFixture = useAddFixture();
  const updateFixtureStatus = useUpdateFixtureStatus();

  const [showAddForm, setShowAddForm] = useState(false);
  const [fixtureName, setFixtureName] = useState('');
  const [fixtureDescription, setFixtureDescription] = useState('');

  const handleAddFixture = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fixtureName.trim() || !fixtureDescription.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const fixture: Fixture = {
        id: `fixture-${Date.now()}`,
        name: fixtureName.trim(),
        description: fixtureDescription.trim(),
        status: 'pending',
        validationTime: BigInt(Date.now() * 1000000),
        validator: identity!.getPrincipal(),
      };

      await addFixture.mutateAsync(fixture);
      toast.success('Fixture added successfully');
      setFixtureName('');
      setFixtureDescription('');
      setShowAddForm(false);
    } catch (error) {
      toast.error('Failed to add fixture');
    }
  };

  const handleStatusChange = async (fixtureId: string, status: string) => {
    try {
      await updateFixtureStatus.mutateAsync({ fixtureId, status });
      toast.success(`Fixture status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update fixture status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p>Loading fixtures...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/validation-icon-transparent.dim_64x64.png"
                alt="Validation"
                className="h-6 w-6"
              />
              <CardTitle>Fixture System</CardTitle>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Fixture
            </Button>
          </div>
          <CardDescription>
            Validate and promote features after auto-checking. Approved fixtures can be promoted to the leaderboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <form onSubmit={handleAddFixture} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div>
                <Label htmlFor="fixtureName">Feature Name</Label>
                <Input
                  id="fixtureName"
                  value={fixtureName}
                  onChange={(e) => setFixtureName(e.target.value)}
                  placeholder="Enter feature name"
                />
              </div>
              <div>
                <Label htmlFor="fixtureDescription">Description</Label>
                <Textarea
                  id="fixtureDescription"
                  value={fixtureDescription}
                  onChange={(e) => setFixtureDescription(e.target.value)}
                  placeholder="Describe the feature and validation criteria"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addFixture.isPending}>
                  Add Fixture
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <ScrollArea className="h-[500px] pr-4">
            {fixtures && fixtures.length > 0 ? (
              <div className="space-y-3">
                {fixtures.map((fixture) => (
                  <div key={fixture.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(fixture.status)}
                          <h3 className="font-semibold">{fixture.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{fixture.description}</p>
                      </div>
                      <Badge variant={getStatusVariant(fixture.status)}>{fixture.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Validated: {new Date(Number(fixture.validationTime) / 1000000).toLocaleString()}
                      </span>
                      <Select
                        value={fixture.status}
                        onValueChange={(value) => handleStatusChange(fixture.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No fixtures created yet</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
