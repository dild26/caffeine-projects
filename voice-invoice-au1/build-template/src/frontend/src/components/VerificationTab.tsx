import { useState } from 'react';
import { useGetMerkleProof, useVerifyMerkleProof } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Search, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerificationTab() {
  const [transactionId, setTransactionId] = useState('');
  const [searchId, setSearchId] = useState<string | null>(null);
  const { data: proof, isLoading: proofLoading } = useGetMerkleProof(searchId);
  const { mutate: verify, isPending: verifying, data: verificationResult } = useVerifyMerkleProof();

  const handleSearch = () => {
    if (transactionId.trim()) {
      setSearchId(transactionId.trim());
    }
  };

  const handleVerify = () => {
    if (searchId) {
      verify(searchId);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img src="/assets/generated/verification-badge.dim_100x100.png" alt="" className="h-6 w-6" />
            Verify Transaction
          </CardTitle>
          <CardDescription>Check the authenticity of any receipt using transaction ID or hash</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="txId">Transaction ID or Hash</Label>
            <div className="flex gap-2">
              <Input
                id="txId"
                placeholder="Enter transaction ID (e.g., ab12...fe45)"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={!transactionId.trim() || proofLoading} className="gap-2">
                {proofLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
            </div>
          </div>

          {searchId && !proofLoading && (
            <>
              {proof ? (
                <div className="space-y-4">
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertDescription>Transaction found in blockchain records</AlertDescription>
                  </Alert>

                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Transaction ID:</span>
                      <Badge variant="outline" className="font-mono">
                        {proof.transactionId}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Merkle Root:</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {Buffer.from(proof.merkleRoot).toString('hex').slice(0, 16)}...
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Validation Status:</span>
                      {proof.isValid ? (
                        <Badge variant="default" className="gap-1 bg-success">
                          <CheckCircle2 className="h-3 w-3" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Invalid
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button onClick={handleVerify} disabled={verifying} className="w-full gap-2">
                    {verifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Verify Merkle Proof
                      </>
                    )}
                  </Button>

                  {verificationResult !== undefined && (
                    <Alert variant={verificationResult ? 'default' : 'destructive'}>
                      {verificationResult ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>
                            ✓ Transaction verified successfully! This receipt is authentic and recorded on the
                            blockchain.
                          </AlertDescription>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            ✗ Verification failed. This transaction could not be verified on the blockchain.
                          </AlertDescription>
                        </>
                      )}
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>No transaction found with this ID</AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Verification Works</CardTitle>
          <CardDescription>Understanding blockchain-based receipt verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src="/assets/generated/merkle-tree-diagram.dim_400x300.png"
            alt="Merkle Tree"
            className="w-full rounded-lg border"
          />
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </div>
              <p className="text-muted-foreground">
                Each transaction is hashed and stored in a Merkle tree structure
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </div>
              <p className="text-muted-foreground">
                The Merkle root is anchored on the blockchain for immutability
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </div>
              <p className="text-muted-foreground">
                Anyone can verify a receipt by checking its cryptographic proof
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
