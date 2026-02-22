import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Clock, 
  Building,
  User,
  MessageSquare,
  Send,
  Linkedin,
  Twitter,
  Github,
  Calendar,
  CreditCard,
  HeadphonesIcon,
  Facebook,
  Instagram,
  MessageCircle,
  Youtube,
  Wallet,
  DollarSign
} from 'lucide-react';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'gods-eye' | 'admin' | 'analytics' | 'exports' | 'monitoring' | 'admin-panel';

interface ContactUsPageProps {
  onNavigate: (page: Page) => void;
}

export default function ContactUsPage({ onNavigate }: ContactUsPageProps) {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6"
      style={{
        backgroundImage: 'url(/assets/generated/network-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Contact Sudha Enterprises
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with our team for support, partnerships, or any inquiries about our platform
          </p>
        </div>

        {/* Main Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Primary Contact */}
          <Card className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Primary Business Contact
              </CardTitle>
              <CardDescription>
                Reach out to our main office for general inquiries and business partnerships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">CEO & Founder</p>
                    <p className="text-lg font-semibold">DILEEP KUMAR D</p>
                    <p className="text-sm text-muted-foreground">CEO of SECOINFI</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Primary Email</p>
                    <a 
                      href="mailto:dild26@gmail.com" 
                      className="text-green-500 hover:underline text-lg"
                    >
                      dild26@gmail.com
                    </a>
                    <p className="text-sm text-muted-foreground">General inquiries & partnerships</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Business Phone</p>
                    <a 
                      href="tel:+91-962-005-8644" 
                      className="text-blue-500 hover:underline text-lg"
                    >
                      +91-962-005-8644
                    </a>
                    <p className="text-sm text-muted-foreground">Available during business hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Website</p>
                    <a 
                      href="https://www.seco.in.net" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-500 hover:underline text-lg"
                    >
                      https://www.seco.in.net
                    </a>
                    <p className="text-sm text-muted-foreground">Official company website</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600/10 border border-green-600/20 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a 
                      href="https://wa.me/919620058644" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-lg"
                    >
                      https://wa.me/919620058644
                    </a>
                    <p className="text-sm text-muted-foreground">Direct messaging support</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Address & Payment Info */}
          <Card className="cyber-gradient border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                Business Address & Payment
              </CardTitle>
              <CardDescription>
                Our physical location and payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">Business Address</p>
                    <a 
                      href="https://www.openstreetmap.org/way/1417238145"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:underline text-sm leading-relaxed block"
                    >
                      Sudha Enterprises | No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097
                    </a>
                    <p className="text-sm text-muted-foreground">Click to view on map</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Payment Information:</h4>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                      <CreditCard className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-blue-500">newgoldenjewel@gmail.com</p>
                      <p className="text-sm text-muted-foreground">Primary payment method</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                      <Wallet className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">UPI ID</p>
                      <p className="text-orange-500">secoin@uboi</p>
                      <p className="text-sm text-muted-foreground">Indian payments</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/10 border border-purple-600/20 rounded-full flex items-center justify-center shrink-0">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">ETH ID</p>
                      <p className="text-purple-600 text-sm break-all">0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7</p>
                      <p className="text-sm text-muted-foreground">Cryptocurrency payments</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Links */}
        <Card className="cyber-gradient border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Connect With Us
            </CardTitle>
            <CardDescription>
              Follow us on all major social platforms for updates and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="https://facebook.com/dild26"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg hover:bg-blue-600/20 transition-colors"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-sm">Facebook</span>
              </a>
              
              <a
                href="https://www.linkedin.com/in/dild26"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-sm">LinkedIn</span>
              </a>
              
              <a
                href="https://t.me/dilee"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-cyan-500" />
                <span className="font-medium text-sm">Telegram</span>
              </a>
              
              <a
                href="https://discord.com/users/dild26"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-indigo-500" />
                <span className="font-medium text-sm">Discord</span>
              </a>
              
              <a
                href="https://dildiva.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors"
              >
                <Globe className="h-5 w-5 text-orange-500" />
                <span className="font-medium text-sm">Blogspot</span>
              </a>
              
              <a
                href="https://www.instagram.com/newgoldenjewel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg hover:bg-pink-500/20 transition-colors"
              >
                <Instagram className="h-5 w-5 text-pink-500" />
                <span className="font-medium text-sm">Instagram</span>
              </a>
              
              <a
                href="https://x.com/dil_sec"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-gray-800/10 border border-gray-800/20 rounded-lg hover:bg-gray-800/20 transition-colors"
              >
                <Twitter className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                <span className="font-medium text-sm">X (Twitter)</span>
              </a>
              
              <a
                href="https://www.youtube.com/@dileepkumard4484"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Youtube className="h-5 w-5 text-red-500" />
                <span className="font-medium text-sm">YouTube</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours & Response Times */}
        <Card className="cyber-gradient border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              Business Hours & Response Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                <Clock className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM IST</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Response</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>General Inquiries:</strong> Within 24 hours</p>
                  <p><strong>Support Requests:</strong> Within 12 hours</p>
                  <p><strong>Urgent Issues:</strong> Within 4 hours</p>
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                <Phone className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Available:</strong> Business hours only</p>
                  <p><strong>Language:</strong> English, Hindi</p>
                  <p><strong>Emergency:</strong> Email preferred</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Contact Options */}
        <Card className="cyber-gradient border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Quick Contact Options
            </CardTitle>
            <CardDescription>
              Choose the best way to reach us based on your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => window.location.href = 'mailto:dild26@gmail.com'}
              >
                <Mail className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <p className="font-medium">General Inquiry</p>
                  <p className="text-xs text-muted-foreground">Business partnerships</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => window.location.href = 'https://wa.me/919620058644'}
              >
                <MessageCircle className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Instant messaging</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => window.location.href = 'mailto:newgoldenjewel@gmail.com'}
              >
                <CreditCard className="h-6 w-6 text-blue-500" />
                <div className="text-center">
                  <p className="font-medium">Payment Support</p>
                  <p className="text-xs text-muted-foreground">PayPal & billing</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => window.location.href = 'tel:+91-962-005-8644'}
              >
                <Phone className="h-6 w-6 text-blue-500" />
                <div className="text-center">
                  <p className="font-medium">Phone Call</p>
                  <p className="text-xs text-muted-foreground">Direct conversation</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="cyber-gradient border-red-500/20">
          <CardContent className="py-6 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold">Need Immediate Assistance?</h3>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                For urgent technical issues or critical business matters, please email us directly. 
                We monitor our email regularly and will respond as quickly as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => window.location.href = 'mailto:dild26@gmail.com?subject=URGENT: Immediate Assistance Required'}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Urgent Email
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://wa.me/919620058644?text=Hello, I need urgent assistance', '_blank')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
