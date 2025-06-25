import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.recipes': 'Recipes',
    'nav.premium': 'Premium',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    
    // Hero Section
    'hero.title': 'Discover Amazing Recipes',
    'hero.subtitle': 'From simple home cooking to gourmet dishes, find your perfect recipe with AI-powered assistance',
    'hero.cta': 'Explore Recipes',
    'hero.premium': 'Go Premium',
    
    // Features
    'features.title': 'Why Choose Recipe Master Pro?',
    'features.ai.title': 'AI Cooking Assistant',
    'features.ai.desc': 'Get personalized recipe suggestions based on your available ingredients',
    'features.premium.title': 'Premium Recipes',
    'features.premium.desc': 'Access exclusive professional recipes and video tutorials',
    'features.search.title': 'Smart Search',
    'features.search.desc': 'Find recipes by ingredients, cuisine, dietary preferences, and more',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search recipes...',
    'common.filter': 'Filter',
    'common.category': 'Category',
    'common.difficulty': 'Difficulty',
    'common.time': 'Cooking Time',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.recipes': 'রেসিপি',
    'nav.premium': 'প্রিমিয়াম',
    'nav.profile': 'প্রোফাইল',
    'nav.login': 'লগইন',
    'nav.logout': 'লগআউট',
    
    // Hero Section
    'hero.title': 'অসাধারণ রেসিপি আবিষ্কার করুন',
    'hero.subtitle': 'সাধারণ ঘরোয়া রান্না থেকে গুরমেট খাবার পর্যন্ত, AI সহায়তায় আপনার পারফেক্ট রেসিপি খুঁজুন',
    'hero.cta': 'রেসিপি দেখুন',
    'hero.premium': 'প্রিমিয়াম নিন',
    
    // Features
    'features.title': 'কেন রেসিপি মাস্টার প্রো বেছে নেবেন?',
    'features.ai.title': 'AI রান্নার সহায়ক',
    'features.ai.desc': 'আপনার হাতের উপকরণ অনুযায়ী ব্যক্তিগত রেসিপি সাজেশন পান',
    'features.premium.title': 'প্রিমিয়াম রেসিপি',
    'features.premium.desc': 'এক্সক্লুসিভ প্রফেশনাল রেসিপি এবং ভিডিও টিউটোরিয়াল দেখুন',
    'features.search.title': 'স্মার্ট সার্চ',
    'features.search.desc': 'উপকরণ, খাবারের ধরন, ডায়েট পছন্দ অনুযায়ী রেসিপি খুঁজুন',
    
    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.search': 'রেসিপি খুঁজুন...',
    'common.filter': 'ফিল্টার',
    'common.category': 'ক্যাটাগরি',
    'common.difficulty': 'কঠিনতা',
    'common.time': 'রান্নার সময়',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};