import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            © 2025. Built with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
