import React from 'react';
import { ChefHat, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-primary-400 mb-4">
              <ChefHat className="w-8 h-8" />
              <span className="text-2xl font-bold font-serif">Food Pro</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Discover thousands of delicious recipes with AI-powered cooking assistance. 
              From simple home cooking to gourmet dishes, we've got you covered.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/recipes" className="text-gray-300 hover:text-primary-400 transition-colors">Browse Recipes</Link></li>
              <li><Link to="/premium" className="text-gray-300 hover:text-primary-400 transition-colors">Premium Features</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Cooking Tips</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Nutrition Guide</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Food Pro. All rights reserved. Built with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;