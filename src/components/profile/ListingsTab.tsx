
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ItemCard from '@/components/ItemCard';
import { Package, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

interface ItemData {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
}

interface ListingsTabProps {
  listings: ItemData[];
  refreshListings?: () => void;
}

const ListingsTab = ({ listings, refreshListings }: ListingsTabProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditItem = (itemId: string) => {
    // Navigate to edit page (to be implemented later)
    toast({
      title: "Edit Feature",
      description: "Edit functionality will be available soon!",
    });
  };

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemToDelete);

      if (error) throw error;

      toast({
        title: "Item Deleted",
        description: "Your listing has been successfully removed",
      });

      // Close dialog
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);

      // Refresh listings
      if (refreshListings) {
        refreshListings();
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 dark:border-gray-700 dark:bg-gray-900">
          {listings.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              <ItemCard 
                id={item.id}
                title={item.title} 
                price={item.price} 
                image={item.image_url || 'https://via.placeholder.com/300'} 
                location={item.location}
                date={new Date(item.created_at).toLocaleDateString()} 
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="flex items-center gap-1"
                  onClick={() => handleEditItem(item.id)}
                >
                  <Edit className="h-4 w-4" /> Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="flex items-center gap-1"
                  onClick={() => handleDeleteClick(item.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-gray-50">
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Items Listed Yet 📦</h3>
            <p className="text-gray-500 mb-6">Start selling by adding your first item to the marketplace!</p>
            <Link to="/add-listing">
              <Button size="lg" className="bg-marketplace-purple hover:bg-marketplace-darkPurple">
                🚀 Add New Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteItem}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListingsTab;
