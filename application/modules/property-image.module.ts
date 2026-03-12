import { SupabasePropertyImageAdapter } from "@/infrastructure/adapters/supabase/supabase-property-image.adapter";
import { PropertyImageService } from "@/domain/services/property-image.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { Lang } from "@/i18n/settings";

export async function propertyImageModule(lang: Lang = "es") {
  const supabase = await SupabaseServerClient();
  const repository = new SupabasePropertyImageAdapter(supabase);
  const propertyImageService = new PropertyImageService(repository, lang);
  
  return {
    propertyImageService
  };
}
