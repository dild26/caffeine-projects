import { useState, useEffect } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetTableConfigs,
  useCreateTableConfig,
  useProcessTableOperation,
} from '../hooks/useTableQueries';
import { useGetAllApps } from '../hooks/useApps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Trash2,
  Edit,
  Archive,
  RotateCcw,
  Download,
  Save,
  Sparkles,
  MessageSquare,
  Smile,
  AlertCircle,
  BarChart3,
  Filter,
  SortAsc,
  CheckSquare,
  Square,
} from 'lucide-react';
import { toast } from 'sonner';

// All 22 implemented features from Features tab
const ALL_FEATURES = [
  'User Authentication',
  'Payment Integration',
  'Real-time Updates',
  'Mobile Responsive',
  'API Access',
  'Analytics Dashboard',
  'Export Functionality',
  'Multi-language Support',
  'PayPal Subscription',
  'PayPal One-Time Payment',
  'PayPal Recurring Billing',
  'PayPal Checkout',
  'PayPal Express',
  'PayPal REST API',
  'PayPal SDK Integration',
  'Dark Mode',
  'Email Notifications',
  'File Upload',
  'Search Functionality',
  'Data Encryption',
  'Role-Based Access Control',
  'Audit Logging',
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  maxEmojis: number;
  currentCount: number;
}

