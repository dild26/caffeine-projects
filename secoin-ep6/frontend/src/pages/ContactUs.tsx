import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Phone, Globe, CreditCard, User, Building2, Share2, Search, ExternalLink } from 'lucide-react';
import { useGetActiveSocialMediaPlatforms } from '../hooks/useQueries';
import { useState } from 'react';
import { getPlatformIcon, getFallbackIcon } from '../lib/socialMediaUtils';

export default function ContactUs() {
  const { data: socialPlatforms = [], isLoading: socialLoading } = useGetActiveSocialMediaPlatforms();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter platforms by search term (search by platform name - clean domain from backend)
  const filteredPlatforms = socialPlatforms.filter(platform => 
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Mail className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Contact Us</h1>
        <p className="text-lg text-muted-foreground">Get in touch with SECOINFI</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        {/* Left Column - Contact Information */}
        <div className="space-y-6">
          {/* CEO & Founder Card */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                CEO & Founder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xl font-bold text-foreground">DILEEP KUMAR D</p>
                <p className="text-muted-foreground">CEO of SECOINFI</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Primary Email</h3>
                  <p className="text-muted-foreground">
                    <a 
                      href="mailto:dild26@gmail.com" 
                      className="hover:text-primary transition-colors"
                    >
                      dild26@gmail.com
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">General inquiries & partnerships</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Business Phone</h3>
                  <p className="text-muted-foreground">
                    <a 
                      href="tel:+919620058644" 
                      className="hover:text-primary transition-colors"
                    >
                      +91-962-005-8644
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Available during business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Website</h3>
                  <p className="text-muted-foreground">
                    <a 
                      href="https://www.seco.in.net" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      www.seco.in.net
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Official company website</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <svg 
                    className="h-6 w-6 text-primary" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-label="WhatsApp"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
                  <p className="text-muted-foreground">
                    <a 
                      href="https://wa.me/919620058644" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      +91-962-005-8644
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Direct messaging support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Address Card */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Business Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    <strong className="text-foreground">Sudha Enterprises</strong><br />
                    No. 157, V R VIHAR, VARADARAJ NAGAR,<br />
                    VIDYARANYAPUR PO,<br />
                    BANGALORE-560097
                  </p>
                  <a 
                    href="https://www.google.com/maps?q=13.081828,77.542533" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    <MapPin className="h-4 w-4" />
                    Click to view on map
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Information */}
        <div className="space-y-6">
          {/* Payment Information Card */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <svg 
                    className="h-6 w-6 text-primary" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-label="PayPal"
                  >
                    <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.794.679H7.72a.483.483 0 01-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502zm-2.96-5.09c.762.868.983 2.156.617 3.803-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.794.679H7.72a.483.483 0 01-.477-.558l1.09-6.908.311-1.976h1.385c4.678 0 7.75-2.203 8.796-6.502.227-1.163.08-2.196-.457-3.003-.537-.807-1.548-1.387-2.997-1.387H5.178a.805.805 0 00-.794.68l-2.355 14.92c-.065.412.24.788.66.788h3.992l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502.227-1.163.08-2.196-.457-3.003z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">PayPal</h3>
                  <p className="text-muted-foreground break-all">
                    newgoldenjewel@gmail.com
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Primary payment method</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">UPI ID</h3>
                  <p className="text-muted-foreground break-all">
                    secoin@uboi
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Indian payments</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <svg 
                    className="h-6 w-6 text-primary" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-label="Ethereum"
                  >
                    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">ETH ID</h3>
                  <p className="text-muted-foreground break-all font-mono text-sm">
                    0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Cryptocurrency payments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Card */}
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Our Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3887.8!2d77.542533!3d13.081828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDA0JzU0LjYiTiA3N8KwMzInMzMuMSJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sudha Enterprises Location"
                  className="rounded-lg"
                />
              </div>
              <div className="mt-4 p-3 bg-accent/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Click on the map to open in Google Maps for directions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Contact CTA */}
          <Card className="border-2 border-accent/30 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Ready to Get Started?
              </h3>
              <p className="text-muted-foreground mb-4">
                Contact us today to learn more about our property investment opportunities and how SECoin can help you achieve your investment goals.
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="mailto:dild26@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <Mail className="h-4 w-4" />
                  Email Us
                </a>
                <a 
                  href="https://wa.me/919620058644"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                  <svg 
                    className="h-4 w-4" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connect With Us Section - Compact Inline Display with Search */}
      <div className="mb-8">
        <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Connect With Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Follow us on social media for the latest updates, insights, and news about SECoin and real estate investment opportunities.
            </p>
            
            {/* Search Field */}
            {socialPlatforms.length > 0 && (
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search platforms by name (e.g., Facebook, Refresh)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
            
            {socialLoading ? (
              <div className="flex flex-wrap gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-10 w-24 bg-muted/20 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredPlatforms.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {filteredPlatforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer"
                    title={`Visit ${platform.name} - ${platform.url}`}
                  >
                    <img 
                      src={getPlatformIcon(platform.icon)} 
                      alt={`${platform.name} icon`}
                      className="object-contain flex-shrink-0"
                      style={{ width: '16px', height: '16px' }}
                      onError={(e) => {
                        e.currentTarget.src = getFallbackIcon();
                      }}
                    />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {platform.name}
                    </span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No platforms found matching "{searchTerm}". Search uses the platform name (e.g., "Facebook", "Refresh").
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Social media links will be available soon.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
