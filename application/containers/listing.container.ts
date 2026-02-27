import { SupabaseListingAdapter } from "@/infrastructure/adapters/supabase/supabase-listing.adapter";
import { ListingUseCases } from "@/domain/use-cases/listing.cases";
import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function createListingModule() {
  const supabase = await createSupabaseServerClient();
  const repository = new SupabaseListingAdapter(supabase);
  const useCases = new ListingUseCases(repository);
  return { useCases };
}