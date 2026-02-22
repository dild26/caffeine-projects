import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqPage() {
  const faqs = [
    {
      question: 'What is Internet Identity?',
      answer: 'Internet Identity is a blockchain-based authentication system that allows you to securely log in to applications without passwords. It uses cryptographic keys stored on your devices to verify your identity.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, your data is highly secure. Internet Identity uses advanced cryptography and stores your authentication credentials locally on your devices. No passwords or personal information are stored on centralized servers.'
    },
    {
      question: 'Can I use the same identity across multiple devices?',
      answer: 'Yes, you can add multiple devices to your Internet Identity. Each device will have its own cryptographic key, and you can manage all your devices from your identity settings.'
    },
    {
      question: 'What happens if I lose my device?',
      answer: 'If you lose a device, you can remove it from your Internet Identity using another registered device. This is why we recommend adding multiple devices to your identity for backup purposes.'
    },
    {
      question: 'Do I need to remember a password?',
      answer: 'No, Internet Identity is passwordless. You authenticate using biometrics (fingerprint, face recognition) or security keys on your devices, making it both more secure and convenient than traditional passwords.'
    },
    {
      question: 'Is there a cost to use this service?',
      answer: 'Basic authentication services are free for all users. Premium features and enterprise solutions may have associated costs. Contact us for more information about pricing.'
    },
    {
      question: 'How do I get started?',
      answer: 'Simply click the "Login" button in the header and follow the prompts to create your Internet Identity. The process takes just a few minutes and requires no personal information.'
    },
    {
      question: 'Can I delete my account?',
      answer: 'Yes, you have full control over your identity. You can delete your account at any time from your profile settings. This action is permanent and cannot be undone.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our service
          </p>
        </div>

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
      </div>
    </div>
  );
}
