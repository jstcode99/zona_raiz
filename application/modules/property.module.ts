import { SupabasePropertyAdapter } from "@/infrastructure/adapters/supabase/supabase-property.adapter";
import { PropertyService } from "@/domain/services/property.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function propertyModule() {
  const supabase = await SupabaseServerClient();
  const repository = new SupabasePropertyAdapter(supabase);
  const propertyService = new PropertyService(repository);
  
  return {
    propertyService
  };
}
