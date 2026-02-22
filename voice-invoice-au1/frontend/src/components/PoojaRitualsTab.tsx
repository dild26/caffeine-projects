import { useGetAllPoojaRituals } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Flower2, IndianRupee } from 'lucide-react';

export default function PoojaRitualsTab() {
  const { data: rituals, isLoading } = useGetAllPoojaRituals();

  const formatAmount = (amount: bigint) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flower2 className="h-5 w-5 text-primary" />
            Available Pooja Rituals
          </CardTitle>
          <CardDescription>Select a ritual to make a donation or payment</CardDescription>
        </CardHeader>
      </Card>

      {!rituals || rituals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Flower2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No rituals available</h3>
            <p className="text-sm text-muted-foreground">
              Pooja rituals will be displayed here once added by administrators
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rituals.map((ritual) => (
            <Card key={ritual.id} className="group transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{ritual.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {ritual.category}
                    </Badge>
                  </div>
                  <Flower2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Donation Type:</span>
                    <span className="font-medium">{ritual.donationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <IndianRupee className="h-3 w-3" />
                      {formatAmount(ritual.price)}
                    </span>
                  </div>
                  {ritual.horoscopeReference && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Horoscope:</span>
                      <span className="font-medium">{ritual.horoscopeReference}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Make Donation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
