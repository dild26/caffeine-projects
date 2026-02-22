import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useImportContactsFromCSV } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Upload as UploadIcon, FileText } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const importContacts = useImportContactsFromCSV();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      const text = await file.text();
      await importContacts.mutateAsync(text);
      toast.success('Contacts imported successfully');
      setFile(null);
    } catch (error) {
      toast.error('Failed to import contacts');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Upload</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Import data in bulk using CSV files
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>CSV Import</CardTitle>
          <CardDescription>Upload a CSV file to import contacts in bulk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {file ? file.name : 'Drag and drop your CSV file here, or click to browse'}
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" asChild>
                <span>Select File</span>
              </Button>
            </label>
          </div>

          {file && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button onClick={handleUpload} disabled={importContacts.isPending}>
                {importContacts.isPending ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">CSV Format Requirements</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• First row should contain headers: name, email, phone, company, tags</li>
              <li>• Each subsequent row represents one contact</li>
              <li>• Tags should be comma-separated within quotes</li>
              <li>• Maximum file size: 5MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
