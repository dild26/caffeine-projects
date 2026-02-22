import { usePinnedSchemes } from '@/hooks/usePinnedSchemes';
import SchemeCard from './SchemeCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookmarkIcon } from 'lucide-react';

export default function PinnedSchemes() {
  const { pinnedSchemes } = usePinnedSchemes();

  if (pinnedSchemes.length === 0) {
    return null;
  }

  return (
    <div id="pinned-schemes" className="scroll-mt-20">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookmarkIcon className="h-5 w-5 text-primary" />
            <CardTitle>My Pinned Schemes</CardTitle>
          </div>
          <CardDescription>
            Schemes you've saved for quick access ({pinnedSchemes.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedSchemes.map((scheme) => (
              <SchemeCard key={Number(scheme.id)} scheme={scheme} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
