import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="mb-6 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <p className="text-center text-sm font-medium text-foreground">
            <strong>Important Disclaimer:</strong> ourSchemes is not an official government application. 
            All links lead to official government portals such as myscheme.gov.in. 
            We are not affiliated with any government entity.
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <p>
            © 2025. Built with <Heart className="inline h-4 w-4 fill-red-500 text-red-500" /> using{' '}
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
            This is an independent project to help citizens discover government schemes. 
            Always verify information on official government websites.
          </p>
        </div>
      </div>
    </footer>
  );
}
