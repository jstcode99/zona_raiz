import { SupabaseAgentAdapter } from "@/infrastructure/adapters/supabase/supabase-agent.adapter";
import { AgentService } from "@/domain/services/agent.service";
import { SupabaseServerClient } from "@/infrastructure/db/supabase.server";

export async function agentModule() {
  const supabase = await SupabaseServerClient();
  const repository = new SupabaseAgentAdapter(supabase);
  const agentService = new AgentService(repository);
  
  return {
    agentService
  };
}
