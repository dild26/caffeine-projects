/**
 * AI-Powered Connectivity Rules Engine
 * 
 * Intelligent validation and suggestion system for block connections
 * with extensible rule definitions and machine learning integration.
 */

import { Block, Connection, PortDefinition } from '../types';
import { getBlockDefinition } from '../blockDefinitions';
import { checkDataTypeCompatibility } from './magneticPhysics';

export interface ValidationResult {
  valid: boolean;
  score: number; // 0-1, higher is better
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ConnectionSuggestion {
  fromBlockId: string;
  fromPort: string;
  toBlockId: string;
  toPort: string;
  confidence: number;
  reason: string;
}

export interface AIRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  validate: (
    fromBlock: Block,
    fromPort: PortDefinition,
    toBlock: Block,
    toPort: PortDefinition,
    existingConnections: Connection[]
  ) => ValidationResult;
}

/**
 * Core AI validation rules
 */
export const coreValidationRules: AIRule[] = [
  {
    id: 'data-type-compatibility',
    name: 'Data Type Compatibility',
    description: 'Validates that data types are compatible between ports',
    priority: 100,
    validate: (fromBlock, fromPort, toBlock, toPort) => {
      const compatible = checkDataTypeCompatibility(fromPort.type, toPort.type);
      
      if (!compatible) {
        return {
          valid: false,
          score: 0,
          errors: [`Incompatible data types: ${fromPort.type} → ${toPort.type}`],
          warnings: [],
          suggestions: [
            `Consider adding a conversion block between ${fromPort.type} and ${toPort.type}`
          ]
        };
      }
      
      return {
        valid: true,
        score: 1.0,
        errors: [],
        warnings: [],
        suggestions: []
      };
    }
  },
  
  {
    id: 'circular-dependency',
    name: 'Circular Dependency Detection',
    description: 'Prevents circular dependencies in the workflow',
    priority: 95,
    validate: (fromBlock, fromPort, toBlock, toPort, existingConnections) => {
      // Build dependency graph
      const dependencies = new Map<string, Set<string>>();
      
      for (const conn of existingConnections) {
        if (!dependencies.has(conn.toBlockId)) {
          dependencies.set(conn.toBlockId, new Set());
        }
        dependencies.get(conn.toBlockId)!.add(conn.fromBlockId);
      }
      
      // Check if adding this connection would create a cycle
      const wouldCreateCycle = (start: string, target: string, visited = new Set<string>()): boolean => {
        if (start === target) return true;
        if (visited.has(start)) return false;
        
        visited.add(start);
        const deps = dependencies.get(start);
        if (!deps) return false;
        
        for (const dep of deps) {
          if (wouldCreateCycle(dep, target, visited)) return true;
        }
        
        return false;
      };
      
      if (wouldCreateCycle(toBlock.id, fromBlock.id)) {
        return {
          valid: false,
          score: 0,
          errors: ['This connection would create a circular dependency'],
          warnings: [],
          suggestions: ['Reorganize your workflow to avoid circular data flow']
        };
      }
      
      return {
        valid: true,
        score: 1.0,
        errors: [],
        warnings: [],
        suggestions: []
      };
    }
  },
  
  {
    id: 'input-output-direction',
    name: 'Input/Output Direction',
    description: 'Ensures connections flow from outputs to inputs',
    priority: 90,
    validate: (fromBlock, fromPort, toBlock, toPort) => {
      // This should be enforced by the UI, but double-check
      const fromDef = getBlockDefinition(fromBlock.type);
      const toDef = getBlockDefinition(toBlock.type);
      
      if (!fromDef || !toDef) {
        return {
          valid: false,
          score: 0,
          errors: ['Invalid block type'],
          warnings: [],
          suggestions: []
        };
      }
      
      const isFromOutput = fromDef.outputs.some(p => p.id === fromPort.id);
      const isToInput = toDef.inputs.some(p => p.id === toPort.id);
      
      if (!isFromOutput || !isToInput) {
        return {
          valid: false,
          score: 0,
          errors: ['Connections must flow from output ports to input ports'],
          warnings: [],
          suggestions: []
        };
      }
      
      return {
        valid: true,
        score: 1.0,
        errors: [],
        warnings: [],
        suggestions: []
      };
    }
  },
  
  {
    id: 'cryptographic-security',
    name: 'Cryptographic Security',
    description: 'Validates secure handling of cryptographic data',
    priority: 85,
    validate: (fromBlock, fromPort, toBlock, toPort) => {
      const warnings: string[] = [];
      const suggestions: string[] = [];
      let score = 1.0;
      
      // Check for private key exposure
      if (fromPort.type === 'string' && fromPort.label.toLowerCase().includes('private')) {
        if (toBlock.type === 'text-display' || toBlock.type === 'object-display') {
          warnings.push('⚠️ Private key being sent to display block - security risk!');
          suggestions.push('Avoid displaying private keys in production environments');
          score = 0.3;
        }
      }
      
      // Check for proper encryption flow
      if (fromBlock.type === 'encryption' && toBlock.type !== 'decryption' && 
          toBlock.type !== 'text-display' && toBlock.type !== 'object-display') {
        warnings.push('Encrypted data should typically be decrypted or displayed');
        score = 0.7;
      }
      
      // Check for signature verification
      if (fromBlock.type === 'sign' && toBlock.type !== 'verify' && 
          toBlock.type !== 'text-display') {
        suggestions.push('Consider adding a signature verification block');
        score = 0.8;
      }
      
      return {
        valid: true,
        score,
        errors: [],
        warnings,
        suggestions
      };
    }
  },
  
  {
    id: 'ethereum-workflow',
    name: 'Ethereum Workflow Validation',
    description: 'Validates proper Ethereum transaction workflows',
    priority: 80,
    validate: (fromBlock, fromPort, toBlock, toPort) => {
      const warnings: string[] = [];
      const suggestions: string[] = [];
      let score = 1.0;
      
      // Check transaction flow
      if (fromBlock.type === 'transaction' && toBlock.type !== 'ledger' && 
          toBlock.type !== 'object-display') {
        warnings.push('Transactions should typically be sent to a ledger block');
        suggestions.push('Add a Ledger block to execute the transaction');
        score = 0.6;
      }
      
      // Check nonce handling
      if (toBlock.type === 'transaction' && fromPort.label.toLowerCase().includes('nonce')) {
        suggestions.push('Ensure nonce values are sequential to prevent replay attacks');
      }
      
      // Check gas estimation
      if (toBlock.type === 'transaction' && !fromPort.label.toLowerCase().includes('gas')) {
        suggestions.push('Consider using a Gas Estimator block for optimal transaction costs');
        score = 0.9;
      }
      
      return {
        valid: true,
        score,
        errors: [],
        warnings,
        suggestions
      };
    }
  },
  
  {
    id: 'conversion-chain',
    name: 'Conversion Chain Optimization',
    description: 'Suggests optimal conversion paths',
    priority: 75,
    validate: (fromBlock, fromPort, toBlock, toPort) => {
      const suggestions: string[] = [];
      let score = 1.0;
      
      // Check for inefficient conversion chains
      if (fromBlock.type === 'to-hex' && toBlock.type === 'to-binary') {
        suggestions.push('Direct string → binary conversion may be more efficient');
        score = 0.8;
      }
      
      if (fromBlock.type === 'to-binary' && toBlock.type === 'to-hex') {
        suggestions.push('Consider using a hex converter block for bidirectional conversion');
        score = 0.8;
      }
      
      // Check for redundant conversions
      if (fromBlock.type === 'to-hex' && toBlock.type === 'to-hex') {
        suggestions.push('Redundant hex conversion detected');
        score = 0.5;
      }
      
      return {
        valid: true,
        score,
        errors: [],
        warnings: [],
        suggestions
      };
    }
  }
];

