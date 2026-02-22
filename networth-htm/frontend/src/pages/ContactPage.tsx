import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Globe, MessageSquare, Download, Printer, Send, Share2, FileText } from 'lucide-react';
import { SiFacebook, SiLinkedin, SiTelegram, SiDiscord, SiBlogger, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import { toast } from 'sonner';

export default function ContactPage() {
  const ceoInfo = {
    name: 'DILEEP KUMAR D',
    title: 'CEO & Founder of SECOINFI',
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Primary Email',
      value: 'dild26@gmail.com',
      link: 'mailto:dild26@gmail.com',
    },
    {
      icon: Phone,
      title: 'Business Phone',
      value: '+91-962-005-8644',
      link: 'tel:+919620058644',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      value: '+91-962-005-8644',
      link: 'https://wa.me/919620058644',
    },
    {
      icon: Globe,
      title: 'Website',
      value: 'www.seco.in.net',
      link: 'https://www.seco.in.net',
    },
    {
      icon: MapPin,
      title: 'Business Address',
      value: 'Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097',
      link: null,
    },
  ];

  const paymentInfo = [
    {
      title: 'PayPal',
      value: 'newgoldenjewel@gmail.com',
    },
    {
      title: 'UPI ID',
      value: 'secoin@uboi',
    },
    {
      title: 'ETH ID',
      value: '0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7',
    },
  ];

  const socialLinks = [
    { icon: SiFacebook, name: 'Facebook', url: 'https://facebook.com/dild26' },
    { icon: SiX, name: 'X (Twitter)', url: 'https://x.com/dil_sec' },
    { icon: SiLinkedin, name: 'LinkedIn', url: 'https://www.linkedin.com/in/dild26' },
    { icon: SiInstagram, name: 'Instagram', url: 'https://www.instagram.com/newgoldenjewel' },
    { icon: SiTelegram, name: 'Telegram', url: 'https://t.me/dilee' },
    { icon: SiDiscord, name: 'Discord', url: 'https://discord.com/users/dild26' },
    { icon: SiBlogger, name: 'Blogspot', url: 'https://dildiva.blogspot.com/' },
    { icon: SiYoutube, name: 'YouTube', url: 'https://www.youtube.com/@dileepkumard4484' },
  ];

  const handleSubmit = () => {
    toast.success('Form submitted successfully!');
  };

  const handleSavePDF = () => {
    window.print();
    toast.success('Print dialog opened. You can save as PDF from there.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    window.location.href = 'mailto:dild26@gmail.com?subject=Contact from Your NetWorth App';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SECOINFI Contact Information',
          text: 'Get in touch with SECOINFI',
          url: window.location.href,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const openInGoogleMaps = () => {
    const address = encodeURIComponent('Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const openInOpenStreetMap = () => {
    window.open('https://www.openstreetmap.org/way/1417238145', '_blank');
  };

  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with SECOINFI for inquiries, support, or collaboration opportunities.
          </p>
        </div>

        {/* CEO Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Leadership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary">DK</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{ceoInfo.name}</h3>
                <p className="text-muted-foreground">{ceoInfo.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            {contactInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-muted-foreground hover:text-foreground transition-colors break-words"
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground break-words">{info.value}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Location Map */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Location</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src="/assets/generated/contact-map.dim_400x300.jpg"
                    alt="Office Location Map"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 w-full">
                      <Button
                        onClick={openInGoogleMaps}
                        className="w-full mb-2"
                        variant="secondary"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Click to open in Google Maps
                      </Button>
                      <Button
                        onClick={openInOpenStreetMap}
                        className="w-full"
                        variant="outline"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        View on OpenStreetMap
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paymentInfo.map((payment, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">{payment.title}</h3>
                  <p className="font-mono text-sm break-all bg-muted p-3 rounded-lg">{payment.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Subscribe for Interactive Topics to fill & submit; get downloadable .json templates of e-Topics; 
              earn GBV royalty on profits as Subscribers/Referrals.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Button onClick={handleSubmit} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Submit
              </Button>
              <Button onClick={handleSavePDF} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Save PDF
              </Button>
              <Button onClick={handlePrint} variant="outline" className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                Print to file
              </Button>
              <Button onClick={handleSendEmail} variant="outline" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send email
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Forward/Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Connect With Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Follow us on social media for updates and news
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <social.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{social.name}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
