export interface ModelScore {
    capability: number;
    efficiency: number;
    reliability: number;
    overall: number;
}

export interface Model {
    id: bigint;
    name: string;
    description: string;
    version: string;
    scores: ModelScore;
    benchmark: {
        p50Latency: number;
        p95Latency: number;
        timeoutRate: number;
        malformedResponseRate: number;
    };
}

export interface EvaluationResult {
    modelId: bigint;
    agentId: string;
    capabilityScore: number;
    efficiencyScore: number;
    reliabilityScore: number;
    timestamp: bigint;
}

export interface RoutingCondition {
    costLimit: number;
    maxLatency: number;
    minReliability: number;
}

export interface BackendActor {
    getModels: () => Promise<Model[]>;
    getTopModels: (limit: bigint) => Promise<Model[]>;
    evaluateModel: (modelId: bigint) => Promise<ModelScore>;
    suggestRoute: (condition: RoutingCondition) => Promise<Model>;
    getHistoricalBenchmarks: (modelId: bigint) => Promise<any[]>;
}

const MOCK_MODELS: Model[] = [
    {
        id: 1n,
        name: "OpenR-Capability-Ultra",
        description: "Standard model for high-accuracy assessment tasks.",
        version: "2.5.0",
        scores: { capability: 0.95, efficiency: 0.82, reliability: 0.98, overall: 0.92 },
        benchmark: { p50Latency: 120, p95Latency: 210, timeoutRate: 0.005, malformedResponseRate: 0.001 }
    },
    {
        id: 2n,
        name: "EcoRoute-v3",
        description: "Optimized for efficiency and cost-effective operations.",
        version: "3.1.2",
        scores: { capability: 0.85, efficiency: 0.96, reliability: 0.92, overall: 0.91 },
        benchmark: { p50Latency: 45, p95Latency: 85, timeoutRate: 0.002, malformedResponseRate: 0.003 }
    },
    {
        id: 3n,
        name: "ProGuard-X",
        description: "Resilient architecture focused on reliability and consistency.",
        version: "1.0.4",
        scores: { capability: 0.88, efficiency: 0.75, reliability: 0.99, overall: 0.87 },
        benchmark: { p50Latency: 180, p95Latency: 350, timeoutRate: 0.001, malformedResponseRate: 0.0005 }
    }
];

export const mockBackend: BackendActor = {
    getModels: async () => MOCK_MODELS,
    getTopModels: async (limit) => MOCK_MODELS.sort((a, b) => b.scores.overall - a.scores.overall).slice(0, Number(limit)),
    evaluateModel: async (modelId) => {
        const model = MOCK_MODELS.find(m => m.id === modelId);
        return model ? model.scores : { capability: 0, efficiency: 0, reliability: 0, overall: 0 };
    },
    suggestRoute: async (condition) => {
        // Simple mock routing logic
        return MOCK_MODELS[0];
    },
    getHistoricalBenchmarks: async (modelId) => [
        { timestamp: BigInt(Date.now() - 86400000 * 7), p50: 110, p95: 200 },
        { timestamp: BigInt(Date.now() - 86400000 * 6), p50: 115, p95: 205 },
        { timestamp: BigInt(Date.now() - 86400000 * 5), p50: 120, p95: 210 }
    ]
};
