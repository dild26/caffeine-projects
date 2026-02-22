import { useEffect, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StaticPageLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children: ReactNode;
  pageTitle?: string;
}

export default function StaticPageLayout({
  title,
  subtitle,
  icon: Icon,
  children,
  pageTitle,
}: StaticPageLayoutProps) {
  useEffect(() => {
    document.title = pageTitle || `${title} - latestTrends`;
  }, [title, pageTitle]);

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Icon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
