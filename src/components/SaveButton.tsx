
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkIcon } from 'lucide-react';
import { useSavedItems } from '@/hooks/useSavedItems';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  itemId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'icon' | 'sm' | 'default' | 'lg';
}

const SaveButton: React.FC<SaveButtonProps> = ({ itemId, variant = 'outline', size = 'icon' }) => {
  const { user } = useAuth();
  const { isSaved, toggleSavedItem } = useSavedItems();
  
  const saved = isSaved(itemId);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedItem(itemId);
  };
  
  if (!user) return null;
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "rounded-full", 
        saved ? "text-marketplace-purple" : "text-gray-500"
      )}
      onClick={handleClick}
      aria-label={saved ? "Unsave item" : "Save item"}
    >
      <BookmarkIcon 
        className={cn("h-5 w-5", saved ? "fill-marketplace-purple" : "fill-none")} 
      />
    </Button>
  );
};

export default SaveButton;
