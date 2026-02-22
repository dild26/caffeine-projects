import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQ() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about SECOINFI
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Questions</CardTitle>
          <CardDescription>Learn about SECOINFI and how it works</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is SECOINFI?</AccordionTrigger>
              <AccordionContent>
                SECOINFI is a comprehensive business management platform built on the Internet Computer blockchain, 
                offering CRM, billing, and product management solutions with enterprise-grade security.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How secure is my data?</AccordionTrigger>
              <AccordionContent>
                Your data is stored on the Internet Computer blockchain with multi-tenant isolation, role-based 
                access control, and encrypted storage, ensuring maximum security and privacy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept payments through Stripe (credit/debit cards), PayPal, bank transfers, and UPI for 
                Indian customers. Additional payment providers can be configured by administrators.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I import my existing contacts?</AccordionTrigger>
              <AccordionContent>
                Yes, you can import contacts in bulk using CSV files. Navigate to the CRM page and use the 
                import functionality to upload your contact list.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features & Functionality</CardTitle>
          <CardDescription>Understanding SECOINFI capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What roles are available?</AccordionTrigger>
              <AccordionContent>
                SECOINFI supports four roles: Admin (full access), Sales (CRM and products), Billing (invoices 
                and payments), and Viewer (read-only access). Admins can assign roles to users.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I share my product catalog on WhatsApp?</AccordionTrigger>
              <AccordionContent>
                Yes, the platform includes WhatsApp catalog sharing functionality. This feature allows you to 
                share your product catalog directly with customers via WhatsApp.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do feature toggles work?</AccordionTrigger>
              <AccordionContent>
                Administrators can enable or disable specific features (CRM, Billing, Products, Analytics, Reports) 
                through the Admin Dashboard, allowing for flexible deployment based on organizational needs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
