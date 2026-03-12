import { SupabaseListingAdapter } from "@/infrastructure/adapters/supabase/supabase-listing.adapter";
import { ListingService } from "@/domain/services/listing.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { Lang } from "@/i18n/settings";

export async function listingModule(lang: Lang = "es") {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseListingAdapter(supabase);
  const listingService = new ListingService(repository, lang);
  
  return {
    listingService
  };
}
