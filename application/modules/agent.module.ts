import { SupabaseAgentAdapter } from "@/infrastructure/adapters/supabase/supabase-agent.adapter";
import { AgentService } from "@/domain/services/agent.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";
import { Lang } from "@/i18n/settings";

export async function agentModule(lang: Lang = "es") {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseAgentAdapter(supabase);
  const agentService = new AgentService(repository, lang);
  
  return {
    agentService
  };
}
