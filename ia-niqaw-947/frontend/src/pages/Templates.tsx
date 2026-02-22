import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export default function Templates() {
  const templates = [
    {
      name: 'Invoice Template',
      description: 'Professional invoice template for billing',
      category: 'Billing',
    },
    {
      name: 'Contact Import CSV',
      description: 'Template for bulk contact import',
      category: 'CRM',
    },
    {
      name: 'Product Catalog',
      description: 'Product listing template',
      category: 'Products',
    },
    {
      name: 'Sales Report',
      description: 'Monthly sales report template',
      category: 'Reports',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Templates</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Download templates to streamline your workflow
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Category: {template.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
