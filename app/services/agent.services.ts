import { createAgentModule } from "@/application/containers/agent.container";
import { cached } from "@/infrastructure/cache/cache";

export const getListAgentByRealEstateId = cached(
  async function (realEstateId: string) {
    const { useCases } = await createAgentModule()
    return useCases.listAgents(realEstateId);
  }
);
