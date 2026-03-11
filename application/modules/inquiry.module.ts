import { InquiryService } from "@/domain/services/inquire.service";
import { SupabaseInquiryAdapter } from "@/infrastructure/adapters/supabase/supabase-inquiry.adapter";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function inquiryModule() {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseInquiryAdapter(supabase);
  const inquiryService = new InquiryService(repository);

  return {
    inquiryService
  };
}
