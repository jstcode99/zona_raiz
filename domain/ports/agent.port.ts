import { ProfileEntity } from "../entities/profile.entity";
import { LandingAgent } from "@/domain/types/landing.types";

export interface AgentPort {
  addAgent(realEstateId: string, profileId: string): Promise<void>;
  removeAgent(realEstateId: string, profileId: string): Promise<void>;
  listAgents(realEstateId: string): Promise<ProfileEntity[]>;
  getTopAgents(limit: number): Promise<LandingAgent[]>;
}