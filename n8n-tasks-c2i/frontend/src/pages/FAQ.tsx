import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is n8n?',
    answer:
      'n8n is a powerful workflow automation tool that allows you to connect different apps and services to automate repetitive tasks. Our platform provides ready-to-use workflow templates to help you get started quickly.',
  },
  {
    question: 'How do I use the workflows?',
    answer:
      'Simply browse our catalog, download the workflow file, and import it into your n8n instance. Each workflow comes with documentation and can be customized to fit your specific needs.',
  },
  {
    question: 'What file formats are supported?',
    answer:
      'We support .json workflow files (native n8n format), .md documentation files, and .zip archives containing multiple files. All workflows are tested and ready to use.',
  },
  {
    question: 'Do I need a subscription?',
    answer:
      'We offer both free and premium workflows. Free workflows are available to everyone, while premium workflows require an active subscription. Subscribers get access to our entire catalog.',
  },
  {
    question: 'How does the referral program work?',
    answer:
      'Share your unique referral code with others. When they sign up and subscribe, you earn rewards. Check your dashboard for your referral code and track your earnings.',
  },
  {
    question: 'Can I upload my own workflows?',
    answer:
      'Yes! If you have admin access, you can upload workflows to share with the community. Contact us to learn more about becoming a contributor.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards through Stripe, as well as PAYU for additional payment options. All transactions are secure and encrypted.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel your subscription anytime from your dashboard. You\'ll continue to have access until the end of your billing period.',
  },
];

export default function FAQ() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our platform and services
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
