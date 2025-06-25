import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, Star, Heart, Share2, Crown, ChefHat, Flame, ArrowLeft, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AIAssistant from '../components/AIAssistant';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Mock recipe data - in real app, this would come from API
  const recipe = {
    id: 1,
    title: 'Creamy Chicken Alfredo',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    time: '30 min',
    difficulty: 'Easy',
    rating: 4.8,
    reviews: 124,
    servings: 4,
    calories: 520,
    isPremium: false,
    description: 'A rich and creamy pasta dish with tender chicken in a garlic parmesan sauce. This classic Italian-American recipe is perfect for a weeknight dinner or special occasion.',
    ingredients: [
      '1 lb fettuccine pasta',
      '2 chicken breasts, sliced',
      '4 cloves garlic, minced',
      '1 cup heavy cream',
      '1 cup grated Parmesan cheese',
      '4 tbsp butter',
      '2 tbsp olive oil',
      'Salt and pepper to taste',
      'Fresh parsley for garnish'
    ],
    instructions: [
      'Cook fettuccine according to package directions. Drain and set aside.',
      'Season chicken with salt and pepper. Heat olive oil in a large skillet over medium-high heat.',
      'Cook chicken until golden brown and cooked through, about 6-7 minutes per side. Remove and set aside.',
      'In the same skillet, melt butter and sauté garlic until fragrant, about 1 minute.',
      'Pour in heavy cream and bring to a simmer. Cook for 2-3 minutes until slightly thickened.',
      'Add Parmesan cheese and whisk until melted and smooth.',
      'Return chicken to the skillet and add the cooked pasta. Toss everything together.',
      'Garnish with fresh parsley and serve immediately.'
    ],
    nutrition: {
      calories: 520,
      protein: 35,
      carbs: 45,
      fat: 24,
      fiber: 2,
      sugar: 3
    },
    tags: ['Italian', 'Pasta', 'Chicken', 'Creamy', 'Comfort Food'],
    prepTime: '15 min',
    cookTime: '15 min',
    chef: {
      name: 'Chef Maria',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.9,
      recipes: 45
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <Link
              to="/recipes"
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Recipes
            </Link>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {recipe.isPremium && (
                    <span className="bg-gradient-to-r from-accent-400 to-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </span>
                  )}
                  <div className="flex items-center text-white">
                    <Star className="w-4 h-4 text-accent-400 mr-1" />
                    <span>{recipe.rating} ({recipe.reviews} reviews)</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">
                  {recipe.title}
                </h1>
                <p className="text-xl text-gray-200 max-w-2xl">
                  {recipe.description}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <button
                  onClick={handleFavorite}
                  className={`p-3 rounded-full transition-colors ${
                    isFavorited 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Recipe Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-2">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-600">Total Time</div>
                  <div className="font-semibold text-gray-900">{recipe.time}</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 text-secondary-600 rounded-full mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-600">Servings</div>
                  <div className="font-semibold text-gray-900">{recipe.servings}</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-100 text-accent-600 rounded-full mb-2">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                  <div className="font-semibold text-gray-900">{recipe.difficulty}</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full mb-2">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-600">Calories</div>
                  <div className="font-semibold text-gray-900">{recipe.calories}</div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold mr-4 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chef Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recipe by</h3>
              <div className="flex items-center">
                <img
                  src={recipe.chef.avatar}
                  alt={recipe.chef.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{recipe.chef.name}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-accent-500 mr-1" />
                    <span>{recipe.chef.rating} rating</span>
                  </div>
                  <p className="text-sm text-gray-600">{recipe.chef.recipes} recipes</p>
                </div>
              </div>
            </div>

            {/* Nutrition */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Nutrition (per serving)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-semibold">{recipe.nutrition.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-semibold">{recipe.nutrition.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-semibold">{recipe.nutrition.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fat</span>
                  <span className="font-semibold">{recipe.nutrition.fat}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fiber</span>
                  <span className="font-semibold">{recipe.nutrition.fiber}g</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Assistant */}
            {user?.isPremium && (
              <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center mb-4">
                  <Bot className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-bold">AI Cooking Assistant</h3>
                </div>
                <p className="text-secondary-100 mb-4">
                  Get personalized cooking tips and ingredient substitutions for this recipe.
                </p>
                <button
                  onClick={() => setShowAIAssistant(true)}
                  className="bg-white text-secondary-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Ask AI Assistant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant 
          recipe={recipe} 
          onClose={() => setShowAIAssistant(false)} 
        />
      )}
    </div>
  );
};

export default RecipeDetailPage;