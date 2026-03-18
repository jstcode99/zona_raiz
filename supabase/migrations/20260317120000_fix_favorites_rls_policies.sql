-- Enable RLS and create policies for favorites table
-- Fix: Remove old conflicting policies and create proper ones

-- First drop old policies if they exist
DROP POLICY IF EXISTS "Favorites: personal access only" ON favorites;
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
DROP POLICY IF EXISTS "Agents can view favorites of their listings" ON favorites;

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policy: users can view their own favorites
CREATE POLICY "favorites_select_own" ON favorites
  FOR SELECT
  USING (profile_id = auth.uid());

-- Policy: users can insert their own favorites
CREATE POLICY "favorites_insert_own" ON favorites
  FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Policy: users can delete their own favorites
CREATE POLICY "favorites_delete_own" ON favorites
  FOR DELETE
  USING (profile_id = auth.uid());

-- Policy: agents/admin can view favorites of their listings
CREATE POLICY "favorites_select_agents" ON favorites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      JOIN real_estate_agents ON listings.agent_id = real_estate_agents.id
      WHERE listings.id = favorites.listing_id
      AND real_estate_agents.profile_id = auth.uid()
    )
  );
