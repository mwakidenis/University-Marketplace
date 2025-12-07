
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const HeroSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 px-6 md:py-20 md:px-12 text-center"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] opacity-20 mix-blend-overlay"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <motion.div 
          className="flex justify-center mb-4"
          variants={fadeInUp}
        >
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-2xl">
            🚀 🔥 💯
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-5xl font-bold mb-2"
          variants={fadeInUp}
        >
          Kuza-Market
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-white/90 mb-8"
          variants={fadeInUp}
        >
          Buy, sell, and discover amazing deals within your university community🤼
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={fadeInUp}
        >
          <Link to="/add-listing">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 font-medium">
              💰 Sell Something
            </Button>
          </Link>
          <Link to="/search">
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Search className="mr-2 h-4 w-4" />
              🔍 Browse Items
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