/**
 * Validate a potential connection using all rules
 */
export function validateConnection(
  fromBlock: Block,
  fromPortId: string,
  toBlock: Block,
  toPortId: string,
  existingConnections: Connection[],
  customRules: AIRule[] = []
): ValidationResult {
  const fromDef = getBlockDefinition(fromBlock.type);
  const toDef = getBlockDefinition(toBlock.type);
  
  if (!fromDef || !toDef) {
    return {
      valid: false,
      score: 0,
      errors: ['Invalid block type'],
      warnings: [],
      suggestions: []
    };
  }
  
  const fromPort = fromDef.outputs.find(p => p.id === fromPortId);
  const toPort = toDef.inputs.find(p => p.id === toPortId);
  
  if (!fromPort || !toPort) {
    return {
      valid: false,
      score: 0,
      errors: ['Invalid port'],
      warnings: [],
      suggestions: []
    };
  }
  
  // Combine core and custom rules, sort by priority
  const allRules = [...coreValidationRules, ...customRules].sort((a, b) => b.priority - a.priority);
  
  const results: ValidationResult[] = [];
  
  for (const rule of allRules) {
    const result = rule.validate(fromBlock, fromPort, toBlock, toPort, existingConnections);
    results.push(result);
    
    // Stop on first critical error
    if (!result.valid && result.score === 0) {
      return result;
    }
  }
  
  // Aggregate results
  const aggregated: ValidationResult = {
    valid: results.every(r => r.valid),
    score: results.reduce((sum, r) => sum + r.score, 0) / results.length,
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings),
    suggestions: results.flatMap(r => r.suggestions)
  };
  
  return aggregated;
}

