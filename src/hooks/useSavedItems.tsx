
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SavedItem = {
  id: string;
  user_id: string;
  item_id: string;
  created_at: string;
};

export const useSavedItems = () => {
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch saved items when the component mounts
  useEffect(() => {
    if (!user) {
      setSavedItems([]);
      setIsLoading(false);
      return;
    }

    const fetchSavedItems = async () => {
      try {
        setIsLoading(true);
        
        // Call the RPC function to get the user's saved items
        const { data, error } = await supabase
          .rpc('get_user_saved_items', { user_id_param: user.id });

        if (error) {
          console.error('Error fetching saved items:', error);
          return;
        }
        
        // Extract item IDs from the saved items
        const itemIds = data ? data.map((item: any) => item.item_id) : [];
        setSavedItems(itemIds);
      } catch (error: any) {
        console.error('Error fetching saved items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedItems();
  }, [user]);

  const toggleSavedItem = async (itemId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save items",
        variant: "destructive"
      });
      return;
    }

    try {
      const isSaved = savedItems.includes(itemId);

      if (isSaved) {
        // Remove from saved items using the RPC function
        const { error } = await supabase.rpc('remove_saved_item', { 
          user_id_param: user.id, 
          item_id_param: itemId 
        });

        if (error) throw error;

        setSavedItems(savedItems.filter(id => id !== itemId));
        toast({
          title: "Item Removed",
          description: "Item removed from your saved items"
        });
      } else {
        // Add to saved items using the RPC function
        const { error } = await supabase.rpc('add_saved_item', {
          user_id_param: user.id,
          item_id_param: itemId
        });

        if (error) throw error;

        setSavedItems([...savedItems, itemId]);
        toast({
          title: "Item Saved",
          description: "Item added to your saved items"
        });
      }
    } catch (error: any) {
      console.error('Error toggling saved item:', error);
      toast({
        title: "Error",
        description: "Failed to update saved items",
        variant: "destructive"
      });
    }
  };

  const isSaved = (itemId: string) => {
    return savedItems.includes(itemId);
  };

  return { savedItems, isLoading, toggleSavedItem, isSaved };
};
