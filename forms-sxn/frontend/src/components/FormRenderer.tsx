import { useState } from 'react';
import { useGetAllFormSchemas } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import DynamicForm from './DynamicForm';
import { FileText } from 'lucide-react';

export default function FormRenderer() {
  const { data: schemas = [], isLoading } = useGetAllFormSchemas();
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);

  const selectedSchema = schemas.find((s) => s.id === selectedSchemaId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Fill Forms</h2>
        <p className="text-muted-foreground mt-1">Select a form to fill out and submit</p>
      </div>

      {schemas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No forms available</h3>
            <p className="text-muted-foreground text-center">
              Contact an administrator to create form schemas
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Select Form</CardTitle>
              <CardDescription>Choose a form to fill out</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="form-select" className="font-bold">
                  Available Forms
                </Label>
                <Select value={selectedSchemaId || ''} onValueChange={setSelectedSchemaId}>
                  <SelectTrigger id="form-select">
                    <SelectValue placeholder="Select a form..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schemas.map((schema) => (
                      <SelectItem key={schema.id} value={schema.id}>
                        {schema.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {selectedSchema && <DynamicForm schema={selectedSchema} />}
        </>
      )}
    </div>
  );
}
