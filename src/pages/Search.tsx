import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ItemCard from '@/components/ItemCard';
import { SearchIcon, FilterIcon, MapPinIcon, TagIcon, TrendingUpIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { Badge } from '@/components/ui/badge';

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Furniture",
  "Other"
];

const locations = [
  "All Locations", 
  "Hostel A", 
  "Hostel B", 
  "Hostel C", 
  "Hostel D", 
  "Campus Center", 
  "Kunene", 
  "Nchiiru", 
  "Kianjai"
];

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Date: Newest First', value: 'date_desc' },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [location, setLocation] = useState(searchParams.get('location') || 'all');
  
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('price_min') || '0', 10) || 0,
    parseInt(searchParams.get('price_max') || '1000', 10) || 1000
  ]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  
  useSearchHistory({
    query: searchQuery,
    isSearching: searchPerformed,
    category: category,
    location: location,
    priceRange: priceRange
  });
  
  useEffect(() => {
    const fetchTrendingSearches = async () => {
      setTrendingSearches([
        "textbooks",
        "laptop",
        "furniture",
        "calculator",
        "bike"
      ]);
    };
    
    fetchTrendingSearches();
  }, []);
  
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim() && !searchParams.has('category') && !searchParams.has('location')) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setSearchPerformed(true);
      
      try {
        let query = supabase
          .from('items')
          .select('*');
        
        if (searchQuery.trim()) {
          query = query.ilike('title', `%${searchQuery}%`);
        }
        
        if (category && category !== 'all') {
          query = query.eq('category', category.toLowerCase());
        }
        
        if (location && location !== 'all') {
          query = query.ilike('location', `%${location}%`);
        }
        
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
        
        switch (sortBy) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'date_desc':
            query = query.order('created_at', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        console.log('Search results:', data?.length || 0, 'items found');
        setSearchResults(data || []);
      } catch (error: any) {
        console.error('Search error:', error);
        toast({
          title: 'Search Failed',
          description: error.message || 'An error occurred during the search',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    performSearch();
  }, [searchQuery, category, location, priceRange, sortBy, toast, searchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ 
      q: searchQuery,
      category: category,
      location: location,
      price_min: priceRange[0].toString(),
      price_max: priceRange[1].toString(),
      sort: sortBy
    });
  };
  
  const handleApplyTrendingSearch = (term: string) => {
    setSearchQuery(term);
    setSearchParams({ 
      q: term,
      category: category,
      location: location,
      price_min: priceRange[0].toString(),
      price_max: priceRange[1].toString(),
      sort: sortBy
    });
  };
  
  const handlePriceRangeChange = (values: number[]) => {
    const newPriceRange: [number, number] = [
      values[0] ?? 0,
      values[1] ?? 1000
    ];
    setPriceRange(newPriceRange);
  };
  
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto py-6 dark:border-gray-700 dark:bg-gray-900"
      >
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            type="search"
            placeholder="Search for items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
        
        {!searchPerformed && trendingSearches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="h-4 w-4 text-marketplace-purple" />
              <h3 className="text-sm font-medium">Trending Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <Badge 
                  key={term} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-marketplace-purple hover:text-white transition-colors"
                  onClick={() => handleApplyTrendingSearch(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="md:w-1/4 p-4 rounded-md border">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FilterIcon className="mr-2 h-5 w-5" />
              Filter
            </h3>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <TagIcon className="mr-2 h-4 w-4 text-marketplace-purple" />
                Category
              </h4>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4 text-marketplace-purple" />
                Location
              </h4>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.filter(loc => loc !== "All Locations").map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Price Range</h4>
              <Slider
                defaultValue={priceRange}
                max={1000}
                step={10}
                onValueChange={handlePriceRangeChange}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>KSH {priceRange[0]}</span>
                <span>KSH {priceRange[1]}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Sort By</h4>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="md:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div 
                    key={index}
                    className="bg-gray-100 animate-pulse rounded-lg h-64"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((item: any) => (
                  <ItemCard 
                    key={item.id} 
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    image={item.image_url || ''}
                    location={item.location || 'Unknown location'}
                    date={new Date(item.created_at).toLocaleDateString()}
                  />
                ))}
                {searchResults.length === 0 && searchPerformed && (
                  <div className="text-center col-span-full p-8">
                    <div className="text-gray-400 mb-2">
                      <SearchIcon size={48} className="mx-auto opacity-50" />
                    </div>
                    <h3 className="text-xl font-medium mb-1">No results found</h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setCategory('all');
                        setLocation('all');
                        setPriceRange([0, 1000]);
                        setSortBy('relevance');
                        setSearchParams({});
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default SearchPage;
