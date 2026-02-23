import { ProfileEntity } from "./profile.entity";

export interface RealEstateAgentEntity {
  id: string;
  real_estate_id: string;
  profile_id: string;
  role: EAgentRole;
  created_at: string;
  profile: ProfileEntity
}

export enum EAgentRole {
  Admin = "admin",
  Agent = "agent",
  Coordinator = "coordinator",
};


export type RealEstateAgentFormData = Omit<RealEstateAgentEntity, 'id' | 'created_at'>;
