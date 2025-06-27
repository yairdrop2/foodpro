/*
  # Create AI chats table

  1. New Tables
    - `ai_chats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `message` (text)
      - `response` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `ai_chats` table
    - Add policies for chat management
*/

CREATE TABLE IF NOT EXISTS ai_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;

-- Users can read their own chat history
CREATE POLICY "Users can read own chats"
  ON ai_chats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own chats
CREATE POLICY "Users can insert own chats"
  ON ai_chats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own chats
CREATE POLICY "Users can delete own chats"
  ON ai_chats
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);