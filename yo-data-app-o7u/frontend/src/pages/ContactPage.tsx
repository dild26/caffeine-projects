import { useEffect } from 'react';
import { useGetContactInfo } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Globe, MapPin, CreditCard, ExternalLink } from 'lucide-react';
import { SiFacebook, SiLinkedin, SiTelegram, SiDiscord, SiBlogger, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import type { ContactInfo } from '../backend';

// Static SECOINFI contact data - always renders regardless of backend status
const SECOINFI_CONTACT_DATA: ContactInfo = {
  companyName: 'SECOINFI',
  ceoName: 'DILEEP KUMAR D',
  primaryEmail: 'dild26@gmail.com',
  phone: '+91-962-005-8644',
  website: 'www.seco.in.net',
  whatsapp: '+91-962-005-8644',
  businessAddress: 'Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097',
  paypal: 'newgoldenjewel@gmail.com',
  upiId: 'secoin@uboi',
  ethId: '0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Sudha+Enterprises+No+157+V+R+VIHAR+VARADARAJ+NAGAR+VIDYARANYAPUR+PO+BANGALORE+560097',
  socialLinks: [
    ['Facebook', 'https://facebook.com/dild26'],
    ['LinkedIn', 'https://www.linkedin.com/in/dild26'],
    ['Telegram', 'https://t.me/dilee'],
    ['Discord', 'https://discord.com/users/dild26'],
    ['Blogspot', 'https://dildiva.blogspot.com'],
    ['Instagram', 'https://instagram.com/newgoldenjewel'],
    ['X', 'https://twitter.com/dil_sec'],
    ['YouTube', 'https://m.youtube.com/@dileepkumard4484/videos'],
  ],
  logoText: 'SECOINFI',
  logoImageUrl: '/assets/yo-data-logo-transparent.dim_200x200.png',
  createdAt: BigInt(0),
  updatedAt: BigInt(0),
  version: BigInt(0),
};

interface ContactDisplayProps {
  contactInfo: ContactInfo;
}

function ContactDisplay({ contactInfo }: ContactDisplayProps) {
  const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    facebook: SiFacebook,
    linkedin: SiLinkedin,
    telegram: SiTelegram,
    discord: SiDiscord,
    blogspot: SiBlogger,
    instagram: SiInstagram,
    x: SiX,
    twitter: SiX,
    youtube: SiYoutube,
  };

  return (
    <div className="container py-12">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <div className="mb-6 flex items-center justify-center gap-4">
          {contactInfo.logoImageUrl && (
            <a
              href={contactInfo.website ? `https://${contactInfo.website}` : 'https://www.seco.in.net'}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              aria-label={`Visit ${contactInfo.companyName} website`}
            >
              <img
                src={contactInfo.logoImageUrl}
                alt={`${contactInfo.companyName} logo`}
                className="h-20 w-20 object-contain"
              />
            </a>
          )}
          {contactInfo.logoText && (
            <a
              href={contactInfo.website ? `https://${contactInfo.website}` : 'https://www.seco.in.net'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl font-bold transition-opacity hover:opacity-80"
              aria-label={`Visit ${contactInfo.companyName} website`}
            >
              {contactInfo.logoText}
            </a>
          )}
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Get in touch with {contactInfo.companyName}</h1>
        <p className="text-lg text-muted-foreground">
          {contactInfo.ceoName}, CEO of {contactInfo.companyName}
        </p>
      </header>

      {/* Contact Information Section */}
      <section className="mb-12" aria-labelledby="contact-methods-heading">
        <h2 id="contact-methods-heading" className="sr-only">Contact Methods</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Primary Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                Primary Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={`mailto:${contactInfo.primaryEmail}`}
                className="text-sm font-medium text-primary hover:underline"
                aria-label={`Send email to ${contactInfo.primaryEmail}`}
              >
                {contactInfo.primaryEmail}
              </a>
            </CardContent>
          </Card>

          {/* Business Phone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                Business Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-sm font-medium text-primary hover:underline"
                aria-label={`Call ${contactInfo.phone}`}
              >
                {contactInfo.phone}
              </a>
            </CardContent>
          </Card>

          {/* Website */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" aria-hidden="true" />
                Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={contactInfo.website.startsWith('http') ? contactInfo.website : `https://${contactInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                aria-label={`Visit ${contactInfo.website} (opens in new tab)`}
              >
                {contactInfo.website}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                aria-label={`Chat on WhatsApp ${contactInfo.whatsapp} (opens in new tab)`}
              >
                {contactInfo.whatsapp}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </CardContent>
          </Card>

          {/* Business Address */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                Business Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <address className="text-sm not-italic">{contactInfo.businessAddress}</address>
              {contactInfo.mapLink && (
                <a
                  href={contactInfo.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  aria-label="View location on Google Maps (opens in new tab)"
                >
                  Click to view on map
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Payment Information Section */}
      <section className="mb-12" aria-labelledby="payment-heading">
        <h2 id="payment-heading" className="mb-6 text-2xl font-bold">Payment Information</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />
                PayPal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{contactInfo.paypal}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />
                UPI ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{contactInfo.upiId}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />
                ETH ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="break-all text-xs font-medium">{contactInfo.ethId}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Location Section */}
      {contactInfo.mapLink && (
        <section className="mb-12" aria-labelledby="location-heading">
          <h2 id="location-heading" className="mb-6 text-2xl font-bold">Our Location</h2>
          <Card>
            <CardContent className="p-6">
              <a
                href={contactInfo.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label="View location on Google Maps (opens in new tab)"
              >
                <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-muted">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 h-12 w-12 text-primary" aria-hidden="true" />
                    <p className="text-sm font-medium">Click to view on Google Maps</p>
                    <p className="mt-1 text-xs text-muted-foreground">Opens in new tab</p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        </section>
      )}

      {/* CTA Section - Ready to Get Started */}
      <section className="mb-12" aria-labelledby="cta-heading">
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center">
            <CardTitle id="cta-heading" className="text-3xl">Ready to Get Started?</CardTitle>
            <CardDescription className="text-base">
              Contact us today to discuss your investment opportunities with {contactInfo.companyName}. 
              We're here to help you explore exciting opportunities and answer any questions you may have.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <a href={`mailto:${contactInfo.primaryEmail}`} aria-label={`Send email to ${contactInfo.primaryEmail}`}>
                <Mail className="mr-2 h-5 w-5" aria-hidden="true" />
                Send Email
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp (opens in new tab)"
              >
                <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a
                href={`tel:${contactInfo.phone}`}
                aria-label={`Call ${contactInfo.phone}`}
              >
                <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                Call Us
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Social Links - Connect With Us on Social Sites */}
      {contactInfo.socialLinks && contactInfo.socialLinks.length > 0 && (
        <section aria-labelledby="social-heading">
          <h2 id="social-heading" className="mb-6 text-center text-2xl font-bold">Connect With Us on Social Sites</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {contactInfo.socialLinks.map(([platform, url]) => {
              const IconComponent = socialIcons[platform.toLowerCase()];
              return (
                <Button
                  key={platform}
                  variant="outline"
                  size="lg"
                  asChild
                  className="gap-2"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${platform} page (opens in new tab)`}
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" aria-hidden="true" />}
                    <span className="capitalize">{platform}</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </Button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ContactPage() {
  const { data: contactInfo, isLoading, error } = useGetContactInfo();

  useEffect(() => {
    document.title = 'Contact – SECOINFI | YO-Data';
  }, []);

  // Console logging for debugging
  useEffect(() => {
    console.log('[ContactPage] Data loading state:', {
      isLoading,
      hasData: !!contactInfo,
      error: error?.message || null,
      dataSource: contactInfo ? 'backend' : 'static-fallback',
    });
  }, [isLoading, contactInfo, error]);

  // Always use static SECOINFI data (backend data can enhance but not replace)
  const displayData = contactInfo || SECOINFI_CONTACT_DATA;

  // Show loading state briefly, but always render content
  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status" aria-label="Loading contact information"></div>
            <p className="text-muted-foreground">Loading contact information...</p>
          </div>
        </div>
      </div>
    );
  }

  return <ContactDisplay contactInfo={displayData} />;
}
