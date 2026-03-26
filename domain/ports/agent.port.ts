import { ProfileEntity } from "../entities/profile.entity";
import { LandingAgent } from "@/domain/types/landing.types";
import { EAgentRole } from "../entities/real-estate-agent.entity";

export interface AgentPort {
  addAgent(
    realEstateId: string,
    profileId: string,
    role?: EAgentRole,
  ): Promise<void>;
  removeAgent(realEstateId: string, profileId: string): Promise<void>;
  listAgents(realEstateId: string): Promise<ProfileEntity[]>;
  getTopAgents(limit: number): Promise<LandingAgent[]>;
}
