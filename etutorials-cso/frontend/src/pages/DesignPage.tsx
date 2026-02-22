import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Palette, Layout, Type, Sparkles } from 'lucide-react';

export default function DesignPage() {
  return (
    <div className="container py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Palette className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Design System</h1>
        <p className="text-xl text-muted-foreground">
          Our comprehensive design guidelines and visual language for the E-Tutorial platform.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Theme System</CardTitle>
                <CardDescription>Three distinct visual themes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌈</span>
                  <h4 className="font-semibold">VIBGYOR</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vibrant, colorful theme with rainbow-inspired gradients and dynamic color schemes.
                </p>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌙</span>
                  <h4 className="font-semibold">Dark</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Modern dark theme optimized for reduced eye strain and night-time usage.
                </p>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">☀️</span>
                  <h4 className="font-semibold">Light</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clean, bright theme with high contrast for optimal daytime readability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Type className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Typography</CardTitle>
                <CardDescription>Consistent text hierarchy</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h1 className="text-4xl font-bold mb-1">Heading 1</h1>
                <p className="text-sm text-muted-foreground">4xl, bold - Main page titles</p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Heading 2</h2>
                <p className="text-sm text-muted-foreground">3xl, bold - Section headers</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Heading 3</h3>
                <p className="text-sm text-muted-foreground">2xl, bold - Subsection titles</p>
              </div>
              <div>
                <p className="text-base mb-1">Body Text</p>
                <p className="text-sm text-muted-foreground">base - Regular content</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Muted Text</p>
                <p className="text-sm text-muted-foreground">sm, muted - Secondary information</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layout className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Layout Principles</CardTitle>
                <CardDescription>Responsive and accessible design</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Mobile-First Approach</p>
                  <p className="text-sm text-muted-foreground">Designed for small screens, enhanced for larger displays</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Consistent Spacing</p>
                  <p className="text-sm text-muted-foreground">8px grid system for harmonious layouts</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Accessible Colors</p>
                  <p className="text-sm text-muted-foreground">WCAG AA compliant contrast ratios</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Clear Hierarchy</p>
                  <p className="text-sm text-muted-foreground">Visual weight guides user attention</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Design Tokens</CardTitle>
            <CardDescription>Core design variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Colors</h4>
                <div className="space-y-1 text-sm">
                  <p><code className="bg-muted px-2 py-1 rounded">--primary</code> - Brand color</p>
                  <p><code className="bg-muted px-2 py-1 rounded">--secondary</code> - Accent color</p>
                  <p><code className="bg-muted px-2 py-1 rounded">--background</code> - Base background</p>
                  <p><code className="bg-muted px-2 py-1 rounded">--foreground</code> - Text color</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Spacing</h4>
                <div className="space-y-1 text-sm">
                  <p><code className="bg-muted px-2 py-1 rounded">space-1</code> - 0.25rem (4px)</p>
                  <p><code className="bg-muted px-2 py-1 rounded">space-2</code> - 0.5rem (8px)</p>
                  <p><code className="bg-muted px-2 py-1 rounded">space-4</code> - 1rem (16px)</p>
                  <p><code className="bg-muted px-2 py-1 rounded">space-8</code> - 2rem (32px)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
