import type { FieldValueEntry } from '../backend';

export function hashData(data: string): Uint8Array {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  const hash = new Uint8Array(32);

  for (let i = 0; i < dataBytes.length; i++) {
    hash[i % 32] ^= dataBytes[i];
  }

  return hash;
}

export function generateNonce(fieldId: string): Uint8Array {
  const timestamp = Date.now().toString();
  const salt = Math.random().toString(36).substring(2);
  const data = `${fieldId}||${timestamp}||${salt}`;
  return hashData(data);
}

function hashFieldEntry(entry: FieldValueEntry): Uint8Array {
  const valueStr = JSON.stringify(entry.value);
  const data = `${entry.fieldId}:${valueStr}`;
  return hashData(data);
}

function combineHashes(left: Uint8Array, right: Uint8Array): Uint8Array {
  const combined = new Uint8Array(left.length + right.length);
  combined.set(left);
  combined.set(right, left.length);
  return hashData(Array.from(combined).join(''));
}

export function generateMerkleTree(entries: FieldValueEntry[]): {
  root: Uint8Array;
  proofs: Array<{ fieldId: string; proofPath: Uint8Array[]; root: Uint8Array }>;
} {
  if (entries.length === 0) {
    return { root: new Uint8Array(32), proofs: [] };
  }

  const sortedEntries = [...entries].sort((a, b) => a.fieldId.localeCompare(b.fieldId));
  let currentLevel = sortedEntries.map(hashFieldEntry);
  const proofPaths: Map<number, Uint8Array[]> = new Map();

  sortedEntries.forEach((_, idx) => {
    proofPaths.set(idx, []);
  });

  while (currentLevel.length > 1) {
    const nextLevel: Uint8Array[] = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = combineHashes(currentLevel[i], currentLevel[i + 1]);
        nextLevel.push(combined);

        for (let j = 0; j < sortedEntries.length; j++) {
          const path = proofPaths.get(j)!;
          if (Math.floor(j / Math.pow(2, path.length)) === Math.floor(i / 2)) {
            if (j % 2 === 0) {
              path.push(currentLevel[i + 1]);
            } else {
              path.push(currentLevel[i]);
            }
          }
        }
      } else {
        nextLevel.push(currentLevel[i]);
      }
    }

    currentLevel = nextLevel;
  }

  const root = currentLevel[0];
  const proofs = sortedEntries.map((entry, idx) => ({
    fieldId: entry.fieldId,
    proofPath: proofPaths.get(idx) || [],
    root,
  }));

  return { root, proofs };
}
