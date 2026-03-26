import { AgentPort } from "@/domain/ports/agent.port";
import { unstable_cache } from "next/cache";
import { Lang } from "@/i18n/settings";
import { LandingAgent } from "@/domain/types/landing.types";
import { CACHE_TAGS } from "@/infrastructure/config/constants";
import { EAgentRole } from "../entities/real-estate-agent.entity";

export class AgentService {
  constructor(
    private agentPort: AgentPort,
    private lang: Lang = "es",
  ) {}

  addAgent(realEstateId: string, profileId: string, role?: EAgentRole) {
    return this.agentPort.addAgent(realEstateId, profileId, role);
  }

  removeAgent(realEstateId: string, profileId: string) {
    return this.agentPort.removeAgent(realEstateId, profileId);
  }

  listAgents(realEstateId: string) {
    return this.agentPort.listAgents(realEstateId);
  }

  getCachedListAgents(realEstateId: string) {
    return unstable_cache(
      async () => this.agentPort.listAgents(realEstateId),
      [CACHE_TAGS.AGENT.BY_REAL_ESTATE(realEstateId)],
      {
        revalidate: 300,
        tags: [
          CACHE_TAGS.AGENT.PRINCIPAL,
          CACHE_TAGS.REAL_ESTATE.DETAIL(realEstateId),
        ],
      },
    )();
  }

  async getTopAgents(limit: number = 6): Promise<LandingAgent[]> {
    const cacheKey = `agent:top:${limit}`;
    return unstable_cache(
      async () => this.agentPort.getTopAgents(limit),
      [cacheKey],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.AGENT.PRINCIPAL, CACHE_TAGS.AGENT.TOP],
      },
    )();
  }
}
