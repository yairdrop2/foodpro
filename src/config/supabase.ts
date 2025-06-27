import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(https://fkqkgjumzjkfikanhrah.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrcWtnanVtemprZmlrYW5ocmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3Nzg4NzcsImV4cCI6MjA2NjM1NDg3N30.5lTT6aTSRKAS-G5Oni-gjJ7M6Rp9ZYWOmuGw2yixFZQ );

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine_type: string;
  dietary_restrictions: string[];
  image_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIChat {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
}