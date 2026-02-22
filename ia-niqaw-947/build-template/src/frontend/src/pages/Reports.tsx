import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

export default function Reports() {
  const reports = [
    { name: 'Sales Report', description: 'Monthly sales performance and trends', date: '2025-01-15' },
    { name: 'Customer Report', description: 'Customer acquisition and retention metrics', date: '2025-01-10' },
    { name: 'Financial Report', description: 'Revenue, expenses, and profit analysis', date: '2025-01-05' },
    { name: 'Product Report', description: 'Product performance and inventory status', date: '2025-01-01' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and download business reports</p>
      </div>

      <div className="grid gap-4">
        {reports.map((report, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Generated on {new Date(report.date).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
