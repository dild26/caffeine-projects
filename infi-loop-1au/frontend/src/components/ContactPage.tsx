import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Globe, MapPin, CheckCircle2 } from 'lucide-react';
import { SiFacebook, SiLinkedin, SiTelegram, SiDiscord, SiBlogger, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  // Verified SECOINFI contact information
  const contactInfo = {
    name: 'DILEEP KUMAR D',
    title: 'CEO & Founder, SECOINFI',
    email: 'dild26@gmail.com',
    phone: '+91-962-005-8644',
    website: 'www.seco.in.net',
    address: 'Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097',
    paypal: 'newgoldenjewel@gmail.com',
    upi: 'secoin@uboi',
    eth: '0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7',
    socialLinks: [
      { name: 'Facebook', url: 'https://facebook.com/dild26', icon: SiFacebook },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dild26', icon: SiLinkedin },
      { name: 'Telegram', url: 'https://t.me/dilee', icon: SiTelegram },
      { name: 'Discord', url: 'https://discord.com/users/dild26', icon: SiDiscord },
      { name: 'Blog', url: 'https://dildiva.blogspot.com', icon: SiBlogger },
      { name: 'Instagram', url: 'https://instagram.com/newgoldenjewel', icon: SiInstagram },
      { name: 'X (Twitter)', url: 'https://twitter.com/dil_sec', icon: SiX },
      { name: 'YouTube', url: 'https://m.youtube.com/@dileepkumard4484/videos', icon: SiYoutube },
    ],
    verified: true,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
              <CardDescription>Verified contact details for SECOINFI</CardDescription>
            </div>
            {contactInfo.verified && (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{contactInfo.name}</h3>
              <p className="text-muted-foreground">{contactInfo.title}</p>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-sm text-primary hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Business Phone / WhatsApp</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-sm text-primary hover:underline">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a
                    href={`https://${contactInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {contactInfo.website}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Business Address</p>
                  <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Payment Information</h4>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">PayPal</p>
                  <p className="text-sm font-mono break-all">{contactInfo.paypal}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">UPI ID</p>
                  <p className="text-sm font-mono">{contactInfo.upi}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">ETH ID</p>
                  <p className="text-sm font-mono break-all">{contactInfo.eth}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Social Links</h4>
              <div className="flex flex-wrap gap-2">
                {contactInfo.socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-4 w-4" />
                        {social.name}
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              All contact information is verified and maintained by SECOINFI.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
