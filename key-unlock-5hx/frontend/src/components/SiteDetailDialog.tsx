import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { SiteConfig } from '../types';

interface SiteDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site: SiteConfig;
}

export default function SiteDetailDialog({ open, onOpenChange, site }: SiteDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] card-3d">
        <DialogHeader>
          <DialogTitle className="text-2xl">{site.name}</DialogTitle>
          <DialogDescription>{site.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-150px)] pr-4">
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={site.status === 'completed' ? 'default' : site.status === 'in-progress' ? 'secondary' : 'outline'}>
                {site.status}
              </Badge>
              <Badge variant="outline">Priority: {Number(site.priority)}</Badge>
              {site.category && <Badge variant="secondary">{site.category}</Badge>}
              {site.domainReference && <Badge variant="default">{site.domainReference}</Badge>}
              {site.isDefault && <Badge variant="outline">Default Site</Badge>}
            </div>

            <Separator />

            {/* Features */}
            {site.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <div className="grid gap-2">
                  {site.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-accent/5">
                      <span className="text-primary">•</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ML Prompt Seeds */}
            {site.mlPromptSeeds.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">ML Prompt Seeds</h3>
                <div className="flex flex-wrap gap-2">
                  {site.mlPromptSeeds.map((seed, idx) => (
                    <Badge key={idx} variant="outline">
                      {seed}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* MVP Checklist */}
            {site.mvpChecklist.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">MVP Checklist</h3>
                <div className="grid gap-2">
                  {site.mvpChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/5">
                      <span className="text-secondary">✓</span>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integration Notes */}
            {site.integrationNotes && (
              <div>
                <h3 className="font-semibold mb-3">Integration Notes</h3>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted">{site.integrationNotes}</p>
              </div>
            )}

            {/* Additional Notes */}
            {site.notes && (
              <div>
                <h3 className="font-semibold mb-3">Additional Notes</h3>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted">{site.notes}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
