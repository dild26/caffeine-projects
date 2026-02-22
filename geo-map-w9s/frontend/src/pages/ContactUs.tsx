import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Globe, Building, User } from 'lucide-react';
import { SiFacebook, SiX, SiLinkedin, SiInstagram, SiYoutube, SiBlogger, SiTelegram, SiDiscord } from 'react-icons/si';

export default function ContactUs() {
  // Static contact information as per specification
  const contact = {
    ceo: 'DILEEP KUMAR D',
    primaryEmail: 'dild26@gmail.com',
    businessPhone: '+91-962-005-8644',
    website: 'www.seco.in.net',
    address: 'Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097',
    paypal: 'newgoldenjewel@gmail.com',
    upiId: 'secoin@uboi',
    ethId: '0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7',
    facebook: 'https://facebook.com/dild26',
    twitter: 'https://x.com/dil_sec',
    linkedin: 'https://www.linkedin.com/in/dild26',
    instagram: 'https://www.instagram.com/newgoldenjewel',
    telegram: 'https://t.me/dilee',
    discord: 'https://discord.com/users/dild26',
    blogspot: 'https://dildiva.blogspot.com/',
    youtube: 'https://www.youtube.com/@dileepkumard4484',
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with SECOINFI for any inquiries or support
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Sudha Enterprises</h3>
                <p className="text-sm text-muted-foreground">
                  Leading provider of geospatial mapping and grid technology solutions
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">CEO & Founder</p>
                    <p className="text-muted-foreground">{contact.ceo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Business Address</p>
                    <p className="text-muted-foreground">{contact.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium">Primary Email</p>
                    <a href={`mailto:${contact.primaryEmail}`} className="text-primary hover:underline">
                      {contact.primaryEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium">Business Phone & WhatsApp</p>
                    <a href={`tel:${contact.businessPhone}`} className="text-primary hover:underline">
                      {contact.businessPhone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="font-medium">Website</p>
                    <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {contact.website}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Multiple payment methods available for your convenience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Digital Payments</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">PayPal:</span>{' '}
                    <a href={`mailto:${contact.paypal}`} className="text-primary hover:underline">
                      {contact.paypal}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground">UPI ID:</span>{' '}
                    <span className="font-mono">{contact.upiId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ethereum:</span>{' '}
                    <span className="font-mono text-xs break-all">{contact.ethId}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Other Methods</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Stripe (Credit/Debit Cards)</li>
                  <li>• Demand Draft (DD)</li>
                  <li>• Bank Transfer</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                For bank transfer details and DD instructions, please contact us at{' '}
                <a href={`mailto:${contact.primaryEmail}`} className="text-primary hover:underline">
                  {contact.primaryEmail}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connect With Us</CardTitle>
            <CardDescription>Follow us on social media for updates and news</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <SiFacebook className="h-5 w-5 text-[#1877F2]" />
                <span className="text-sm font-medium">Facebook</span>
              </a>
              <a
                href={contact.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <SiX className="h-5 w-5" />
                <span className="text-sm font-medium">X</span>
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <SiLinkedin className="h-5 w-5 text-[#0A66C2]" />
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <SiInstagram className="h-5 w-5 text-[#E4405F]" />
                <span className="text-sm font-medium">Instagram</span>
              </a>
              <a
                href={contact.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <SiTelegram className="h-5 w-5 text-[#26A5E4]" />
                <span className="text-sm font-medium">Telegram</span>
              </a>
              <a
                href={contact.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <SiDiscord className="h-5 w-5 text-[#5865F2]" />
                <span className="text-sm font-medium">Discord</span>
              </a>
              <a
                href={contact.blogspot}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <SiBlogger className="h-5 w-5 text-[#FF5722]" />
                <span className="text-sm font-medium">Blogspot</span>
              </a>
              <a
                href={contact.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <SiYoutube className="h-5 w-5 text-[#FF0000]" />
                <span className="text-sm font-medium">YouTube</span>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday:</span>
                <span className="font-medium">9:00 AM - 6:00 PM IST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday:</span>
                <span className="font-medium">10:00 AM - 4:00 PM IST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday:</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
