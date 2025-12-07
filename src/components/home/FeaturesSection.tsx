
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Tag, Truck, ShieldCheck } from 'lucide-react';

const FeaturesSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    { icon: Users, emoji: "👥", title: "Community Based", description: "Trade with fellow students you can trust" },
    { icon: Tag, emoji: "🏷️", title: "Great Deals", description: "Find bargains on textbooks, electronics & more" },
    { icon: Truck, emoji: "⚡", title: "Quick & Easy", description: "List items in minutes and sell fast" },
    { icon: ShieldCheck, emoji: "🔒", title: "Secure", description: "Safe transactions within your campus" }
  ];

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-8 "
    >
      <h2 className="text-2xl font-semibold text-center mb-8">✨ Why Use Kuza-Market? ✨</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="flex flex-col items-center text-center p-4 rounded-lg border border-gray-100 shadow-sm bg-white hover:shadow-md hover:-translate-y-1 dark:border-gray-700 transition-all dark:bg-gray-900 duration-300"
          >
            <div className="bg-marketplace-purple/10 p-3 rounded-full mb-3">
              <feature.icon className="h-6 w-6 text-marketplace-purple" />
            </div>
            <h3 className="text-lg font-medium mb-1">{feature.emoji} {feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturesSection;
