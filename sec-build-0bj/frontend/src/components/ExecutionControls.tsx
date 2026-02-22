import { Play, Pause, Square, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExecutionState, Block, Connection } from '../types';
import { getBlockDefinition } from '../blockDefinitions';
import { toast } from 'sonner';
import { useGetCallerSubscription, useTrackExecution, useIsCallerAdmin } from '../hooks/useQueries';
import { useState } from 'react';

interface ExecutionControlsProps {
  executionState: ExecutionState;
  onExecutionStateChange: (state: ExecutionState) => void;
  blocks: Block[];
  connections: Connection[];
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
}

export default function ExecutionControls({
  executionState,
  onExecutionStateChange,
  blocks,
  connections,
  onUpdateBlock
}: ExecutionControlsProps) {
  const { data: subscription } = useGetCallerSubscription();
  const { data: isAdmin } = useIsCallerAdmin();
  const trackExecution = useTrackExecution();
  const [isExecuting, setIsExecuting] = useState(false);
  
  const executeWorkflow = async () => {
    if (blocks.length === 0) {
      toast.error('No blocks to execute');
      return;
    }

    // Check execution quota (admins bypass this check)
    if (!isAdmin) {
      if (!subscription) {
        toast.error('No active subscription. Please subscribe to execute workflows.');
        return;
      }

      if (!subscription.active) {
        toast.error('Subscription inactive. Please renew your subscription.');
        return;
      }

      if (subscription.executionsUsed >= subscription.executionQuota) {
        toast.error('Execution quota exceeded. Please purchase more executions or upgrade your plan.');
        return;
      }
    }

    setIsExecuting(true);
    onExecutionStateChange('running');
    toast.info('Executing workflow...');

    try {
      // Track execution (will update quota or track for admin analytics)
      const workspaceId = `workspace-${Date.now()}`;
      await trackExecution.mutateAsync(workspaceId);

      // Build dependency graph
      const blockMap = new Map(blocks.map(b => [b.id, b]));
      const executed = new Set<string>();
      
      // Topological sort to execute blocks in order
      const executeBlock = async (blockId: string): Promise<void> => {
        if (executed.has(blockId)) return;
        
        const block = blockMap.get(blockId);
        if (!block) return;

        // Find all input connections for this block
        const inputConnections = connections.filter(c => c.toBlockId === blockId);
        
        // Execute dependencies first
        for (const conn of inputConnections) {
          await executeBlock(conn.fromBlockId);
        }

        // Gather inputs from connected blocks
        const inputs: Record<string, any> = {};
        for (const conn of inputConnections) {
          const sourceBlock = blockMap.get(conn.fromBlockId);
          if (sourceBlock?.outputs && sourceBlock.outputs[conn.fromPort] !== undefined) {
            inputs[conn.toPort] = sourceBlock.outputs[conn.fromPort];
          }
        }

        // Execute this block
        const definition = getBlockDefinition(block.type);
        if (definition?.execute) {
          try {
            const outputs = await definition.execute(block.config, inputs);
            onUpdateBlock(block.id, { outputs });
          } catch (error) {
            console.error(`Error executing block ${block.id}:`, error);
            toast.error(`Error in ${definition.label}: ${error}`);
          }
        }

        executed.add(blockId);
      };

      // Execute all blocks
      for (const block of blocks) {
        await executeBlock(block.id);
      }

      toast.success('Workflow executed successfully');
      onExecutionStateChange('idle');
    } catch (error: any) {
      console.error('Execution error:', error);
      if (error.message?.includes('quota exceeded')) {
        toast.error('Execution quota exceeded. Please purchase more executions.');
      } else if (error.message?.includes('Subscription inactive')) {
        toast.error('Subscription inactive. Please renew your subscription.');
      } else {
        toast.error('Execution failed');
      }
      onExecutionStateChange('error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handlePlay = () => {
    if (executionState === 'idle' || executionState === 'error') {
      executeWorkflow();
    } else if (executionState === 'paused') {
      onExecutionStateChange('running');
    }
  };

  const handlePause = () => {
    if (executionState === 'running') {
      onExecutionStateChange('paused');
    }
  };

  const handleStop = () => {
    onExecutionStateChange('idle');
    setIsExecuting(false);
  };

  const remainingExecutions = subscription 
    ? Number(subscription.executionQuota) - Number(subscription.executionsUsed)
    : 0;

  const quotaPercentage = subscription
    ? (Number(subscription.executionsUsed) / Number(subscription.executionQuota)) * 100
    : 0;

  return (
    <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={executionState === 'running' ? 'default' : 'outline'}
              size="sm"
              onClick={handlePlay}
              disabled={executionState === 'running' || isExecuting}
            >
              <Play className="w-4 h-4 mr-2" />
              {executionState === 'paused' ? 'Resume' : 'Execute'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Execute workflow and consume 1 execution credit
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handlePause}
        disabled={executionState !== 'running'}
      >
        <Pause className="w-4 h-4 mr-2" />
        Pause
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleStop}
        disabled={executionState === 'idle'}
      >
        <Square className="w-4 h-4 mr-2" />
        Stop
      </Button>

      <div className="ml-4 text-sm text-muted-foreground">
        {executionState === 'idle' && 'Ready'}
        {executionState === 'running' && 'Executing...'}
        {executionState === 'paused' && 'Paused'}
        {executionState === 'error' && 'Error'}
      </div>

      {subscription && !isAdmin && (
        <div className="ml-auto flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <Badge 
                    variant={quotaPercentage > 90 ? "destructive" : quotaPercentage > 70 ? "secondary" : "default"}
                  >
                    {remainingExecutions} executions left
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p>Used: {Number(subscription.executionsUsed)}</p>
                  <p>Quota: {Number(subscription.executionQuota)}</p>
                  <p>Remaining: {remainingExecutions}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {isAdmin && (
        <div className="ml-auto">
          <Badge variant="outline" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            Admin - Unlimited Executions
          </Badge>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {blocks.length} blocks • {connections.length} connections
      </div>
    </div>
  );
}

