import { useState } from 'react';
import { useGetFixtures, useGetWorkflows } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { TrendingUp, Award, CheckCircle } from 'lucide-react';

export default function LeaderboardPromotion() {
  const { data: fixtures } = useGetFixtures();
  const { data: workflows } = useGetWorkflows();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const approvedFixtures = fixtures?.filter((f) => f.status === 'approved') || [];
  const recentWorkflows = workflows?.slice(0, 10) || [];

  const handleToggleSelection = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePromoteToLeaderboard = () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item to promote');
      return;
    }

    // In a real implementation, this would call a backend method to promote items
    toast.success(`Promoted ${selectedItems.size} item(s) to the leaderboard`);
    setSelectedItems(new Set());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/leaderboard-icon-transparent.dim_64x64.png"
              alt="Leaderboard"
              className="h-6 w-6"
            />
            <CardTitle>Leaderboard Promotion</CardTitle>
          </div>
          <CardDescription>
            Promote approved fixtures and robust features to the top of the leaderboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Approved Fixtures ({approvedFixtures.length})
                </h3>
                {selectedItems.size > 0 && (
                  <Button onClick={handlePromoteToLeaderboard} size="sm">
                    <Award className="mr-2 h-4 w-4" />
                    Promote {selectedItems.size} to Leaderboard
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px] pr-4">
                {approvedFixtures.length > 0 ? (
                  <div className="space-y-2">
                    {approvedFixtures.map((fixture) => (
                      <div
                        key={fixture.id}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedItems.has(fixture.id)}
                          onCheckedChange={() => handleToggleSelection(fixture.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{fixture.name}</h4>
                            <Badge variant="default">Approved</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{fixture.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Validated: {new Date(Number(fixture.validationTime) / 1000000).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No approved fixtures available for promotion</p>
                  </div>
                )}
              </ScrollArea>
            </div>

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Workflows ({recentWorkflows.length})
              </h3>
              <ScrollArea className="h-[300px] pr-4">
                {recentWorkflows.length > 0 ? (
                  <div className="space-y-2">
                    {recentWorkflows.map((workflow) => (
                      <div
                        key={workflow.id}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedItems.has(workflow.id)}
                          onCheckedChange={() => handleToggleSelection(workflow.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{workflow.name}</h4>
                            {workflow.isPublic && <Badge variant="secondary">Public</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{workflow.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Uploaded: {new Date(Number(workflow.uploadTime) / 1000000).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No workflows available</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
