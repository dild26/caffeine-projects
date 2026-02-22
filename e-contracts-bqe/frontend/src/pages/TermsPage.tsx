import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using E-Contracts, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.',
    },
    {
      title: '2. Use License',
      content: 'Permission is granted to temporarily access and use E-Contracts for personal or commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose without proper licensing; attempt to decompile or reverse engineer any software contained on E-Contracts; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or "mirror" the materials on any other server.',
    },
    {
      title: '3. User Accounts',
      content: 'When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.',
    },
    {
      title: '4. Intellectual Property',
      content: 'The Service and its original content, features, and functionality are and will remain the exclusive property of E-Contracts and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without prior written consent.',
    },
    {
      title: '5. User Content',
      content: 'Our Service allows you to create, upload, and manage contracts and other content. You retain all rights to your content. By uploading content, you grant us a license to use, store, and display your content as necessary to provide the Service. You are responsible for the content you upload and must ensure you have all necessary rights and permissions.',
    },
    {
      title: '6. Prohibited Uses',
      content: 'You may not use our Service: for any unlawful purpose or to solicit others to perform unlawful acts; to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others; to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate; to submit false or misleading information; to upload or transmit viruses or any other type of malicious code; to collect or track the personal information of others; to spam, phish, pharm, pretext, spider, crawl, or scrape; for any obscene or immoral purpose; or to interfere with or circumvent the security features of the Service.',
    },
    {
      title: '7. Blockchain and Data Storage',
      content: 'E-Contracts uses blockchain technology for secure, decentralized storage of contracts. By using our Service, you acknowledge that: data stored on the blockchain is immutable and cannot be deleted; blockchain transactions may incur network fees; we cannot reverse or modify blockchain transactions once confirmed; and you are responsible for maintaining access to your account credentials.',
    },
    {
      title: '8. Payment Terms',
      content: 'Certain features of the Service may require payment. You agree to provide current, complete, and accurate purchase and account information. You agree to promptly update your account and payment information. We reserve the right to refuse or cancel orders at any time for reasons including product or service availability, errors in pricing, or suspected fraud.',
    },
    {
      title: '9. Termination',
      content: 'We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.',
    },
    {
      title: '10. Limitation of Liability',
      content: 'In no event shall E-Contracts, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.',
    },
    {
      title: '11. Disclaimer',
      content: 'Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.',
    },
    {
      title: '12. Changes to Terms',
      content: 'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days\' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.',
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Terms & Conditions</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Last updated: October 24, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Welcome to E-Contracts. These Terms and Conditions ("Terms") govern your use of our website and services. Please read these Terms carefully before using our platform. By accessing or using E-Contracts, you agree to be bound by these Terms.
            </p>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact */}
        <Card className="mt-8 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@e-contracts.com" className="font-medium text-primary hover:underline">
                legal@e-contracts.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
