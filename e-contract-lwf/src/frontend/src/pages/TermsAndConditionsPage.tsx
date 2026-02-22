import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TermsAndConditionsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Terms & Conditions</h1>
        <p className="text-muted-foreground">Last updated: January 1, 2025</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6 text-muted-foreground">
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using the E-Contracts Management System, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">2. Use License</h3>
                <p className="mb-2">
                  Permission is granted to temporarily access the materials on E-Contracts Management System for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software</li>
                  <li>Remove any copyright or other proprietary notations</li>
                  <li>Transfer the materials to another person</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">3. User Accounts</h3>
                <p>
                  When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your account and for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">4. Intellectual Property</h3>
                <p>
                  The service and its original content, features, and functionality are and will remain the exclusive property of E-Contracts Management System and its licensors. The service is protected by copyright, trademark, and other laws.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">5. User Content</h3>
                <p>
                  You retain all rights to any content you submit, post, or display on or through the service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">6. Payment Terms</h3>
                <p>
                  Certain features of the service may require payment. You agree to provide current, complete, and accurate purchase and account information. All fees are non-refundable unless otherwise stated.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">7. Privacy Policy</h3>
                <p>
                  Your use of the service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">8. Termination</h3>
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">9. Limitation of Liability</h3>
                <p>
                  In no event shall E-Contracts Management System, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">10. Changes to Terms</h3>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-2">11. Contact Information</h3>
                <p>
                  If you have any questions about these Terms, please contact us at support@e-contracts.com.
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
