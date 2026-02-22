import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Calendar } from 'lucide-react';
import type { Project } from '../backend';

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
}

export default function ProjectList({ projects, isLoading }: ProjectListProps) {
  const formatDate = (time: bigint) => {
    const date = new Date(Number(time) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No projects yet</p>
          <p className="text-xs text-muted-foreground">Create your first project to organize datasets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <FolderOpen className="h-8 w-8 text-primary" />
              <Badge variant="outline">Active</Badge>
            </div>
            <CardTitle className="mt-4">{project.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created {formatDate(project.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Project workspace for organizing related datasets and analyses</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
