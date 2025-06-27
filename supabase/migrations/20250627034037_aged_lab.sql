/*
  # Create recipes table

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text)
      - `ingredients` (text array)
      - `instructions` (text array)
      - `prep_time` (integer, minutes)
      - `cook_time` (integer, minutes)
      - `servings` (integer)
      - `difficulty` (enum: easy, medium, hard)
      - `cuisine_type` (text)
      - `dietary_restrictions` (text array)
      - `image_url` (text, optional)
      - `is_public` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `recipes` table
    - Add policies for recipe management
*/

-- Create enum for difficulty levels
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  ingredients text[] DEFAULT '{}',
  instructions text[] DEFAULT '{}',
  prep_time integer DEFAULT 0,
  cook_time integer DEFAULT 0,
  servings integer DEFAULT 1,
  difficulty difficulty_level DEFAULT 'easy',
  cuisine_type text DEFAULT '',
  dietary_restrictions text[] DEFAULT '{}',
  image_url text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Users can read their own recipes
CREATE POLICY "Users can read own recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can read public recipes
CREATE POLICY "Users can read public recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Users can insert their own recipes
CREATE POLICY "Users can insert own recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own recipes
CREATE POLICY "Users can update own recipes"
  ON recipes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own recipes
CREATE POLICY "Users can delete own recipes"
  ON recipes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();