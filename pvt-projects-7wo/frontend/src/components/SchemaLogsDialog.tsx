import { useGetSchemaChangeLogs } from '../hooks/useQueries';
import { SchemaChangeLog, SchemaType, ChangeType } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AlertCircle, FileText, Database } from 'lucide-react';

interface SchemaLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleString();
}

function getSchemaTypeLabel(schemaType: SchemaType): string {
  switch (schemaType) {
    case SchemaType.userProfile:
      return 'User Profile';
    case SchemaType.task:
      return 'Task';
    default:
      return 'Unknown';
  }
}

function getChangeTypeLabel(changeType: ChangeType): string {
  switch (changeType) {
    case ChangeType.fieldAdded:
      return 'Field Added';
    case ChangeType.fieldRemoved:
      return 'Field Removed';
    case ChangeType.typeChanged:
      return 'Type Changed';
    case ChangeType.validationRuleChanged:
      return 'Validation Rule Changed';
    default:
      return 'Unknown';
  }
}

function getChangeTypeVariant(changeType: ChangeType): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (changeType) {
    case ChangeType.fieldAdded:
      return 'default';
    case ChangeType.fieldRemoved:
      return 'destructive';
    case ChangeType.typeChanged:
      return 'secondary';
    case ChangeType.validationRuleChanged:
      return 'outline';
    default:
      return 'outline';
  }
}

function getSchemaTypeIcon(schemaType: SchemaType) {
  switch (schemaType) {
    case SchemaType.userProfile:
      return <FileText className="h-4 w-4" />;
    case SchemaType.task:
      return <Database className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

export default function SchemaLogsDialog({ open, onOpenChange }: SchemaLogsDialogProps) {
  const { data: logs, isLoading, error } = useGetSchemaChangeLogs();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Schema Change Logs</DialogTitle>
          <DialogDescription>
            History of all schema changes and validation rule updates
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center py-8 text-destructive">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>Failed to load schema logs</span>
            </div>
          )}
          
          {!isLoading && !error && logs && logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Database className="mb-4 h-12 w-12 opacity-50" />
              <p>No schema changes recorded yet</p>
            </div>
          )}
          
          {!isLoading && !error && logs && logs.length > 0 && (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={index}>
                  <div className="space-y-2 rounded-lg border bg-card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {getSchemaTypeIcon(log.schemaType)}
                        <span className="font-medium">{getSchemaTypeLabel(log.schemaType)}</span>
                      </div>
                      <Badge variant={getChangeTypeVariant(log.changeType)}>
                        {getChangeTypeLabel(log.changeType)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{log.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTimestamp(log.timestamp)}</span>
                    </div>
                  </div>
                  
                  {index < logs.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
