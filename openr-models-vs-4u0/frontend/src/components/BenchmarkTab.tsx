import { useModels, useHistoricalBenchmarks } from '../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Zap, Clock } from 'lucide-react';

export default function BenchmarkTab() {
    const { data: models } = useModels();
    const [selectedModelId, setSelectedModelId] = useState<bigint | null>(null);

    const { data: benchmarks, isLoading } = useHistoricalBenchmarks(selectedModelId);

    const selectedModel = models?.find(m => m.id === selectedModelId);

    // Initialize selected model if not set
    if (!selectedModelId && models && models.length > 0) {
        setSelectedModelId(models[0].id);
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400" />
                    Performance Metrics
                </h2>
                <div className="w-full md:w-64">
                    <Select value={selectedModelId?.toString()} onValueChange={(val) => setSelectedModelId(BigInt(val))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                            {models?.map(m => (
                                <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedModel && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MetricCard
                        label="P50 Latency"
                        value={`${selectedModel.benchmark.p50Latency}ms`}
                        subValue="Median Response Time"
                        icon={<Clock className="h-4 w-4 text-blue-500" />}
                    />
                    <MetricCard
                        label="P95 Latency"
                        value={`${selectedModel.benchmark.p95Latency}ms`}
                        subValue="Tail Latency"
                        icon={<Zap className="h-4 w-4 text-amber-500" />}
                    />
                    <MetricCard
                        label="Timeout Rate"
                        value={`${(selectedModel.benchmark.timeoutRate * 100).toFixed(2)}%`}
                        subValue="Request Failures"
                        icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                    />
                    <MetricCard
                        label="Malformed rate"
                        value={`${(selectedModel.benchmark.malformedResponseRate * 100).toFixed(3)}%`}
                        subValue="Response Integrity"
                        icon={<AlertCircle className="h-4 w-4 text-orange-500" />}
                    />
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Latency Trend (7 Days)</CardTitle>
                    <CardDescription>Historical P50/P95 latency tracking in milliseconds.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full mt-4">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading chart data...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={benchmarks}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="timestamp"
                                        tickFormatter={(ts) => new Date(Number(ts)).toLocaleDateString(undefined, { weekday: 'short' })}
                                        fontSize={12}
                                    />
                                    <YAxis fontSize={12} />
                                    <Tooltip
                                        labelFormatter={(label) => new Date(Number(label)).toLocaleString()}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                    <Line type="monotone" dataKey="p50" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function MetricCard({ label, value, subValue, icon }: { label: string, value: string, subValue: string, icon: React.ReactNode }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                    {icon}
                    <span className="text-xs font-medium text-muted-foreground uppercase">{label}</span>
                </div>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-[10px] text-muted-foreground mt-1">{subValue}</p>
            </CardContent>
        </Card>
    )
}
