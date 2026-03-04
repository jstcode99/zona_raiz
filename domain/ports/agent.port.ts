import { ProfileEntity } from "../entities/profile.entity";

export interface AgentPort {
  addAgent(realEstateId: string, profileId: string): Promise<void>;
  removeAgent(realEstateId: string, profileId: string): Promise<void>;
  listAgents(realEstateId: string): Promise<ProfileEntity[]>;
}