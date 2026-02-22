import { useState } from 'react';
import { useRoutingSuggestion } from '../hooks/useQueries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Route, BrainCircuit, CheckCircle2, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Model } from '../backend';

export default function RoutingTab() {
    const [cost, setCost] = useState(0.5);
    const [latency, setLatency] = useState(200);
    const [reliability, setReliability] = useState(0.9);

    const routingMutation = useRoutingSuggestion();
    const [recommendation, setRecommendation] = useState<Model | null>(null);

    const handleSuggest = async () => {
        const result = await routingMutation.mutateAsync({
            costLimit: cost,
            maxLatency: latency,
            minReliability: reliability
        });
        setRecommendation(result);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-2 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5 text-primary" />
                        Routing Constraints
                    </CardTitle>
                    <CardDescription>Adjust criteria to find the optimal model for your workflow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Cost Sensitivity</Label>
                            <span className="text-xs font-medium">${cost.toFixed(2)}/1k tkn</span>
                        </div>
                        <Slider value={[cost * 100]} onValueChange={(val) => setCost(val[0] / 100)} max={100} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Max Acceptable Latency</Label>
                            <span className="text-xs font-medium">{latency}ms</span>
                        </div>
                        <Slider value={[latency]} onValueChange={(val) => setLatency(val[0])} max={1000} step={10} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Min Required Reliability</Label>
                            <span className="text-xs font-medium">{(reliability * 100).toFixed(0)}%</span>
                        </div>
                        <Slider value={[reliability * 100]} onValueChange={(val) => setReliability(val[0] / 100)} max={100} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSuggest} className="w-full gap-2" disabled={routingMutation.isPending}>
                        {routingMutation.isPending ? 'Calculating...' : 'Find Optimal Model'}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>

            <div className="flex flex-col">
                {recommendation ? (
                    <Card className="border-primary/40 bg-primary/5 flex-1 shadow-inner">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-primary mb-2">
                                <BrainCircuit className="h-6 w-6" />
                                <span className="text-sm font-bold uppercase tracking-widest">Recommendation</span>
                            </div>
                            <CardTitle className="text-2xl">{recommendation.name}</CardTitle>
                            <CardDescription>Selected based on your optimization criteria.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-background rounded-lg p-4 border space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Confidence Score</span>
                                    <span className="font-bold text-green-600">98.2%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Cost Efficiency</span>
                                    <span className="font-bold">{(recommendation.scores.efficiency * 10).toFixed(1)}/10</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Est. Latency</span>
                                    <span className="font-bold">{recommendation.benchmark.p50Latency}ms</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Badge className="bg-blue-600">Scalable</Badge>
                                <Badge className="bg-green-600">Stable</Badge>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Deploy to Production</Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <div className="flex-1 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <Route className="h-12 w-12 mb-4 opacity-20" />
                        <p>Run a simulation to see the routing engine's recommendation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
