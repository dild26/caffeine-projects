import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Globe, MessageCircle, Wallet, ExternalLink } from 'lucide-react';
import { SiFacebook, SiLinkedin, SiTelegram, SiDiscord, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import { useGetContactInfo } from '../hooks/useQueries';

export default function ContactPage() {
  const { data: contactInfo, isLoading } = useGetContactInfo();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contact information...</p>
        </div>
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Contact information unavailable</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with the Secoinfi ePay team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                {contactInfo.email}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Phone className="mr-2 h-5 w-5 text-primary" />
                Business Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href={`tel:${contactInfo.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                {contactInfo.phone}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                {contactInfo.whatsapp}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Globe className="mr-2 h-5 w-5 text-primary" />
                Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                {contactInfo.website}
              </a>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Business Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{contactInfo.address}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={contactInfo.mapLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Click to view on map
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={contactInfo.googleMapsLink} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2 h-4 w-4" />
                    Get directions
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">PayPal</p>
                <p className="text-muted-foreground font-mono text-sm">{contactInfo.paypal}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">UPI ID</p>
                <p className="text-muted-foreground font-mono text-sm">{contactInfo.upiId}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">ETH ID</p>
                <p className="text-muted-foreground font-mono text-xs break-all">{contactInfo.ethId}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CEO & Founder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{contactInfo.ceo}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connect With Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer">
                  <SiFacebook className="mr-2 h-4 w-4" />
                  Facebook
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <SiLinkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={contactInfo.telegram} target="_blank" rel="noopener noreferrer">
                  <SiTelegram className="mr-2 h-4 w-4" />
                  Telegram
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={contactInfo.discord} target="_blank" rel="noopener noreferrer">
                  <SiDiscord className="mr-2 h-4 w-4" />
                  Discord
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={contactInfo.blog} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Blog
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">
                  <SiInstagram className="mr-2 h-4 w-4" />
                  Instagram
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer">
                  <SiX className="mr-2 h-4 w-4" />
                  X/Twitter
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer">
                  <SiYoutube className="mr-2 h-4 w-4" />
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