/**
 * Generate connection suggestions based on workflow analysis
 */
export function generateConnectionSuggestions(
  blocks: Block[],
  connections: Connection[]
): ConnectionSuggestion[] {
  const suggestions: ConnectionSuggestion[] = [];
  
  // Find blocks with unconnected outputs
  for (const block of blocks) {
    const def = getBlockDefinition(block.type);
    if (!def) continue;
    
    for (const output of def.outputs) {
      const isConnected = connections.some(
        c => c.fromBlockId === block.id && c.fromPort === output.id
      );
      
      if (!isConnected) {
        // Find compatible input ports
        for (const targetBlock of blocks) {
          if (targetBlock.id === block.id) continue;
          
          const targetDef = getBlockDefinition(targetBlock.type);
          if (!targetDef) continue;
          
          for (const input of targetDef.inputs) {
            const isTargetConnected = connections.some(
              c => c.toBlockId === targetBlock.id && c.toPort === input.id
            );
            
            if (!isTargetConnected && checkDataTypeCompatibility(output.type, input.type)) {
              const validation = validateConnection(
                block,
                output.id,
                targetBlock,
                input.id,
                connections
              );
              
              if (validation.valid && validation.score > 0.7) {
                suggestions.push({
                  fromBlockId: block.id,
                  fromPort: output.id,
                  toBlockId: targetBlock.id,
                  toPort: input.id,
                  confidence: validation.score,
                  reason: `Compatible ${output.type} → ${input.type} connection`
                });
              }
            }
          }
        }
      }
    }
  }
  
  // Sort by confidence
  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}

/**
 * Analyze workflow for optimization opportunities
 */
export function analyzeWorkflow(blocks: Block[], connections: Connection[]): {
  efficiency: number;
  bottlenecks: string[];
  optimizations: string[];
} {
  const bottlenecks: string[] = [];
  const optimizations: string[] = [];
  
  // Check for disconnected blocks
  const connectedBlocks = new Set<string>();
  connections.forEach(c => {
    connectedBlocks.add(c.fromBlockId);
    connectedBlocks.add(c.toBlockId);
  });
  
  const disconnectedCount = blocks.length - connectedBlocks.size;
  if (disconnectedCount > 0) {
    bottlenecks.push(`${disconnectedCount} disconnected block(s) detected`);
    optimizations.push('Connect or remove unused blocks to improve workflow clarity');
  }
  
  // Check for long conversion chains
  const conversionBlocks = blocks.filter(b => 
    b.type.startsWith('to-') || b.type === 'hex-converter'
  );
  
  if (conversionBlocks.length > 3) {
    bottlenecks.push('Multiple conversion blocks may impact performance');
    optimizations.push('Consider consolidating conversion operations');
  }
  
  // Check for missing error handling
  const hasErrorHandling = blocks.some(b => b.type === 'if-else' || b.type === 'comparison');
  if (!hasErrorHandling && blocks.length > 5) {
    optimizations.push('Add error handling blocks for robust workflows');
  }
  
  // Calculate efficiency score
  const connectionRatio = connections.length / Math.max(blocks.length - 1, 1);
  const utilizationScore = connectedBlocks.size / Math.max(blocks.length, 1);
  const efficiency = (connectionRatio * 0.4 + utilizationScore * 0.6) * 100;
  
  return {
    efficiency: Math.min(efficiency, 100),
    bottlenecks,
    optimizations
  };
}

/**
 * Get contextual tooltip for a connection attempt
 */
export function getConnectionTooltip(
  fromBlock: Block,
  fromPortId: string,
  toBlock: Block,
  toPortId: string,
  existingConnections: Connection[]
): string {
  const validation = validateConnection(fromBlock, fromPortId, toBlock, toPortId, existingConnections);
  
  if (!validation.valid) {
    return `❌ ${validation.errors[0]}`;
  }
  
  if (validation.warnings.length > 0) {
    return `⚠️ ${validation.warnings[0]}`;
  }
  
  if (validation.score >= 0.9) {
    return `✅ Excellent connection (${(validation.score * 100).toFixed(0)}% compatibility)`;
  } else if (validation.score >= 0.7) {
    return `✓ Good connection (${(validation.score * 100).toFixed(0)}% compatibility)`;
  } else {
    return `⚡ Valid but suboptimal (${(validation.score * 100).toFixed(0)}% compatibility)`;
  }
}
