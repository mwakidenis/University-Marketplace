
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import { Skeleton } from "@/components/ui/skeleton";

interface Item {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
}

interface ItemsSectionProps {
  featuredItems: Item[];
  recentItems: Item[];
  isLoading: boolean;
  formatRelativeTime: (dateString: string) => string;
}

const ItemsSection = ({ featuredItems, recentItems, isLoading, formatRelativeTime }: ItemsSectionProps) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // Faster stagger animation
      }
    }
  };

  // Loading skeleton component for better UX
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="w-full h-48 rounded-lg" />
          <Skeleton className="w-3/4 h-5 rounded" />
          <Skeleton className="w-1/2 h-5 rounded" />
          <div className="flex justify-between mt-1">
            <Skeleton className="w-1/3 h-4 rounded" />
            <Skeleton className="w-1/3 h-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderItemsGrid = (items: Item[], label: string) => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    
    if (items.length === 0) {
      return (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No {label.toLowerCase()} items available</p>
          <Link to="/add-listing" className="mt-2 inline-block text-marketplace-purple hover:underline">
            Be the first to add an item! 🎉
          </Link>
        </div>
      );
    }

    return (
      <motion.div 
        variants={staggerContainer} 
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {items.map((item) => (
          <motion.div 
            key={item.id} 
            variants={fadeInUp}
            className="hover:-translate-y-1 transition-all duration-200"
          >
            <ItemCard 
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image_url || ''}
              location={item.location}
              date={formatRelativeTime(item.created_at)}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }} // Improved margin for earlier loading
      variants={fadeInUp}
      className="bg-white rounded-lg shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-700 p-6"
    >
      <h2 className="text-2xl font-semibold mb-6">🛍️ Explore Items</h2>
      
      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="featured" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Featured Items ✨
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Recent Listings 🆕
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured">
          {renderItemsGrid(featuredItems, "Featured")}
          {featuredItems.length > 0 && (
            <div className="mt-6 text-center">
              <Link to="/search" className="inline-flex items-center bg-marketplace-purple/10 text-marketplace-purple px-4 py-2 rounded-full hover:bg-marketplace-purple/20 transition-colors">
                Browse all items ✨
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          {renderItemsGrid(recentItems, "Recent")}
          {recentItems.length > 0 && (
            <div className="mt-6 text-center">
              <Link to="/search" className="inline-flex items-center bg-marketplace-purple/10 dark:bg-gray-900 text-marketplace-purple px-4 py-2 rounded-full hover:bg-marketplace-purple/20 transition-colors">
                Browse all items 🆕
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ItemsSection;
