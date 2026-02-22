import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FAQPage() {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);

  const faqsPage1 = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first contract?',
          a: 'After logging in, click the "New Contract" button in the dashboard. You can either start from a template or create a custom contract from scratch. Fill in the required fields and save as a draft to continue editing later.',
        },
        {
          q: 'Do I need technical knowledge to use E-Contracts?',
          a: 'No technical knowledge is required. Our platform is designed to be user-friendly and intuitive. We also provide comprehensive tutorials and 24/7 support to help you get started.',
        },
        {
          q: 'How do I invite others to sign a contract?',
          a: 'In the contract editor, add the email addresses of all parties who need to sign. They will receive an invitation link to review and sign the contract digitally.',
        },
      ],
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          q: 'How secure are my contracts?',
          a: 'Your contracts are stored on the blockchain with military-grade encryption. This ensures they are tamper-proof and secure. We use advanced cryptographic techniques to protect your data.',
        },
        {
          q: 'Who can access my contracts?',
          a: 'Only you and the parties you explicitly invite can access your contracts. We implement strict role-based access control to ensure privacy and security.',
        },
        {
          q: 'Is my data backed up?',
          a: 'Yes, all data is automatically backed up on the blockchain network. The decentralized nature of blockchain ensures your contracts are always available and cannot be lost.',
        },
      ],
    },
  ];

  const faqsPage2 = [
    {
      category: 'Features',
      questions: [
        {
          q: 'What are voice commands?',
          a: 'Voice commands allow you to navigate and control the platform using your voice. You can create contracts, search, and perform various actions hands-free using natural language.',
        },
        {
          q: 'How does text-to-speech work?',
          a: 'Hover over any contract to hear its content read aloud. This feature enhances accessibility and allows you to review contracts while multitasking.',
        },
        {
          q: 'Can I use templates?',
          a: 'Yes, we provide a library of professionally designed templates for common contract types. You can customize these templates to fit your specific needs.',
        },
      ],
    },
    {
      category: 'Billing & Plans',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, and cryptocurrency payments. Enterprise customers can also arrange for invoice-based billing.',
        },
        {
          q: 'Can I cancel my subscription anytime?',
          a: 'Yes, you can cancel your subscription at any time. Your contracts will remain accessible, but you won\'t be able to create new ones after cancellation.',
        },
        {
          q: 'Is there a free trial?',
          a: 'Yes, we offer a 14-day free trial with full access to all features. No credit card required to start your trial.',
        },
      ],
    },
  ];

  const currentFaqs = currentPage === 1 ? faqsPage1 : faqsPage2;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-4 text-primary">
            <HelpCircle className="h-12 w-12" />
          </div>
          <h1 className="mb-4 text-5xl font-bold">Frequently Asked Questions</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Find answers to common questions about E-Contracts
          </p>
        </div>

        {/* FAQ Header Image */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-border/50 shadow-lg">
          <img 
            src="/assets/generated/faq-header.dim_600x200.png" 
            alt="FAQ" 
            className="h-auto w-full"
          />
        </div>

        {/* Page Navigation */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <Button
            variant={currentPage === 1 ? 'default' : 'outline'}
            onClick={() => setCurrentPage(1)}
            className="min-w-[120px]"
          >
            Page 1
          </Button>
          <Button
            variant={currentPage === 2 ? 'default' : 'outline'}
            onClick={() => setCurrentPage(2)}
            className="min-w-[120px]"
          >
            Page 2
          </Button>
        </div>

        {/* Topic Overview - Centered */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-3xl font-bold">Topics on This Page</h2>
          <div className="mx-auto max-w-2xl">
            <div className="grid gap-4 md:grid-cols-2">
              {currentFaqs.map((section, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-xl">{section.category}</CardTitle>
                    <CardDescription>
                      {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {currentFaqs.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-center text-2xl">{section.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Page Navigation - Bottom */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of 2
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(2)}
            disabled={currentPage === 2}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Still Have Questions?</h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
        </div>
      </div>
    </div>
  );
}
