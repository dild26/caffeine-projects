import { Card, CardContent } from '@/components/ui/card';

export default function TermsConditions() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Terms & Conditions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Please read these terms carefully before using SECOINFI
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using SECOINFI, you accept and agree to be bound by the terms and provisions 
              of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily access SECOINFI for personal or commercial use. This is 
              the grant of a license, not a transfer of title, and under this license you may not modify or 
              copy the materials, use the materials for any commercial purpose without proper authorization, 
              or attempt to decompile or reverse engineer any software contained on SECOINFI.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account and password. You agree 
              to accept responsibility for all activities that occur under your account. SECOINFI reserves 
              the right to refuse service, terminate accounts, or remove content at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Data Privacy</h2>
            <p className="text-muted-foreground">
              We are committed to protecting your privacy. All data is stored securely on the Internet Computer 
              blockchain with multi-tenant isolation. We do not share your data with third parties without 
              your explicit consent, except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Payment Terms</h2>
            <p className="text-muted-foreground">
              Payment for services is processed through secure third-party payment providers. All fees are 
              non-refundable unless otherwise stated. We reserve the right to change our pricing at any time 
              with prior notice to users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              SECOINFI shall not be liable for any damages arising from the use or inability to use our service, 
              including but not limited to direct, indirect, incidental, punitive, and consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting to the platform. Your continued use of SECOINFI after changes constitutes acceptance 
              of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms & Conditions, please contact us at contact@secoinfi.com.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
