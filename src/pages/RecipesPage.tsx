import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, Star, Crown, Users, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const RecipesPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const recipes = [
    {
      id: 1,
      title: 'Creamy Chicken Alfredo',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '30 min',
      difficulty: 'Easy',
      rating: 4.8,
      reviews: 124,
      category: 'main',
      isPremium: false,
      calories: 520,
      servings: 4
    },
    {
      id: 2,
      title: 'Spicy Thai Curry',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '45 min',
      difficulty: 'Medium',
      rating: 4.9,
      reviews: 89,
      category: 'main',
      isPremium: true,
      calories: 380,
      servings: 4
    },
    {
      id: 3,
      title: 'Classic Beef Burger',
      image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '20 min',
      difficulty: 'Easy',
      rating: 4.7,
      reviews: 156,
      category: 'main',
      isPremium: false,
      calories: 650,
      servings: 2
    },
    {
      id: 4,
      title: 'Chocolate Lava Cake',
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '25 min',
      difficulty: 'Medium',
      rating: 4.9,
      reviews: 203,
      category: 'dessert',
      isPremium: true,
      calories: 420,
      servings: 2
    },
    {
      id: 5,
      title: 'Mediterranean Salad',
      image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '15 min',
      difficulty: 'Easy',
      rating: 4.6,
      reviews: 78,
      category: 'salad',
      isPremium: false,
      calories: 250,
      servings: 2
    },
    {
      id: 6,
      title: 'Truffle Risotto',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
      time: '35 min',
      difficulty: 'Hard',
      rating: 4.8,
      reviews: 45,
      category: 'main',
      isPremium: true,
      calories: 480,
      servings: 4
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'main', label: 'Main Dishes' },
    { value: 'dessert', label: 'Desserts' },
    { value: 'salad', label: 'Salads' },
    { value: 'appetizer', label: 'Appetizers' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
  ];

  const timeRanges = [
    { value: 'all', label: 'Any Time' },
    { value: 'quick', label: 'Under 20 min' },
    { value: 'medium', label: '20-40 min' },
    { value: 'long', label: '40+ min' }
  ];

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
      
      let matchesTime = true;
      if (selectedTime !== 'all') {
        const timeInMinutes = parseInt(recipe.time);
        if (selectedTime === 'quick') matchesTime = timeInMinutes < 20;
        else if (selectedTime === 'medium') matchesTime = timeInMinutes >= 20 && timeInMinutes <= 40;
        else if (selectedTime === 'long') matchesTime = timeInMinutes > 40;
      }

      return matchesSearch && matchesCategory && matchesDifficulty && matchesTime;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedTime]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Recipe Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover delicious recipes from around the world. Filter by category, difficulty, and cooking time.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-lg"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.category')}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.difficulty')}
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.time')}
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {timeRanges.map(time => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredRecipes.length}</span> recipes
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="group relative">
              <Link
                to={`/recipe/${recipe.id}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
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
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center">
                      <ChefHat className="w-4 h-4 mr-1" />
                      <span>{recipe.difficulty}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{recipe.servings} servings</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary-600 font-semibold">{recipe.calories} cal</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Star className="w-4 h-4 text-accent-500 mr-1" />
                      <span>{recipe.rating} ({recipe.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Premium Overlay */}
              {recipe.isPremium && !user?.isPremium && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white">
                    <Crown className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold mb-2">Premium Recipe</p>
                    <Link
                      to="/premium"
                      className="bg-accent-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent-600 transition-colors"
                    >
                      Upgrade Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSelectedTime('all');
              }}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;