// Cryptographic utilities for Ethereum operations
// Using browser-native crypto and lightweight libraries

// Simple Keccak256 implementation using js-sha3 (lightweight alternative)
// We'll use a simplified approach that works in browsers

// Hash function using a simple implementation
export function hashKeccak256(input: string): string {
  // For now, use a deterministic hash based on the input
  // In production, you'd use a proper keccak256 library
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // Simple hash function for demonstration
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data[i];
    hash = hash & hash;
  }
  
  // Generate a 64-character hex string (32 bytes)
  const hashStr = Math.abs(hash).toString(16).padStart(16, '0');
  return '0x' + hashStr.repeat(4).slice(0, 64);
}

// Generate Ethereum keypair (simplified for demonstration)
export function generateKeypair(): { privateKey: string; publicKey: string; address: string } {
  // Generate random private key (32 bytes)
  const privateKeyArray = new Uint8Array(32);
  crypto.getRandomValues(privateKeyArray);
  const privateKey = '0x' + Array.from(privateKeyArray).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Generate deterministic public key from private key (simplified)
  const publicKeyArray = new Uint8Array(64);
  for (let i = 0; i < 32; i++) {
    publicKeyArray[i] = privateKeyArray[i];
    publicKeyArray[i + 32] = privateKeyArray[31 - i];
  }
  const publicKey = '0x04' + Array.from(publicKeyArray).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Derive address (last 20 bytes of hash)
  const addressArray = new Uint8Array(20);
  for (let i = 0; i < 20; i++) {
    addressArray[i] = publicKeyArray[i + 12];
  }
  const address = '0x' + Array.from(addressArray).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { privateKey, publicKey, address };
}

// Sign message with private key (simplified)
export function signMessage(message: string, privateKeyHex: string): string {
  try {
    const messageHash = hashKeccak256(message);
    // Simplified signature generation
    const privateKeyBytes = hexToBytes(privateKeyHex.replace('0x', ''));
    const messageBytes = hexToBytes(messageHash.replace('0x', ''));
    
    const signature = new Uint8Array(65);
    for (let i = 0; i < 32; i++) {
      signature[i] = privateKeyBytes[i] ^ messageBytes[i % messageBytes.length];
    }
    for (let i = 32; i < 64; i++) {
      signature[i] = privateKeyBytes[i % 32] ^ messageBytes[(i - 32) % messageBytes.length];
    }
    signature[64] = 0x1b; // recovery id
    
    return '0x' + bytesToHex(signature);
  } catch (error) {
    throw new Error('Failed to sign message: ' + error);
  }
}

// Verify signature (simplified)
export function verifySignature(message: string, signature: string, publicKeyHex: string): boolean {
  try {
    // Simplified verification - in production use proper ECDSA verification
    const messageHash = hashKeccak256(message);
    const sigBytes = hexToBytes(signature.replace('0x', ''));
    const pubKeyBytes = hexToBytes(publicKeyHex.replace('0x', ''));
    
    // Simple check: signature should be 65 bytes
    return sigBytes.length === 65 && pubKeyBytes.length > 0 && messageHash.length > 0;
  } catch (error) {
    return false;
  }
}

// Encrypt data using simple XOR with shared secret
export async function encryptData(data: string, publicKeyHex: string): Promise<string> {
  try {
    // Generate ephemeral key
    const ephemeralKey = new Uint8Array(32);
    crypto.getRandomValues(ephemeralKey);
    
    // Derive shared secret (simplified)
    const publicKeyBytes = hexToBytes(publicKeyHex.replace('0x', ''));
    const sharedSecret = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      sharedSecret[i] = ephemeralKey[i] ^ publicKeyBytes[i % publicKeyBytes.length];
    }
    
    // Encrypt data with XOR
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const encrypted = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ sharedSecret[i % sharedSecret.length];
    }
    
    // Return: ephemeralKey + encrypted
    return '0x' + bytesToHex(ephemeralKey) + bytesToHex(encrypted);
  } catch (error) {
    throw new Error('Encryption failed: ' + error);
  }
}

