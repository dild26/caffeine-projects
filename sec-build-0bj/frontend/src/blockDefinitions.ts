import { BlockDefinition } from './types';
import { hashKeccak256, generateKeypair, signMessage, verifySignature, encryptData, decryptData, toHex, fromHex, toBinary, toHash } from './lib/crypto';

export const blockDefinitions: BlockDefinition[] = [
  // ===== INPUT BLOCKS =====
  {
    type: 'text-input',
    label: 'Text Input',
    category: 'inputs',
    icon: '/favicon.ico',
    inputs: [],
    outputs: [{ id: 'value', label: 'Text', type: 'string' }],
    configFields: [
      { id: 'value', label: 'Text Value', type: 'text', placeholder: 'Enter text...' }
    ],
    execute: async (config) => ({ value: config.value || '' })
  },
  {
    type: 'number-input',
    label: 'Number Input',
    category: 'inputs',
    icon: '/favicon.ico',
    inputs: [],
    outputs: [{ id: 'value', label: 'Number', type: 'number' }],
    configFields: [
      { id: 'value', label: 'Number Value', type: 'number', placeholder: '0' }
    ],
    execute: async (config) => ({ value: parseFloat(config.value) || 0 })
  },
  {
    type: 'address-input',
    label: 'Address Input',
    category: 'inputs',
    icon: '/favicon.ico',
    inputs: [],
    outputs: [{ id: 'address', label: 'Address', type: 'address' }],
    configFields: [
      { id: 'address', label: 'Ethereum Address', type: 'text', placeholder: '0x...' }
    ],
    execute: async (config) => ({ address: config.address || '' })
  },
  {
    type: 'private-key-input',
    label: 'Private Key',
    category: 'inputs',
    icon: '/favicon.ico',
    inputs: [],
    outputs: [{ id: 'key', label: 'Private Key', type: 'string' }],
    configFields: [
      { id: 'key', label: 'Private Key (hex)', type: 'text', placeholder: '0x...' }
    ],
    execute: async (config) => ({ key: config.key || '' })
  },
  {
    type: 'hex-input',
    label: 'Hex Input',
    category: 'inputs',
    icon: '/favicon.ico',
    inputs: [],
    outputs: [{ id: 'value', label: 'Hex', type: 'hex' }],
    configFields: [
      { id: 'value', label: 'Hex Value', type: 'text', placeholder: '0x...' }
    ],
    execute: async (config) => ({ value: config.value || '0x' })
  },
  {
    type: 'binary-input',
    label: 'Binary Input',
    category: 'inputs',
    icon: '/favicon.ico',
    inputs: [],
    outputs: [{ id: 'value', label: 'Binary', type: 'binary' }],
    configFields: [
      { id: 'value', label: 'Binary Value', type: 'text', placeholder: '101010...' }
    ],
    execute: async (config) => ({ value: config.value || '0' })
  },
  
  // ===== LOGIC BLOCKS =====
  {
    type: 'if-else',
    label: 'If/Else',
    category: 'logic',
    icon: '/favicon.ico',
    inputs: [
      { id: 'condition', label: 'Condition', type: 'boolean' },
      { id: 'ifTrue', label: 'If True', type: 'any' },
      { id: 'ifFalse', label: 'If False', type: 'any' }
    ],
    outputs: [{ id: 'result', label: 'Result', type: 'any' }],
    execute: async (config, inputs) => ({
      result: inputs.condition ? inputs.ifTrue : inputs.ifFalse
    })
  },
  {
    type: 'comparison',
    label: 'Comparison',
    category: 'logic',
    icon: '/favicon.ico',
    inputs: [
      { id: 'a', label: 'Value A', type: 'any' },
      { id: 'b', label: 'Value B', type: 'any' }
    ],
    outputs: [{ id: 'result', label: 'Result', type: 'boolean' }],
    configFields: [
      {
        id: 'operator',
        label: 'Operator',
        type: 'select',
        options: [
          { value: '==', label: 'Equal (==)' },
          { value: '!=', label: 'Not Equal (!=)' },
          { value: '>', label: 'Greater Than (>)' },
          { value: '<', label: 'Less Than (<)' },
          { value: '>=', label: 'Greater or Equal (>=)' },
          { value: '<=', label: 'Less or Equal (<=)' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      const { a, b } = inputs;
      const op = config.operator || '==';
      let result = false;
      switch (op) {
        case '==': result = a == b; break;
        case '!=': result = a != b; break;
        case '>': result = a > b; break;
        case '<': result = a < b; break;
        case '>=': result = a >= b; break;
        case '<=': result = a <= b; break;
      }
      return { result };
    }
  },
  {
    type: 'math-operation',
    label: 'Math Operation',
    category: 'logic',
    icon: '/favicon.ico',
    inputs: [
      { id: 'a', label: 'Number A', type: 'number' },
      { id: 'b', label: 'Number B', type: 'number' }
    ],
    outputs: [{ id: 'result', label: 'Result', type: 'number' }],
    configFields: [
      {
        id: 'operation',
        label: 'Operation',
        type: 'select',
        options: [
          { value: 'add', label: 'Add (+)' },
          { value: 'subtract', label: 'Subtract (-)' },
          { value: 'multiply', label: 'Multiply (×)' },
          { value: 'divide', label: 'Divide (÷)' },
          { value: 'modulo', label: 'Modulo (%)' },
          { value: 'power', label: 'Power (^)' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      const a = parseFloat(inputs.a) || 0;
      const b = parseFloat(inputs.b) || 0;
      let result = 0;
      switch (config.operation) {
        case 'add': result = a + b; break;
        case 'subtract': result = a - b; break;
        case 'multiply': result = a * b; break;
        case 'divide': result = b !== 0 ? a / b : 0; break;
        case 'modulo': result = b !== 0 ? a % b : 0; break;
        case 'power': result = Math.pow(a, b); break;
      }
      return { result };
    }
  },
  
  // ===== AUTO-CONVERSION TOOLS =====
  {
    type: 'to-hex',
    label: 'To Hex',
    category: 'conversion',
    icon: '/favicon.ico',
    inputs: [{ id: 'input', label: 'Input', type: 'any' }],
    outputs: [{ id: 'hex', label: 'Hex', type: 'hex' }],
    configFields: [
      {
        id: 'inputType',
        label: 'Input Type',
        type: 'select',
        options: [
          { value: 'string', label: 'String' },
          { value: 'number', label: 'Number' },
          { value: 'binary', label: 'Binary' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      try {
        const inputType = config.inputType || 'string';
        const hex = toHex(inputs.input, inputType as any);
        return { hex };
      } catch (error) {
        throw new Error('Hex conversion failed: ' + error);
      }
    }
  },
  {
    type: 'to-hash',
    label: 'To Hash',
    category: 'conversion',
    icon: '/favicon.ico',
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'hash', label: 'Hash', type: 'hash' }],
    configFields: [
      {
        id: 'algorithm',
        label: 'Algorithm',
        type: 'select',
        options: [
          { value: 'keccak256', label: 'Keccak256 (Ethereum)' },
          { value: 'sha256', label: 'SHA256' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      try {
        const algorithm = config.algorithm || 'keccak256';
        const hash = await toHash(inputs.input || '', algorithm as any);
        return { hash };
      } catch (error) {
        throw new Error('Hash generation failed: ' + error);
      }
    }
  },
  {
    type: 'to-binary',
    label: 'To Binary',
    category: 'conversion',
    icon: '/favicon.ico',
    inputs: [{ id: 'input', label: 'Input', type: 'any' }],
    outputs: [{ id: 'binary', label: 'Binary', type: 'binary' }],
    execute: async (config, inputs) => {
      try {
        const binary = toBinary(inputs.input);
        return { binary };
      } catch (error) {
        throw new Error('Binary conversion failed: ' + error);
      }
    }
  },
  {
    type: 'to-decimal',
    label: 'To Decimal',
    category: 'conversion',
    icon: '/favicon.ico',
    inputs: [{ id: 'input', label: 'Input', type: 'any' }],
    outputs: [{ id: 'decimal', label: 'Decimal', type: 'number' }],
    configFields: [
      {
        id: 'inputType',
        label: 'Input Type',
        type: 'select',
        options: [
          { value: 'hex', label: 'Hexadecimal' },
          { value: 'binary', label: 'Binary' },
          { value: 'string', label: 'String' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      try {
        const inputType = config.inputType || 'hex';
        let decimal = 0;
        
        if (inputType === 'hex') {
          decimal = parseInt(inputs.input, 16);
        } else if (inputType === 'binary') {
          decimal = parseInt(inputs.input, 2);
        } else {
          decimal = parseFloat(inputs.input) || 0;
        }
        
        return { decimal };
      } catch (error) {
        throw new Error('Decimal conversion failed: ' + error);
      }
    }
  },
  {
    type: 'to-ascii',
    label: 'To ASCII',
    category: 'conversion',
    icon: '/favicon.ico',
    inputs: [{ id: 'input', label: 'Input', type: 'any' }],
    outputs: [{ id: 'ascii', label: 'ASCII', type: 'string' }],
    execute: async (config, inputs) => {
      try {
        const input = inputs.input;
        let ascii = '';
        
        if (typeof input === 'string' && input.startsWith('0x')) {
          const hex = input.slice(2);
          for (let i = 0; i < hex.length; i += 2) {
            const byte = parseInt(hex.substr(i, 2), 16);
            if (byte !== 0) ascii += String.fromCharCode(byte);
          }
        } else {
          ascii = String(input);
        }
        
        return { ascii };
      } catch (error) {
        throw new Error('ASCII conversion failed: ' + error);
      }
    }
  },
  {
    type: 'to-base64',
    label: 'To Base64',
    category: 'conversion',
    icon: '/favicon.ico',
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'base64', label: 'Base64', type: 'string' }],
    execute: async (config, inputs) => {
      try {
        const base64 = btoa(inputs.input || '');
        return { base64 };
      } catch (error) {
        throw new Error('Base64 encoding failed: ' + error);
      }
    }
  },
  
  // ===== CRYPTOGRAPHIC BLOCKS =====
  {
    type: 'hash',
    label: 'Hash (Keccak256)',
    category: 'cryptographic',
    icon: '/favicon.ico',
    inputs: [{ id: 'input', label: 'Input', type: 'string' }],
    outputs: [{ id: 'hash', label: 'Hash', type: 'hash' }],
    execute: async (config, inputs) => {
      try {
        const hash = hashKeccak256(inputs.input || '');
        return { hash };
      } catch (error) {
        throw new Error('Hash computation failed: ' + error);
      }
    }
  },
  {
    type: 'hex-converter',
    label: 'Hex Converter',
    category: 'cryptographic',
    icon: '/favicon.ico',
    inputs: [{ id: 'input', label: 'Input', type: 'any' }],
    outputs: [{ id: 'output', label: 'Output', type: 'any' }],
    configFields: [
      {
        id: 'fromType',
        label: 'From Type',
        type: 'select',
        options: [
          { value: 'string', label: 'String' },
          { value: 'number', label: 'Number' },
          { value: 'binary', label: 'Binary' }
        ]
      },
      {
        id: 'toType',
        label: 'To Type',
        type: 'select',
        options: [
          { value: 'hex', label: 'Hex' },
          { value: 'string', label: 'String' },
          { value: 'number', label: 'Number' },
          { value: 'binary', label: 'Binary' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      try {
        const fromType = config.fromType || 'string';
        const toType = config.toType || 'hex';
        
        if (toType === 'hex') {
          const output = toHex(inputs.input, fromType as any);
          return { output };
        } else {
          const output = fromHex(inputs.input, toType as any);
          return { output };
        }
      } catch (error) {
        throw new Error('Conversion failed: ' + error);
      }
    }
  },
  {
    type: 'keypair',
    label: 'Generate Keypair',
    category: 'cryptographic',
    icon: '/favicon.ico',
    inputs: [],
    outputs: [
      { id: 'privateKey', label: 'Private Key', type: 'string' },
      { id: 'publicKey', label: 'Public Key', type: 'string' },
      { id: 'address', label: 'Address', type: 'address' }
    ],
    configFields: [
      { id: 'generate', label: 'Auto-generate on execute', type: 'checkbox', defaultValue: true }
    ],
    execute: async (config) => {
      try {
        const keypair = generateKeypair();
        return {
          privateKey: keypair.privateKey,
          publicKey: keypair.publicKey,
          address: keypair.address
        };
      } catch (error) {
        throw new Error('Keypair generation failed: ' + error);
      }
    }
  },
  {
    type: 'sign',
    label: 'Sign Message',
    category: 'cryptographic',
    icon: '/favicon.ico',
    inputs: [
      { id: 'message', label: 'Message', type: 'string' },
      { id: 'privateKey', label: 'Private Key', type: 'string' }
    ],
    outputs: [{ id: 'signature', label: 'Signature', type: 'signature' }],
    execute: async (config, inputs) => {
      try {
        if (!inputs.message || !inputs.privateKey) {
          throw new Error('Message and private key required');
        }
        const signature = signMessage(inputs.message, inputs.privateKey);
        return { signature };
      } catch (error) {
        throw new Error('Signing failed: ' + error);
      }
    }
  },
  {
    type: 'verify',
    label: 'Verify Signature',
    category: 'cryptographic',
    icon: '/favicon.ico',
    inputs: [
      { id: 'message', label: 'Message', type: 'string' },
      { id: 'signature', label: 'Signature', type: 'signature' },
      { id: 'publicKey', label: 'Public Key', type: 'string' }
    ],
    outputs: [{ id: 'valid', label: 'Valid', type: 'boolean' }],
    execute: async (config, inputs) => {
      try {
        if (!inputs.message || !inputs.signature || !inputs.publicKey) {
          return { valid: false };
        }
        const valid = verifySignature(inputs.message, inputs.signature, inputs.publicKey);
        return { valid };
      } catch (error) {
        return { valid: false };
      }
    }
  },
  {
    type: 'encryption',
    label: 'Encrypt',
    category: 'cryptographic',
    icon: '/favicon.ico',
    inputs: [
      { id: 'data', label: 'Data', type: 'string' },
      { id: 'publicKey', label: 'Public Key', type: 'string' }
    ],
    outputs: [{ id: 'encrypted', label: 'Encrypted', type: 'string' }],
    execute: async (config, inputs) => {
      try {
        if (!inputs.data || !inputs.publicKey) {
          throw new Error('Data and public key required');
        }
        const encrypted = await encryptData(inputs.data, inputs.publicKey);
        return { encrypted };
      } catch (error) {
        throw new Error('Encryption failed: ' + error);
      }
    }
  },
  {
    type: 'decryption',
    label: 'Decrypt',
    category: 'cryptographic',
    icon: '/favicon.ico',
    inputs: [
      { id: 'encrypted', label: 'Encrypted', type: 'string' },
      { id: 'privateKey', label: 'Private Key', type: 'string' }
    ],
    outputs: [{ id: 'data', label: 'Data', type: 'string' }],
    execute: async (config, inputs) => {
      try {
        if (!inputs.encrypted || !inputs.privateKey) {
          throw new Error('Encrypted data and private key required');
        }
        const data = await decryptData(inputs.encrypted, inputs.privateKey);
        return { data };
      } catch (error) {
        throw new Error('Decryption failed: ' + error);
      }
    }
  },
  {
    type: 'elliptic-curve',
    label: 'Elliptic Curve',
    category: 'cryptographic',
    icon: '/favicon.ico',
    inputs: [
      { id: 'privateKey', label: 'Private Key', type: 'string' }
    ],
    outputs: [
      { id: 'publicKey', label: 'Public Key', type: 'string' },
      { id: 'curvePoint', label: 'Curve Point', type: 'object' }
    ],
    configFields: [
      {
        id: 'curve',
        label: 'Curve Type',
        type: 'select',
        options: [
          { value: 'secp256k1', label: 'secp256k1 (Ethereum)' },
          { value: 'ed25519', label: 'Ed25519' },
          { value: 'p256', label: 'P-256' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      try {
        const curve = config.curve || 'secp256k1';
        const privateKey = inputs.privateKey || '0x' + '1'.repeat(64);
        
        const publicKey = '0x04' + hashKeccak256(privateKey + curve).substring(2, 66) + 
                         hashKeccak256(curve + privateKey).substring(2, 66);
        
        const curvePoint = {
          x: publicKey.substring(4, 68),
          y: publicKey.substring(68),
          curve: curve
        };
        
        return { publicKey, curvePoint };
      } catch (error) {
        throw new Error('Elliptic curve operation failed: ' + error);
      }
    }
  },
  {
    type: 'zkp-visualizer',
    label: 'ZKP Visualizer',
    category: 'cryptographic',
    icon: '/favicon.ico',
    inputs: [
      { id: 'secret', label: 'Secret', type: 'string' },
      { id: 'statement', label: 'Statement', type: 'string' }
    ],
    outputs: [
      { id: 'proof', label: 'Proof', type: 'object' },
      { id: 'verified', label: 'Verified', type: 'boolean' }
    ],
    configFields: [
      {
        id: 'proofType',
        label: 'Proof Type',
        type: 'select',
        options: [
          { value: 'zk-snark', label: 'zk-SNARK' },
          { value: 'zk-stark', label: 'zk-STARK' },
          { value: 'bulletproof', label: 'Bulletproof' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      try {
        const proofType = config.proofType || 'zk-snark';
        const secret = inputs.secret || '';
        const statement = inputs.statement || '';
        
        const commitment = hashKeccak256(secret);
        const challenge = hashKeccak256(statement + commitment);
        const response = hashKeccak256(secret + challenge);
        
        const proof = {
          type: proofType,
          commitment,
          challenge: challenge.substring(0, 18),
          response: response.substring(0, 18),
          timestamp: Date.now()
        };
        
        const verified = secret.length > 0 && statement.length > 0;
        
        return { proof, verified };
      } catch (error) {
        throw new Error('ZKP visualization failed: ' + error);
      }
    }
  },
  
  // ===== ETHEREUM ECOSYSTEM TOOLS =====
  {
    type: 'contract-deployer',
    label: 'Contract Deployer',
    category: 'ethereum',
    icon: '/favicon.ico',
    inputs: [
      { id: 'bytecode', label: 'Bytecode', type: 'string' },
      { id: 'abi', label: 'ABI', type: 'string' }
    ],
    outputs: [
      { id: 'address', label: 'Contract Address', type: 'address' },
      { id: 'txHash', label: 'Tx Hash', type: 'hash' }
    ],
    configFields: [
      {
        id: 'network',
        label: 'Network',
        type: 'select',
        options: [
          { value: 'mainnet', label: 'Ethereum Mainnet' },
          { value: 'sepolia', label: 'Sepolia Testnet' },
          { value: 'goerli', label: 'Goerli Testnet' },
          { value: 'mock', label: 'Mock Deployment' }
        ]
      },
      { id: 'gasLimit', label: 'Gas Limit', type: 'number', placeholder: '3000000' }
    ],
    execute: async (config, inputs) => {
      const network = config.network || 'mock';
      const address = '0x' + hashKeccak256(inputs.bytecode || 'mock').substring(2, 42);
      const txHash = hashKeccak256(JSON.stringify({ bytecode: inputs.bytecode, network, timestamp: Date.now() }));
      
      return { address, txHash };
    }
  },
  {
    type: 'abi-encoder',
    label: 'ABI Encoder',
    category: 'ethereum',
    icon: '/favicon.ico',
    inputs: [
      { id: 'functionName', label: 'Function', type: 'string' },
      { id: 'params', label: 'Parameters', type: 'string' }
    ],
    outputs: [{ id: 'encoded', label: 'Encoded Data', type: 'hex' }],
    configFields: [
      { id: 'abi', label: 'Function ABI', type: 'textarea', placeholder: 'Function signature...' }
    ],
    execute: async (config, inputs) => {
      try {
        const functionSig = inputs.functionName || 'transfer(address,uint256)';
        const selector = hashKeccak256(functionSig).substring(0, 10);
        const params = inputs.params || '';
        const encoded = selector + params.replace(/0x/g, '').padStart(64, '0');
        
        return { encoded };
      } catch (error) {
        throw new Error('ABI encoding failed: ' + error);
      }
    }
  },
  {
    type: 'abi-decoder',
    label: 'ABI Decoder',
    category: 'ethereum',
    icon: '/favicon.ico',
    inputs: [{ id: 'encoded', label: 'Encoded Data', type: 'hex' }],
    outputs: [
      { id: 'functionName', label: 'Function', type: 'string' },
      { id: 'params', label: 'Parameters', type: 'object' }
    ],
    configFields: [
      { id: 'abi', label: 'Contract ABI', type: 'textarea', placeholder: 'ABI JSON...' }
    ],
    execute: async (config, inputs) => {
      try {
        const encoded = inputs.encoded || '';
        const selector = encoded.substring(0, 10);
        const paramsData = encoded.substring(10);
        
        return {
          functionName: 'decoded_function',
          params: { selector, data: paramsData }
        };
      } catch (error) {
        throw new Error('ABI decoding failed: ' + error);
      }
    }
  },
  {
    type: 'event-listener',
    label: 'Event Listener',
    category: 'ethereum',
    icon: '/favicon.ico',
    inputs: [
      { id: 'contractAddress', label: 'Contract', type: 'address' },
      { id: 'eventName', label: 'Event Name', type: 'string' }
    ],
    outputs: [
      { id: 'events', label: 'Events', type: 'object' },
      { id: 'count', label: 'Event Count', type: 'number' }
    ],
    configFields: [
      { id: 'fromBlock', label: 'From Block', type: 'number', placeholder: 'latest' },
      { id: 'toBlock', label: 'To Block', type: 'number', placeholder: 'latest' }
    ],
    execute: async (config, inputs) => {
      const mockEvents = [
        { blockNumber: 18000000, transactionHash: hashKeccak256('event1'), args: {} },
        { blockNumber: 18000001, transactionHash: hashKeccak256('event2'), args: {} }
      ];
      
      return { events: mockEvents, count: mockEvents.length };
    }
  },
  {
    type: 'nonce-visualizer',
    label: 'Nonce Visualizer',
    category: 'ethereum',
    icon: '/favicon.ico',
    inputs: [{ id: 'address', label: 'Address', type: 'address' }],
    outputs: [
      { id: 'nonce', label: 'Current Nonce', type: 'number' },
      { id: 'pendingNonce', label: 'Pending Nonce', type: 'number' }
    ],
    configFields: [
      {
        id: 'network',
        label: 'Network',
        type: 'select',
        options: [
          { value: 'mainnet', label: 'Ethereum Mainnet' },
          { value: 'sepolia', label: 'Sepolia Testnet' },
          { value: 'mock', label: 'Mock Data' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      const nonce = Math.floor(Math.random() * 100);
      const pendingNonce = nonce + Math.floor(Math.random() * 5);
      
      return { nonce, pendingNonce };
    }
  },
  {
    type: 'gas-estimator',
    label: 'Gas Estimator',
    category: 'ethereum',
    icon: '/favicon.ico',
    inputs: [
      { id: 'to', label: 'To Address', type: 'address' },
      { id: 'data', label: 'Data', type: 'hex' },
      { id: 'value', label: 'Value (ETH)', type: 'number' }
    ],
    outputs: [
      { id: 'gasLimit', label: 'Gas Limit', type: 'number' },
      { id: 'gasPrice', label: 'Gas Price (Gwei)', type: 'number' },
      { id: 'totalCost', label: 'Total Cost (ETH)', type: 'number' }
    ],
    configFields: [
      {
        id: 'speed',
        label: 'Transaction Speed',
        type: 'select',
        options: [
          { value: 'slow', label: 'Slow (Low Cost)' },
          { value: 'standard', label: 'Standard' },
          { value: 'fast', label: 'Fast (High Cost)' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      const speed = config.speed || 'standard';
      const gasLimit = 21000 + (inputs.data ? inputs.data.length * 16 : 0);
      const gasPrice = speed === 'slow' ? 10 : speed === 'fast' ? 50 : 25;
      const totalCost = (gasLimit * gasPrice) / 1e9;
      
      return { gasLimit, gasPrice, totalCost };
    }
  },
  {
    type: 'solidity-editor',
    label: 'Solidity Editor',
    category: 'ethereum',
    icon: '/favicon.ico',
    inputs: [],
    outputs: [
      { id: 'code', label: 'Solidity Code', type: 'string' },
      { id: 'compiled', label: 'Compiled', type: 'boolean' },
      { id: 'errors', label: 'Errors', type: 'object' }
    ],
    configFields: [
      { id: 'code', label: 'Solidity Code', type: 'textarea', placeholder: 'pragma solidity ^0.8.0;...' }
    ],
    execute: async (config) => {
      const code = config.code || '';
      const hasErrors = !code.includes('pragma solidity');
      
      return {
        code,
        compiled: !hasErrors,
        errors: hasErrors ? { message: 'Missing pragma directive' } : {}
      };
    }
  },
  {
    type: 'tx-debugger',
    label: 'Transaction Debugger',
    category: 'ethereum',
    icon: '/favicon.ico',
    inputs: [{ id: 'txHash', label: 'Tx Hash', type: 'hash' }],
    outputs: [
      { id: 'trace', label: 'Execution Trace', type: 'object' },
      { id: 'gasUsed', label: 'Gas Used', type: 'number' },
      { id: 'status', label: 'Status', type: 'string' }
    ],
    execute: async (config, inputs) => {
      const trace = {
        steps: [
          { op: 'PUSH1', gas: 21000, depth: 1 },
          { op: 'MSTORE', gas: 20997, depth: 1 },
          { op: 'CALL', gas: 20994, depth: 1 }
        ]
      };
      
      return {
        trace,
        gasUsed: 21000,
        status: 'success'
      };
    }
  },
  
  // ===== BLOCKCHAIN BLOCKS =====
  {
    type: 'transaction',
    label: 'Transaction Builder',
    category: 'blockchain',
    icon: '/favicon.ico',
    inputs: [
      { id: 'from', label: 'From', type: 'address' },
      { id: 'to', label: 'To', type: 'address' },
      { id: 'value', label: 'Value (ETH)', type: 'number' },
      { id: 'nonce', label: 'Nonce', type: 'number' }
    ],
    outputs: [{ id: 'transaction', label: 'Transaction', type: 'object' }],
    configFields: [
      { id: 'gasLimit', label: 'Gas Limit', type: 'number', placeholder: '21000' },
      { id: 'gasPrice', label: 'Gas Price (Gwei)', type: 'number', placeholder: '20' }
    ],
    execute: async (config, inputs) => {
      const transaction = {
        from: inputs.from || '',
        to: inputs.to || '',
        value: inputs.value || 0,
        nonce: inputs.nonce || 0,
        gasLimit: config.gasLimit || 21000,
        gasPrice: config.gasPrice || 20,
        data: '0x',
        hash: hashKeccak256(JSON.stringify({
          from: inputs.from,
          to: inputs.to,
          value: inputs.value,
          nonce: inputs.nonce
        }))
      };
      return { transaction };
    }
  },
  {
    type: 'ledger',
    label: 'Ledger',
    category: 'blockchain',
    icon: '/favicon.ico',
    inputs: [{ id: 'transaction', label: 'Transaction', type: 'object' }],
    outputs: [
      { id: 'txHash', label: 'Tx Hash', type: 'hash' },
      { id: 'status', label: 'Status', type: 'string' },
      { id: 'blockNumber', label: 'Block Number', type: 'number' }
    ],
    execute: async (config, inputs) => {
      const tx = inputs.transaction || {};
      const txHash = tx.hash || hashKeccak256(JSON.stringify(tx));
      const blockNumber = Math.floor(Math.random() * 1000000) + 15000000;
      return {
        txHash,
        status: 'confirmed',
        blockNumber
      };
    }
  },
  {
    type: 'block-chain-visualizer',
    label: 'Block Chain Visualizer',
    category: 'blockchain',
    icon: '/favicon.ico',
    inputs: [
      { id: 'transactions', label: 'Transactions', type: 'object' }
    ],
    outputs: [
      { id: 'blocks', label: 'Blocks', type: 'object' },
      { id: 'chainLength', label: 'Chain Length', type: 'number' }
    ],
    configFields: [
      { id: 'blockSize', label: 'Block Size', type: 'number', placeholder: '10', defaultValue: 10 }
    ],
    execute: async (config, inputs) => {
      try {
        const blockSize = config.blockSize || 10;
        const transactions = Array.isArray(inputs.transactions) ? inputs.transactions : [inputs.transactions];
        
        interface BlockData {
          number: number;
          transactions: any[];
          previousHash: string;
          timestamp: number;
          hash?: string;
        }
        
        const blocks: BlockData[] = [];
        let currentBlock: BlockData = {
          number: 1,
          transactions: [],
          previousHash: '0x' + '0'.repeat(64),
          timestamp: Date.now()
        };
        
        transactions.forEach((tx: any, idx: number) => {
          currentBlock.transactions.push(tx);
          
          if ((idx + 1) % blockSize === 0) {
            currentBlock.hash = hashKeccak256(JSON.stringify(currentBlock));
            blocks.push({ ...currentBlock });
            
            currentBlock = {
              number: currentBlock.number + 1,
              transactions: [],
              previousHash: currentBlock.hash,
              timestamp: Date.now()
            };
          }
        });
        
        if (currentBlock.transactions.length > 0) {
          currentBlock.hash = hashKeccak256(JSON.stringify(currentBlock));
          blocks.push(currentBlock);
        }
        
        return {
          blocks,
          chainLength: blocks.length
        };
      } catch (error) {
        throw new Error('Block chain visualization failed: ' + error);
      }
    }
  },
  {
    type: 'object',
    label: 'Object Builder',
    category: 'blockchain',
    icon: '/favicon.ico',
    inputs: [
      { id: 'key1', label: 'Key 1', type: 'any' },
      { id: 'key2', label: 'Key 2', type: 'any' },
      { id: 'key3', label: 'Key 3', type: 'any' }
    ],
    outputs: [{ id: 'object', label: 'Object', type: 'object' }],
    configFields: [
      { id: 'key1Name', label: 'Key 1 Name', type: 'text', placeholder: 'property1' },
      { id: 'key2Name', label: 'Key 2 Name', type: 'text', placeholder: 'property2' },
      { id: 'key3Name', label: 'Key 3 Name', type: 'text', placeholder: 'property3' }
    ],
    execute: async (config, inputs) => {
      const obj: Record<string, any> = {};
      if (config.key1Name && inputs.key1 !== undefined) obj[config.key1Name] = inputs.key1;
      if (config.key2Name && inputs.key2 !== undefined) obj[config.key2Name] = inputs.key2;
      if (config.key3Name && inputs.key3 !== undefined) obj[config.key3Name] = inputs.key3;
      return { object: obj };
    }
  },
  {
    type: 'balance-checker',
    label: 'Balance Checker',
    category: 'blockchain',
    icon: '/favicon.ico',
    inputs: [{ id: 'address', label: 'Address', type: 'address' }],
    outputs: [{ id: 'balance', label: 'Balance (ETH)', type: 'number' }],
    configFields: [
      {
        id: 'network',
        label: 'Network',
        type: 'select',
        options: [
          { value: 'mainnet', label: 'Ethereum Mainnet' },
          { value: 'sepolia', label: 'Sepolia Testnet' },
          { value: 'mock', label: 'Mock Data' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      if (config.network === 'mock' || !inputs.address) {
        return { balance: Math.random() * 10 };
      }
      try {
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${inputs.address}&tag=latest`);
        const data = await response.json();
        const balance = data.result ? parseFloat(data.result) / 1e18 : 0;
        return { balance };
      } catch (error) {
        return { balance: 0 };
      }
    }
  },
  {
    type: 'block-explorer',
    label: 'Block Explorer',
    category: 'blockchain',
    icon: '/favicon.ico',
    inputs: [{ id: 'blockNumber', label: 'Block Number', type: 'number' }],
    outputs: [
      { id: 'hash', label: 'Block Hash', type: 'hash' },
      { id: 'timestamp', label: 'Timestamp', type: 'number' },
      { id: 'transactions', label: 'Tx Count', type: 'number' }
    ],
    configFields: [
      {
        id: 'network',
        label: 'Network',
        type: 'select',
        options: [
          { value: 'mainnet', label: 'Ethereum Mainnet' },
          { value: 'mock', label: 'Mock Data' }
        ]
      }
    ],
    execute: async (config, inputs) => {
      if (config.network === 'mock') {
        return {
          hash: '0x' + Math.random().toString(16).substring(2, 66),
          timestamp: Date.now(),
          transactions: Math.floor(Math.random() * 200)
        };
      }
      return {
        hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        timestamp: Date.now(),
        transactions: 0
      };
    }
  },
  {
    type: 'wallet-connect',
    label: 'Wallet Connect',
    category: 'blockchain',
    icon: '/favicon.ico',
    inputs: [],
    outputs: [
      { id: 'address', label: 'Address', type: 'address' },
      { id: 'connected', label: 'Connected', type: 'boolean' }
    ],
    configFields: [
      { id: 'mockAddress', label: 'Mock Address', type: 'text', placeholder: '0x...' }
    ],
    execute: async (config) => ({
      address: config.mockAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      connected: true
    })
  },
  {
    type: 'contract-caller',
    label: 'Contract Caller',
    category: 'blockchain',
    icon: '/favicon.ico',
    inputs: [
      { id: 'contractAddress', label: 'Contract', type: 'address' },
      { id: 'method', label: 'Method', type: 'string' },
      { id: 'params', label: 'Parameters', type: 'string' }
    ],
    outputs: [{ id: 'result', label: 'Result', type: 'any' }],
    configFields: [
      { id: 'abi', label: 'Contract ABI', type: 'textarea', placeholder: 'Paste ABI JSON...' }
    ],
    execute: async (config, inputs) => ({
      result: 'Mock contract result: ' + (inputs.method || 'unknown')
    })
  },
  
  // ===== DISPLAY BLOCKS =====
  {
    type: 'text-display',
    label: 'Text Display',
    category: 'display',
    icon: '/favicon.ico',
    inputs: [{ id: 'value', label: 'Text', type: 'string' }],
    outputs: [],
    execute: async (config, inputs) => ({ displayValue: inputs.value || '' })
  },
  {
    type: 'number-display',
    label: 'Number Display',
    category: 'display',
    icon: '/favicon.ico',
    inputs: [{ id: 'value', label: 'Number', type: 'number' }],
    outputs: [],
    execute: async (config, inputs) => ({ displayValue: inputs.value || 0 })
  },
  {
    type: 'hash-display',
    label: 'Hash Display',
    category: 'display',
    icon: '/favicon.ico',
    inputs: [{ id: 'hash', label: 'Hash', type: 'hash' }],
    outputs: [],
    execute: async (config, inputs) => ({ displayValue: inputs.hash || '' })
  },
  {
    type: 'balance-display',
    label: 'Balance Display',
    category: 'display',
    icon: '/favicon.ico',
    inputs: [{ id: 'balance', label: 'Balance', type: 'number' }],
    outputs: [],
    configFields: [
      { id: 'unit', label: 'Unit', type: 'text', placeholder: 'ETH' }
    ],
    execute: async (config, inputs) => ({
      displayValue: `${inputs.balance || 0} ${config.unit || 'ETH'}`
    })
  },
  {
    type: 'object-display',
    label: 'Object Display',
    category: 'display',
    icon: '/favicon.ico',
    inputs: [{ id: 'object', label: 'Object', type: 'object' }],
    outputs: [],
    execute: async (config, inputs) => ({
      displayValue: JSON.stringify(inputs.object || {}, null, 2)
    })
  }
];

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return blockDefinitions.find(def => def.type === type);
}
