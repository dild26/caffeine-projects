import { useState, useEffect } from 'react';
import { useGetContract, useCreateContract, useUpdateContract, useDeleteContract, useChangeContractStatus } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Trash2, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { ContractStatus } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

interface ContractEditorProps {
  contractId: string | null;
  isCreating: boolean;
  onClose: () => void;
}

export default function ContractEditor({ contractId, isCreating, onClose }: ContractEditorProps) {
  const { data: contract, isLoading } = useGetContract(contractId || '');
  const createMutation = useCreateContract();
  const updateMutation = useUpdateContract();
  const deleteMutation = useDeleteContract();
  const changeStatusMutation = useChangeContractStatus();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [parties, setParties] = useState('');

  useEffect(() => {
    if (contract && !isCreating) {
      setTitle(contract.title);
      setContent(contract.content);
      setParties(contract.parties.map(p => p.toString()).join(', '));
    }
  }, [contract, isCreating]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const partiesArray = parties
      .split(',')
      .map(p => p.trim())
      .filter(p => p)
      .map(p => {
        try {
          return Principal.fromText(p);
        } catch {
          return null;
        }
      })
      .filter((p): p is Principal => p !== null);

    if (isCreating) {
      createMutation.mutate(
        { title, content, parties: partiesArray },
        {
          onSuccess: () => {
            toast.success('Contract created successfully!');
            onClose();
          },
          onError: (error) => {
            toast.error(`Failed to create contract: ${error.message}`);
          },
        }
      );
    } else if (contractId) {
      updateMutation.mutate(
        { id: contractId, title, content },
        {
          onSuccess: () => {
            toast.success('Contract updated successfully!');
            onClose();
          },
          onError: (error) => {
            toast.error(`Failed to update contract: ${error.message}`);
          },
        }
      );
    }
  };

  const handleDelete = async () => {
    if (!contractId) return;

    deleteMutation.mutate(contractId, {
      onSuccess: () => {
        toast.success('Contract deleted successfully!');
        onClose();
      },
      onError: (error) => {
        toast.error(`Failed to delete contract: ${error.message}`);
      },
    });
  };

  const handleStatusChange = async (newStatus: ContractStatus) => {
    if (!contractId) return;

    changeStatusMutation.mutate(
      { id: contractId, status: newStatus },
      {
        onSuccess: () => {
          toast.success('Contract status updated!');
        },
        onError: (error) => {
          toast.error(`Failed to update status: ${error.message}`);
        },
      }
    );
  };

  if (isLoading && !isCreating) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading contract...</p>
        </div>
      </div>
    );
  }

  const isDraft = contract?.status === ContractStatus.draft || isCreating;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose} className="gap-2" aria-label="Back to contracts">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {!isCreating && contract && (
          <div className="flex items-center gap-2">
            <Select
              value={contract.status}
              onValueChange={(value) => handleStatusChange(value as ContractStatus)}
              disabled={changeStatusMutation.isPending}
            >
              <SelectTrigger className="w-[150px]" aria-label="Change contract status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ContractStatus.draft}>Draft</SelectItem>
                <SelectItem value={ContractStatus.active}>Active</SelectItem>
                <SelectItem value={ContractStatus.completed}>Completed</SelectItem>
                <SelectItem value={ContractStatus.cancelled}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{isCreating ? 'Create New Contract' : 'Edit Contract'}</CardTitle>
          <CardDescription>
            {isDraft ? 'Fill in the contract details below' : 'View contract details'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Contract Title *</Label>
            <Input
              id="title"
              placeholder="Enter contract title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isDraft || isSaving}
              aria-label="Contract title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contract Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter contract terms and conditions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!isDraft || isSaving}
              rows={12}
              className="resize-none font-mono text-sm"
              aria-label="Contract content"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parties">Parties (Principal IDs, comma-separated)</Label>
            <Input
              id="parties"
              placeholder="e.g., aaaaa-aa, bbbbb-bb"
              value={parties}
              onChange={(e) => setParties(e.target.value)}
              disabled={!isCreating || isSaving}
              aria-label="Contract parties"
            />
            <p className="text-xs text-muted-foreground">
              Enter Internet Computer Principal IDs separated by commas
            </p>
          </div>

          {!isCreating && contract && (
            <div className="grid gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {new Date(Number(contract.createdAt) / 1000000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                  {new Date(Number(contract.updatedAt) / 1000000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parties:</span>
                <span className="font-medium">{contract.parties.length}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              {isDraft && (
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isCreating ? 'Create' : 'Save Changes'}
                    </>
                  )}
                </Button>
              )}
            </div>

            {!isCreating && isDraft && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the contract.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
