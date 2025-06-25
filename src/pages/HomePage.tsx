import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Crown, Search, Star, Clock, Users, ChefHat, Heart, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const featuredRecipes = [
    {
      id: 1,
      title: 'Creamy Chicken Alfredo',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '30 min',
      difficulty: 'Easy',
      rating: 4.8,
      isPremium: false
    },
    {
      id: 2,
      title: 'Spicy Thai Curry',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '45 min',
      difficulty: 'Medium',
      rating: 4.9,
      isPremium: true
    },
    {
      id: 3,
      title: 'Classic Beef Burger',
      image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '20 min',
      difficulty: 'Easy',
      rating: 4.7,
      isPremium: false
    }
  ];

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: t('features.ai.title'),
      description: 'Get personalized recipe suggestions and cooking tips powered by Gemini AI',
      color: 'bg-gradient-to-br from-secondary-400 to-secondary-600'
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: t('features.premium.title'),
      description: t('features.premium.desc'),
      color: 'bg-gradient-to-br from-accent-400 to-accent-600'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: t('features.search.title'),
      description: t('features.search.desc'),
      color: 'bg-gradient-to-br from-primary-400 to-primary-600'
    }
  ];

  const stats = [
    { icon: <ChefHat className="w-6 h-6" />, label: 'Recipes', value: '10,000+' },
    { icon: <Users className="w-6 h-6" />, label: 'Users', value: '50,000+' },
    { icon: <Heart className="w-6 h-6" />, label: 'Favorites', value: '1M+' },
    { icon: <Star className="w-6 h-6" />, label: 'Rating', value: '4.9/5' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-bounce-subtle"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-200 rounded-full opacity-20 animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent-200 rounded-full opacity-20 animate-bounce-subtle" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-serif">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              From simple home cooking to gourmet dishes, find your perfect recipe with AI-powered assistance from Gemini AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/recipes"
                className="bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('hero.cta')}
              </Link>
              <Link
                to="/premium"
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg border-2 border-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Crown className="w-5 h-5 inline mr-2" />
                {t('hero.premium')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full text-primary-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the powerful features that make Food Pro the ultimate cooking companion with AI assistance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`${feature.color} p-8 text-white relative`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    {feature.icon}
                    <h3 className="text-2xl font-bold mt-4 mb-2">{feature.title}</h3>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
              Featured Recipes
            </h2>
            <p className="text-xl text-gray-600">
              Try these popular recipes loved by our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {recipe.isPremium && (
                      <span className="bg-gradient-to-r from-accent-400 to-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-lg flex items-center">
                    <Star className="w-4 h-4 text-accent-500 mr-1" />
                    <span className="text-sm font-semibold">{recipe.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{recipe.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      <span className="text-sm">{recipe.difficulty}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/recipes"
              className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Recipes
              <Search className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Ready to Start Cooking?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of home cooks who have transformed their kitchen skills with Food Pro and AI assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/recipes"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Free Recipes
            </Link>
            <Link
              to="/premium"
              className="bg-accent-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Crown className="w-5 h-5 inline mr-2" />
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;