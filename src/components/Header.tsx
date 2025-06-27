import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Search, User, Crown, Globe, Menu, X, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const { user, userProfile, logout, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
              <ChefHat className="w-8 h-8" />
              <span className="text-xl font-bold font-serif">Food Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                {t('nav.home')}
              </Link>
              <Link to="/recipes" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                {t('nav.recipes')}
              </Link>
              {user && (
                <Link to="/create-recipe" className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span>Create Recipe</span>
                </Link>
              )}
              <Link to="/premium" className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center space-x-1">
                <Crown className="w-4 h-4" />
                <span>{t('nav.premium')}</span>
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Switch Language"
              >
                <Globe className="w-5 h-5" />
                <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
              </button>

              {/* Search */}
              <button
                onClick={() => navigate('/recipes')}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Search Recipes"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                {loading ? (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <div className="flex items-center space-x-3">
                    {userProfile?.is_premium && (
                      <span className="bg-gradient-to-r from-accent-400 to-accent-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                        Premium
                      </span>
                    )}
                    <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                      <User className="w-5 h-5" />
                      <span className="hidden md:block font-medium">{userProfile?.name || user.email}</span>
                    </Link>
                    <button
                      onClick={handleAuthClick}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    {t('nav.login')}
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4 animate-slide-up">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/recipes" 
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {t('nav.recipes')}
                </Link>
                {user && (
                  <Link 
                    to="/create-recipe" 
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center space-x-1"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Recipe</span>
                  </Link>
                )}
                <Link 
                  to="/premium" 
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center space-x-1"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Crown className="w-4 h-4" />
                  <span>{t('nav.premium')}</span>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default Header;