function EmojiPicker({ onSelect, maxEmojis, currentCount }: EmojiPickerProps) {
  const emojis = ['👍', '❤️', '🎉', '🚀', '⭐', '💡', '🔥', '✅', '👏', '💯', '🎯', '⚡'];

  if (currentCount >= maxEmojis) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Maximum {maxEmojis} emojis per feature reached</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {emojis.map((emoji) => (
        <Button
          key={emoji}
          variant="outline"
          size="sm"
          onClick={() => onSelect(emoji)}
          className="text-2xl"
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}

export default function AllAppFeaturesComparison() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: tableConfigs = [], isLoading: configsLoading, refetch: refetchConfigs } = useGetTableConfigs();
  const { data: apps = [] } = useGetAllApps();
  const createTableConfig = useCreateTableConfig();
  const processTableOperation = useProcessTableOperation();

  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
  const [showAddRowDialog, setShowAddRowDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showEmojiDialog, setShowEmojiDialog] = useState(false);
  const [newColumnHeader, setNewColumnHeader] = useState('');
  const [commentText, setCommentText] = useState('');
  const [selectedCell, setSelectedCell] = useState<{ rowId: number; cellIndex: number } | null>(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [actionCount, setActionCount] = useState(0);
  const [activeTab, setActiveTab] = useState('table');

  const isAuthenticated = !!identity;
  const maxPublicActions = 10;
  const canPerformAction = isAdmin || actionCount < maxPublicActions;

  useEffect(() => {
    if (tableConfigs.length > 0 && !selectedConfig) {
      setSelectedConfig(tableConfigs[0]);
    }
  }, [tableConfigs, selectedConfig]);

  const handleCreateDefaultConfig = async () => {
    if (!isAdmin) {
      toast.error('Only admins can create table configurations');
      return;
    }

    try {
      const defaultColumns = apps.map((app, index) => ({
        id: Date.now() + index,
        header: app.name,
        isSelected: false,
        isArchived: false,
        lastUpdated: Date.now(),
      }));

      const defaultRows = ALL_FEATURES.map((feature, index) => ({
        id: Date.now() + index + 1000,
        cells: defaultColumns.map(() => ({
          value: '',
          formula: null,
          isEditable: true,
          isSelected: false,
          comments: [],
          emojis: [],
          lastUpdated: Date.now(),
        })),
        isSelected: false,
        isArchived: false,
        lastUpdated: Date.now(),
      }));

      await createTableConfig.mutateAsync({
        name: 'All App Features Comparison',
        columns: defaultColumns,
        rows: defaultRows,
      });

      toast.success('Default configuration created successfully');
      await refetchConfigs();
    } catch (error) {
      console.error('Error creating default config:', error);
      toast.error('Failed to create default configuration');
    }
  };

  const handleAddColumn = async () => {
    if (!canPerformAction) {
      toast.error('Action limit reached. Please login as admin for unlimited access.');
      return;
    }

    if (!newColumnHeader.trim()) {
      toast.error('Column header cannot be empty');
      return;
    }

    try {
      await processTableOperation.mutateAsync({
        operation: 'addColumn',
        configId: selectedConfig.id,
        value: newColumnHeader,
      });

      setNewColumnHeader('');
      setShowAddColumnDialog(false);
      if (!isAdmin) setActionCount(actionCount + 1);
      toast.success('Column added successfully');
      await refetchConfigs();
    } catch (error) {
      console.error('Error adding column:', error);
      toast.error('Failed to add column');
    }
  };

  const handleAddRow = async () => {
    if (!canPerformAction) {
      toast.error('Action limit reached. Please login as admin for unlimited access.');
      return;
    }

    try {
      await processTableOperation.mutateAsync({
        operation: 'addRow',
        configId: selectedConfig.id,
      });

      setShowAddRowDialog(false);
      if (!isAdmin) setActionCount(actionCount + 1);
      toast.success('Row added successfully');
      await refetchConfigs();
    } catch (error) {
      console.error('Error adding row:', error);
      toast.error('Failed to add row');
    }
  };

  const handleUpdateCell = async (rowId: number, cellIndex: number, value: string) => {
    if (!canPerformAction) {
      toast.error('Action limit reached. Please login as admin for unlimited access.');
      return;
    }

    try {
      await processTableOperation.mutateAsync({
        operation: 'updateCell',
        configId: selectedConfig.id,
        rowId,
        cellIndex,
        value,
      });

      if (!isAdmin) setActionCount(actionCount + 1);
      await refetchConfigs();
    } catch (error) {
      console.error('Error updating cell:', error);
      toast.error('Failed to update cell');
    }
  };

  const handleToggleSelectAll = async () => {
    if (!isAdmin) {
      toast.error('Only admins can use select all functionality');
      return;
    }

    try {
      await processTableOperation.mutateAsync({
        operation: 'toggleSelectAll',
        configId: selectedConfig.id,
        isSelected: !selectAllChecked,
      });

      setSelectAllChecked(!selectAllChecked);
      toast.success(`All items ${!selectAllChecked ? 'selected' : 'deselected'}`);
      await refetchConfigs();
    } catch (error) {
      console.error('Error toggling select all:', error);
      toast.error('Failed to toggle select all');
    }
  };

  const handleAddComment = async () => {
    if (!canPerformAction) {
      toast.error('Action limit reached. Please login as admin for unlimited access.');
      return;
    }

    if (!selectedCell) return;

    if (commentText.length > 100) {
      toast.error('Comment must be 100 characters or less');
      return;
    }

    try {
      await processTableOperation.mutateAsync({
        operation: 'addComment',
        configId: selectedConfig.id,
        rowId: selectedCell.rowId,
        cellIndex: selectedCell.cellIndex,
        comment: commentText,
      });

      setCommentText('');
      setShowCommentDialog(false);
      setSelectedCell(null);
      if (!isAdmin) setActionCount(actionCount + 1);
      toast.success('Comment added successfully');
      await refetchConfigs();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleAddEmoji = async (emoji: string) => {
    if (!canPerformAction) {
      toast.error('Action limit reached. Please login as admin for unlimited access.');
      return;
    }

    if (!selectedCell) return;

    try {
      await processTableOperation.mutateAsync({
        operation: 'addEmoji',
        configId: selectedConfig.id,
        rowId: selectedCell.rowId,
        cellIndex: selectedCell.cellIndex,
        emoji,
      });

      if (!isAdmin) setActionCount(actionCount + 1);
      toast.success('Emoji added successfully');
      await refetchConfigs();
    } catch (error) {
      console.error('Error adding emoji:', error);
      toast.error('Failed to add emoji');
    }
  };

  const handleAIAutoFill = async () => {
    if (!isAdmin) {
      toast.error('Only admins can use AI auto-fill');
      return;
    }

    toast.info('AI auto-fill feature coming soon!');
  };

  const handleExport = () => {
    if (!selectedConfig) return;

    const csvContent = [
      ['Feature', ...selectedConfig.columns.map((col: any) => col.header)].join(','),
      ...selectedConfig.rows.map((row: any, rowIndex: number) =>
        [ALL_FEATURES[rowIndex] || `Feature ${rowIndex + 1}`, ...row.cells.map((cell: any) => cell.value || '')].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `features-comparison-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Data exported successfully');
  };

  if (configsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  if (tableConfigs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All App Features Comparison</CardTitle>
          <CardDescription>
            No comparison table found. Create one to get started with all {ALL_FEATURES.length} features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreateDefaultConfig} disabled={!isAdmin}>
            <Plus className="mr-2 h-4 w-4" />
            Create Default Configuration ({ALL_FEATURES.length} Features)
          </Button>
          {!isAdmin && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Only admins can create table configurations
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                All App Features Comparison
              </CardTitle>
              <CardDescription>
                Dynamic analytics table with {ALL_FEATURES.length} features across all {apps.length} SECOINFI apps
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isAdmin ? 'default' : 'secondary'}>
                {isAdmin ? 'Admin' : `${actionCount}/${maxPublicActions} actions`}
              </Badge>
              {isAuthenticated && (
                <Badge variant="outline">Authenticated</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="table">Comparison Table</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleSelectAll}
                    >
                      {selectAllChecked ? (
                        <CheckSquare className="mr-2 h-4 w-4" />
                      ) : (
                        <Square className="mr-2 h-4 w-4" />
                      )}
                      Select All
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddColumnDialog(true)}
                    disabled={!canPerformAction}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Column
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddRowDialog(true)}
                    disabled={!canPerformAction}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Row
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAIAutoFill}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Auto-Fill
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[600px] w-full border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] sticky left-0 bg-background">
                        Feature
                      </TableHead>
                      {selectedConfig?.columns.map((col: any) => (
                        <TableHead key={col.id.toString()} className="min-w-[150px]">
                          {col.header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedConfig?.rows.map((row: any, rowIndex: number) => (
                      <TableRow key={row.id.toString()}>
                        <TableCell className="font-medium sticky left-0 bg-background">
                          {ALL_FEATURES[rowIndex] || `Feature ${rowIndex + 1}`}
                        </TableCell>
                        {row.cells.map((cell: any, cellIndex: number) => (
                          <TableCell key={cellIndex}>
                            <div className="space-y-2">
                              <Input
                                value={cell.value}
                                onChange={(e) =>
                                  handleUpdateCell(row.id, cellIndex, e.target.value)
                                }
                                placeholder="Enter value..."
                                disabled={!canPerformAction}
                                className="min-w-[120px]"
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCell({ rowId: row.id, cellIndex });
                                    setShowCommentDialog(true);
                                  }}
                                  disabled={!canPerformAction}
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  {cell.comments.length > 0 && (
                                    <span className="ml-1 text-xs">
                                      {cell.comments.length}
                                    </span>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCell({ rowId: row.id, cellIndex });
                                    setShowEmojiDialog(true);
                                  }}
                                  disabled={!canPerformAction}
                                >
                                  <Smile className="h-3 w-3" />
                                  {cell.emojis.length > 0 && (
                                    <span className="ml-1 text-xs">
                                      {cell.emojis.join('')}
                                    </span>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Visualizations and insights from the comparison data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Analytics visualizations coming soon!</p>
                    <p className="text-sm mt-2">
                      Charts, graphs, and insights will be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Table Settings</CardTitle>
                  <CardDescription>
                    Configure table behavior and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Access Control</Label>
                    <div className="text-sm text-muted-foreground">
                      <p>Admin: Full access to all features</p>
                      <p>Authenticated Users: Limited to {maxPublicActions} actions per session</p>
                      <p>Public Users: View only</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Comment Limits</Label>
                    <p className="text-sm text-muted-foreground">
                      Maximum 100 characters per comment
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Emoji Limits</Label>
                    <p className="text-sm text-muted-foreground">
                      Maximum 10 emojis per feature cell
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Column Dialog */}
      <Dialog open={showAddColumnDialog} onOpenChange={setShowAddColumnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
            <DialogDescription>
              Enter the header name for the new column
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="columnHeader">Column Header</Label>
              <Input
                id="columnHeader"
                value={newColumnHeader}
                onChange={(e) => setNewColumnHeader(e.target.value)}
                placeholder="e.g., New App Name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddColumnDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddColumn}>Add Column</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Row Dialog */}
      <Dialog open={showAddRowDialog} onOpenChange={setShowAddRowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Row</DialogTitle>
            <DialogDescription>
              A new feature row will be added to the comparison table
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRow}>Add Row</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Maximum 100 characters per comment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment..."
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground text-right">
                {commentText.length}/100 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddComment}>Add Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emoji Dialog */}
      <Dialog open={showEmojiDialog} onOpenChange={setShowEmojiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emoji</DialogTitle>
            <DialogDescription>
              Select an emoji to add to this feature (max 10 per cell)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <EmojiPicker
              onSelect={(emoji) => {
                handleAddEmoji(emoji);
                setShowEmojiDialog(false);
              }}
              maxEmojis={10}
              currentCount={
                selectedCell
                  ? selectedConfig?.rows
                      .find((r: any) => r.id === selectedCell.rowId)
                      ?.cells[selectedCell.cellIndex]?.emojis.length || 0
                  : 0
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmojiDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
