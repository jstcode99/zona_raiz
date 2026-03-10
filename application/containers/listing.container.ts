import { SupabaseListingAdapter } from "@/infrastructure/adapters/supabase/supabase-listing.adapter";
import { ListingUseCases } from "@/domain/use-cases/listing.cases";
import { ListingSearchService } from "@/domain/services/listing-search.service";
import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function createListingModule() {
  const supabase = await createSupabaseServerClient();
  const repository = new SupabaseListingAdapter(supabase);
  const useCases = new ListingUseCases(repository);
  const searchService = new ListingSearchService(repository);
  return { repository, useCases, searchService };
}