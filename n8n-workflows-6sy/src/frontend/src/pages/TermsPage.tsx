export default function TermsPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b-4 border-primary">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using the n8n Workflows marketplace, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-muted-foreground">
                Upon purchase, you are granted a non-exclusive, non-transferable license to use the workflow for your personal or commercial projects. You may not resell, redistribute, or share the workflow files with others.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. Payment Terms</h2>
              <p className="text-muted-foreground">
                All payments are processed securely through Stripe. Subscription fees are billed monthly or annually as selected. Pay-per-run purchases are one-time payments. All prices are in USD unless otherwise stated.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">4. Refund Policy</h2>
              <p className="text-muted-foreground">
                We offer refunds within 30 days of purchase if the workflow does not function as described. To request a refund, contact our support team with your order details and a description of the issue.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">5. User Accounts</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All workflows, content, and materials available on our platform are protected by intellectual property rights. The purchase of a workflow grants you a license to use it, but does not transfer ownership of the intellectual property.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                We are not liable for any damages arising from the use or inability to use our service, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the service after changes are posted constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us through our contact page or email us at support@n8nworkflows.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
