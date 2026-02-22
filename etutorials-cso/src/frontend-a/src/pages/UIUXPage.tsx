import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Palette, Layout, Zap, Eye, Accessibility } from 'lucide-react';

export default function UIUXPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Palette className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">UI/UX Design</h1>
        <p className="text-xl text-muted-foreground">
          Design principles and user experience philosophy behind the E-Tutorial platform.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Design Philosophy
            </CardTitle>
            <CardDescription>
              User-centered design for optimal learning experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The E-Tutorial platform is designed with a focus on clarity, accessibility, and ease of use. Every 
              interface element is carefully crafted to support the learning journey and minimize cognitive load.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Clarity</h4>
                <p className="text-sm text-muted-foreground">
                  Clear visual hierarchy and intuitive navigation make it easy to find what you need.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Consistency</h4>
                <p className="text-sm text-muted-foreground">
                  Consistent patterns and components across the platform reduce learning curve.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Feedback</h4>
                <p className="text-sm text-muted-foreground">
                  Immediate visual feedback for all user actions builds confidence and trust.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Simplicity</h4>
                <p className="text-sm text-muted-foreground">
                  Clean, uncluttered interfaces focus attention on what matters most.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Color System
            </CardTitle>
            <CardDescription>
              OKLCH-based color palette for modern, accessible design
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The platform uses the OKLCH color space for perceptually uniform colors that maintain consistent 
              brightness and saturation. This ensures excellent readability and accessibility.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary" />
                <div>
                  <p className="font-semibold text-sm">Primary</p>
                  <p className="text-xs text-muted-foreground">Main brand color for key actions and highlights</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-secondary" />
                <div>
                  <p className="font-semibold text-sm">Secondary</p>
                  <p className="text-xs text-muted-foreground">Supporting color for secondary elements</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-accent" />
                <div>
                  <p className="font-semibold text-sm">Accent</p>
                  <p className="text-xs text-muted-foreground">Emphasis color for special features</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-muted" />
                <div>
                  <p className="font-semibold text-sm">Muted</p>
                  <p className="text-xs text-muted-foreground">Subtle backgrounds and borders</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              Layout Principles
            </CardTitle>
            <CardDescription>
              Structured layouts for optimal content organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Grid System:</strong> Consistent 12-column grid ensures alignment and visual harmony.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Whitespace:</strong> Generous spacing between elements improves readability and focus.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Card-Based Design:</strong> Content organized in cards for clear separation and hierarchy.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Responsive Breakpoints:</strong> Layouts adapt smoothly across all screen sizes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Visual Hierarchy:</strong> Size, color, and position guide attention to important elements.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Interaction Design
            </CardTitle>
            <CardDescription>
              Smooth, intuitive interactions throughout the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Every interaction is designed to feel natural and responsive, with appropriate feedback and animations:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Hover States</h4>
                <p className="text-sm text-muted-foreground">
                  Subtle color changes and elevation effects indicate interactive elements.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Loading States</h4>
                <p className="text-sm text-muted-foreground">
                  Spinners and skeleton screens provide feedback during data loading.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Transitions</h4>
                <p className="text-sm text-muted-foreground">
                  Smooth animations between states create a polished, professional feel.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Error Handling</h4>
                <p className="text-sm text-muted-foreground">
                  Clear error messages with actionable solutions help users recover quickly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" />
              Accessibility
            </CardTitle>
            <CardDescription>
              Inclusive design for all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>WCAG Compliance:</strong> Meets AA standards for color contrast and text sizing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Keyboard Navigation:</strong> Full keyboard support for all interactive elements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Screen Reader Support:</strong> Semantic HTML and ARIA labels for assistive technologies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Focus Indicators:</strong> Clear visual indicators for keyboard focus states.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Dark Mode:</strong> Full dark mode support reduces eye strain in low-light conditions.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Library</CardTitle>
            <CardDescription>
              Reusable components built with shadcn/ui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The platform uses a comprehensive component library based on shadcn/ui and Radix UI primitives, 
              ensuring consistency and accessibility across all interface elements.
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-muted rounded-lg">Buttons</div>
              <div className="p-3 bg-muted rounded-lg">Cards</div>
              <div className="p-3 bg-muted rounded-lg">Forms</div>
              <div className="p-3 bg-muted rounded-lg">Dialogs</div>
              <div className="p-3 bg-muted rounded-lg">Dropdowns</div>
              <div className="p-3 bg-muted rounded-lg">Tables</div>
              <div className="p-3 bg-muted rounded-lg">Badges</div>
              <div className="p-3 bg-muted rounded-lg">Alerts</div>
              <div className="p-3 bg-muted rounded-lg">Tooltips</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
