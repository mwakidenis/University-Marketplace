
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/contexts/AuthContext';
import ItemCard from '@/components/ItemCard';
import { formatDistanceToNow } from 'date-fns';
import { SparklesIcon, UserIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Item = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
  category: string;
};

const SmartRecommendations = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personalized');
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Format the relative time for display
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Query to fetch personalized recommendations based on user data
  const { data: personalizedItems, isLoading: personalizedLoading } = useQuery({
    queryKey: ['personalized-recommendations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // In a real implementation, this would use the user's search and browsing history
        // to recommend items they might be interested in
        const { data, error } = await supabase
          .from('items')
          .select('id, title, price, image_url, location, created_at, category')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching personalized recommendations:", error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Query to fetch trending items
  const { data: trendingItems, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-items'],
    queryFn: async () => {
      try {
        // In a real implementation, this would fetch the most viewed/saved items
        const { data, error } = await supabase
          .from('items')
          .select('id, title, price, image_url, location, created_at, category')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching trending items:", error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const isLoading = activeTab === 'personalized' ? personalizedLoading : trendingLoading;
  const items = activeTab === 'personalized' ? personalizedItems : trendingItems;
  
  // If user is not logged in and we're on personalized tab, redirect to trending
  useEffect(() => {
    if (!user && activeTab === 'personalized') {
      setActiveTab('trending');
    }
  }, [user, activeTab]);
  
  // If there are no recommendations and no trending items, don't show the section
  if ((!personalizedItems || personalizedItems.length === 0) && 
      (!trendingItems || trendingItems.length === 0)) {
    return null;
  }
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="my-10"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Smart Recommendations</h2>
          <TabsList>
            {user && (
              <TabsTrigger value="personalized" className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>For You</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="trending" className="flex items-center gap-1">
              <SparklesIcon className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {user && (
          <TabsContent value="personalized">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="w-full h-48 rounded-lg" />
                    <Skeleton className="w-3/4 h-5 rounded" />
                    <Skeleton className="w-1/2 h-5 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items && items.map((item: Item) => (
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
            )}
            {!isLoading && personalizedItems && personalizedItems.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500">Start browsing to get personalized recommendations!</p>
              </div>
            )}
          </TabsContent>
        )}
        
        <TabsContent value="trending">
          {trendingLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="w-full h-48 rounded-lg" />
                  <Skeleton className="w-3/4 h-5 rounded" />
                  <Skeleton className="w-1/2 h-5 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingItems && trendingItems.map((item: Item) => (
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
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SmartRecommendations;
