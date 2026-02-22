import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGetContactInfo } from '../hooks/useAppQueries';
import { Mail, Phone, MapPin, User, ExternalLink, Wallet, Globe, MessageCircle } from 'lucide-react';
import { SiFacebook, SiX, SiLinkedin, SiInstagram, SiYoutube, SiTelegram, SiDiscord, SiBlogger } from 'react-icons/si';

export default function ContactPage() {
  const { data: contactInfo, isLoading } = useGetContactInfo();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading contact information...</p>
        </div>
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Contact information not available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Contact Us – Get in touch with SECOINFI</h1>
        </div>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>CEO & Founder</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{contactInfo.ceoName}, CEO of SECOINFI</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Primary Email</p>
              </div>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-lg text-primary hover:underline"
              >
                {contactInfo.email}
              </a>
              <p className="text-sm text-muted-foreground mt-1">General inquiries & partnerships</p>
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Phone className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Business Phone</p>
              </div>
              <a 
                href={`tel:${contactInfo.phone}`}
                className="text-lg text-primary hover:underline"
              >
                {contactInfo.phone}
              </a>
              <p className="text-sm text-muted-foreground mt-1">Available during business hours</p>
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Website</p>
              </div>
              <a 
                href="https://www.seco.in.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-primary hover:underline inline-flex items-center gap-2"
              >
                www.seco.in.net
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="text-sm text-muted-foreground mt-1">Official company website</p>
            </div>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
              </div>
              <a 
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-primary hover:underline inline-flex items-center gap-2"
              >
                {contactInfo.whatsapp}
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="text-sm text-muted-foreground mt-1">Direct messaging support</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Business Address</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{contactInfo.address}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a 
                  href={contactInfo.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  View on OpenStreetMap
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a 
                  href={contactInfo.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  View on Google Maps
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <CardTitle>Payment Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">PayPal</p>
                <p className="font-mono text-sm break-all">{contactInfo.paymentMethods.paypal}</p>
                <p className="text-xs text-muted-foreground mt-2">Primary payment method</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">UPI ID</p>
                <p className="font-mono text-sm break-all">{contactInfo.paymentMethods.upi}</p>
                <p className="text-xs text-muted-foreground mt-2">Indian payments</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">ETH ID</p>
                <p className="font-mono text-xs break-all">{contactInfo.paymentMethods.eth}</p>
                <p className="text-xs text-muted-foreground mt-2">Cryptocurrency payments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-base">
              Contact us today for investment opportunities and partnerships
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="inline-flex items-center gap-2"
                >
                  <Mail className="h-5 w-5" />
                  Email Us
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a 
                  href="https://wa.me/919620058644"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Connect With Us</CardTitle>
            <CardDescription>Follow us on social media</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="lg">
                <a 
                  href={contactInfo.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <SiFacebook className="h-5 w-5" />
                  Facebook
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href={contactInfo.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <SiLinkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href={contactInfo.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <SiTelegram className="h-5 w-5" />
                  Telegram
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href={contactInfo.socialLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <SiDiscord className="h-5 w-5" />
                  Discord
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href={contactInfo.socialLinks.blogspot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <SiBlogger className="h-5 w-5" />
                  Blogspot
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href={contactInfo.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <SiInstagram className="h-5 w-5" />
                  Instagram
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href={contactInfo.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <SiX className="h-5 w-5" />
                  X (Twitter)
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a 
                  href={contactInfo.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <SiYoutube className="h-5 w-5" />
                  YouTube
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
