/**
 * CLI Command Parser and Executor
 * 
 * Parses CLI command chains and executes them by creating blocks and connections
 * in the workspace with magnetic physics integration.
 */

import { Block, Connection, BlockType } from '../types';
import { blockDefinitions, getBlockDefinition } from '../blockDefinitions';
import { validateConnection } from './aiConnectivityRules';
import * as THREE from 'three';

export interface ParsedCommand {
  blocks: BlockType[];
  valid: boolean;
  errors: string[];
}

export interface ExecutionResult {
  blocks: Block[];
  connections: Connection[];
  success: boolean;
  errors: string[];
}

/**
 * Parse a CLI command chain into block types
 */
export function parseCommandChain(command: string): ParsedCommand {
  const parts = command
    .split('>')
    .map(p => p.trim())
    .filter(p => p);

  const errors: string[] = [];
  const blocks: BlockType[] = [];

  for (const part of parts) {
    const def = blockDefinitions.find(d => d.type === part);
    if (!def) {
      errors.push(`Unknown block type: ${part}`);
    } else {
      blocks.push(part as BlockType);
    }
  }

  return {
    blocks,
    valid: errors.length === 0 && blocks.length > 0,
    errors
  };
}

/**
 * Validate a command chain for connectivity
 */
export function validateCommandChain(blocks: BlockType[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const def = getBlockDefinition(blocks[i]);
    if (!def) {
      errors.push(`Invalid block type: ${blocks[i]}`);
      continue;
    }

    // Check if block can be part of a chain
    if (i > 0 && def.inputs.length === 0) {
      errors.push(`${def.label} cannot receive inputs`);
    }

    if (i < blocks.length - 1 && def.outputs.length === 0) {
      errors.push(`${def.label} has no outputs to connect`);
    }

    // Check data type compatibility with next block
    if (i < blocks.length - 1) {
      const nextDef = getBlockDefinition(blocks[i + 1]);
      if (nextDef && def.outputs.length > 0 && nextDef.inputs.length > 0) {
        const outputType = def.outputs[0].type;
        const inputType = nextDef.inputs[0].type;

        // Simple compatibility check
        const compatible = 
          outputType === inputType ||
          outputType === 'any' ||
          inputType === 'any' ||
          (outputType === 'string' && ['hex', 'hash', 'address', 'binary'].includes(inputType)) ||
          (inputType === 'string' && ['hex', 'hash', 'address', 'binary'].includes(outputType));

        if (!compatible) {
          errors.push(`Incompatible types: ${def.label} (${outputType}) → ${nextDef.label} (${inputType})`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Execute a CLI command chain by creating blocks and connections
 */
export function executeCommandChain(
  command: string,
  existingBlocks: Block[],
  existingConnections: Connection[],
  startPosition: { x: number; y: number } = { x: 100, y: 100 }
): ExecutionResult {
  const parsed = parseCommandChain(command);
  
  if (!parsed.valid) {
    return {
      blocks: [],
      connections: [],
      success: false,
      errors: parsed.errors
    };
  }

  const validation = validateCommandChain(parsed.blocks);
  if (!validation.valid) {
    return {
      blocks: [],
      connections: [],
      success: false,
      errors: validation.errors
    };
  }

  // Create blocks with automatic positioning
  const newBlocks: Block[] = [];
  const spacing = 200; // Horizontal spacing between blocks

  parsed.blocks.forEach((blockType, index) => {
    const block: Block = {
      id: `cli-block-${Date.now()}-${index}`,
      type: blockType,
      position: {
        x: startPosition.x + (index * spacing),
        y: startPosition.y
      },
      config: {},
      outputs: {}
    };
    newBlocks.push(block);
  });

  // Create connections between consecutive blocks
  const newConnections: Connection[] = [];

  for (let i = 0; i < newBlocks.length - 1; i++) {
    const fromBlock = newBlocks[i];
    const toBlock = newBlocks[i + 1];
    
    const fromDef = getBlockDefinition(fromBlock.type);
    const toDef = getBlockDefinition(toBlock.type);

    if (fromDef && toDef && fromDef.outputs.length > 0 && toDef.inputs.length > 0) {
      const connection: Connection = {
        fromBlockId: fromBlock.id,
        fromPort: fromDef.outputs[0].id,
        toBlockId: toBlock.id,
        toPort: toDef.inputs[0].id
      };
      newConnections.push(connection);
    }
  }

  return {
    blocks: newBlocks,
    connections: newConnections,
    success: true,
    errors: []
  };
}

/**
 * Get suggested command chains based on current workspace
 */
export function getSuggestedChains(
  blocks: Block[],
  connections: Connection[]
): string[] {
  const suggestions: string[] = [];

  // Common conversion chains
  suggestions.push('text-input > to-hex > to-hash');
  suggestions.push('text-input > to-binary > to-hex');
  suggestions.push('number-input > to-hex > to-decimal');
  
  // Cryptographic chains
  suggestions.push('text-input > hash > text-display');
  suggestions.push('keypair > sign > verify');
  suggestions.push('text-input > encryption > decryption');
  
  // Ethereum chains
  suggestions.push('address-input > balance-checker > balance-display');
  suggestions.push('transaction > ledger > hash-display');
  suggestions.push('contract-deployer > abi-encoder > contract-caller');

  return suggestions;
}

/**
 * Highlight blocks that are part of a CLI chain
 */
export function highlightChainBlocks(blockIds: string[]): void {
  blockIds.forEach((id, index) => {
    const element = document.querySelector(`[data-block-id="${id}"]`);
    if (element) {
      element.classList.add('cli-chain-highlight');
      element.setAttribute('data-chain-index', index.toString());
      
      // Add pulsating glow effect
      setTimeout(() => {
        element.classList.add('animate-pulse-glow');
      }, index * 200);
    }
  });

  // Remove highlights after animation
  setTimeout(() => {
    blockIds.forEach(id => {
      const element = document.querySelector(`[data-block-id="${id}"]`);
      if (element) {
        element.classList.remove('cli-chain-highlight', 'animate-pulse-glow');
        element.removeAttribute('data-chain-index');
      }
    });
  }, 3000);
}

/**
 * Get CLI command from existing block chain
 */
export function getCommandFromBlocks(
  blockIds: string[],
  blocks: Block[]
): string | null {
  const chainBlocks = blockIds
    .map(id => blocks.find(b => b.id === id))
    .filter((b): b is Block => b !== undefined);

  if (chainBlocks.length === 0) return null;

  return chainBlocks.map(b => b.type).join(' > ');
}
