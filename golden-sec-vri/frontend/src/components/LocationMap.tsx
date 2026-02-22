import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function LocationMap() {
  const coordinates = { lat: 13.081828, lng: 77.542533 };
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.5!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzU0LjYiTiA3N8KwMzInMzMuMSJF!5e0!3m2!1sen!2sin!4v1234567890`;

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Sudha Enterprises Location
        </CardTitle>
        <CardDescription>
          {coordinates.lat}, {coordinates.lng}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border-2">
          <iframe
            src={mapUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sudha Enterprises Location"
          />
        </div>
      </CardContent>
    </Card>
  );
}
