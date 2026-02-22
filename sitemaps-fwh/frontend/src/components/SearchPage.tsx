import React from 'react';
import EnhancedSearchInterface from '@/components/EnhancedSearchInterface';

type Page = 'home' | 'search' | 'dashboard';

interface SearchPageProps {
  onNavigate: (page: Page) => void;
}

export default function SearchPage({ onNavigate }: SearchPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Advanced Sitemap Search
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Discover and explore sitemap data with enhanced search capabilities.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span className="bg-muted px-2 py-1 rounded">✨ Debounced Search</span>
            <span className="bg-muted px-2 py-1 rounded">🔍 Live Domain Matching</span>
            <span className="bg-muted px-2 py-1 rounded">🛡️ Secure Preview</span>
            <span className="bg-muted px-2 py-1 rounded">📱 Lazy Loading</span>
            <span className="bg-muted px-2 py-1 rounded">🔗 inurl: Support</span>
          </div>
        </div>
        
        <EnhancedSearchInterface />
        
        <div className="mt-12 text-center">
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Search Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Domain Search</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Live character matching</li>
                  <li>• Input validation (a-z, A-Z, 0-9, .)</li>
                  <li>• Instant suggestions</li>
                  <li>• Lazy loading for performance</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">URL Path Search</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Debounced search (400ms)</li>
                  <li>• Multi-level path matching</li>
                  <li>• Google-style inurl: support</li>
                  <li>• Case-insensitive matching</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Secure Preview</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Sandboxed content display</li>
                  <li>• Zoom controls (50%-200%)</li>
                  <li>• Fullscreen mode</li>
                  <li>• XML download support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
