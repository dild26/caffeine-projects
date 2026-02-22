export type BlockType = 
  // Inputs
  | 'text-input' | 'number-input' | 'address-input' | 'private-key-input'
  | 'hex-input' | 'binary-input'
  // Logic
  | 'if-else' | 'loop' | 'math-operation' | 'comparison'
  // Conversion
  | 'to-hex' | 'to-hash' | 'to-binary' | 'to-decimal' | 'to-ascii' | 'to-base64'
  // Cryptographic
  | 'hash' | 'hex-converter' | 'keypair' | 'sign' | 'verify' | 'encryption' | 'decryption'
  | 'elliptic-curve' | 'zkp-visualizer'
  // Ethereum Ecosystem
  | 'contract-deployer' | 'abi-encoder' | 'abi-decoder' | 'event-listener'
  | 'nonce-visualizer' | 'gas-estimator' | 'solidity-editor' | 'tx-debugger'
  // Blockchain
  | 'wallet-connect' | 'balance-checker' | 'transaction-sender' | 'contract-caller' | 'block-explorer'
  | 'transaction' | 'ledger' | 'object' | 'block-chain-visualizer'
  // Display
  | 'text-display' | 'number-display' | 'hash-display' | 'balance-display' | 'object-display';

export type ExecutionState = 'idle' | 'running' | 'paused' | 'error';

export interface Block {
  id: string;
  type: BlockType;
  position: { x: number; y: number };
  config: Record<string, any>;
  outputs?: Record<string, any>;
  error?: string;
}

export interface Connection {
  fromBlockId: string;
  fromPort: string;
  toBlockId: string;
  toPort: string;
}

export interface BlockDefinition {
  type: BlockType;
  label: string;
  category: 'inputs' | 'logic' | 'conversion' | 'cryptographic' | 'ethereum' | 'blockchain' | 'display';
  icon: string;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  configFields?: ConfigField[];
  execute?: (config: Record<string, any>, inputs: Record<string, any>) => Promise<Record<string, any>>;
}

export interface PortDefinition {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'address' | 'hash' | 'hex' | 'binary' | 'keypair' | 'signature' | 'object' | 'any';
}

export interface ConfigField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
  options?: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: any;
}

export interface HistoryState {
  blocks: Block[];
  connections: Connection[];
  timestamp?: number;
}

export interface CustomBlockDefinition {
  id: string;
  name: string;
  description: string;
  category: 'inputs' | 'logic' | 'conversion' | 'cryptographic' | 'ethereum' | 'blockchain' | 'display';
  inputPorts: PortDefinition[];
  outputPorts: PortDefinition[];
  logic: string;
}
