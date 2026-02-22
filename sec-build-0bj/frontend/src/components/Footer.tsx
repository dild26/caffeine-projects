import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-3 text-sm text-muted-foreground flex items-center justify-center gap-2">
      <span>© 2025. Built with</span>
      <Heart className="w-4 h-4 text-destructive fill-destructive" />
      <span>using</span>
      <a 
        href="https://caffeine.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium"
      >
        caffeine.ai
      </a>
    </footer>
  );
}
