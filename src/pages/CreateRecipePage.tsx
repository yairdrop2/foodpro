import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RecipeService } from '../services/recipeService';
import { AIService } from '../services/aiService';
import type { Recipe } from '../config/supabase';

const CreateRecipePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prep_time: 0,
    cook_time: 0,
    servings: 1,
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    cuisine_type: '',
    dietary_restrictions: [] as string[],
    image_url: '',
    is_public: false
  });

  const [aiRequest, setAiRequest] = useState({
    ingredients: '',
    cuisine: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    cookingTime: 30
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to create recipes</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'ingredients' | 'instructions', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const generateWithAI = async () => {
    if (!aiRequest.ingredients.trim()) {
      setError('Please enter some ingredients for AI generation');
      return;
    }

    setAiLoading(true);
    setError(null);

    try {
      const ingredients = aiRequest.ingredients.split(',').map(i => i.trim()).filter(Boolean);
      const recipe = await AIService.generateRecipe({
        ingredients,
        cuisine: aiRequest.cuisine || undefined,
        difficulty: aiRequest.difficulty,
        cookingTime: aiRequest.cookingTime
      });

      setFormData(prev => ({
        ...prev,
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        cuisine_type: recipe.cuisineType,
        dietary_restrictions: recipe.dietaryRestrictions
      }));
    } catch (err) {
      console.error('AI generation failed:', err);
      setError('Failed to generate recipe with AI. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error('Recipe title is required');
      }
      if (formData.ingredients.filter(i => i.trim()).length === 0) {
        throw new Error('At least one ingredient is required');
      }
      if (formData.instructions.filter(i => i.trim()).length === 0) {
        throw new Error('At least one instruction is required');
      }

      const recipeData: Omit<Recipe, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        ingredients: formData.ingredients.filter(i => i.trim()),
        instructions: formData.instructions.filter(i => i.trim()),
        prep_time: formData.prep_time,
        cook_time: formData.cook_time,
        servings: formData.servings,
        difficulty: formData.difficulty,
        cuisine_type: formData.cuisine_type.trim(),
        dietary_restrictions: formData.dietary_restrictions,
        image_url: formData.image_url.trim() || null,
        is_public: formData.is_public
      };

      const createdRecipe = await RecipeService.createRecipe(recipeData);
      navigate(`/recipe/${createdRecipe.id}`);
    } catch (err: any) {
      console.error('Failed to create recipe:', err);
      setError(err.message || 'Failed to create recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Create New Recipe</h1>
          <p className="text-xl text-gray-600">Share your culinary creation with the community</p>
        </div>

        {/* AI Recipe Generator */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <Sparkles className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">AI Recipe Generator</h2>
          </div>
          <p className="text-gray-600 mb-4">Let AI help you create a recipe based on your ingredients!</p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients (comma-separated)
              </label>
              <input
                type="text"
                value={aiRequest.ingredients}
                onChange={(e) => setAiRequest(prev => ({ ...prev, ingredients: e.target.value }))}
                placeholder="chicken, garlic, tomatoes, basil"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type (optional)
              </label>
              <input
                type="text"
                value={aiRequest.cuisine}
                onChange={(e) => setAiRequest(prev => ({ ...prev, cuisine: e.target.value }))}
                placeholder="Italian, Asian, Mexican..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={aiRequest.difficulty}
                onChange={(e) => setAiRequest(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Cooking Time (minutes)
              </label>
              <input
                type="number"
                value={aiRequest.cookingTime}
                onChange={(e) => setAiRequest(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 30 }))}
                min="5"
                max="300"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={generateWithAI}
            disabled={aiLoading || !aiRequest.ingredients.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {aiLoading ? 'Generating...' : 'Generate Recipe with AI'}
          </button>
        </div>

        {/* Manual Recipe Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter recipe title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your recipe..."
              />
            </div>

            {/* Recipe Details */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Time (min)
                </label>
                <input
                  type="number"
                  value={formData.prep_time}
                  onChange={(e) => handleInputChange('prep_time', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cook Time (min)
                </label>
                <input
                  type="number"
                  value={formData.cook_time}
                  onChange={(e) => handleInputChange('cook_time', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servings
                </label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => handleInputChange('servings', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type
              </label>
              <input
                type="text"
                value={formData.cuisine_type}
                onChange={(e) => handleInputChange('cuisine_type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Italian, Asian, Mexican, etc."
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients *
              </label>
              <div className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('ingredients', index)}
                      disabled={formData.ingredients.length === 1}
                      className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('ingredients')}
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Ingredient
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions *
              </label>
              <div className="space-y-2">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-2">
                      {index + 1}
                    </div>
                    <textarea
                      value={instruction}
                      onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                      rows={2}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={`Step ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('instructions', index)}
                      disabled={formData.instructions.length === 1}
                      className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('instructions')}
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </button>
              </div>
            </div>

            {/* Visibility */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => handleInputChange('is_public', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                Make this recipe public (others can see and search for it)
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Creating...' : 'Create Recipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;