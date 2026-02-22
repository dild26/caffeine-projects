import { useState } from 'react';
import { useGetAllFormSchemas, useCreateFormSchema, useDeleteFormSchema } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FileJson } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SchemaEditorDialog from './SchemaEditorDialog';
import SchemaCatalogDialog from './SchemaCatalogDialog';
import type { FormSchema } from '../backend';
import { normalizeArray } from '../lib/schemaUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function FormSchemaManager() {
  const { data: schemas = [], isLoading } = useGetAllFormSchemas();
  const { mutate: deleteSchema } = useDeleteFormSchema();
  const [editorOpen, setEditorOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [schemaToDelete, setSchemaToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setSchemaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (schemaToDelete) {
      deleteSchema(schemaToDelete);
      setDeleteDialogOpen(false);
      setSchemaToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading schemas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Form Schema Management</h2>
          <p className="text-muted-foreground mt-1">Create and manage form schemas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCatalogOpen(true)} variant="outline" className="gap-2">
            <FileJson className="h-4 w-4" />
            Schema Catalog
          </Button>
          <Button onClick={() => setEditorOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Schema
          </Button>
        </div>
      </div>

      {schemas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileJson className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No schemas yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first form schema to get started
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setCatalogOpen(true)} variant="outline" className="gap-2">
                <FileJson className="h-4 w-4" />
                Browse Catalog
              </Button>
              <Button onClick={() => setEditorOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Schema
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schemas.map((schema) => {
            // Normalize arrays to prevent runtime errors
            const fields = normalizeArray(schema.fields);
            const validations = normalizeArray(schema.validations);
            const calculations = normalizeArray(schema.calculations);
            
            return (
              <Card key={schema.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{schema.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{schema.description}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(schema.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{fields.length} fields</Badge>
                      <Badge variant="secondary">{validations.length} validations</Badge>
                    </div>
                    {calculations.length > 0 && (
                      <Badge variant="outline">{calculations.length} calculations</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <SchemaEditorDialog open={editorOpen} onOpenChange={setEditorOpen} />
      <SchemaCatalogDialog open={catalogOpen} onOpenChange={setCatalogOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schema</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schema? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
