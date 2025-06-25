import React, { useState } from 'react';
import { User, Crown, Heart, BookOpen, Settings, Star, Clock, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');

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

  const favoriteRecipes = [
    {
      id: 1,
      title: 'Creamy Chicken Alfredo',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300',
      time: '30 min',
      rating: 4.8
    },
    {
      id: 3,
      title: 'Classic Beef Burger',
      image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=300',
      time: '20 min',
      rating: 4.7
    }
  ];

  const recentRecipes = [
    {
      id: 2,
      title: 'Spicy Thai Curry',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300',
      time: '45 min',
      rating: 4.9,
      viewedAt: '2 hours ago'
    },
    {
      id: 4,
      title: 'Chocolate Lava Cake',
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=300',
      time: '25 min',
      rating: 4.9,
      viewedAt: '1 day ago'
    }
  ];

  const achievements = [
    { icon: <BookOpen className="w-6 h-6" />, title: 'Recipe Explorer', description: 'Viewed 50+ recipes' },
    { icon: <Heart className="w-6 h-6" />, title: 'Favorite Collector', description: 'Saved 25+ favorites' },
    { icon: <Clock className="w-6 h-6" />, title: 'Quick Cook', description: 'Completed 10+ quick recipes' },
    { icon: <Award className="w-6 h-6" />, title: 'Master Chef', description: 'Completed 5+ expert recipes' }
  ];

  const stats = [
    { label: 'Recipes Viewed', value: '127' },
    { label: 'Favorites', value: '23' },
    { label: 'Cooking Time', value: '45h' },
    { label: 'Average Rating', value: '4.8' }
  ];

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" /> },
    { id: 'recent', label: 'Recent', icon: <Clock className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              {user.isPremium && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent-400 to-accent-500 text-white p-2 rounded-full">
                  <Crown className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <p className="text-gray-600">{user.email}</p>
                  {user.isPremium && (
                    <span className="inline-flex items-center bg-gradient-to-r from-accent-400 to-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold mt-2">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium Member
                    </span>
                  )}
                </div>
                <button className="mt-4 md:mt-0 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Edit Profile
                </button>
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
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Favorite Recipes</h2>
                {favoriteRecipes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRecipes.map((recipe) => (
                      <Link
                        key={recipe.id}
                        to={`/recipe/${recipe.id}`}
                        className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {recipe.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{recipe.time}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-accent-500 mr-1" />
                              <span>{recipe.rating}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
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
                )}
              </div>
            )}

            {/* Recent Tab */}
            {activeTab === 'recent' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
                <div className="space-y-4">
                  {recentRecipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      to={`/recipe/${recipe.id}`}
                      className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {recipe.title}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="mr-4">{recipe.time}</span>
                          <Star className="w-4 h-4 text-accent-500 mr-1" />
                          <span>{recipe.rating}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {recipe.viewedAt}
                      </div>
                    </Link>
                  ))}
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