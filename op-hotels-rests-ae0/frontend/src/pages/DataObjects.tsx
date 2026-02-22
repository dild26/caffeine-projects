import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAllDataObjects, useAddDataObject } from '../hooks/useQueries';
import { Upload, FileText, FileJson, FileArchive, File } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalBlob } from '../backend';

export default function DataObjects() {
  const { data: dataObjects, isLoading } = useGetAllDataObjects();
  const addDataObject = useAddDataObject();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['.json', '.csv', '.md', '.zip'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      toast.error('Invalid file type. Allowed: .json, .csv, .md, .zip');
      return;
    }

    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      const dataObject = {
        id: `obj-${Date.now()}`,
        name: file.name,
        fileType: fileExt,
        metadata: JSON.stringify({
          size: file.size,
          lastModified: file.lastModified,
          type: file.type,
        }),
        preview: fileExt === '.md' ? 'Markdown preview available' : undefined,
        uploadedAt: BigInt(Date.now() * 1000000),
        blob,
      };

      await addDataObject.mutateAsync(dataObject);
      toast.success('File uploaded successfully!');
      e.target.value = '';
    } catch (error) {
      toast.error('Failed to upload file');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case '.json':
        return <FileJson className="h-8 w-8 text-blue-500" />;
      case '.csv':
        return <FileText className="h-8 w-8 text-green-500" />;
      case '.md':
        return <FileText className="h-8 w-8 text-purple-500" />;
      case '.zip':
        return <FileArchive className="h-8 w-8 text-orange-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Data Objects</h1>
        <p className="text-muted-foreground">
          Upload and manage structured files with automatic metadata extraction
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Supported formats: .json, .csv, .md, .zip
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".json,.csv,.md,.zip"
              />
            </Label>
            {uploading && (
              <p className="text-sm text-muted-foreground text-center">
                Uploading...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>
            {dataObjects?.length || 0} file(s) stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : dataObjects && dataObjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dataObjects.map(obj => {
                const metadata = JSON.parse(obj.metadata);
                return (
                  <Card key={obj.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          {getFileIcon(obj.fileType)}
                          <Badge variant="outline">{obj.fileType}</Badge>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold truncate" title={obj.name}>
                            {obj.name}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Size: {formatFileSize(metadata.size)}</p>
                            <p>Uploaded: {formatTimestamp(obj.uploadedAt)}</p>
                          </div>
                          {obj.preview && (
                            <p className="text-xs text-muted-foreground italic">
                              {obj.preview}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            const url = obj.blob.getDirectURL();
                            window.open(url, '_blank');
                          }}
                        >
                          View File
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No files uploaded yet. Upload your first file above.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
