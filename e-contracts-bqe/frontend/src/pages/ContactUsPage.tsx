import { useState } from 'react';
import { useSubmitContactForm, useGetContactInfo } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, MessageCircle, Globe, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const submitForm = useSubmitContactForm();
  const { data: contactInfo, isLoading: contactInfoLoading } = useGetContactInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await submitForm.mutateAsync({ name, email, message });
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const socialMediaLinks = contactInfo ? [
    { icon: Facebook, label: 'Facebook', url: contactInfo.socialMedia.facebook, color: 'text-blue-600' },
    { icon: Linkedin, label: 'LinkedIn', url: contactInfo.socialMedia.linkedin, color: 'text-blue-700' },
    { icon: MessageCircle, label: 'Telegram', url: contactInfo.socialMedia.telegram, color: 'text-sky-500' },
    { icon: MessageCircle, label: 'Discord', url: contactInfo.socialMedia.discord, color: 'text-indigo-600' },
    { icon: Globe, label: 'Blogspot', url: contactInfo.socialMedia.blogspot, color: 'text-orange-600' },
    { icon: Instagram, label: 'Instagram', url: contactInfo.socialMedia.instagram, color: 'text-pink-600' },
    { icon: Twitter, label: 'X/Twitter', url: contactInfo.socialMedia.twitter, color: 'text-gray-900 dark:text-gray-100' },
    { icon: Youtube, label: 'YouTube', url: contactInfo.socialMedia.youtube, color: 'text-red-600' },
  ] : [];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={submitForm.isPending}
                >
                  {submitForm.isPending ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & Illustration */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border/50 shadow-lg">
              <img 
                src="/assets/generated/secoinfi-contact-illustration.dim_400x300.png" 
                alt="Contact SECOINFI" 
                className="h-auto w-full"
              />
            </div>

            {contactInfoLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center gap-4 pb-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : contactInfo ? (
              <>
                <div className="space-y-4">
                  {/* Company & CEO */}
                  <Card className="transition-all hover:shadow-md hover:border-primary/50">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">{contactInfo.companyName}</CardTitle>
                      <CardDescription>CEO & Founder: {contactInfo.ceoName}</CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Call-to-Action Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="w-full gap-2"
                    >
                      <a href={`mailto:${contactInfo.email}`}>
                        <Mail className="h-5 w-5" />
                        Email Us
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <a
                        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>

                  {/* Email */}
                  <Card className="transition-all hover:shadow-md hover:border-primary/50">
                    <CardHeader className="flex flex-row items-center gap-4 pb-4">
                      <div className="rounded-lg bg-primary/10 p-3 text-primary">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Email</CardTitle>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.email}
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">For general inquiries & partnerships</p>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Phone & WhatsApp */}
                  <Card className="transition-all hover:shadow-md hover:border-primary/50">
                    <CardHeader className="flex flex-row items-center gap-4 pb-4">
                      <div className="rounded-lg bg-green-500/10 p-3 text-green-500">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Business Phone & WhatsApp</CardTitle>
                        <a
                          href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.phone}
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">Available during business hours, direct messaging support</p>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Website */}
                  <Card className="transition-all hover:shadow-md hover:border-primary/50">
                    <CardHeader className="flex flex-row items-center gap-4 pb-4">
                      <div className="rounded-lg bg-primary/10 p-3 text-primary">
                        <Globe className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Website</CardTitle>
                        <a
                          href={`https://${contactInfo.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.website}
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">Official company website</p>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Address */}
                  <Card className="transition-all hover:shadow-md hover:border-primary/50">
                    <CardHeader className="flex flex-row items-center gap-4 pb-4">
                      <div className="rounded-lg bg-primary/10 p-3 text-primary">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Business Address</CardTitle>
                        <a
                          href={contactInfo.mapLocation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.address}
                        </a>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* Call to Action Section */}
                <Card className="bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-xl">Ready to Get Started?</CardTitle>
                    <CardDescription className="text-base">
                      Contact us today to learn more about our property investment opportunities and how SECoin can help you achieve your investment goals.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Social Media */}
                <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
                  <CardHeader>
                    <CardTitle>Connect With Us</CardTitle>
                    <CardDescription>Follow us on social media for updates and news</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {socialMediaLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm transition-all hover:border-primary hover:shadow-md"
                          aria-label={social.label}
                        >
                          <social.icon className={`h-4 w-4 ${social.color}`} />
                          <span>{social.label}</span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>We accept the following payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                        <span className="text-sm font-medium">PayPal</span>
                        <span className="text-xs text-muted-foreground">{contactInfo.paymentMethods.paypal}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                        <span className="text-sm font-medium">UPI ID</span>
                        <span className="text-xs text-muted-foreground">{contactInfo.paymentMethods.upi}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                        <span className="text-sm font-medium">ETH ID</span>
                        <span className="text-xs text-muted-foreground break-all">{contactInfo.paymentMethods.eth}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
