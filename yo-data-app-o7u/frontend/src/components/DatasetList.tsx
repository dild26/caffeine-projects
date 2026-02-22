import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Globe } from 'lucide-react';
import type { Dataset } from '../backend';
import DatasetViewDialog from './DatasetViewDialog';

interface DatasetListProps {
  datasets: Dataset[];
  isLoading: boolean;
}

export default function DatasetList({ datasets, isLoading }: DatasetListProps) {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  const formatDate = (time: bigint) => {
    const date = new Date(Number(time) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getFormatBadgeVariant = (format: string) => {
    switch (format.toLowerCase()) {
      case 'csv':
        return 'default';
      case 'json':
        return 'secondary';
      case 'excel':
        return 'outline';
      default:
        return 'default';
    }
  };

  const handleDownload = (dataset: Dataset) => {
    try {
      // Convert Uint8Array to regular array buffer for Blob
      const buffer = new ArrayBuffer(dataset.blob.length);
      const view = new Uint8Array(buffer);
      view.set(dataset.blob);
      
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset.name}.${dataset.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download dataset:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading datasets...</p>
        </div>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No datasets yet</p>
          <p className="text-xs text-muted-foreground">Upload your first dataset to get started</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasets.map((dataset) => (
              <TableRow key={dataset.id}>
                <TableCell className="font-medium">{dataset.name}</TableCell>
                <TableCell>
                  <Badge variant={getFormatBadgeVariant(dataset.format)}>{dataset.format.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  {dataset.isPublic ? (
                    <Badge variant="secondary" className="gap-1">
                      <Globe className="h-3 w-3" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="outline">Private</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(dataset.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedDataset(dataset)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(dataset)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedDataset && (
        <DatasetViewDialog dataset={selectedDataset} open={!!selectedDataset} onOpenChange={() => setSelectedDataset(null)} />
      )}
    </>
  );
}
