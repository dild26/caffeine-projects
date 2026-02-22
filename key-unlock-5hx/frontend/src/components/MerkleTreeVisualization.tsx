import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Hash, Shield, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MerkleNode {
  id: string;
  hash: string;
  type: 'root' | 'branch' | 'leaf';
  label: string;
  children?: MerkleNode[];
}

const MOCK_MERKLE_TREE: MerkleNode = {
  id: 'root',
  hash: 'a1b2c3d4e5f6g7h8',
  type: 'root',
  label: 'Sitemap Root',
  children: [
    {
      id: 'app1',
      hash: 'b2c3d4e5f6g7h8i9',
      type: 'branch',
      label: 'SECoin',
      children: [
        { id: 'page1', hash: 'c3d4e5f6g7h8i9j0', type: 'leaf', label: 'About' },
        { id: 'page2', hash: 'd4e5f6g7h8i9j0k1', type: 'leaf', label: 'Features' },
        { id: 'page3', hash: 'e5f6g7h8i9j0k1l2', type: 'leaf', label: 'Contact' },
      ]
    },
    {
      id: 'app2',
      hash: 'f6g7h8i9j0k1l2m3',
      type: 'branch',
      label: 'SitemapAi',
      children: [
        { id: 'page4', hash: 'g7h8i9j0k1l2m3n4', type: 'leaf', label: 'About' },
        { id: 'page5', hash: 'h8i9j0k1l2m3n4o5', type: 'leaf', label: 'Pros' },
      ]
    },
  ]
};

export default function MerkleTreeVisualization() {
  const renderNode = (node: MerkleNode, level: number = 0) => {
    const indent = level * 40;
    
    return (
      <div key={node.id} style={{ marginLeft: `${indent}px` }} className="space-y-2">
        <div className="card-3d p-3 rounded-lg flex items-center justify-between group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3">
            {node.type === 'root' && <Shield className="w-5 h-5 text-primary" />}
            {node.type === 'branch' && <GitBranch className="w-5 h-5 text-accent" />}
            {node.type === 'leaf' && <CheckCircle className="w-5 h-5 text-success" />}
            <div>
              <div className="font-semibold">{node.label}</div>
              <div className="text-xs text-muted-foreground font-mono">
                <Hash className="w-3 h-3 inline mr-1" />
                {node.hash}
              </div>
            </div>
          </div>
          <Badge variant={
            node.type === 'root' ? 'default' :
            node.type === 'branch' ? 'secondary' : 'outline'
          }>
            {node.type}
          </Badge>
        </div>
        {node.children && (
          <div className="space-y-2">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="card-3d card-3d-hover">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gradient flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-primary" />
          Merkle Tree Sitemap Structure
        </CardTitle>
        <CardDescription>
          Hierarchical hash-based verification with root hash calculation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Hash className="h-4 w-4" />
          <AlertDescription>
            <strong>Merkle-Leaf Hashing:</strong> Each page has a unique content hash (leaf). App-level hashes (branches) are computed from their pages. The root hash represents the entire sitemap state and updates on every mutation.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          {renderNode(MOCK_MERKLE_TREE)}
        </div>

        <div className="card-3d p-4 rounded-lg space-y-2">
          <h4 className="font-semibold text-primary">Verification Properties:</h4>
          <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
            <li>Deterministic hash calculation ensures consistency</li>
            <li>Any page change updates all parent hashes up to root</li>
            <li>Root hash serves as cryptographic proof of sitemap state</li>
            <li>Enables efficient verification without checking every page</li>
            <li>Tamper-proof tracking with complete audit trail</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
