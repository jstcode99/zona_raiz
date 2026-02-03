import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/shared/env/keys'
import { createClient } from '@supabase/supabase-js'

export function createSupabaseBrowser() {
  return createClient(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!
  )
}
