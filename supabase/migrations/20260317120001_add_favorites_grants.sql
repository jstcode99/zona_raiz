-- Fix: Add missing table grants for favorites table
-- Issue: KRO-90

GRANT INSERT, DELETE ON favorites TO authenticated, anon;
