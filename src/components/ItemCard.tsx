
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SaveButton from '@/components/SaveButton';
import { Skeleton } from "@/components/ui/skeleton";

interface ItemCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  date: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ id, title, price, image, location, date }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [imgError, setImgError] = React.useState(false);

  return (
    <Link to={`/item/${id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md group h-full">
        <div className="relative w-full pt-[75%]">
          {isLoading && !imgError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <Skeleton className="h-full w-full" />
            </div>
          )}
          <img 
            src={image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={title}
            className={`absolute inset-0 object-cover w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
            loading="lazy" // Add lazy loading attribute
            decoding="async" // Hint to browser to decode asynchronously
            onLoad={() => setIsLoading(false)}
            onError={(e) => {
              setImgError(true);
              setIsLoading(false);
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Error';
            }}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <SaveButton itemId={id} />
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-base line-clamp-1">{title}</h3>
          <p className="text-lg font-bold text-marketplace-purple">KSH {price.toLocaleString()}</p>
        </CardContent>
        <CardFooter className="px-3 py-2 pt-0 flex justify-between text-xs text-gray-500">
          <span>{location}</span>
          <span>{date}</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ItemCard;