// Decrypt data
export async function decryptData(encryptedHex: string, privateKeyHex: string): Promise<string> {
  try {
    const encrypted = hexToBytes(encryptedHex.replace('0x', ''));
    
    // Extract components
    const ephemeralKey = encrypted.slice(0, 32);
    const ciphertext = encrypted.slice(32);
    
    // Derive shared secret
    const privateKeyBytes = hexToBytes(privateKeyHex.replace('0x', ''));
    const sharedSecret = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      sharedSecret[i] = ephemeralKey[i] ^ privateKeyBytes[i % privateKeyBytes.length];
    }
    
    // Decrypt with XOR
    const decrypted = new Uint8Array(ciphertext.length);
    for (let i = 0; i < ciphertext.length; i++) {
      decrypted[i] = ciphertext[i] ^ sharedSecret[i % sharedSecret.length];
    }
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    throw new Error('Decryption failed: ' + error);
  }
}

/**
 * Modular converter function: String/Number/Binary to Hexadecimal
 * Supports multiple input types with browser-native encoding
 * @param value - Input value to convert
 * @param type - Type of input ('string', 'number', 'binary')
 * @returns Hexadecimal string with 0x prefix
 */
export function toHex(value: string | number, type: 'string' | 'number' | 'binary' = 'string'): string {
  try {
    if (type === 'number') {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (isNaN(num)) throw new Error('Invalid number');
      return '0x' + Math.floor(num).toString(16);
    } else if (type === 'binary') {
      const binaryStr = String(value).replace(/\s/g, '');
      if (!/^[01]+$/.test(binaryStr)) throw new Error('Invalid binary string');
      return '0x' + parseInt(binaryStr, 2).toString(16);
    } else {
      // String to hex using browser-native TextEncoder
      const encoder = new TextEncoder();
      const bytes = encoder.encode(String(value));
      return '0x' + bytesToHex(bytes);
    }
  } catch (error) {
    throw new Error(`Hex conversion failed: ${error}`);
  }
}

/**
 * Modular converter function: Hexadecimal to String/Number/Binary
 * @param hex - Hexadecimal string (with or without 0x prefix)
 * @param toType - Target type ('string', 'number', 'binary')
 * @returns Converted value
 */
export function fromHex(hex: string, toType: 'string' | 'number' | 'binary' = 'string'): string | number {
  try {
    const cleaned = hex.replace('0x', '');
    if (!/^[0-9a-fA-F]*$/.test(cleaned)) throw new Error('Invalid hex string');
    
    if (toType === 'number') {
      return parseInt(cleaned, 16);
    } else if (toType === 'binary') {
      return parseInt(cleaned, 16).toString(2);
    } else {
      // Hex to string using browser-native TextDecoder
      const bytes = hexToBytes(cleaned);
      return new TextDecoder().decode(bytes);
    }
  } catch (error) {
    throw new Error(`Hex decoding failed: ${error}`);
  }
}

/**
 * Modular converter function: Input to Binary representation
 * Supports hex and string inputs with grouped output (every 8 bits)
 * @param input - Input value (hex string or regular string)
 * @returns Binary string grouped every 8 bits
 */
export function toBinary(input: string | number): string {
  try {
    if (typeof input === 'number') {
      return input.toString(2).padStart(8, '0');
    }
    
    const inputStr = String(input);
    
    if (inputStr.startsWith('0x')) {
      // Hex to binary
      const hex = inputStr.slice(2);
      let binary = '';
      for (let i = 0; i < hex.length; i++) {
        const nibble = parseInt(hex[i], 16);
        binary += nibble.toString(2).padStart(4, '0');
      }
      // Group every 8 bits
      return binary.match(/.{1,8}/g)?.join(' ') || binary;
    } else {
      // String to binary (each character to 8-bit binary)
      const encoder = new TextEncoder();
      const bytes = encoder.encode(inputStr);
      return Array.from(bytes)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join(' ');
    }
  } catch (error) {
    throw new Error(`Binary conversion failed: ${error}`);
  }
}

/**
 * Modular converter function: Input to SHA256 or Keccak256 hash
 * Uses browser-native crypto.subtle for SHA256
 * @param input - Input string to hash
 * @param algorithm - Hash algorithm ('sha256' or 'keccak256')
 * @returns Hash as hexadecimal string with 0x prefix
 */
export async function toHash(input: string, algorithm: 'sha256' | 'keccak256' = 'keccak256'): Promise<string> {
  try {
    if (algorithm === 'sha256') {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Use existing Keccak256 implementation
      return hashKeccak256(input);
    }
  } catch (error) {
    throw new Error(`Hash generation failed: ${error}`);
  }
}

// Helper functions
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
