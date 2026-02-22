import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { FileText, AlertCircle, Shield } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      number: 1,
      title: 'Acceptance of Terms',
      content: `By accessing or using Gateway Edge ICP Cloud Storage services ("Services") provided by SECOINFI through Caffeine.ai, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you may not use the Services. These terms constitute a legally binding agreement between you and SECOINFI. SECOINFI reserves the right to update, modify, or cancel these Terms and Conditions at any time without prior notice. Your continued use of the Services after any changes constitutes acceptance of the modified terms.`,
    },
    {
      number: 2,
      title: 'Service Description',
      content: `Gateway Edge provides multi-tenant cloud storage services built on the Internet Computer blockchain. Services include but are not limited to: file storage and management, backup and restore capabilities with Merkle tree verification, Message-Locked Encryption (MLE), multi-file and folder upload functionality, tenant management, billing integration, monetization features, and enterprise-grade features including replication, access control, and audit logging.`,
    },
    {
      number: 3,
      title: 'User Accounts and Authentication',
      content: `Users must authenticate using Internet Identity or other approved authentication methods. You are responsible for maintaining the confidentiality of your authentication credentials. You agree to notify SECOINFI immediately of any unauthorized access to your account. SECOINFI reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent, abusive, or illegal activities.`,
    },
    {
      number: 4,
      title: 'Data Storage and Security',
      content: `SECOINFI employs industry-standard security measures including Message-Locked Encryption (MLE), content-hash-based key generation, and blockchain-based storage on the Internet Computer. While we implement robust security protocols, you acknowledge that no system is completely secure. You are responsible for maintaining backups of critical data. SECOINFI is not liable for data loss resulting from user error, unauthorized access, or force majeure events.`,
    },
    {
      number: 5,
      title: 'Acceptable Use Policy',
      content: `You agree not to use the Services to: (a) store, transmit, or distribute illegal, harmful, or offensive content; (b) violate any applicable laws, regulations, or third-party rights; (c) interfere with or disrupt the Services or servers; (d) attempt unauthorized access to other accounts or systems; (e) distribute malware, viruses, or malicious code; (f) engage in activities that could harm SECOINFI's reputation or operations. SECOINFI reserves the right to remove content and terminate accounts that violate this policy.`,
    },
    {
      number: 6,
      title: 'Billing and Payment',
      content: `Services are billed based on storage usage (GB-month) and egress bandwidth using a cycle-based pricing model. Payment is processed through Stripe integration. You agree to provide accurate billing information and authorize SECOINFI to charge your payment method. Failure to pay may result in service suspension or termination. Storage quotas and billing plans are defined per tenant. Admin users may have unrestricted storage capabilities for testing purposes.`,
    },
    {
      number: 7,
      title: 'Intellectual Property Rights',
      content: `You retain all ownership rights to your data and content stored on the Services. By using the Services, you grant SECOINFI a limited license to store, process, and transmit your data as necessary to provide the Services. SECOINFI retains all rights to the platform, software, documentation, and related intellectual property. You may not reverse engineer, decompile, or attempt to extract source code from the Services.`,
    },
    {
      number: 8,
      title: 'Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, SECOINFI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICES. SECOINFI'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICES IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. SOME JURISDICTIONS DO NOT ALLOW LIMITATION OF LIABILITY, SO THESE LIMITATIONS MAY NOT APPLY TO YOU.`,
    },
    {
      number: 9,
      title: 'Service Modifications and Termination',
      content: `SECOINFI reserves the absolute right to modify, suspend, or discontinue the Services at any time with or without notice. We will make reasonable efforts to notify users of significant changes. You may terminate your account at any time by contacting SECOINFI. Upon termination, you are responsible for retrieving your data within thirty (30) days. SECOINFI may terminate accounts that violate these terms or remain inactive for extended periods. SECOINFI reserves the right to update or cancel these policies or Terms and Conditions at any time without prior notice.`,
    },
    {
      number: 10,
      title: 'Monetization and Admin Exemptions',
      content: `The platform supports file and folder monetization where uploaders/owners can define prices in USD. Users must pay the specified price before downloading or accessing monetized content. Payment is processed through Stripe/PayPal integration with webhook-based payout management. ADMIN USERS ARE EXPLICITLY EXEMPT FROM ALL MONETIZATION POLICIES AND PAYMENT REQUIREMENTS. Admin users have unrestricted access to all content regardless of pricing. File and folder owners always have free access to their own content. SECOINFI reserves the right to modify monetization policies at any time.`,
    },
    {
      number: 11,
      title: 'Governing Law and Dispute Resolution',
      content: `These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction where SECOINFI operates, without regard to conflict of law principles. Any disputes arising from these terms or the Services shall be resolved through binding arbitration in accordance with applicable arbitration rules. You agree to waive any right to a jury trial or to participate in a class action lawsuit. If any provision of these terms is found unenforceable, the remaining provisions shall remain in full force and effect.`,
    },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-lg text-muted-foreground">
            ICP Cloud Storage Services at Caffeine.ai
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Last Updated: December 8, 2025</span>
          </div>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please read these Terms and Conditions carefully before using Gateway Edge ICP Cloud Storage services. 
              These terms govern your access to and use of our services. By using our platform, you acknowledge that 
              you have read, understood, and agree to be bound by these terms.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.number} className="group hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-start gap-3">
                  <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary/20 transition-colors">
                    {section.number}
                  </span>
                  <span className="pt-0.5">{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="font-medium text-sm">Admin User Privileges</p>
                <p className="text-sm text-muted-foreground">
                  Admin users are exempt from all monetization policies and payment requirements. Admin users have 
                  unrestricted access to all platform content and features regardless of pricing or access restrictions. 
                  This exemption is permanent and cannot be revoked without explicit authorization from SECOINFI.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Company:</span> SECOINFI
              </p>
              <p>
                <span className="font-medium">Platform:</span> Gateway Edge (Caffeine.ai)
              </p>
              <p>
                <span className="font-medium">Email:</span>{' '}
                <a href="mailto:contact@secoinfi.com" className="text-primary hover:underline">
                  contact@secoinfi.com
                </a>
              </p>
              <p>
                <span className="font-medium">Website:</span>{' '}
                <a href="/contact" className="text-primary hover:underline">
                  Contact Page
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="font-medium text-sm">Important Notice - Policy Updates</p>
                <p className="text-sm text-muted-foreground">
                  SECOINFI RESERVES THE ABSOLUTE RIGHT TO UPDATE, MODIFY, OR CANCEL THESE TERMS AND CONDITIONS, 
                  POLICIES, OR ANY ASPECT OF THE SERVICES AT ANY TIME WITHOUT PRIOR NOTICE. Changes will be 
                  effective immediately upon posting to the platform. Your continued use of the Services after 
                  changes are posted constitutes acceptance of the modified terms. We recommend reviewing these 
                  terms periodically. SECOINFI is not obligated to provide notice of changes and bears no liability 
                  for any consequences resulting from policy modifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            By using Gateway Edge services, you acknowledge that you have read and understood these Terms and Conditions 
            and agree to be bound by them, including SECOINFI's right to modify or cancel policies at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
