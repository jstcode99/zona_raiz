import { SupabaseRealEstateAdapter } from "@/infrastructure/adapters/supabase/supabase-real-state.adapter";
import { RealEstateService } from "@/domain/services/real-estate.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { Lang } from "@/i18n/settings";

export async function realEstateModule(lang: Lang = "es") {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseRealEstateAdapter(supabase);
  const realEstateService = new RealEstateService(repository, lang);
  
  return {
    realEstateService
  };
}
