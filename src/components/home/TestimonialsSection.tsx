
import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
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

  const testimonials = [
    { name: "Sarah M.", quote: "Sold my textbooks in just 1 day! Amazing platform!", avatar: "S", university: "Meru University" },
    { name: "John K.", quote: "Found exactly what I needed at a great price. Highly recommend!", avatar: "J", university: "MUST" },
    { name: "Michael O.", quote: "Much better than other marketplace apps. The campus focus is perfect!", avatar: "M", university: "Marimba Campus" },
    { name: "Lucy W.", quote: "The interface is so intuitive! Made selling my old laptop super easy.", avatar: "L", university: "MUST Town Campus" }
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="py-8"
    >
      <h2 className="text-2xl font-semibold text-center mb-8">❤️ Success Stories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="bg-marketplace-purple text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                {testimonial.avatar}
              </div>
              <div>
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.university}</p>
              </div>
            </div>
            <p className="text-gray-300">"{testimonial.quote}"</p>
            <div className="mt-3 text-amber-500">★★★★★</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
