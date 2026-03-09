import { InquiryUseCases } from "@/domain/use-cases/inquiry.cases";
import { SupabaseInquiryAdapter } from "@/infrastructure/adapters/supabase/supabase-inquiry.adapter";
import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function createInquiryModule() {
  const supabase = await createSupabaseServerClient();

  const repository = new SupabaseInquiryAdapter(supabase);
  const useCases = new InquiryUseCases(repository);

  return {
    repository,
    useCases,
  };
}
