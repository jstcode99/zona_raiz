import { Profile } from "./Profile";

export interface RealEstateAgent {
  id: string;
  real_estate_id: string;
  profile_id: string;
  role: EAgentRole;
  created_at: string;
  profile: Profile
}

export enum EAgentRole {
  Admin = "admin",
  Agent = "agent",
  Coordinator = "coordinator",
};



export type RealEstateAgentFormData = Omit<RealEstateAgent, 'id' | 'created_at'>;
