import { Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useGetCompanyInfo } from '@/hooks/useQueries';

export default function Footer() {
  const { data: companyInfo } = useGetCompanyInfo();

  const company = companyInfo || {
    name: 'SECOINFI',
    email: 'secoinfi@gmail.com',
  };

  return (
    <footer className="border-t-4 border-primary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">n8n Workflows</h3>
            <p className="text-sm text-muted-foreground">
              Your marketplace for powerful automation workflows.
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold">{company.name}</span>
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Catalog
              </Link>
              <Link to="/pros" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pros
              </Link>
              <Link to="/what-we-do" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                What We Do
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link to="/referral" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Referral
              </Link>
              <Link to="/trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Trust
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 {company.name}. Built with{' '}
              <Heart className="inline h-4 w-4 text-accent fill-accent" />{' '}
              using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              Contact: <a href={`mailto:${company.email}`} className="hover:text-primary transition-colors">{company.email}</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
