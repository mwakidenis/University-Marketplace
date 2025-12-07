
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, PlusIcon, UserIcon } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: HomeIcon, path: '/', label: 'Home' },
    { icon: SearchIcon, path: '/search', label: 'Search' },
    { icon: PlusIcon, path: '/add-listing', label: 'Add' },
    { icon: UserIcon, path: '/profile', label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 md:hidden dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link to={item.path} key={item.path} className="flex flex-col items-center justify-center flex-1 h-full">
              <Icon 
                size={24} 
                className={`${isActive ? 'text-marketplace-purple' : 'text-gray-500'}`} 
              />
              <span className={`text-xs ${isActive ? 'text-marketplace-purple' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
