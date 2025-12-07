
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type PickupPoint = {
  id: string;
  name: string;
  location: string;
  description?: string;
  coordinates?: string;
};

const MOCKUP_PICKUP_POINTS: PickupPoint[] = [
  {
    id: '1',
    name: 'University Main Gate',
    location: 'Main Campus',
    description: 'Safe, public area with security guards'
  },
  {
    id: '2',
    name: 'Student Center',
    location: 'Central Campus',
    description: 'Indoor location with lots of foot traffic'
  },
  {
    id: '3',
    name: 'Library Entrance',
    location: 'Academic Block',
    description: 'Well-lit area with CCTV cameras'
  }
];

const PickupPoints: React.FC<{ itemLocation?: string }> = ({ itemLocation }) => {
  // For now, use mockup data
  // In a real app, we would fetch this from the database
  const pickupPoints = MOCKUP_PICKUP_POINTS;
  
  // Function to open in Google Maps
  const openInMaps = (point: PickupPoint) => {
    // First try using coordinates if available
    if (point.coordinates) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${point.coordinates}`, '_blank');
    } else {
      // Fall back to name + location
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${point.name}, ${point.location}`)}`, '_blank');
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="font-medium mb-3 flex items-center">
          <MapPin className="mr-2 h-4 w-4" /> 
          Safe Pickup Points
        </h3>
        <div className="space-y-3">
          {pickupPoints.map((point) => (
            <div key={point.id} className="border-b border-gray-100 pb-2 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{point.name}</p>
                  <p className="text-xs text-gray-500">{point.location}</p>
                  {point.description && (
                    <p className="text-xs text-gray-500 mt-1">{point.description}</p>
                  )}
                </div>
                <button 
                  onClick={() => openInMaps(point)}
                  className="text-marketplace-purple hover:text-marketplace-purple/80 p-1"
                  title="Open in Google Maps"
                >
                  <Navigation size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PickupPoints;
