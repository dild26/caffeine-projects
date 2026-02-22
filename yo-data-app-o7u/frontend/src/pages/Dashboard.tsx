import { useState } from 'react';
import { useGetUserDatasets, useGetUserProjects } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Database, FolderOpen } from 'lucide-react';
import DatasetList from '../components/DatasetList';
import ProjectList from '../components/ProjectList';
import UploadDatasetDialog from '../components/UploadDatasetDialog';
import CreateProjectDialog from '../components/CreateProjectDialog';
import StatsOverview from '../components/StatsOverview';

export default function Dashboard() {
  const { data: datasets = [], isLoading: datasetsLoading } = useGetUserDatasets();
  const { data: projects = [], isLoading: projectsLoading } = useGetUserProjects();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your datasets, projects, and analytics</p>
      </div>

      <StatsOverview datasets={datasets} projects={projects} />

      <Tabs defaultValue="datasets" className="mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="datasets">
            <Database className="mr-2 h-4 w-4" />
            Datasets
          </TabsTrigger>
          <TabsTrigger value="projects">
            <FolderOpen className="mr-2 h-4 w-4" />
            Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Datasets</CardTitle>
                  <CardDescription>Upload and manage your data files</CardDescription>
                </div>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Dataset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DatasetList datasets={datasets} isLoading={datasetsLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>Organize related datasets and analyses</CardDescription>
                </div>
                <Button onClick={() => setCreateProjectDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProjectList projects={projects} isLoading={projectsLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UploadDatasetDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      <CreateProjectDialog open={createProjectDialogOpen} onOpenChange={setCreateProjectDialogOpen} />
    </div>
  );
}
