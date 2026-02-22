import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Terms & Conditions</h1>
          <p className="text-muted-foreground">Please read these terms carefully</p>
        </div>
      </div>

      <Card className="border-2 shadow-lg">
        <CardContent className="prose dark:prose-invert max-w-none pt-6">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the SECoin platform, you accept and agree to be bound by the terms and
            provisions of this agreement. If you do not agree to these terms, please do not use our platform.
          </p>

          <h2>2. Investment Risks</h2>
          <p>
            Property investment carries inherent risks. The value of properties can go down as well as up, and you
            may not get back the amount you invested. Past performance is not indicative of future results.
          </p>

          <h2>3. User Responsibilities</h2>
          <p>Users are responsible for:</p>
          <ul>
            <li>Maintaining the security of their Internet Identity credentials</li>
            <li>Conducting their own due diligence before investing</li>
            <li>Understanding the risks associated with property investment</li>
            <li>Complying with all applicable laws and regulations</li>
          </ul>

          <h2>4. Platform Usage</h2>
          <p>
            SECoin provides a platform for fractional property investment. We do not provide investment advice.
            Users should consult with qualified financial advisors before making investment decisions.
          </p>

          <h2>5. Ownership and Rights</h2>
          <p>
            Fractional ownership is represented through blockchain tokens. Ownership rights are proportional to
            the number of tokens held and are subject to the terms of each specific property offering.
          </p>

          <h2>6. Fees and Charges</h2>
          <p>
            SECoin charges platform fees for transactions and property management services. All fees are disclosed
            before you complete any transaction. Fees are subject to change with prior notice.
          </p>

          <h2>7. Privacy and Data Protection</h2>
          <p>
            We are committed to protecting your privacy. Your personal information is stored securely and used
            only for platform operations. We do not sell or share your personal information with third parties
            without your consent.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            SECoin is not liable for any losses arising from property investments, market fluctuations, or
            platform usage. Our liability is limited to the maximum extent permitted by law.
          </p>

          <h2>9. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Users will be notified of significant changes.
            Continued use of the platform after changes constitutes acceptance of the modified terms.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be subject to the exclusive
            jurisdiction of the courts in Bangalore, Karnataka.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            For questions about these terms, please contact us at legal@secoin.com or through our contact page.
          </p>

          <p className="text-sm text-muted-foreground mt-8">Last updated: October 18, 2025</p>
        </CardContent>
      </Card>
    </div>
  );
}
