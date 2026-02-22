import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, FolderOpen, TrendingUp, Clock } from 'lucide-react';
import type { Dataset, Project } from '../backend';

interface StatsOverviewProps {
  datasets: Dataset[];
  projects: Project[];
}

export default function StatsOverview({ datasets, projects }: StatsOverviewProps) {
  const totalDatasets = datasets.length;
  const totalProjects = projects.length;

  const recentDatasets = datasets
    .sort((a, b) => Number(b.createdAt - a.createdAt))
    .slice(0, 3);

  const formatDate = (time: bigint) => {
    const date = new Date(Number(time) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDatasets}</div>
          <p className="text-xs text-muted-foreground">Uploaded data files</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground">Active projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(totalDatasets * 2.4).toFixed(1)} MB</div>
          <p className="text-xs text-muted-foreground">Across all datasets</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentDatasets.length}</div>
          <p className="text-xs text-muted-foreground">
            {recentDatasets.length > 0 ? `Last: ${formatDate(recentDatasets[0].createdAt)}` : 'No recent activity'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
