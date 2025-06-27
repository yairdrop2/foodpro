import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Heart, Share2, Crown, ChefHat, Flame, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RecipeService } from '../services/recipeService';
import type { Recipe } from '../config/supabase';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadRecipe();
    }
  }, [id]);

  const loadRecipe = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const recipeData = await RecipeService.getRecipeById(id);
      
      if (!recipeData) {
        setError('Recipe not found');
        return;
      }

      setRecipe(recipeData);
    } catch (err: any) {
      console.error('Failed to load recipe:', err);
      setError(err.message || 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recipe || !user || recipe.user_id !== user.id) return;

    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await RecipeService.deleteRecipe(recipe.id);
      navigate('/recipes');
    } catch (err: any) {
      console.error('Failed to delete recipe:', err);
      alert('Failed to delete recipe. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement favorites functionality with backend
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.title,
        text: recipe?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The recipe you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/recipes"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      </div>
    );
  }

  const totalTime = recipe.prep_time + recipe.cook_time;
  const isOwner = user && recipe.user_id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={recipe.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'}
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
                  <div className="flex items-center text-white">
                    <Star className="w-4 h-4 text-accent-400 mr-1" />
                    <span>4.8 (124 reviews)</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">
                  {recipe.title}
                </h1>
                <p className="text-xl text-gray-200 max-w-2xl">
                  {recipe.description}
                </p>
                {recipe.cuisine_type && (
                  <div className="mt-2">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {recipe.cuisine_type}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                {isOwner && (
                  <>
                    <Link
                      to={`/recipe/${recipe.id}/edit`}
                      className="p-3 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
                    >
                      <Edit className="w-6 h-6" />
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="p-3 rounded-full bg-red-500 bg-opacity-80 text-white hover:bg-opacity-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </>
                )}
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
                  <div className="font-semibold text-gray-900">{totalTime} min</div>
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
                  <div className="font-semibold text-gray-900 capitalize">{recipe.difficulty}</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full mb-2">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-600">Prep Time</div>
                  <div className="font-semibold text-gray-900">{recipe.prep_time} min</div>
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
            {/* Recipe Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recipe Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prep Time</span>
                  <span className="font-semibold">{recipe.prep_time} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cook Time</span>
                  <span className="font-semibold">{recipe.cook_time} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time</span>
                  <span className="font-semibold">{totalTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Servings</span>
                  <span className="font-semibold">{recipe.servings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-semibold capitalize">{recipe.difficulty}</span>
                </div>
                {recipe.cuisine_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cuisine</span>
                    <span className="font-semibold">{recipe.cuisine_type}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dietary Restrictions */}
            {recipe.dietary_restrictions && recipe.dietary_restrictions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Dietary Information</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.dietary_restrictions.map((restriction, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {restriction}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recipe Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recipe Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Visibility</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    recipe.is_public 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {recipe.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-sm text-gray-700">
                    {new Date(recipe.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;