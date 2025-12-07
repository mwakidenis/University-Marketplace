import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SaveButton from '@/components/SaveButton';
import { motion } from 'framer-motion';
import PickupPoints from '@/components/PickupPoints';

type ItemDetailType = {
  id: string;
  title: string;
  price: number;
  description: string;
  image_url: string | null;
  location: string;
  created_at: string;
  category: string;
  contact_email: string;
  contact_phone: string | null;
  user_id: string;
};

type SellerType = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [itemDetails, setItemDetails] = useState<ItemDetailType | null>(null);
  const [seller, setSeller] = useState<SellerType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchItemDetails() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch item details
        const { data: item, error: itemError } = await supabase
          .from('items')
          .select('*')
          .eq('id', id)
          .single();
        
        if (itemError) throw itemError;
        
        if (!item) {
          toast({
            title: "Item Not Found",
            description: "The requested listing could not be found",
            variant: "destructive"
          });
          return;
        }
        
        setItemDetails(item);
        
        // Fetch seller details
        const { data: sellerData, error: sellerError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', item.user_id)
          .single();
        
        if (!sellerError) {
          setSeller(sellerData);
        }
        
        // Track view for recommendation system if not the seller
        // We need to create the item_views table first
        // Comment out for now
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && session.user.id !== item.user_id) {
          // console.log('Would track view:', {
          //   item_id: id,
          //   user_id: session.user.id
          // });
          
          // Uncomment after creating the table:
          // await supabase.from('item_views').insert({
          //   item_id: id,
          //   user_id: session.user.id
          // });
        }
      } catch (error: any) {
        console.error('Error fetching item details:', error);
        toast({
          title: "Error",
          description: "Failed to load item details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchItemDetails();
  }, [id, toast]);
  
  // Create WhatsApp message with item details
  const createWhatsAppMessage = (item: ItemDetailType) => {
    return encodeURIComponent(
      `Hi there! I'm interested in your "${item.title}" for KSH ${item.price.toLocaleString()} that I saw on KuzaMarket. Is it still available? Can we meet at one of the safe pickup points?`
    );
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto py-6">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!itemDetails) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto py-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Item Not Found💀</h1>
          <p className="mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const sellerName = seller?.full_name || itemDetails.contact_email.split('@')[0] || 'Seller';
  
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-6 dark:border-gray-700 dark:bg-gray-900">
        <Link to="/search" className="inline-flex items-center text-marketplace-purple mb-4 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to search
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Item Images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-square overflow-hidden rounded-xl border relative">
              <img 
                src={itemDetails.image_url || 'https://via.placeholder.com/600'} 
                alt={itemDetails.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <SaveButton itemId={itemDetails.id} size="default" />
              </div>
            </div>
          </motion.div>
          
          {/* Item Details */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{itemDetails.title}</h1>
              </div>
              <p className="text-3xl font-semibold text-marketplace-purple mt-2">KSH {itemDetails.price.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <span>{itemDetails.location}</span>
                <span>•</span>
                <span>Listed {formatDate(itemDetails.created_at)}</span>
              </div>
              <div className="mt-2 inline-block bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs">
                {itemDetails.category.charAt(0).toUpperCase() + itemDetails.category.slice(1)}
              </div>
            </div>
            
            <Card className="p-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{itemDetails.description}</p>
            </Card>
            
            {/* Pickup Points Integration */}
            <PickupPoints itemLocation={itemDetails.location} />
            
            <Card className="p-4">
              <h3 className="font-medium mb-3">Contact Seller</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="font-medium">{sellerName}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={`mailto:${itemDetails.contact_email}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full">
                      Email Seller
                    </Button>
                  </a>
                  {itemDetails.contact_phone && (
                    <a 
                      href={`https://wa.me/${itemDetails.contact_phone.replace(/[^0-9]/g, '')}?text=${createWhatsAppMessage(itemDetails)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ItemDetails;
