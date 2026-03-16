import { EUserRole } from "../entities/profile.entity";
import { EAgentRole } from "../entities/real-estate-agent.entity";

export interface CookiesPort {
  getProfileRole(): Promise<EUserRole | null>
  getAgentRole(): Promise<EAgentRole | null>
  getRealEstateId(): Promise<EAgentRole | null>
  clearSession(): void
  setSession(name: string, value: string): void
}