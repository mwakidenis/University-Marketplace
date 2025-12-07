
import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSavedItems } from '@/hooks/useSavedItems';
import { motion } from 'framer-motion';
import { Package, BookmarkIcon } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Import the components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import ListingsTab from '@/components/profile/ListingsTab';
import SavedItemsTab from '@/components/profile/SavedItemsTab';

type ProfileData = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  phone: string | null;
  created_at?: string;
};

type ItemData = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  location: string;
  created_at: string;
};

const profileSchema = z.object({
  full_name: z.string().min(2, "Name is required").max(50),
  phone: z.string().optional(),
  university: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { savedItems } = useSavedItems();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [myListings, setMyListings] = useState<ItemData[]>([]);
  const [savedListings, setSavedListings] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      university: profile?.university || "",
    },
  });

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Load user profile and listings
  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      setProfile(profileData);
      
      // Set form values
      form.reset({
        full_name: profileData?.full_name || "",
        phone: profileData?.phone || "",
        university: profileData?.university || "",
      });
      
      // Fetch user's listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (listingsError) throw listingsError;
      setMyListings(listingsData || []);
    } catch (error: any) {
      console.error('Error loading profile data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, form]);
  
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  // Fetch saved items when savedItems ids change
  useEffect(() => {
    async function fetchSavedListings() {
      if (!savedItems.length) {
        setSavedListings([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .in('id', savedItems);
        
        if (error) throw error;
        setSavedListings(data || []);
      } catch (error) {
        console.error('Error fetching saved listings:', error);
      }
    }

    fetchSavedListings();
  }, [savedItems]);

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          phone: values.phone,
          university: values.university,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfile({
        ...profile!,
        full_name: values.full_name,
        phone: values.phone,
        university: values.university,
      });
      
      setIsEditing(false);
      
      toast({
        title: '✅ Profile Updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: '❌ Update Failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-marketplace-purple/20 rounded-full"></div>
            <div className="h-4 bg-marketplace-purple/20 rounded w-48"></div>
            <div className="h-3 bg-marketplace-purple/10 rounded w-36"></div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const joinedDate = profile?.created_at ? formatDate(profile.created_at) : 'Recently';
  
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto space-y-8 dark:border-gray-700 dark:bg-gray-900">
        {/* Profile Header */}
        <ProfileHeader 
          displayName={displayName}
          email={user.email}
          phone={profile?.phone}
          joinedDate={joinedDate}
          university={profile?.university}
          avatarUrl={profile?.avatar_url}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSignOut={signOut}
        />
        
        {/* Edit Profile Form */}
        {isEditing && (
          <ProfileForm 
            form={form} 
            onSubmit={handleUpdateProfile} 
          />
        )}
        
        {/* Listings Tabs */}
        <Tabs defaultValue="myListings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="myListings" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Listings 📦
              {myListings.length > 0 && (
                <span className="bg-marketplace-purple text-white text-xs px-2 py-0.5 rounded-full">
                  {myListings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <BookmarkIcon className="h-4 w-4" />
              Saved Items 🔖
              {savedListings.length > 0 && (
                <span className="bg-marketplace-purple text-white text-xs px-2 py-0.5 rounded-full">
                  {savedListings.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TabsContent value="myListings" className="pt-0">
              <ListingsTab 
                listings={myListings} 
                refreshListings={loadUserData}
              />
            </TabsContent>
            
            <TabsContent value="saved" className="pt-0">
              <SavedItemsTab listings={savedListings} />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;
