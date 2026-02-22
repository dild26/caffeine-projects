import { useState } from 'react';
import { useGetAllContracts } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Plus } from 'lucide-react';
import { ContractStatus } from '../backend';
import type { Contract } from '../backend';
import { useVoice } from './VoiceProvider';

interface ContractsListProps {
  onSelectContract: (id: string) => void;
  onCreateNew: () => void;
}

export default function ContractsList({ onSelectContract, onCreateNew }: ContractsListProps) {
  const { data: contracts = [], isLoading } = useGetAllContracts();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { speak } = useVoice();

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ContractStatus) => {
    const variants: Record<ContractStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      [ContractStatus.draft]: { variant: 'secondary', label: 'Draft' },
      [ContractStatus.active]: { variant: 'default', label: 'Active' },
      [ContractStatus.completed]: { variant: 'outline', label: 'Completed' },
      [ContractStatus.cancelled]: { variant: 'destructive', label: 'Cancelled' },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleContractHover = (contract: Contract) => {
    const summary = `${contract.title}. Status: ${contract.status}. Created ${new Date(Number(contract.createdAt) / 1000000).toLocaleDateString()}.`;
    speak(summary);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Search contracts"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]" aria-label="Filter by status">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={ContractStatus.draft}>Draft</SelectItem>
              <SelectItem value={ContractStatus.active}>Active</SelectItem>
              <SelectItem value={ContractStatus.completed}>Completed</SelectItem>
              <SelectItem value={ContractStatus.cancelled}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredContracts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No contracts found</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first contract'}
            </p>
            <Button onClick={onCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Contract
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value={ContractStatus.draft}>Draft</TabsTrigger>
            <TabsTrigger value={ContractStatus.active}>Active</TabsTrigger>
            <TabsTrigger value={ContractStatus.completed}>Completed</TabsTrigger>
            <TabsTrigger value={ContractStatus.cancelled}>Cancelled</TabsTrigger>
          </TabsList>
          
          {['all', ContractStatus.draft, ContractStatus.active, ContractStatus.completed, ContractStatus.cancelled].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredContracts
                  .filter(c => tab === 'all' || c.status === tab)
                  .map(contract => (
                    <Card
                      key={contract.id}
                      className="group cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg"
                      onClick={() => onSelectContract(contract.id)}
                      onMouseEnter={() => handleContractHover(contract)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectContract(contract.id);
                        }
                      }}
                      aria-label={`Contract: ${contract.title}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="line-clamp-1 text-lg group-hover:text-primary">
                            {contract.title}
                          </CardTitle>
                          {getStatusBadge(contract.status)}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {contract.content.substring(0, 100)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created {new Date(Number(contract.createdAt) / 1000000).toLocaleDateString()}</span>
                          <span>{contract.parties.length} parties</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
