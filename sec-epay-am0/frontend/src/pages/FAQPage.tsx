import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is Secoinfi ePay?',
      answer: 'Secoinfi ePay is a decentralized financial platform that uses blockchain-inspired technology to provide secure, transparent, and efficient transaction processing. It supports QRC-based payments, multi-level transaction processing, and offers higher returns compared to traditional systems.',
    },
    {
      question: 'How do I get started?',
      answer: 'To get started, login using Internet Identity, complete your profile with your UPI/QRC details, and request approval from an administrator. Once approved, you can start making transactions and subscribing to the leaderboard.',
    },
    {
      question: 'What are Pay-Ins and Pay-Outs?',
      answer: 'Pay-Ins are deposits you make into the system, while Pay-Outs are withdrawals. Both can be done using QRC scanning or manual entry, and support both INR and USD currencies with automatic conversion.',
    },
    {
      question: 'How does the leaderboard work?',
      answer: 'The leaderboard displays top performers ranked by transaction totals and duration. You can subscribe to broadcast your QRC code on a rotating basis, with time-based cycles managed by the admin.',
    },
    {
      question: 'What is Merkle root validation?',
      answer: 'Merkle root validation is a cryptographic technique used to verify the integrity of transaction blocks. Each transaction is hashed and combined to create a Merkle root, ensuring that transactions cannot be tampered with.',
    },
    {
      question: 'How are transactions validated?',
      answer: 'Transactions go through multiple validation stages: pending (initial submission), OK (validated and approved), or rejected (failed validation). The system automatically calculates running balances and ensures they match transaction history.',
    },
    {
      question: 'What currencies are supported?',
      answer: 'Secoinfi ePay supports both INR (Indian Rupees) and USD (US Dollars) with automatic conversion. The current conversion rate is 1 USD = 90 INR, which can be adjusted by administrators.',
    },
    {
      question: 'How much does a subscription cost?',
      answer: 'Subscription fees are determined by administrators as an average global price. The current fee and rotation cycle can be viewed on the subscriptions page.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, Secoinfi ePay is built on the Internet Computer with blockchain-inspired security measures. All transactions are cryptographically secured, and complete audit trails are maintained for transparency.',
    },
    {
      question: 'How do I become an admin?',
      answer: 'The first user to initialize the system becomes the admin. Additional admins can be assigned by existing administrators through the admin panel.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about Secoinfi ePay
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>Everything you need to know about using Secoinfi ePay</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
