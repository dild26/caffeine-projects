import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqPage() {
  const faqs = [
    {
      question: 'What is n8n?',
      answer: 'n8n is a powerful workflow automation tool that allows you to connect different services and automate tasks. Our marketplace provides pre-built workflows that you can purchase and deploy instantly.',
    },
    {
      question: 'How do I purchase a workflow?',
      answer: 'Simply browse our catalog, select a workflow you like, and click the purchase button. You\'ll be redirected to our secure Stripe checkout page to complete the payment.',
    },
    {
      question: 'What\'s the difference between subscription and pay-per-run?',
      answer: 'Subscription gives you unlimited access to a workflow for a monthly or yearly fee. Pay-per-run is a one-time purchase that gives you permanent access to that specific workflow.',
    },
    {
      question: 'Can I preview workflows before purchasing?',
      answer: 'Yes! You can view the workflow metadata, description, and even preview the JSON structure before making a purchase. However, you cannot download the workflow without purchasing it.',
    },
    {
      question: 'How do I deploy a purchased workflow?',
      answer: 'After purchase, you can download the workflow JSON file and import it directly into your n8n instance. Detailed instructions are provided with each workflow.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely! We use Stripe for payment processing, which is PCI-DSS compliant and trusted by millions of businesses worldwide. We never store your payment information.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'We offer refunds within 30 days of purchase if the workflow doesn\'t work as described. Please contact our support team with your order details.',
    },
    {
      question: 'How do I become a workflow creator?',
      answer: 'We\'re currently accepting applications from experienced n8n users. Contact us through our contact page to learn more about our creator program.',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 border-b-4 border-accent">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex justify-center mb-6">
              <img
                src="/assets/generated/faq-icon-transparent.dim_80x80.png"
                alt="FAQ"
                className="h-20 w-20"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-2 rounded-lg px-6 data-[state=open]:border-primary"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
