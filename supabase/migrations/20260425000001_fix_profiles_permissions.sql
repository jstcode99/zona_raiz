-- Fix: Add missing table grants for profiles table
-- Issue: KRO-XXX - Error 42501 permission denied for table profiles in auth callback

-- Ensure all necessary permissions are granted for authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated, anon;

-- Ensure the role function works correctly for RLS policies
-- This function is used by several RLS policies
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.jwt() ->> 'role', 'client');
$$;