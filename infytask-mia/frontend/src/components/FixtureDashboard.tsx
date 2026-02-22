import { useGetAllFixtures, useGetAllExecutionLogs, useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, Clock, PlayCircle, Shield, FileText } from 'lucide-react';
import { Fixture, FixtureStatus, ExecutionLog } from '../backend';
import { cn } from '@/lib/utils';

const FIXTURE_STATUS_CONFIG = {
    [FixtureStatus.pending]: {
        label: 'Pending',
        icon: Clock,
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
    [FixtureStatus.approved]: {
        label: 'Approved',
        icon: CheckCircle2,
        color: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    [FixtureStatus.rejected]: {
        label: 'Rejected',
        icon: XCircle,
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
    [FixtureStatus.executed]: {
        label: 'Executed',
        icon: PlayCircle,
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
};

export function FixtureDashboard() {
    const { data: fixtures, isLoading: fixturesLoading } = useGetAllFixtures();
    const { data: executionLogs, isLoading: logsLoading } = useGetAllExecutionLogs();
    const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

    if (fixturesLoading || logsLoading || adminLoading) {
        return (
            <div className="container py-8">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-96" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="container py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>
                            Only administrators can access the fixture dashboard.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const fixturesByFoF = fixtures?.reduce((acc, fixture) => {
        if (!acc[fixture.fof]) {
            acc[fixture.fof] = [];
        }
        acc[fixture.fof].push(fixture);
        return acc;
    }, {} as Record<string, Fixture[]>) || {};

    return (
        <div className="container py-8">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Fixture Governance Dashboard</h2>
                <p className="text-muted-foreground">
                    Manage fixtures grouped by Field of Focus with AI/Admin decisions and execution tracking
                </p>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Fixtures</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <p className="text-2xl font-bold">{fixtures?.length || 0}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                            <p className="text-2xl font-bold">
                                {fixtures?.filter(f => f.status === FixtureStatus.approved).length || 0}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Executed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <PlayCircle className="h-8 w-8 text-blue-500" />
                            <p className="text-2xl font-bold">
                                {fixtures?.filter(f => f.status === FixtureStatus.executed).length || 0}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Execution Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <FileText className="h-8 w-8 text-primary" />
                            <p className="text-2xl font-bold">{executionLogs?.length || 0}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="by-fof" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="by-fof">Grouped by FoF</TabsTrigger>
                    <TabsTrigger value="all-fixtures">All Fixtures</TabsTrigger>
                    <TabsTrigger value="execution-logs">Execution Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="by-fof" className="space-y-6">
                    {Object.keys(fixturesByFoF).length > 0 ? (
                        Object.entries(fixturesByFoF).map(([fof, fofFixtures]) => (
                            <Card key={fof}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        {fof}
                                    </CardTitle>
                                    <CardDescription>
                                        {fofFixtures.length} fixture{fofFixtures.length !== 1 ? 's' : ''} in this field
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[300px] pr-4">
                                        <div className="space-y-3">
                                            {fofFixtures.map((fixture) => {
                                                const config = FIXTURE_STATUS_CONFIG[fixture.status];
                                                const Icon = config.icon;
                                                return (
                                                    <div key={fixture.id} className="p-4 rounded-lg border bg-card">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <p className="font-medium">{fixture.topic}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {new Date(Number(fixture.timestamp) / 1000000).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <Badge className={config.color}>
                                                                <Icon className="h-3 w-3 mr-1" />
                                                                {config.label}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <span className="text-muted-foreground">AI Decision:</span>
                                                                <Badge variant={fixture.aiDecision ? "default" : "outline"}>
                                                                    {fixture.aiDecision ? "Approved" : "Pending"}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <span className="text-muted-foreground">Admin Decision:</span>
                                                                <Badge variant={fixture.adminDecision ? "default" : "outline"}>
                                                                    {fixture.adminDecision ? "Approved" : "Pending"}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        {fixture.merkleProof && (
                                                            <div className="mt-2 p-2 rounded bg-muted text-xs font-mono">
                                                                <span className="text-muted-foreground">Merkle Proof: </span>
                                                                {fixture.merkleProof.substring(0, 32)}...
                                                            </div>
                                                        )}
                                                        {fixture.executionLogs.length > 0 && (
                                                            <div className="mt-2">
                                                                <p className="text-xs font-semibold mb-1">Execution Logs:</p>
                                                                <div className="space-y-1">
                                                                    {fixture.executionLogs.map((logId, idx) => (
                                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                                            {logId}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                <Shield className="h-12 w-12 mb-2 opacity-50" />
                                <p>No fixtures available</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="all-fixtures" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Fixtures</CardTitle>
                            <CardDescription>
                                Complete list of all fixtures with status and decisions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[500px] pr-4">
                                {fixtures && fixtures.length > 0 ? (
                                    <div className="space-y-3">
                                        {fixtures.map((fixture) => {
                                            const config = FIXTURE_STATUS_CONFIG[fixture.status];
                                            const Icon = config.icon;
                                            return (
                                                <div key={fixture.id} className="p-4 rounded-lg border bg-card">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="font-medium">{fixture.topic}</p>
                                                            <div className="flex gap-2 mt-1">
                                                                <Badge variant="outline" className="text-xs">
                                                                    FoF: {fixture.fof}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <Badge className={config.color}>
                                                            <Icon className="h-3 w-3 mr-1" />
                                                            {config.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-muted-foreground">AI:</span>
                                                            <Badge variant={fixture.aiDecision ? "default" : "outline"}>
                                                                {fixture.aiDecision ? "✓" : "○"}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-muted-foreground">Admin:</span>
                                                            <Badge variant={fixture.adminDecision ? "default" : "outline"}>
                                                                {fixture.adminDecision ? "✓" : "○"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                        <Shield className="h-12 w-12 mb-2 opacity-50" />
                                        <p>No fixtures yet</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="execution-logs" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Execution Logs</CardTitle>
                            <CardDescription>
                                Complete audit trail with timestamps, actors, and Merkle roots
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[500px] pr-4">
                                {executionLogs && executionLogs.length > 0 ? (
                                    <div className="space-y-3">
                                        {executionLogs.map((log) => (
                                            <div key={log.id} className="p-4 rounded-lg border bg-card">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-medium">{log.action}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {new Date(Number(log.timestamp) / 1000000).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline">
                                                        {log.result}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2 mt-3">
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">Target: </span>
                                                        <span className="font-mono">{log.target}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">Actor: </span>
                                                        <span className="font-mono text-xs">{log.actorPrincipal.toString()}</span>
                                                    </div>
                                                    <div className="p-2 rounded bg-muted text-xs font-mono">
                                                        <span className="text-muted-foreground">Merkle Root: </span>
                                                        {log.merkleRoot}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                        <FileText className="h-12 w-12 mb-2 opacity-50" />
                                        <p>No execution logs yet</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
