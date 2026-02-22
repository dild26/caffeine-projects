import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function DocumentationCenter() {
  return (
    <div className="space-y-6">
      <Card className="card-3d">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="w-6 h-6 text-primary" />
                Documentation Center
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Generate and export comprehensive platform documentation (Feature not yet implemented)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Documentation generation feature coming soon</p>
            <p className="text-sm text-muted-foreground mb-6">
              This feature will generate comprehensive specification documents including all sites, templates, and platform
              configurations
            </p>
          </div>

          <div className="pt-4 border-t">
            <img src="/assets/generated/architecture-diagram.dim_1024x768.png" alt="Architecture" className="w-full rounded-lg" />
            <p className="text-xs text-muted-foreground mt-2 text-center">MOAP Platform Architecture Overview</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
