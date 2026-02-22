import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, CheckCircle2, Lock, FileCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function TrustPage() {
  const { identity } = useInternetIdentity();
  const [proofData, setProofData] = useState({
    workflowId: '',
    proofHash: '',
  });

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Proof submitted for verification!');
    setProofData({ workflowId: '', proofHash: '' });
  };

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b-4 border-primary">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex justify-center mb-6">
              <img
                src="/assets/generated/trust-badge-transparent.dim_100x100.png"
                alt="Trust Badge"
                className="h-24 w-24"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Proof of Trust
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Cryptographic verification for workflow usage and referral claims
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Zero-Knowledge Verification</h2>
            <p className="text-lg text-muted-foreground">
              Our platform simulates ZK-proof verification to ensure trust and transparency. Submit cryptographic proofs of workflow usage or referral claims without revealing sensitive information.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Secure</CardTitle>
                <CardDescription>
                  Cryptographic proofs ensure data integrity
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-accent/10 w-fit mb-4">
                  <Lock className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Private</CardTitle>
                <CardDescription>
                  Verify without revealing sensitive data
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Verifiable</CardTitle>
                <CardDescription>
                  All proofs are recorded on-chain
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-accent/10 w-fit mb-4">
                  <FileCheck className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Transparent</CardTitle>
                <CardDescription>
                  Audit trail for all verifications
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {identity ? (
            <Card className="border-2 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Submit Proof</CardTitle>
                <CardDescription>
                  Submit a cryptographic proof for verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitProof} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="workflowId">Workflow ID</Label>
                    <Input
                      id="workflowId"
                      placeholder="Enter workflow ID"
                      value={proofData.workflowId}
                      onChange={(e) => setProofData({ ...proofData, workflowId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proofHash">Proof Hash</Label>
                    <Textarea
                      id="proofHash"
                      placeholder="Enter cryptographic proof hash"
                      rows={4}
                      value={proofData.proofHash}
                      onChange={(e) => setProofData({ ...proofData, proofHash: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit for Verification
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Login Required</CardTitle>
                <CardDescription>
                  Please login to submit proofs for verification
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Generate Proof</h4>
                  <p className="text-muted-foreground">
                    Create a cryptographic hash of your workflow usage or referral claim using your private key.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Submit for Verification</h4>
                  <p className="text-muted-foreground">
                    Submit your proof through our secure interface. The proof is validated using ZK-verification logic.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Get Verified</h4>
                  <p className="text-muted-foreground">
                    Once verified, your proof is recorded on-chain and you receive a trust badge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
