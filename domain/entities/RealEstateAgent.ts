import { EUserRole } from "./Profile";

export interface RealEstateAgent {
  id: string;
  real_estate_id: string;
  profile_id: string;
  role:  EUserRole.Agent| EUserRole.Admin;
  created_at: string;
}

export type RealEstateAgentFormData = Omit<RealEstateAgent, 'id' | 'created_at'>;
