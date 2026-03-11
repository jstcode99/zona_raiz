import { AgentPort } from "@/domain/ports/agent.port";
import { unstable_cache } from "next/cache";

export class AgentService {
  constructor(private agentPort: AgentPort) {}

  addAgent(realEstateId: string, profileId: string) {
    return this.agentPort.addAgent(realEstateId, profileId);
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
      [`agent:real-estate:${realEstateId}`],
      {
        revalidate: 300,
        tags: ["agents", `real-estate:${realEstateId}`],
      }
    )();
  }
}
