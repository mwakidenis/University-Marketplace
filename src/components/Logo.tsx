
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'light' | 'dark';
  className?: string; // Add className prop
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  variant = 'dark',
  className = '' 
}) => {
  
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
  };
  
  const colorClasses = {
    light: 'text-white',
    dark: 'text-gray-900',
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <span className={`font-bold tracking-tight ${sizeClasses[size]} ${colorClasses[variant]}`}>
        <span className="text-marketplace-purple">Kuza</span>
        <span className="text-gray-900 dark:text-white">Market</span>
      </span>
    </Link>
  );
};

export default Logo;
