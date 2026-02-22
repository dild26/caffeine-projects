import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from 'react-icons/si';

export default function ContactUs() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get in touch with our team for support, inquiries, or partnerships
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Reach out to us through any of these channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:contact@secoinfi.com" className="text-muted-foreground hover:text-primary">
                  contact@secoinfi.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">
                  123 Business Street<br />
                  Suite 100<br />
                  San Francisco, CA 94102
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Website</p>
                <a href="https://secoinfi.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  www.secoinfi.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Accepted payment methods and details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium mb-2">Stripe</p>
              <p className="text-sm text-muted-foreground">Credit & Debit Cards accepted</p>
            </div>
            <div>
              <p className="font-medium mb-2">PayPal</p>
              <p className="text-sm text-muted-foreground">paypal@secoinfi.com</p>
            </div>
            <div>
              <p className="font-medium mb-2">Bank Transfer</p>
              <p className="text-sm text-muted-foreground">
                Account: 1234567890<br />
                Routing: 987654321<br />
                Bank: Example Bank
              </p>
            </div>
            <div>
              <p className="font-medium mb-2">UPI (India)</p>
              <p className="text-sm text-muted-foreground">secoinfi@upi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connect With Us</CardTitle>
          <CardDescription>Follow us on social media for updates and news</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <a
              href="https://facebook.com/secoinfi"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <SiFacebook className="h-5 w-5 text-primary" />
            </a>
            <a
              href="https://twitter.com/secoinfi"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <SiX className="h-5 w-5 text-primary" />
            </a>
            <a
              href="https://linkedin.com/company/secoinfi"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <SiLinkedin className="h-5 w-5 text-primary" />
            </a>
            <a
              href="https://instagram.com/secoinfi"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <SiInstagram className="h-5 w-5 text-primary" />
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Map</CardTitle>
          <CardDescription>Find us at our office location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Map integration placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
