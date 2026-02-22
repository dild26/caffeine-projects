import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  User, 
  Mail, 
  Globe, 
  MapPin, 
  Phone,
  Heart,
  Target,
  Users,
  Zap,
  Award,
  Calendar,
  Linkedin,
  Twitter,
  Github,
  Facebook,
  Instagram,
  MessageCircle,
  Youtube,
  Wallet,
  CreditCard,
  DollarSign
} from 'lucide-react';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'gods-eye' | 'admin' | 'analytics' | 'exports' | 'monitoring' | 'admin-panel';

interface AboutUsPageProps {
  onNavigate: (page: Page) => void;
}

export default function AboutUsPage({ onNavigate }: AboutUsPageProps) {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6"
      style={{
        backgroundImage: 'url(https://dild26.systeme.io)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            About Sudha Enterprises
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pioneering the future of sitemap intelligence and web discovery through innovative technology solutions
          </p>
        </div>

        {/* Company Overview */}
        <Card className="cyber-gradient border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Innovation • Technology • Excellence</span>
              </div>
              <p className="text-lg leading-relaxed">
                <span className="font-semibold text-primary">Sudha Enterprises</span> is led by{' '}
                <span className="font-semibold">DILEEP KUMAR D</span>, our visionary CEO and founder of SECOINFI. 
                We are dedicated to revolutionizing how businesses discover, analyze, and leverage 
                web content through advanced sitemap intelligence and cutting-edge search technologies.
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Our Mission</h3>
                <p className="text-sm text-muted-foreground">
                  Empowering businesses with intelligent web discovery and comprehensive sitemap analysis tools
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold">Our Vision</h3>
                <p className="text-sm text-muted-foreground">
                  Creating a connected digital ecosystem where every website's structure is accessible and analyzable
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold">Our Values</h3>
                <p className="text-sm text-muted-foreground">
                  Innovation, reliability, and customer-centric solutions that drive real business value
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leadership */}
        <Card className="cyber-gradient border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              Leadership Team
            </CardTitle>
            <CardDescription>
              Meet the visionary behind our innovative platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">DILEEP KUMAR D</h3>
                  <p className="text-lg text-accent font-medium">Chief Executive Officer</p>
                  <p className="text-muted-foreground">CEO of SECOINFI</p>
                </div>
                <p className="text-sm leading-relaxed">
                  With a passion for technology and innovation, DILEEP KUMAR D founded Sudha Enterprises and serves as CEO of SECOINFI 
                  to bridge the gap between complex web structures and business intelligence. His vision drives our 
                  commitment to delivering cutting-edge solutions that empower businesses to understand 
                  and leverage the digital landscape effectively.
                </p>
                
                {/* Business and Technical Services */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Business & Technical Services:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Web Intelligence Solutions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Sitemap Analysis & Discovery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Digital Platform Development</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Business Intelligence Tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Technology Consulting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Enterprise Solutions</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Established Leader
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Bangalore, India
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="cyber-gradient border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-500" />
              Get in Touch
            </CardTitle>
            <CardDescription>
              Connect with us through multiple channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Primary Contact</p>
                    <a 
                      href="mailto:dild26@gmail.com" 
                      className="text-primary hover:underline"
                    >
                      dild26@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Website</p>
                    <a 
                      href="https://www.seco.in.net" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      https://www.seco.in.net
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Business Phone</p>
                    <a 
                      href="tel:+91-962-005-8644" 
                      className="text-green-500 hover:underline"
                    >
                      +91-962-005-8644
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600/10 border border-green-600/20 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a 
                      href="https://wa.me/919620058644" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      https://wa.me/919620058644
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Business Address</p>
                    <a 
                      href="https://www.openstreetmap.org/way/1417238145"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 hover:underline text-sm leading-relaxed"
                    >
                      Sudha Enterprises | No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097
                    </a>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Payment Information:</h4>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                      <CreditCard className="h-3 w-3 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">PayPal</p>
                      <p className="text-xs text-blue-500">newgoldenjewel@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                      <Wallet className="h-3 w-3 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">UPI ID</p>
                      <p className="text-xs text-orange-500">secoin@uboi</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600/10 border border-purple-600/20 rounded-full flex items-center justify-center shrink-0">
                      <DollarSign className="h-3 w-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">ETH ID</p>
                      <p className="text-xs text-purple-600 break-all">0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card className="cyber-gradient border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Connect With Us
            </CardTitle>
            <CardDescription>
              Follow us on social media and professional networks
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

        {/* Company Values */}
        <Card className="cyber-gradient border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-500" />
              Our Core Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Continuously pushing boundaries in web intelligence technology
                </p>
              </div>
              <div className="text-center p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <Award className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  Delivering superior quality in every solution we create
                </p>
              </div>
              <div className="text-center p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Customer Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Putting our customers' success at the heart of everything we do
                </p>
              </div>
              <div className="text-center p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Reliability</h3>
                <p className="text-sm text-muted-foreground">
                  Building trust through consistent, dependable service delivery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="cyber-gradient border-primary/20 text-center">
          <CardContent className="py-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Web Discovery?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join businesses worldwide using our platform to unlock the power of intelligent web analysis. 
              Experience the difference that real innovation makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('subscription')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Get Started Today
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
              >
                Contact Us
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
