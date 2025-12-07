
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/contexts/AuthContext';
import ItemCard from '@/components/ItemCard';
import { formatDistanceToNow } from 'date-fns';

type Item = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
  category: string;
};

const RecommendationsSection = () => {
  const { user } = useAuth();
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Format the relative time for display
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Query to fetch recommended items
  const { data: recommendedItems, isLoading } = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // For now, just fetch recent items as recommendations
        // In a real app, we'd use search history and user preferences
        const { data, error } = await supabase
          .from('items')
          .select('id, title, price, image_url, location, created_at, category')
          .order('created_at', { ascending: false })
          .limit(6);
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // If user is not logged in, show nothing
  if (!user) {
    return null;
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">🎯 Recommended For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="w-3/4 h-5 rounded" />
              <Skeleton className="w-1/2 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // If there are no recommendations yet, don't show the section
  if (!recommendedItems || recommendedItems.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="mt-10"
    >
      <h2 className="text-2xl font-semibold mb-6">🎯 Recommended For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recommendedItems.map((item) => (
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
      </div>
    </motion.div>
  );
};

export default RecommendationsSection;
