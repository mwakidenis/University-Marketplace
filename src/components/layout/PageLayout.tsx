
import React from 'react';
import AppNavbar from '../AppNavbar';
import BottomNav from '../BottomNav';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar />
      <main className="flex-1 container px-4 pb-20 pt-6 md:py-8">
        {children}
      </main>
      <Footer />
      {isMobile && <BottomNav />}
    </div>
  );
};

export default PageLayout;
