import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, Globe, MessageCircle, Wallet } from 'lucide-react';
import { SiFacebook, SiLinkedin, SiInstagram, SiX, SiYoutube, SiTelegram, SiDiscord } from 'react-icons/si';
import { useState } from 'react';
import { toast } from 'sonner';
import { useGetBusinessInfo } from '../hooks/useQueries';

export default function ContactUsPage() {
  const { data: businessInfo } = useGetBusinessInfo();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  if (!businessInfo) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading contact information...</p>
        </div>
      </div>
    );
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: businessInfo.email,
      href: `mailto:${businessInfo.email}`,
    },
    {
      icon: Phone,
      title: 'Phone',
      value: businessInfo.phone,
      href: `tel:${businessInfo.phone}`,
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: businessInfo.phone,
      href: businessInfo.whatsapp,
    },
    {
      icon: Globe,
      title: 'Website',
      value: businessInfo.website,
      href: businessInfo.website,
    },
    {
      icon: MapPin,
      title: 'Address',
      value: businessInfo.address,
      href: businessInfo.mapLink,
    },
  ];

  const paymentInfo = [
    {
      icon: Wallet,
      title: 'UPI ID',
      value: businessInfo.upiId,
      href: `upi://pay?pa=${businessInfo.upiId}`,
    },
    {
      icon: Wallet,
      title: 'ETH Address',
      value: businessInfo.ethId,
      href: `https://etherscan.io/address/${businessInfo.ethId}`,
    },
    {
      icon: Wallet,
      title: 'PayPal',
      value: businessInfo.paypal,
      href: `https://paypal.me/${businessInfo.paypal}`,
    },
  ];

  const socialLinks = [
    { icon: SiFacebook, href: businessInfo.facebook, label: 'Facebook' },
    { icon: SiLinkedin, href: businessInfo.linkedin, label: 'LinkedIn' },
    { icon: SiInstagram, href: businessInfo.instagram, label: 'Instagram' },
    { icon: SiX, href: businessInfo.x, label: 'X (Twitter)' },
    { icon: SiYoutube, href: businessInfo.youtube, label: 'YouTube' },
    { icon: SiTelegram, href: businessInfo.telegram, label: 'Telegram' },
    { icon: SiDiscord, href: businessInfo.discord, label: 'Discord' },
  ];

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{businessInfo.companyName}</CardTitle>
              <CardDescription>{businessInfo.ceo}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactInfo.map((info) => (
                <a
                  key={info.title}
                  href={info.href}
                  target={info.title === 'Address' || info.title === 'Website' || info.title === 'WhatsApp' ? '_blank' : undefined}
                  rel={info.title === 'Address' || info.title === 'Website' || info.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{info.title}</div>
                    <div className="text-sm text-muted-foreground break-words">{info.value}</div>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Multiple payment options available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentInfo.map((info) => (
                <a
                  key={info.title}
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{info.title}</div>
                    <div className="text-sm text-muted-foreground break-all">{info.value}</div>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
              <CardDescription>Stay connected on social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <Button
                    key={link.label}
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-full h-12 w-12"
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <link.icon className="h-5 w-5" />
                    </a>
                  </Button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <a
                  href={businessInfo.blogspot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Visit our blog: {businessInfo.blogspot}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
