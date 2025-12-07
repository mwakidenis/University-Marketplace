
import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  BookIcon, 
  LaptopIcon, 
  ShirtIcon, 
  HomeIcon, 
  BriefcaseIcon, 
  CoffeeIcon, 
  ShoppingBagIcon,
  TrendingUpIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const categories = [
  { name: "All Items", icon: ShoppingBagIcon, path: "/search?category=all" },
  { name: "Electronics", icon: LaptopIcon, path: "/search?category=electronics" },
  { name: "Textbooks", icon: BookIcon, path: "/search?category=textbooks" },
  { name: "Furniture", icon: HomeIcon, path: "/search?category=furniture" },
  { name: "Clothing", icon: ShirtIcon, path: "/search?category=clothing" },
  { name: "School Supplies", icon: BriefcaseIcon, path: "/search?category=school%20supplies" },
  { name: "Dorm Essentials", icon: CoffeeIcon, path: "/search?category=dorm%20essentials" },
];

// Mock trending categories - in a real app, this would be fetched from the backend
const trendingCategories = [
  { name: "Textbooks", count: 24, path: "/search?category=textbooks" },
  { name: "Electronics", count: 18, path: "/search?category=electronics" },
  { name: "Furniture", count: 12, path: "/search?category=furniture" },
];

const Categories = () => {
  return (
    <div className="my-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">Browse Categories</h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 p-1">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={category.path}
                    className="flex flex-col items-center justify-center w-20 h-20 p-3 bg-white dark:bg-gray-800  rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:border-marketplace-purple hover:scale-105 transition-all duration-200"
                  >
                    <Icon className="w-6 h-6 text-marketplace-purple  dark:text-purple-400 mb-1" />
                    <span className="text-xs text-center break-words whitespace-normal leading-tight">{category.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* New trending section */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUpIcon className="w-4 h-4 text-marketplace-purple" />
          <h2 className="text-lg font-semibold">Trending Now</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingCategories.map((category) => (
            <Link key={category.name} to={category.path}>
              <Badge variant="outline" className="py-2 px-3 hover:bg-marketplace-purple hover:text-white transition-colors flex items-center gap-1">
                {category.name}
                <span className="bg-gray-100 text-gray-700 rounded-full text-xs px-2 py-0.5 ml-1">
                  {category.count}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
