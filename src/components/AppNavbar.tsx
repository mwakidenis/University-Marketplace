
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, PlusIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from './Logo';

const AppNavbar = () => {
  const isMobile = useIsMobile();
  
  return (
    <nav className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center">
          <Logo size="medium" variant="dark" />
        </Link>
        
        {!isMobile && (
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Search for items..." 
                className="w-full pl-10 pr-4 rounded-full"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/add-listing">
            <Button variant="outline" size={isMobile ? "icon" : "default"} className="rounded-full">
              <PlusIcon className="w-5 h-5" />
              {!isMobile && <span className="ml-2">Add Listing</span>}
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserIcon className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
