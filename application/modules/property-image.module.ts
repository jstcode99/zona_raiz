import { SupabasePropertyImageAdapter } from "@/infrastructure/adapters/supabase/supabase-property-image.adapter";
import { PropertyImageService } from "@/domain/services/property-image.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function propertyImageModule() {
  const supabase = await SupabaseServerClient();
  const repository = new SupabasePropertyImageAdapter(supabase);
  const propertyImageService = new PropertyImageService(repository);
  
  return {
    propertyImageService
  };
}
