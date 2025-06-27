import React, { useState, useEffect } from 'react';
import { User, Crown, Heart, BookOpen, Settings, Star, Clock, Award, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RecipeService } from '../services/recipeService';
import { Link } from 'react-router-dom';
import type { Recipe } from '../config/supabase';

const ProfilePage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('my-recipes');
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserRecipes();
    }
  }, [user]);

  const loadUserRecipes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const recipes = await RecipeService.getUserRecipes(user.id);
      setUserRecipes(recipes);
    } catch (error) {
      console.error('Failed to load user recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your profile</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Recipes Created', value: userRecipes.length.toString() },
    { label: 'Public Recipes', value: userRecipes.filter(r => r.is_public).length.toString() },
    { label: 'Total Views', value: '1.2k' }, // Mock data
    { label: 'Average Rating', value: '4.8' } // Mock data
  ];

  const achievements = [
    { icon: <BookOpen className="w-6 h-6" />, title: 'Recipe Creator', description: 'Created your first recipe' },
    { icon: <Heart className="w-6 h-6" />, title: 'Community Favorite', description: 'Recipe got 50+ likes' },
    { icon: <Clock className="w-6 h-6" />, title: 'Quick Cook', description: 'Shared 5+ quick recipes' },
    { icon: <Award className="w-6 h-6" />, title: 'Master Chef', description: 'Created 10+ recipes' }
  ];

  const tabs = [
    { id: 'my-recipes', label: 'My Recipes', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-primary-600" />
              </div>
              {userProfile?.is_premium && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent-400 to-accent-500 text-white p-2 rounded-full">
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userProfile?.name || user.email}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                  {userProfile?.is_premium && (
                    <span className="inline-flex items-center bg-gradient-to-r from-accent-400 to-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold mt-2">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium Member
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <Link
                    to="/create-recipe"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Recipe
                  </Link>
                  <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Settings className="w-4 h-4 inline mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center md:text-left">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* My Recipes Tab */}
            {activeTab === 'my-recipes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Recipes</h2>
                  <Link
                    to="/create-recipe"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Recipe
                  </Link>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your recipes...</p>
                  </div>
                ) : userRecipes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userRecipes.map((recipe) => (
                      <Link
                        key={recipe.id}
                        to={`/recipe/${recipe.id}`}
                        className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <img
                          src={recipe.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300'}
                          alt={recipe.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {recipe.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              recipe.is_public 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {recipe.is_public ? 'Public' : 'Private'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {recipe.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{recipe.prep_time + recipe.cook_time} min</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-accent-500 mr-1" />
                              <span>4.8</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes yet</h3>
                    <p className="text-gray-600 mb-6">Start creating and sharing your favorite recipes</p>
                    <Link
                      to="/create-recipe"
                      className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Create Your First Recipe
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Favorite Recipes</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-600 mb-6">Start exploring recipes and save your favorites</p>
                  <Link
                    to="/recipes"
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Browse Recipes
                  </Link>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Achievements</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl"
                    >
                      <div className="bg-white p-3 rounded-full text-primary-600 mr-4">
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-gray-600 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;