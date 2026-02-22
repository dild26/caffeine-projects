import { useGetAllFilePairs } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCode2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';

export default function TemplatesPage() {
  const { data: filePairs = [] } = useGetAllFilePairs();
  const navigate = useNavigate();

  // Separate paired and unpaired files
  const pairedTemplates = filePairs.filter(pair => pair.jsonFile && pair.mdFile);
  const unpairedJson = filePairs.filter(pair => pair.jsonFile && !pair.mdFile);
  const unpairedMd = filePairs.filter(pair => !pair.jsonFile && pair.mdFile);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">Dynamic template engine with strict basename pairing</p>
        </div>
        <Button className="rounded-full" onClick={() => navigate({ to: '/upload' })}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Templates
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Pairing Status</CardTitle>
          <CardDescription>Overview of file pairing by basename (case-insensitive)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">{pairedTemplates.length}</p>
              <p className="text-sm text-muted-foreground">Fully Paired</p>
              <p className="text-xs text-muted-foreground mt-1">JSON + MD matched</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold text-amber-600">{unpairedJson.length}</p>
              <p className="text-sm text-muted-foreground">Unpaired JSON</p>
              <p className="text-xs text-muted-foreground mt-1">Missing MD file</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold text-amber-600">{unpairedMd.length}</p>
              <p className="text-sm text-muted-foreground">Unpaired MD</p>
              <p className="text-xs text-muted-foreground mt-1">Missing JSON file</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Files</CardTitle>
          <CardDescription>All template files organized by pairing status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="paired">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="paired">
                Paired ({pairedTemplates.length})
              </TabsTrigger>
              <TabsTrigger value="unpaired-json">
                Unpaired JSON ({unpairedJson.length})
              </TabsTrigger>
              <TabsTrigger value="unpaired-md">
                Unpaired MD ({unpairedMd.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="paired" className="space-y-4 mt-4">
              {pairedTemplates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No fully paired templates yet. Upload matching .json and .md files with the same basename.
                </div>
              ) : (
                <div className="space-y-2">
                  {pairedTemplates.map((pair) => (
                    <div key={pair.baseName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{pair.baseName}</p>
                        <p className="text-sm text-muted-foreground">
                          {pair.jsonFile!.name} + {pair.mdFile!.name}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        ✓ Paired
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unpaired-json" className="space-y-4 mt-4">
              {unpairedJson.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  All JSON files are paired!
                </div>
              ) : (
                <div className="space-y-2">
                  {unpairedJson.map((pair) => (
                    <div key={pair.baseName} className="flex items-center justify-between p-4 border rounded-lg border-amber-200">
                      <div>
                        <p className="font-medium">{pair.baseName}</p>
                        <p className="text-sm text-muted-foreground">
                          {pair.jsonFile!.name}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          Missing: {pair.baseName}.md
                        </p>
                      </div>
                      <Badge variant="outline" className="text-amber-600 border-amber-600">
                        ⚠ Unpaired
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unpaired-md" className="space-y-4 mt-4">
              {unpairedMd.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  All MD files are paired!
                </div>
              ) : (
                <div className="space-y-2">
                  {unpairedMd.map((pair) => (
                    <div key={pair.baseName} className="flex items-center justify-between p-4 border rounded-lg border-amber-200">
                      <div>
                        <p className="font-medium">{pair.baseName}</p>
                        <p className="text-sm text-muted-foreground">
                          {pair.mdFile!.name}
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          Missing: {pair.baseName}.json
                        </p>
                      </div>
                      <Badge variant="outline" className="text-amber-600 border-amber-600">
                        ⚠ Unpaired
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Features</CardTitle>
          <CardDescription>Advanced template engine capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="schema">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schema">JSON Schema</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="references">Cross-References</TabsTrigger>
            </TabsList>
            <TabsContent value="schema" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Recursive JSON schema parsing with validation and error reporting. Each .json file defines the contract form structure with properties, types, and validation rules.
              </p>
            </TabsContent>
            <TabsContent value="preview" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Real-time template preview with dynamic content injection. The E-Contract Form tab shows the interactive form generated from the JSON schema, while the Details tab displays the raw MD content.
              </p>
            </TabsContent>
            <TabsContent value="references" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Cross-referencing between .json and .md files for comprehensive documentation. Files are paired strictly by basename (case-insensitive, extension-agnostic). The .json file provides the form structure, and the .md file provides guidance and instructions.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
