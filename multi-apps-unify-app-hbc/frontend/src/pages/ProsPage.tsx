import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Check } from 'lucide-react';

export default function ProsPage() {
  const pros = [
    {
      category: 'Efficiency',
      items: [
        'Automatic synchronization saves time and reduces manual work',
        'Real-time updates ensure consistency across formats',
        'Single source of truth with spec.yaml',
      ],
    },
    {
      category: 'Security',
      items: [
        'Role-based access control for sensitive operations',
        'Internet Identity authentication',
        'Admin-only controls for critical functions',
      ],
    },
    {
      category: 'Usability',
      items: [
        'Intuitive interface for file management',
        'Built-in file viewers with syntax highlighting',
        'Version tracking and history',
      ],
    },
    {
      category: 'Reliability',
      items: [
        'Backup and restore capabilities',
        'Comprehensive error handling',
        'Synchronization status monitoring',
      ],
    },
  ];

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Platform Advantages</h1>
        <p className="text-lg text-muted-foreground">
          Discover why Multi-Apps-Unify is the right choice for specification management
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2">
          {pros.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{section.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
