import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, MessageCircle, ExternalLink, Globe, Wallet } from 'lucide-react';
import { Facebook, Linkedin, Send, MessageSquare, FileText, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Contact() {
  const businessAddress = "Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessAddress)}`;

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/dild26', icon: Facebook },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dild26', icon: Linkedin },
    { name: 'Telegram', url: 'https://t.me/dilee', icon: Send },
    { name: 'Discord', url: 'https://discord.com/users/dild26', icon: MessageSquare },
    { name: 'Blog', url: 'https://dildiva.blogspot.com', icon: FileText },
    { name: 'Instagram', url: 'https://instagram.com/newgoldenjewel', icon: Instagram },
    { name: 'Twitter/X', url: 'https://twitter.com/dil_sec', icon: Twitter },
    { name: 'YouTube', url: 'https://m.youtube.com/@dileepkumard4484/videos', icon: Youtube },
  ];

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact SECOINFI</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get in touch with us for property investment opportunities, partnerships, and inquiries about our services.
        </p>
      </div>

      {/* Leadership Section */}
      <Card className="mb-8 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Leadership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">DK</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">DILEEP KUMAR D</h3>
              <p className="text-muted-foreground">CEO & Founder of SECOINFI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
        {/* Primary Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Email</p>
                <a 
                  href="mailto:dild26@gmail.com" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  dild26@gmail.com
                </a>
                <p className="text-sm text-muted-foreground mt-1">For general inquiries & partnerships</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Business Phone</p>
                <a 
                  href="tel:+919620058644" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +91-962-005-8644
                </a>
                <p className="text-sm text-muted-foreground mt-1">Available during business hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <a 
                  href="https://wa.me/919620058644" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +91-962-005-8644
                </a>
                <p className="text-sm text-muted-foreground mt-1">Direct messaging support</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Website</p>
                <a 
                  href="http://www.seco.in.net" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  www.seco.in.net
                  <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-sm text-muted-foreground mt-1">Official company website</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Address */}
        <Card>
          <CardHeader>
            <CardTitle>Our Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium mb-2">Business Address</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sudha Enterprises<br />
                  No. 157, V R VIHAR<br />
                  VARADARAJ NAGAR<br />
                  VIDYARANYAPUR PO<br />
                  BANGALORE-560097
                </p>
              </div>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                View on Google Maps
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information */}
      <Card className="mb-8 max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Wallet className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-muted-foreground break-all">newgoldenjewel@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wallet className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">UPI ID</p>
                <p className="text-sm text-muted-foreground">secoin@uboi</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wallet className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">ETH ID</p>
                <p className="text-sm text-muted-foreground break-all">0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-2xl mx-auto">
        <a href="mailto:dild26@gmail.com" className="flex-1">
          <Button size="lg" className="w-full">
            <Mail className="h-5 w-5 mr-2" />
            Email Us
          </Button>
        </a>
        <a href="https://wa.me/919620058644" target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button size="lg" variant="outline" className="w-full">
            <MessageCircle className="h-5 w-5 mr-2" />
            WhatsApp
          </Button>
        </a>
      </div>

      {/* Call to Action */}
      <Card className="mb-8 max-w-4xl mx-auto bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-3 text-center">Ready to Get Started?</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Contact us today to learn more about our property investment opportunities and how SECoin can help you achieve your investment goals.
          </p>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Connect With Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent hover:border-primary transition-colors"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium text-center">{social.name}</span>
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
