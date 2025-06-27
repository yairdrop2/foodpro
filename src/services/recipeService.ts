import { supabase } from '../config/supabase';
import type { Recipe } from '../config/supabase';

export class RecipeService {
  static async createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .insert([recipe])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create recipe: ${error.message}`);
    }

    return data;
  }

  static async getUserRecipes(userId: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch recipes: ${error.message}`);
    }

    return data || [];
  }

  static async getPublicRecipes(limit: number = 20): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch public recipes: ${error.message}`);
    }

    return data || [];
  }

  static async getRecipeById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Recipe not found
      }
      throw new Error(`Failed to fetch recipe: ${error.message}`);
    }

    return data;
  }

  static async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update recipe: ${error.message}`);
    }

    return data;
  }

  static async deleteRecipe(id: string): Promise<void> {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete recipe: ${error.message}`);
    }
  }

  static async searchRecipes(query: string, filters?: {
    cuisine?: string;
    difficulty?: string;
    maxCookTime?: number;
    dietaryRestrictions?: string[];
  }): Promise<Recipe[]> {
    let queryBuilder = supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true);

    // Text search in title and description
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Apply filters
    if (filters?.cuisine) {
      queryBuilder = queryBuilder.eq('cuisine_type', filters.cuisine);
    }

    if (filters?.difficulty) {
      queryBuilder = queryBuilder.eq('difficulty', filters.difficulty);
    }

    if (filters?.maxCookTime) {
      queryBuilder = queryBuilder.lte('cook_time', filters.maxCookTime);
    }

    if (filters?.dietaryRestrictions && filters.dietaryRestrictions.length > 0) {
      queryBuilder = queryBuilder.contains('dietary_restrictions', filters.dietaryRestrictions);
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Failed to search recipes: ${error.message}`);
    }

    return data || [];
  }
}