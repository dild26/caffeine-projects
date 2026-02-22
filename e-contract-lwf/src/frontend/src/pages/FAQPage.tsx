import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is an e-contract?',
      answer: 'An e-contract is a digital version of a traditional contract that is created, signed, and stored electronically. It has the same legal validity as a paper contract but offers enhanced security, faster processing, and easier management.',
    },
    {
      question: 'How secure are e-contracts?',
      answer: 'E-contracts on our platform are highly secure. We use blockchain technology for verification, SHA-256 hashing for file integrity, and bank-level encryption for data storage. All contracts are tamper-proof and maintain a complete audit trail.',
    },
    {
      question: 'Can I upload multiple files at once?',
      answer: 'Yes! Our platform supports bulk uploads of 51+ files in a single session. We accept .json, .md, .txt, and .zip formats with automatic pairing and deduplication.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We support multiple payment methods including Stripe (credit/debit cards), PayPal, UPI, and cryptocurrency (Ethereum). All transactions are secure and encrypted.',
    },
    {
      question: 'How do I get started?',
      answer: 'Simply log in with Internet Identity, set up your profile, and you can immediately start creating contracts, uploading files, or browsing templates. No credit card required to get started.',
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Our web platform is fully responsive and works seamlessly on mobile devices. A dedicated mobile app is currently in development and will be available soon.',
    },
    {
      question: 'Can I customize contract templates?',
      answer: 'Absolutely! Our dynamic template engine allows you to create custom templates with JSON schema parsing, custom fields, and markdown support. You can also modify existing templates to suit your needs.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'You maintain full ownership of your data. You can export all your contracts and files at any time. We also provide backup and restore functionality to ensure your data is never lost.',
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes! We provide 24/7 customer support through email, chat, and phone. Our dedicated support team is always ready to help you with any questions or issues.',
    },
    {
      question: 'Are e-contracts legally binding?',
      answer: 'Yes, e-contracts are legally binding in most jurisdictions worldwide. Our platform complies with international e-signature laws including ESIGN Act and eIDAS regulations.',
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our e-contract management platform
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>Click on any question to see the answer</CardDescription>
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

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
            <CardDescription>
              Can't find the answer you're looking for? Please contact our support team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="/contact-us"
              className="text-primary hover:underline font-medium"
            >
              Contact Support →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
