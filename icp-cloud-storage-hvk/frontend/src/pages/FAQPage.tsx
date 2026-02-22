import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is Gateway Edge?',
      answer: 'Gateway Edge is a multi-tenant cloud storage platform built on the Internet Computer blockchain. It provides secure, scalable, and decentralized file storage with enterprise-grade features.',
    },
    {
      question: 'How secure is my data?',
      answer: 'Your data is protected with end-to-end encryption, strict tenant isolation, role-based access control, and distributed storage across multiple canisters. We recommend client-side encryption for sensitive data.',
    },
    {
      question: 'What are the storage limits?',
      answer: 'Storage quotas are configurable per tenant. The platform supports autoscaling to meet growing storage demands. Contact your administrator for specific quota information.',
    },
    {
      question: 'How does billing work?',
      answer: 'Billing is based on storage usage (GB-month) and egress bandwidth. The system automatically tracks usage and generates invoices. Payment processing is handled through Stripe integration.',
    },
    {
      question: 'Can I access my files programmatically?',
      answer: 'Yes, the platform provides presigned URLs for secure file uploads and downloads. You can integrate with external systems using our provisioning APIs and webhook endpoints.',
    },
    {
      question: 'What happens if a canister fails?',
      answer: 'The platform includes cross-canister replication and automated integrity checks. If a canister fails, your data remains accessible through replica canisters, and the system automatically initiates repair mechanisms.',
    },
    {
      question: 'How do I get started?',
      answer: 'Sign in with Internet Identity to create your account. First-time users will be prompted to set up their profile. Once configured, you can immediately start uploading and managing files.',
    },
    {
      question: 'Is there a rate limit?',
      answer: 'Yes, the platform enforces a rate limit of 1000 requests per minute per tenant to ensure fair resource allocation and system stability.',
    },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about Gateway Edge
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Still have questions? <a href="/contact" className="text-primary hover:underline font-medium">Contact us</a> for more information.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
