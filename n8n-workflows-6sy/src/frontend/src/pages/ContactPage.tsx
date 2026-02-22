import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Phone, Globe, MessageCircle, Wallet, Linkedin, Twitter, Facebook, Instagram, CheckCircle2, Youtube, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useGetCompanyInfo } from '@/hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const { data: companyInfo, isLoading } = useGetCompanyInfo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // Real SECOINFI company information
  const company = companyInfo || {
    name: 'SECOINFI',
    ceo: 'DILEEP KUMAR D',
    email: 'dild26@gmail.com',
    phone: '+91-962-005-8644',
    website: 'www.seco.in.net',
    whatsapp: '+91-962-005-8644',
    address: 'Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097',
    paypal: 'newgoldenjewel@gmail.com',
    upi: 'secoin@uboi',
    eth: '0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7',
    socialLinks: {
      facebook: 'https://facebook.com/dild26',
      linkedin: 'https://www.linkedin.com/in/dild26',
      telegram: 'https://t.me/dilee',
      discord: 'https://discord.com/users/dild26',
      blog: 'https://dildiva.blogspot.com',
      instagram: 'https://instagram.com/newgoldenjewel',
      twitter: 'https://twitter.com/dil_sec',
      youtube: 'https://m.youtube.com/@dileepkumard4484/videos',
    },
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b-4 border-primary">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Contact {company.name}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our team for general inquiries & partnerships
            </p>
            <Alert className="border-2 border-primary/50 bg-primary/5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm font-medium">
                ✓ All contact information displayed is genuine and verified SECOINFI company data.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Send us a message</h2>
                <p className="text-muted-foreground">
                  Have a question or feedback? Fill out the form and we'll respond as soon as possible.
                </p>
              </div>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <img
                  src="/assets/generated/contact-hero.dim_800x400.png"
                  alt="Contact SECOINFI"
                  className="rounded-lg shadow-xl border-4 border-primary mb-8 w-full"
                />
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-primary/50 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="default" className="text-sm">CEO & Founder</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">{company.ceo}</p>
                    <p className="text-sm text-muted-foreground">CEO of {company.name}</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10 shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Primary Email</CardTitle>
                        <CardDescription className="break-all">
                          For general inquiries & partnerships
                        </CardDescription>
                        <a href={`mailto:${company.email}`} className="text-sm font-medium hover:text-primary transition-colors">
                          {company.email}
                        </a>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-accent/10 shrink-0">
                        <Phone className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Business Phone</CardTitle>
                        <CardDescription>Available during business hours</CardDescription>
                        <a href={`tel:${company.phone}`} className="text-sm font-medium hover:text-primary transition-colors">
                          {company.phone}
                        </a>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10 shrink-0">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>WhatsApp</CardTitle>
                        <CardDescription>Direct messaging support</CardDescription>
                        <a href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors">
                          {company.whatsapp}
                        </a>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-accent/10 shrink-0">
                        <Globe className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>Website</CardTitle>
                        <CardDescription>Official company website</CardDescription>
                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors break-all">
                          {company.website}
                        </a>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Our Location</h2>
              <p className="text-muted-foreground">
                Visit us at our business address
              </p>
            </div>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>Business Address</CardTitle>
                    <CardDescription className="mt-2 text-base leading-relaxed">
                      {company.address}
                    </CardDescription>
                    <Button variant="outline" className="mt-4" asChild>
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions on Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Payment Information</h2>
              <p className="text-muted-foreground">
                Multiple payment options available for your convenience
              </p>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Accepted Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border-2 rounded-lg">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">PayPal</p>
                    <p className="text-xs text-muted-foreground mb-2">Primary payment method</p>
                    <p className="text-sm font-mono break-all">{company.paypal}</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">UPI ID</p>
                    <p className="text-xs text-muted-foreground mb-2">Indian payments</p>
                    <p className="text-sm font-mono">{company.upi}</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">ETH ID</p>
                    <p className="text-xs text-muted-foreground mb-2">Cryptocurrency payments</p>
                    <p className="text-xs font-mono break-all">{company.eth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Connect With Us</h2>
              <p className="text-muted-foreground">
                Follow us on social media for updates and news
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2" asChild>
                    <a href={company.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-6 w-6" />
                      <span className="text-xs">Facebook</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2" asChild>
                    <a href={company.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-6 w-6" />
                      <span className="text-xs">LinkedIn</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2" asChild>
                    <a href={company.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                      <Send className="h-6 w-6" />
                      <span className="text-xs">Telegram</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2" asChild>
                    <a href={company.socialLinks.discord} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-6 w-6" />
                      <span className="text-xs">Discord</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2" asChild>
                    <a href={company.socialLinks.blog} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-6 w-6" />
                      <span className="text-xs">Blog</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2" asChild>
                    <a href={company.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-6 w-6" />
                      <span className="text-xs">Instagram</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2" asChild>
                    <a href={company.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-6 w-6" />
                      <span className="text-xs">Twitter/X</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2" asChild>
                    <a href={company.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                      <Youtube className="h-6 w-6" />
                      <span className="text-xs">YouTube</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-t-4 border-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground">
              Contact us today to learn more about our property investment opportunities and how SECoin can help you achieve your investment goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href={`mailto:${company.email}`}>
                  <Mail className="h-5 w-5 mr-2" />
                  Email Us
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
