import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetProById, useGetRelatedPros } from '../hooks/useAppQueries';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, ArrowLeft, ExternalLink } from 'lucide-react';

interface ProDetailPageProps {
  proId: bigint;
}

export default function ProDetailPage({ proId }: ProDetailPageProps) {
  const { data: pro, isLoading: proLoading } = useGetProById(proId);
  const { data: relatedPros = [], isLoading: relatedLoading } = useGetRelatedPros(proId);
  const navigate = useNavigate();

  if (proLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Pro Not Found</h1>
          <Button onClick={() => navigate({ to: '/pros' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pros
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: '/pros' })}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pros
        </Button>

        <Card className="border-2">
          <CardHeader>
            <div className="space-y-2">
              <Badge variant="outline">ID: {pro.id.toString()}</Badge>
              <CardTitle className="text-4xl">{pro.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {pro.description}
              </p>
            </div>

            {pro.title === 'Secure' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Security Features</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• End-to-end encryption for all data transmission</li>
                  <li>• Multi-factor authentication support</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Zero-knowledge proof architecture</li>
                </ul>
              </div>
            )}

            {pro.title === 'Private' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Privacy Guarantees</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• No personal data stored on centralized servers</li>
                  <li>• User-controlled data sharing permissions</li>
                  <li>• Anonymous authentication options</li>
                  <li>• GDPR and privacy law compliant</li>
                </ul>
              </div>
            )}

            {pro.title === 'Decentralised' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Decentralization Benefits</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• No single point of failure</li>
                  <li>• Distributed consensus mechanisms</li>
                  <li>• Censorship-resistant architecture</li>
                  <li>• Community-governed protocols</li>
                </ul>
              </div>
            )}

            {pro.title === 'Universal' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Universal Access</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Cross-platform compatibility (Web, Mobile, Desktop)</li>
                  <li>• Single sign-on across all services</li>
                  <li>• Works with any device or browser</li>
                  <li>• Seamless integration with partner platforms</li>
                </ul>
              </div>
            )}

            {pro.title === 'Profile' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Profile Management</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Customizable user profiles</li>
                  <li>• Secure credential storage</li>
                  <li>• Easy profile updates and modifications</li>
                  <li>• Export and backup capabilities</li>
                </ul>
              </div>
            )}

            {pro.title === 'Identity' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Identity Protection</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Self-sovereign identity management</li>
                  <li>• Verifiable credentials support</li>
                  <li>• Protection against identity theft</li>
                  <li>• Blockchain-based identity verification</li>
                </ul>
              </div>
            )}

            {pro.title === 'Authenticated' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Authentication Methods</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Passwordless authentication</li>
                  <li>• Biometric authentication support</li>
                  <li>• Hardware security key integration</li>
                  <li>• Time-based one-time passwords (TOTP)</li>
                </ul>
              </div>
            )}

            {pro.title === 'Blockchain-based' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Blockchain Technology</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Built on Internet Computer Protocol</li>
                  <li>• Immutable transaction records</li>
                  <li>• Smart contract automation</li>
                  <li>• Transparent and auditable operations</li>
                </ul>
              </div>
            )}

            {pro.title === 'Cryptographic Security' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Cryptographic Features</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Advanced encryption algorithms (AES-256, RSA-4096)</li>
                  <li>• Public-key infrastructure (PKI)</li>
                  <li>• Digital signatures for authentication</li>
                  <li>• Secure key management and rotation</li>
                </ul>
                <div className="mt-4">
                  <img
                    src="/assets/generated/merkle-tree-diagram.dim_600x400.png"
                    alt="Cryptographic Security"
                    className="w-full rounded-lg border"
                  />
                </div>
              </div>
            )}

            {pro.title === 'Multi-device Support' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Device Compatibility</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Sync across all your devices</li>
                  <li>• Mobile-first responsive design</li>
                  <li>• Desktop and tablet optimization</li>
                  <li>• Offline access capabilities</li>
                </ul>
                <div className="mt-4">
                  <img
                    src="/assets/generated/qr-phone-display.dim_400x300.png"
                    alt="Multi-device Support"
                    className="w-full rounded-lg border"
                  />
                </div>
              </div>
            )}

            {pro.title === 'Protected Identity' && (
              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h4 className="font-semibold text-lg">Identity Protection</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Advanced threat detection and prevention</li>
                  <li>• Real-time security monitoring</li>
                  <li>• Automatic security updates</li>
                  <li>• 24/7 security team support</li>
                </ul>
                <div className="mt-4">
                  <img
                    src="/assets/generated/security-shield-transparent.dim_64x64.png"
                    alt="Protected Identity"
                    className="w-32 h-32 mx-auto"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {relatedPros.length > 0 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Related Advantages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedPros.map((relatedPro) => (
                  <button
                    key={relatedPro.id.toString()}
                    onClick={() => navigate({ to: relatedPro.link })}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors text-left group"
                  >
                    <div>
                      <p className="font-medium">{relatedPro.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {relatedPro.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
