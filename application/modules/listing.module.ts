import { SupabaseListingAdapter } from "@/infrastructure/adapters/supabase/supabase-listing.adapter";
import { ListingService } from "@/domain/services/listing.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function listingModule() {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseListingAdapter(supabase);
  const listingService = new ListingService(repository);
  
  return {
    listingService
  };
}
