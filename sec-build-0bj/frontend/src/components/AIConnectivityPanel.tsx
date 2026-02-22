import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Lightbulb, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Block, Connection } from '../types';
import { useGlobalKeyboard } from '../hooks/useGlobalKeyboard';
import WindowControls, { WindowState } from './WindowControls';
import { 
  generateConnectionSuggestions, 
  analyzeWorkflow, 
  ConnectionSuggestion 
} from '../lib/aiConnectivityRules';

interface AIConnectivityPanelProps {
  blocks: Block[];
  connections: Connection[];
  onApplySuggestion: (suggestion: ConnectionSuggestion) => void;
  onClose?: () => void;
}

export default function AIConnectivityPanel({
  blocks,
  connections,
  onApplySuggestion,
  onClose
}: AIConnectivityPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    suggestions: true,
    analysis: true,
    compatibility: false
  });
  const [windowState, setWindowState] = useState<WindowState>('normal');
  
  const [suggestions, setSuggestions] = useState<ConnectionSuggestion[]>([]);
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeWorkflow> | null>(null);

  // Global keyboard handlers
  useGlobalKeyboard('ai-connectivity-panel', {
    onEscape: () => {
      if (windowState === 'zoomed') {
        setWindowState('normal');
      } else if (windowState === 'minimized') {
        setWindowState('normal');
      } else if (onClose) {
        onClose();
      }
    },
    enabled: true,
    priority: 7
  });

  useEffect(() => {
    const newSuggestions = generateConnectionSuggestions(blocks, connections);
    setSuggestions(newSuggestions);
    
    const newAnalysis = analyzeWorkflow(blocks, connections);
    setAnalysis(newAnalysis);
  }, [blocks, connections]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-success';
    if (efficiency >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return <Badge variant="default" className="bg-success">High</Badge>;
    if (confidence >= 0.7) return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  const handleMinimize = () => {
    setWindowState(windowState === 'minimized' ? 'normal' : 'minimized');
  };

  const handleZoom = () => {
    setWindowState(windowState === 'zoomed' ? 'normal' : 'zoomed');
  };

  return (
    <div 
      className="space-y-4 gpu-accelerated"
      role="complementary"
      aria-label="AI connectivity analysis panel"
    >
      {onClose && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">AI Connectivity</h3>
          <WindowControls
            onClose={onClose}
            onMinimize={handleMinimize}
            onZoom={handleZoom}
            windowState={windowState}
          />
        </div>
      )}

      {windowState !== 'minimized' && (
        <>
          {/* Connection Suggestions */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('suggestions')}
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
              aria-expanded={expandedSections.suggestions}
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">AI Suggestions</h3>
                {suggestions.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{suggestions.length}</Badge>
                )}
              </div>
              {expandedSections.suggestions ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {expandedSections.suggestions && (
              <div className="space-y-2 pl-2">
                {suggestions.length === 0 ? (
                  <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
                    No connection suggestions available. Add more blocks to get AI recommendations.
                  </div>
                ) : (
                  <ScrollArea className="h-48">
                    <div className="space-y-2 pr-3">
                      {suggestions.map((suggestion, idx) => (
                        <div key={idx} className="p-2 bg-muted/30 rounded text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-primary">Connection #{idx + 1}</span>
                            {getConfidenceBadge(suggestion.confidence)}
                          </div>
                          <div className="text-muted-foreground">{suggestion.reason}</div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full h-7 text-xs"
                            onClick={() => onApplySuggestion(suggestion)}
                          >
                            Apply Suggestion
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Workflow Analysis */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('analysis')}
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
              aria-expanded={expandedSections.analysis}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Workflow Analysis</h3>
              </div>
              {expandedSections.analysis ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {expandedSections.analysis && analysis && (
              <div className="space-y-3 pl-2">
                <div className="p-3 bg-muted/30 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Efficiency Score</span>
                    <span className={`text-sm font-bold ${getEfficiencyColor(analysis.efficiency)}`}>
                      {analysis.efficiency.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        analysis.efficiency >= 80 ? 'bg-success' :
                        analysis.efficiency >= 60 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${analysis.efficiency}%` }}
                    />
                  </div>
                </div>

                {analysis.bottlenecks.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Bottlenecks
                    </div>
                    {analysis.bottlenecks.map((bottleneck, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground pl-5">
                        • {bottleneck}
                      </div>
                    ))}
                  </div>
                )}

                {analysis.optimizations.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Optimizations
                    </div>
                    {analysis.optimizations.map((optimization, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground pl-5">
                        • {optimization}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Compatibility Matrix */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('compatibility')}
              className="w-full flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors"
              aria-expanded={expandedSections.compatibility}
            >
              <div className="flex items-center gap-2">
                <img 
                  src="/assets/generated/compatibility-matrix-icon-transparent.dim_32x32.png" 
                  alt="" 
                  className="w-4 h-4"
                />
                <h3 className="text-sm font-semibold">Compatibility Matrix</h3>
              </div>
              {expandedSections.compatibility ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {expandedSections.compatibility && (
              <div className="space-y-2 pl-2">
                <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded space-y-2">
                  <div className="font-medium">Data Type Compatibility</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-success rounded-full" />
                      <span>string ↔ hex, hash, address, binary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-success rounded-full" />
                      <span>object ↔ keypair, signature</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-success rounded-full" />
                      <span>any ↔ all types</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-warning rounded-full" />
                      <span>number ↔ number only</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-destructive rounded-full" />
                      <span>boolean ↔ boolean only</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
