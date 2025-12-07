
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo className="h-8" />
            <p className="text-gray-500 text-sm">
              Campus Marketplace is your trusted platform for buying and selling items within the university community.
              Made by comrades for comrades😁🚀
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-500 hover:text-marketplace-purple">Home</Link></li>
              <li><Link to="/search" className="text-gray-500 hover:text-marketplace-purple">Browse All Items</Link></li>
              <li><Link to="/add-listing" className="text-gray-500 hover:text-marketplace-purple">Sell an Item</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/electronics" className="text-gray-500 hover:text-marketplace-purple">Electronics</Link></li>
              <li><Link to="/category/textbooks" className="text-gray-500 hover:text-marketplace-purple">Textbooks</Link></li>
              <li><Link to="/category/furniture" className="text-gray-500 hover:text-marketplace-purple">Furniture</Link></li>
              <li><Link to="/category/clothing" className="text-gray-500 hover:text-marketplace-purple">Clothing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500">Email: support@campusmarketplace.com</li>
              <li className="text-gray-500">Phone: +254 790767347</li>
              <li className="text-gray-500">Location: Student Center, Main Campus Meru University</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">© {currentYear} Kuza-Market Campus Marketplace. All rights reserved. Built By Comrades For Comrades😁</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
