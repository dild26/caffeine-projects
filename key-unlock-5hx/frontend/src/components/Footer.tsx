import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2025. Built with{' '}
            <Heart className="inline h-4 w-4 text-destructive fill-destructive" />{' '}
            using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Powered by Internet Computer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
