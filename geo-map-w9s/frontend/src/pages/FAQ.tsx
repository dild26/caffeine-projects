import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQ() {
  const faqs = [
    {
      question: 'What is GPS Grid Maps?',
      answer: 'GPS Grid Maps is an advanced geospatial mapping application that provides interactive 3D globe and 2D map views with customizable grid overlays and precision pin placement.',
    },
    {
      question: 'How do I place a pin?',
      answer: 'You can place pins by entering latitude, longitude, and altitude coordinates in the control panel, or by clicking directly on the map.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Stripe (credit/debit cards), PayPal, UPI, and Demand Draft (DD) for subscriptions.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, premium subscribers can export their pins, polygons, and operation logs in various formats.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all operations are logged with Ed25519 signatures and stored on the Internet Computer blockchain for maximum security and immutability.',
    },
  ];

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about GPS Grid Maps
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
