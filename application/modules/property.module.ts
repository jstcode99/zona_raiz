import { SupabasePropertyAdapter } from "@/infrastructure/adapters/supabase/supabase-property.adapter";
import { PropertyService } from "@/domain/services/property.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { Lang } from "@/i18n/settings";

export async function propertyModule(lang: Lang = "es") {
  const supabase = await SupabaseServerClient();
  const repository = new SupabasePropertyAdapter(supabase);
  const propertyService = new PropertyService(repository, lang);
  
  return {
    propertyService
  };
}
