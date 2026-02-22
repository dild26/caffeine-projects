import { useState } from 'react';
import { useGetProperties } from '../hooks/useQueries';
import PropertyCard from './PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2 } from 'lucide-react';
import InteractivePropertyMap from './InteractivePropertyMap';

export default function PropertyGrid() {
  const { data: properties, isLoading } = useGetProperties();
  const [hoveredProperty, setHoveredProperty] = useState<{ lat: number; lng: number } | null>(null);

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-foreground">Available Properties</h2>
        <p className="text-muted-foreground">
          Explore our curated selection of premium real estate investment opportunities
        </p>
      </div>

      {properties && properties.length > 0 ? (
        <>
          <InteractivePropertyMap 
            properties={properties} 
            hoveredCoordinates={hoveredProperty}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property}
                onHover={(coords) => setHoveredProperty(coords)}
                onLeave={() => setHoveredProperty(null)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
          <Building2 className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="mb-2 text-xl font-semibold text-foreground">No Properties Available</h3>
          <p className="text-muted-foreground">
            Properties will appear here once they are added. Subscribers can list properties for a small monthly fee.
          </p>
        </div>
      )}
    </div>
  );
}
