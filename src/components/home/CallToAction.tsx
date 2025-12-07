
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

const CallToAction = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const floatEmoji = {
    initial: { y: 0 },
    animate: { y: [-3, 3, -3], transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-10 text-center md:text-left space-y-4 text-white relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white"></div>
      </div>
      
      {/* Content */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div className="flex justify-center md:justify-start space-x-3">
            <motion.div initial="initial" animate="animate" variants={floatEmoji} className="text-3xl">💰</motion.div>
            <motion.div initial="initial" animate="animate" variants={floatEmoji} className="text-3xl">🛒</motion.div>
            <motion.div initial="initial" animate="animate" variants={floatEmoji} className="text-3xl">💸</motion.div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold">Ready to sell your items?</h2>
          <p className="text-white/90 text-lg md:max-w-md">Get started in minutes and reach thousands of students on campus. Your next sale is just a few clicks away!</p>
          
          <Link to="/add-listing" className="inline-block">
            <Button size="lg" className="bg-white text-marketplace-purple hover:bg-white/90 mt-2 font-medium group">
              🚀 List Your Item Now
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute -top-12 -right-6 bg-yellow-400 text-black font-bold py-1 px-4 rounded-full transform rotate-12">
              Sell Fast!
            </div>
            <div className="w-40 h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-5xl">🔥</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CallToAction;
