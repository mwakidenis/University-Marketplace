
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EnhancedListingItemProps {
  id: string;
  title: string;
  price: number;
  image: string | null;
  location: string;
  created_at: string;
  status?: 'active' | 'sold' | 'pending' | 'featured';
  onFeature?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const EnhancedListingItem: React.FC<EnhancedListingItemProps> = ({
  id,
  title,
  price,
  image,
  location,
  created_at,
  status = 'active',
  onFeature,
  onRemove
}) => {
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });
  
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    sold: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    featured: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 gap-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="h-16 w-16 flex-shrink-0">
        <img
          src={image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={title}
          className="h-full w-full object-cover rounded-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Error';
          }}
        />
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base truncate pr-2">{title}</h3>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
        
        <p className="text-lg font-bold text-marketplace-purple">KSH {price.toLocaleString()}</p>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{location}</span>
          <span>{timeAgo}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        {onFeature && status !== 'featured' && (
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => onFeature(id)}
          >
            Feature
          </Button>
        )}
        
        {onRemove && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="text-xs"
            onClick={() => onRemove(id)}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnhancedListingItem;
