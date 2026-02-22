import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Mail, Phone, MapPin, Wallet, Globe, MessageCircle } from 'lucide-react';
import { SiFacebook, SiLinkedin, SiInstagram, SiYoutube, SiX } from 'react-icons/si';

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Get in touch with SECOINFI
          </h1>
          <p className="text-lg text-muted-foreground">
            We're here to help and answer any questions you might have
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                CEO & Founder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-lg">DILEEP KUMAR D</p>
                <p className="text-sm text-muted-foreground">CEO of SECOINFI</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-1">Primary Email</p>
                <a
                  href="mailto:dild26@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline block"
                >
                  dild26@gmail.com
                </a>
                <p className="text-xs text-muted-foreground mt-1">General inquiries & partnerships</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Business Phone</p>
                <a
                  href="tel:+919620058644"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline block"
                >
                  +91-962-005-8644
                </a>
                <p className="text-xs text-muted-foreground mt-1">Available during business hours</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Website</p>
                <a
                  href="http://www.seco.in.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  www.seco.in.net
                </a>
                <p className="text-xs text-muted-foreground mt-1">Official company website</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">WhatsApp</p>
                <a
                  href="https://wa.me/919620058644"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="h-3 w-3" />
                  +91-962-005-8644
                </a>
                <p className="text-xs text-muted-foreground mt-1">Direct messaging support</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Business Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-semibold mb-2">Sudha Enterprises</p>
                <p className="text-sm">
                  No. 157, V R VIHAR, VARADARAJ NAGAR<br />
                  VIDYARANYAPUR PO<br />
                  BANGALORE-560097
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=No.+157+V+R+VIHAR+VARADARAJ+NAGAR+VIDYARANYAPUR+PO+BANGALORE+560097"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <MapPin className="h-4 w-4" />
                Click to view on map
              </a>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold mb-1">PayPal</p>
                  <a
                    href="mailto:newgoldenjewel@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    newgoldenjewel@gmail.com
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Primary payment method</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">UPI ID</p>
                  <p className="text-sm text-muted-foreground break-all">
                    secoin@uboi
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Indian payments</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">ETH ID</p>
                  <p className="text-xs text-muted-foreground break-all font-mono">
                    0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Cryptocurrency payments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Our Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Click on the map to open in Google Maps for directions.
              </p>
              <a
                href="https://maps.google.com/?q=No.+157+V+R+VIHAR+VARADARAJ+NAGAR+VIDYARANYAPUR+PO+BANGALORE+560097"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full aspect-video bg-muted rounded-lg items-center justify-center hover:bg-accent transition-colors border border-border"
              >
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 mx-auto text-primary" />
                  <p className="text-sm font-medium">View Location on Google Maps</p>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 to-cyan-500/10 border-primary/20">
            <CardHeader>
              <CardTitle>Ready to Get Started?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Contact us today to learn more about our investment opportunities for VCs and how SECoin can help you achieve your investment goals.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href="mailto:dild26@gmail.com" target="_blank" rel="noopener noreferrer">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Us
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://wa.me/919620058644" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Connect With Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://facebook.com/dild26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <SiFacebook className="h-5 w-5 text-[#1877F2]" />
                  <span className="text-sm font-medium">Facebook</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/dild26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <SiLinkedin className="h-5 w-5 text-[#0A66C2]" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
                <a
                  href="https://t.me/dilee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#0088cc]" />
                  <span className="text-sm font-medium">Telegram</span>
                </a>
                <a
                  href="https://discord.com/users/dild26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#5865F2]" />
                  <span className="text-sm font-medium">Discord</span>
                </a>
                <a
                  href="https://dildiva.blogspot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <Globe className="h-5 w-5 text-[#FF5722]" />
                  <span className="text-sm font-medium">Blogspot</span>
                </a>
                <a
                  href="https://instagram.com/newgoldenjewel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <SiInstagram className="h-5 w-5 text-[#E4405F]" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a
                  href="https://twitter.com/dil_sec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <SiX className="h-5 w-5" />
                  <span className="text-sm font-medium">X (Twitter)</span>
                </a>
                <a
                  href="https://m.youtube.com/@dileepkumard4484/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <SiYoutube className="h-5 w-5 text-[#FF0000]" />
                  <span className="text-sm font-medium">YouTube</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
