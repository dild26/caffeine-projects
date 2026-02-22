import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { Contract } from '../backend';
import { ContractStatus } from '../backend';

interface StatsOverviewProps {
  contracts: Contract[];
}

export default function StatsOverview({ contracts }: StatsOverviewProps) {
  const stats = {
    total: contracts.length,
    draft: contracts.filter(c => c.status === ContractStatus.draft).length,
    active: contracts.filter(c => c.status === ContractStatus.active).length,
    completed: contracts.filter(c => c.status === ContractStatus.completed).length,
    cancelled: contracts.filter(c => c.status === ContractStatus.cancelled).length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All contracts in system</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-accent/50 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <Clock className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Awaiting execution</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-green-500/50 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          <p className="text-xs text-muted-foreground">Successfully executed</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-muted/50 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Draft</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">{stats.draft}</div>
          <p className="text-xs text-muted-foreground">In progress</p>
        </CardContent>
      </Card>
    </div>
  );
}
