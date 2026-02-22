import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Lock, Globe, Infinity } from 'lucide-react';

export default function ProofOfTrust() {
  const verifySignUrl = 'https://etherscan.io/verifySig/13271';

  const trustFeatures = [
    { icon: CheckCircle, label: 'Authentic', color: 'text-green-500' },
    { icon: Shield, label: 'Verified', color: 'text-blue-500' },
    { icon: Lock, label: '100% Transparent', color: 'text-amber-500' },
    { icon: Globe, label: 'No Restrictions', color: 'text-purple-500' },
    { icon: Infinity, label: 'Future-Proof', color: 'text-cyan-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/proof-of-trust-icon-transparent.dim_64x64.png"
              alt="Proof of Trust"
              className="h-16 w-16"
            />
          </div>
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">
            Proof of Trust
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Cryptographic verification and transparency through blockchain technology
          </p>
        </div>

        {/* Trust Features */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {trustFeatures.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-primary/20 hover:border-primary/50 transition-all shadow-lg hover:shadow-xl"
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
                <span className="text-sm font-semibold text-center">{feature.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CEO Quote Card */}
        <Card className="border-3 border-accent/30 shadow-2xl bg-gradient-to-br from-card via-card to-accent/5">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-accent" />
              Official Statement from CEO & Founder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-2xl">
              <p className="text-base md:text-lg leading-relaxed text-foreground">
                <span className="font-bold text-accent">Genuine Owner is DILEEP KUMAR D from INDIA</span>, 
                <span className="font-semibold"> +919620058644</span>, 
                <span className="font-semibold"> Twt: dil_sec</span>, 
                <span className="font-semibold"> Tel: @dilee</span>
              </p>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-foreground">
                <span className="font-bold text-destructive">Pl. Block ALL Misuse of #CryptoRealty by unknown Culprits & Frauds mushrooming to Fake Our Services.!</span>
              </p>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-foreground">
                <span className="font-bold text-primary">But as per Our Cryptographic Proofs from EtherScan VerifySign, We could Retain Our Ownership for a Millenium.!</span>
              </p>
              <p className="mt-4 text-base md:text-lg leading-relaxed">
                <span className="font-semibold">CryptoRealty@SECoINFI:</span>{' '}
                <a
                  href={verifySignUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 underline font-semibold break-all"
                >
                  {verifySignUrl}
                </a>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="border-green-500 text-green-500 px-4 py-2 text-sm">
                ✓ Cryptographically Verified
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-500 px-4 py-2 text-sm">
                ✓ Blockchain Secured
              </Badge>
              <Badge variant="outline" className="border-amber-500 text-amber-500 px-4 py-2 text-sm">
                ✓ No Border Transactions
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* EtherScan VerifySign Embed */}
        <Card className="border-2 border-primary/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              EtherScan VerifySign - ZK-Proof Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <iframe
                src={verifySignUrl}
                title="EtherScan VerifySign Proof"
                className="absolute top-0 left-0 w-full h-full border-2 border-primary/20 rounded-xl"
                style={{ minHeight: '600px' }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                loading="lazy"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={verifySignUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold underline"
              >
                <Globe className="h-4 w-4" />
                View Full Verification on EtherScan
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Shield className="h-10 w-10 text-primary mx-auto" />
                <h3 className="font-bold text-lg">Immutable Proof</h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain-verified ownership that cannot be altered or forged
                </p>
              </div>
              <div className="space-y-2">
                <Lock className="h-10 w-10 text-accent mx-auto" />
                <h3 className="font-bold text-lg">Cryptographic Security</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced cryptographic signatures ensure authenticity
                </p>
              </div>
              <div className="space-y-2">
                <Infinity className="h-10 w-10 text-cyan-500 mx-auto" />
                <h3 className="font-bold text-lg">Millennium Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Ownership secured for generations through decentralized verification
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
