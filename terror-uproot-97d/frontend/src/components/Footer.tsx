import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            © 2025. Built with <Heart className="h-4 w-4 fill-destructive text-destructive" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs">
            Ethical security research platform • No personal data collection • Transparency first
          </p>
        </div>
      </div>
    </footer>
  );
}

