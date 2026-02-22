import { useModels } from '../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, TrendingUp } from 'lucide-react';

export default function EvaluationTab() {
    const { data: models, isLoading } = useModels();

    if (isLoading) return <div className="p-8 text-center">Loading evaluation data...</div>;

    const top3 = models?.slice(0, 3) || [];
    const rest = models?.slice(3) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Top 3 Models */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <h2 className="text-xl font-semibold">Top Performers</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {top3.map((model, idx) => (
                        <Card key={model.id} className={`overflow-hidden border-2 ${idx === 0 ? 'border-primary/20 shadow-lg' : 'border-border'}`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={idx === 0 ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold tracking-wider">
                                        {idx === 0 ? 'Champion' : `Rank #${idx + 1}`}
                                    </Badge>
                                    <span className="text-2xl font-black text-primary/10">#{idx + 1}</span>
                                </div>
                                <CardTitle className="text-lg">{model.name}</CardTitle>
                                <CardDescription className="line-clamp-1">{model.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-3xl font-bold">{(model.scores.overall * 100).toFixed(0)}<span className="text-sm font-medium text-muted-foreground ml-1">pts</span></span>
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +2.4%
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    <ScoreBar label="Capability" value={model.scores.capability} />
                                    <ScoreBar label="Efficiency" value={model.scores.efficiency} />
                                    <ScoreBar label="Reliability" value={model.scores.reliability} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Best of the Rest */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-blue-500" />
                        <h2 className="text-xl font-semibold">Alternative Leaders</h2>
                    </div>
                    <Badge variant="outline" className="text-xs">OR-BOR-STD Compliant</Badge>
                </div>
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 text-left font-medium text-muted-foreground">
                                    <th className="p-4">Model Name</th>
                                    <th className="p-4">Dimension A (Cap)</th>
                                    <th className="p-4">Dimension B (Eff)</th>
                                    <th className="p-4">Dimension C (Rel)</th>
                                    <th className="p-4 text-right">Aggregate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {rest.map((model) => (
                                    <tr key={model.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold">{model.name}</div>
                                            <div className="text-xs text-muted-foreground">v{model.version}</div>
                                        </td>
                                        <td className="p-4">{(model.scores.capability * 100).toFixed(1)}%</td>
                                        <td className="p-4">{(model.scores.efficiency * 100).toFixed(1)}%</td>
                                        <td className="p-4">{(model.scores.reliability * 100).toFixed(1)}%</td>
                                        <td className="p-4 text-right font-bold text-primary">{(model.scores.overall * 100).toFixed(2)}</td>
                                    </tr>
                                ))}
                                {rest.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground italic">No competing models identified in the current snapshot.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>
        </div>
    );
}

function ScoreBar({ label, value }: { label: string, value: number }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-tighter text-muted-foreground">
                <span>{label}</span>
                <span>{(value * 100).toFixed(0)}%</span>
            </div>
            <Progress value={value * 100} className="h-1.5" />
        </div>
    );
}
