import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileJson, Sparkles } from 'lucide-react';
import { useGetAllJsonSchemaTemplates, useGetAllMlPromptTemplates } from '../hooks/useTemplates';

interface TemplateLibraryProps {
  isAdmin: boolean;
}

export default function TemplateLibrary({ isAdmin }: TemplateLibraryProps) {
  const { data: jsonTemplates = [], isLoading: loadingJson } = useGetAllJsonSchemaTemplates();
  const { data: mlTemplates = [], isLoading: loadingMl } = useGetAllMlPromptTemplates();

  return (
    <div className="space-y-6">
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="text-2xl">Template Library</CardTitle>
          <CardDescription className="text-base">
            Reusable templates for site creation and ML prompts (Feature not yet implemented)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="json" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="json" className="gap-2">
                <FileJson className="w-4 h-4" />
                JSON Schemas ({jsonTemplates.length})
              </TabsTrigger>
              <TabsTrigger value="ml" className="gap-2">
                <Sparkles className="w-4 h-4" />
                ML Prompts ({mlTemplates.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="json" className="space-y-4">
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <FileJson className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Template library feature coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This feature will allow you to create and manage reusable JSON schema templates
                </p>
              </div>
            </TabsContent>

            <TabsContent value="ml" className="space-y-4">
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Template library feature coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This feature will allow you to create and manage ML prompt templates for AI-assisted development
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
