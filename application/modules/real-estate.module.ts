import { SupabaseRealEstateAdapter } from "@/infrastructure/adapters/supabase/supabase-real-state.adapter";
import { RealEstateService } from "@/domain/services/real-estate.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function realEstateModule() {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseRealEstateAdapter(supabase);
  const realEstateService = new RealEstateService(repository);
  
  return {
    realEstateService
  };
}
