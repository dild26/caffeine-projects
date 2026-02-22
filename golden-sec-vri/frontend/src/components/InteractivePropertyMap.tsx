import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import type { Property } from '../backend';
import { fromBackendUnitValue } from '../lib/unitConversion';

interface InteractivePropertyMapProps {
  properties: Property[];
  hoveredCoordinates: { lat: number; lng: number } | null;
}

export default function InteractivePropertyMap({ properties, hoveredCoordinates }: InteractivePropertyMapProps) {
  const defaultCoordinates = { lat: 13.081828, lng: 77.542533 };
  const [currentCoordinates, setCurrentCoordinates] = useState(defaultCoordinates);
  const [displayLocation, setDisplayLocation] = useState('Sudha Enterprises');

  useEffect(() => {
    if (hoveredCoordinates) {
      setCurrentCoordinates(hoveredCoordinates);
      const hoveredProperty = properties.find(
        p => {
          const lat = fromBackendUnitValue(p.latitude, 'degree').value;
          const lng = fromBackendUnitValue(p.longitude, 'degree').value;
          return lat === hoveredCoordinates.lat && lng === hoveredCoordinates.lng;
        }
      );
      if (hoveredProperty) {
        setDisplayLocation(hoveredProperty.name);
      }
    } else {
      setCurrentCoordinates(defaultCoordinates);
      setDisplayLocation('Sudha Enterprises');
    }
  }, [hoveredCoordinates, properties]);

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.5!2d${currentCoordinates.lng}!3d${currentCoordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzU0LjYiTiA3N8KwMzInMzMuMSJF!5e0!3m2!1sen!2sin!4v${Date.now()}`;

  return (
    <Card className="border-2 shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {displayLocation}
        </CardTitle>
        <CardDescription>
          {currentCoordinates.lat.toFixed(6)}, {currentCoordinates.lng.toFixed(6)}
        </CardDescription>
        <p className="text-sm text-muted-foreground">
          Hover over property cards to see their location on the map
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border-2 transition-all duration-300">
          <iframe
            key={`${currentCoordinates.lat}-${currentCoordinates.lng}`}
            src={mapUrl}
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${displayLocation} Location`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
