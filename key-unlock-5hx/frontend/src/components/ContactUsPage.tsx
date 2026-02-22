import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { SiFacebook, SiLinkedin, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import { useGetContactInfo } from '../hooks/useContactInfo';

export default function ContactUsPage() {
  const { data: contactInfo, isLoading } = useGetContactInfo();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading contact information...</p>
        </div>
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Contact information not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-lg">
          Get in touch with the SECOINFI team
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Primary Contact */}
        <Card className="card-3d card-3d-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Primary Contact
            </CardTitle>
            <CardDescription>Reach out to our CEO directly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">CEO</p>
              <p className="font-semibold">{contactInfo.ceoName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a href={`mailto:${contactInfo.email}`} className="font-semibold text-primary hover:underline">
                {contactInfo.email}
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <a href={`tel:${contactInfo.phone}`} className="font-semibold text-primary hover:underline">
                {contactInfo.phone}
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} className="font-semibold text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {contactInfo.whatsapp}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Business Address */}
        <Card className="card-3d card-3d-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Business Address
            </CardTitle>
            <CardDescription>Visit us at our office</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{contactInfo.businessAddress}</p>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="card-3d card-3d-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Information
            </CardTitle>
            <CardDescription>Multiple payment options available</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">PayPal</p>
              <p className="font-semibold">{contactInfo.paypal}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">UPI</p>
              <p className="font-semibold">{contactInfo.upi}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ethereum (ETH)</p>
              <p className="font-mono text-xs break-all">{contactInfo.eth}</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="card-3d card-3d-hover">
          <CardHeader>
            <CardTitle>Connect With Us</CardTitle>
            <CardDescription>Follow us on social media</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <SiFacebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a href={contactInfo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <SiLinkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <SiInstagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
              <a href={contactInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <SiX className="w-5 h-5" />
                <span>X/Twitter</span>
              </a>
              <a href={contactInfo.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <SiYoutube className="w-5 h-5" />
                <span>YouTube</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
