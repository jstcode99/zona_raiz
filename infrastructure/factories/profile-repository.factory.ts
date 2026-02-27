import { SupabaseClient } from "@supabase/supabase-js"
import { ProfilePort } from "@/domain/ports/profile.port"
import { SupabaseProfileAdapter } from "../adapters/supabase/supabase-profile.adapter"

export function createProfileRepository(
  supabase: SupabaseClient
): ProfilePort {
  return new SupabaseProfileAdapter(supabase)
}