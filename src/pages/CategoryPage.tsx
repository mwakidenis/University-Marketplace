
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import ItemCard from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPinIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ItemData = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
  category: string;
};

const sortOptions = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" }
];

// Common locations for filtering
const locations = [
  "All Locations", 
  "Hostel A", 
  "Hostel B", 
  "Hostel C", 
  "Hostel D", 
  "Campus Center", 
  "Library", 
  "Nchiiru", 
  "Kianjai"
];

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [items, setItems] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [location, setLocation] = useState('all');
  const { toast } = useToast();

  const categoryDisplayName = categoryName ? 
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 
    'Category';

  useEffect(() => {
    const fetchItems = async () => {
      if (!categoryName) return;
      
      setIsLoading(true);
      try {
        let query = supabase
          .from('items')
          .select('*');
        
        // Only apply category filter if not "all"
        if (categoryName.toLowerCase() !== 'all') {
          query = query.eq('category', categoryName.toLowerCase());
        }
        
        // Apply location filter if not "all"
        if (location !== 'all') {
          query = query.ilike('location', `%${location}%`);
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        console.log(`Category ${categoryName}: ${data?.length} items found`);
        setItems(data || []);
      } catch (error: any) {
        console.error('Error fetching items:', error);
        toast({
          title: "Error",
          description: "Failed to load category items",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, [categoryName, sortBy, location, toast]);
  
  return (
    <PageLayout>
      <div className="space-y-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link to="/" className="flex items-center text-marketplace-purple mb-2">
              <ArrowLeft size={16} className="mr-1" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold">{categoryDisplayName}</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <MapPinIcon size={16} className="text-gray-500" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.filter(loc => loc !== "All Locations").map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div 
                key={index} 
                className="animate-pulse bg-gray-100 rounded-lg aspect-[4/3]"
              ></div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map(item => (
              <ItemCard 
                key={item.id} 
                id={item.id}
                title={item.title} 
                price={item.price} 
                image={item.image_url || 'https://via.placeholder.com/300'} 
                location={item.location}
                date={new Date(item.created_at).toLocaleDateString()} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No items found in this category{location !== 'all' ? ` at ${location}` : ''}.</p>
            <div className="mt-4">
              <Link to="/add-listing">
                <Button>Add New Listing</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CategoryPage;
