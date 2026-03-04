import { AgentPort } from "../ports/agent.port"


export class AgentsUseCases {
  constructor(private agents: AgentPort) {}

  addAgent(realEstateId: string, profileId: string) {
    return this.agents.addAgent(realEstateId, profileId)
  }

  removeAgent(realEstateId: string, profileId: string) {
    return this.agents.removeAgent(realEstateId, profileId)
  }

  listAgents(realEstateId: string) {
    return this.agents.listAgents(realEstateId)
  }
}