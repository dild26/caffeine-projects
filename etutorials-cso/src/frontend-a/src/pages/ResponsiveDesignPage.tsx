import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Smartphone, Tablet, Monitor, Layout } from 'lucide-react';

export default function ResponsiveDesignPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Layout className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Responsive Design</h1>
        <p className="text-xl text-muted-foreground">
          Seamless experience across all devices and screen sizes.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mobile-First Approach</CardTitle>
            <CardDescription>
              Designed for optimal performance on all devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The E-Tutorial platform is built with a mobile-first responsive design philosophy, ensuring that the 
              interface adapts seamlessly to any screen size, from smartphones to large desktop monitors.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Mobile</h4>
                <p className="text-xs text-muted-foreground">320px - 767px</p>
                <p className="text-xs text-muted-foreground mt-2">Optimized touch interface</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <Tablet className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Tablet</h4>
                <p className="text-xs text-muted-foreground">768px - 1023px</p>
                <p className="text-xs text-muted-foreground mt-2">Balanced layout</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <Monitor className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Desktop</h4>
                <p className="text-xs text-muted-foreground">1024px+</p>
                <p className="text-xs text-muted-foreground mt-2">Full-featured interface</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adaptive Navigation</CardTitle>
            <CardDescription>
              Navigation that adjusts to your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The navigation system automatically adapts based on screen size to provide the best user experience:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  Desktop Navigation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Full horizontal menu bar with all primary links visible. Dropdown menu for additional pages. 
                  Hover effects and smooth transitions enhance the experience.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  Mobile Navigation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Hamburger menu icon opens a full-screen navigation drawer. All links organized in a scrollable 
                  list for easy access. Touch-optimized spacing and sizing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsive Components</CardTitle>
            <CardDescription>
              UI elements that adapt to screen size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Grid Layouts:</strong> Automatically adjust from multi-column on desktop to single-column on mobile.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Cards:</strong> Stack vertically on small screens, display in grids on larger screens.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Tables:</strong> Transform into card-based layouts on mobile for better readability.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Forms:</strong> Full-width inputs on mobile, optimized sizing on desktop.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Modals:</strong> Full-screen on mobile, centered overlays on desktop.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Touch Optimization</CardTitle>
            <CardDescription>
              Enhanced experience for touch devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              All interactive elements are optimized for touch input on mobile and tablet devices:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Touch Targets</h4>
                <p className="text-sm text-muted-foreground">
                  Minimum 44x44px touch targets for buttons and links, ensuring easy tapping without errors.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Gesture Support</h4>
                <p className="text-sm text-muted-foreground">
                  Swipe gestures for carousels and drawers, pinch-to-zoom where appropriate.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Spacing</h4>
                <p className="text-sm text-muted-foreground">
                  Increased padding and margins on mobile to prevent accidental taps.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Feedback</h4>
                <p className="text-sm text-muted-foreground">
                  Visual feedback on touch interactions with active states and animations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Optimization</CardTitle>
            <CardDescription>
              Fast loading on all devices and connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Lazy Loading:</strong> Images and components load only when needed to reduce initial load time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Optimized Assets:</strong> Compressed images and minified code for faster downloads.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Responsive Images:</strong> Different image sizes served based on device screen size.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Caching:</strong> Smart caching strategies to reduce data usage on mobile networks.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
