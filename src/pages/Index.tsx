
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import PageLayout from '@/components/layout/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import Categories from '@/components/Categories';
import FeaturesSection from '@/components/home/FeaturesSection';
import ItemsSection from '@/components/home/ItemsSection';
import CallToAction from '@/components/home/CallToAction';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import SmartRecommendations from '@/components/home/SmartRecommendations';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  // Format the relative time for display
  const formatRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Query to fetch featured items
  const { data: featuredItems = [], isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('id, title, price, image_url, location, created_at')
        .limit(8)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query to fetch recent items
  const { data: recentItems = [], isLoading: isRecentLoading } = useQuery({
    queryKey: ['recentItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('id, title, price, image_url, location, created_at')
        .limit(8)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const isLoading = isFeaturedLoading || isRecentLoading;

  return (
    <PageLayout>
      <HeroSection />
      <Categories />
      <SmartRecommendations />
      <ItemsSection 
        featuredItems={featuredItems} 
        recentItems={recentItems} 
        isLoading={isLoading} 
        formatRelativeTime={formatRelativeTime} 
      />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToAction />
    </PageLayout>
  );
};

export default Index;
