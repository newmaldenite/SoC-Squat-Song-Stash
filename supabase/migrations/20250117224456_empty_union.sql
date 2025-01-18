/*
  # Create songs table

  1. New Tables
    - `songs`
      - `id` (uuid, primary key)
      - `song_title` (text, required)
      - `user_name` (text, required)
      - `bootcamp_number` (integer, required)
      - `youtube_link` (text, required)
      - `notes` (text, required)
      - `created_at` (timestamp with timezone, defaults to now)

  2. Security
    - Enable RLS on `songs` table
    - Add policy for public access (since this is a public app)
*/

CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_title text NOT NULL,
  user_name text NOT NULL,
  bootcamp_number integer NOT NULL,
  youtube_link text NOT NULL,
  notes text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON songs
  FOR SELECT
  TO public
  USING (true);

-- Create policy for public insert access
CREATE POLICY "Allow public insert access"
  ON songs
  FOR INSERT
  TO public
  WITH CHECK (true);