import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Card, CardContent } from '../components/ui/card';

export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I upload CSV data?',
      answer: 'Navigate to the Admin Panel (admin access required) and use the CSV Upload tab. Paste your CSV content following the provided format examples for resources or instructors.',
    },
    {
      question: 'How are fees converted from Rs to USD?',
      answer: 'Fees are automatically converted using the formula: USD = Rs / 90. This conversion happens automatically when you upload resources with fees in Rupees.',
    },
    {
      question: 'How does hashtag search work?',
      answer: 'Use the Explore page to search for resources and instructors by hashtags. Simply enter a hashtag (with or without the # symbol) and click Search to find matching items.',
    },
    {
      question: 'Can I book multiple appointments?',
      answer: 'Yes! You can book as many appointments as needed. Go to the Appointments page, click "Book Appointment", and fill in the required details including learner ID, instructor, resource, and time slot.',
    },
    {
      question: 'What is the resource verification process?',
      answer: 'When resources are uploaded, they are initially marked as unverified. Admin users can review pending resources in the Admin Panel and approve them for public visibility.',
    },
    {
      question: 'How do I track learner progress?',
      answer: 'Learner progress is tracked automatically by topic, pace, language, and difficulty level. You can view progress details in the Dashboard and through the learner management features.',
    },
    {
      question: 'What file formats are supported for uploads?',
      answer: 'The platform supports CSV, JSON, and MD (Markdown) formats for data uploads. CSV is the primary format for bulk data import.',
    },
    {
      question: 'How does the appointment booking optimization work?',
      answer: 'The system uses a Merkle root nonce mechanism to optimize booking logic, ensuring efficient scheduling and preventing conflicts.',
    },
    {
      question: 'Can I view instructor availability?',
      answer: 'Yes! Each instructor profile displays their availability time slots. You can view this information on the Instructors page or when booking an appointment.',
    },
    {
      question: 'What is the external content synchronization feature?',
      answer: 'The Contact page can synchronize with external content sources on a daily or session basis. The system detects changes and updates the local cache automatically.',
    },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about the E-Tutorial platform.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto bg-muted/50">
        <CardContent className="pt-6 text-center space-y-4">
          <h3 className="text-xl font-bold">Still have questions?</h3>
          <p className="text-muted-foreground">
            Can't find the answer you're looking for? Visit our Contact page to get in touch with our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
