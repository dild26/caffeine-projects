import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Twitter, Github, Linkedin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container px-4 py-8 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Get in Touch</h1>
        <p className="text-xl text-muted-foreground">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Reach out through any of these channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:support@sitemaphub.com" className="text-sm text-muted-foreground hover:text-primary">
                  support@sitemaphub.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Available Mon-Fri, 9am-5pm EST</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Follow us for updates and news</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <a href="https://twitter.com/sitemaphub" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
                Twitter
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <a href="https://github.com/sitemaphub" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <a href="https://linkedin.com/company/sitemaphub" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment & Billing Support</CardTitle>
          <CardDescription>Questions about subscriptions or payments?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            For billing inquiries, subscription changes, or payment issues, please contact our billing team at{' '}
            <a href="mailto:billing@sitemaphub.com" className="text-primary hover:underline">
              billing@sitemaphub.com
            </a>
          </p>
          <div className="flex gap-4 pt-2">
            <img
              src="/assets/generated/payment-security-transparent.dim_100x100.png"
              alt="Secure Payments"
              className="h-16 w-16 object-contain"
            />
            <div>
              <p className="font-medium">Secure Payment Processing</p>
              <p className="text-sm text-muted-foreground">
                All payments are processed securely through Stripe. We never store your payment information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Inquiries</CardTitle>
          <CardDescription>Interested in enterprise solutions or partnerships?</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            For enterprise plans, custom solutions, or partnership opportunities, reach out to our business development
            team:
          </p>
          <Button asChild>
            <a href="mailto:business@sitemaphub.com">
              <Mail className="h-4 w-4 mr-2" />
              Contact Business Team
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground pt-8">
        <p>SitemapHub is built with ❤️ using caffeine.ai</p>
        <p className="mt-2">© 2025 SitemapHub. All rights reserved.</p>
      </div>
    </div>
  );
}
