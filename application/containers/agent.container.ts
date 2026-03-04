import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { AgentsUseCases } from "@/domain/use-cases/agents.use-cases"
import { SupabaseAgentAdapter } from "@/infrastructure/adapters/supabase/supabase-agent.adapter"

export async function createAgentModule() {
  const supabase = await createSupabaseServerClient()

  const adapter = new SupabaseAgentAdapter(supabase)
  const useCases = new AgentsUseCases(adapter)

  return { useCases }
}