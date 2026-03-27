import { EUserRole } from "../entities/profile.entity";
import { EAgentRole } from "../entities/real-estate-agent.entity";
import { CookiesPort } from "../ports/cookies.port";

export class CookiesService {
  constructor(private readonly cookies: CookiesPort) {}

  getProfileRole(): Promise<EUserRole | null> {
    return this.cookies.getProfileRole();
  }

  getAgentRole(): Promise<EAgentRole | null> {
    return this.cookies.getAgentRole();
  }

  getRealEstateId(): Promise<string | null> {
    return this.cookies.getRealEstateId();
  }

  clearSession(): void {
    this.cookies.clearSession();
  }

  setSession(name: string, value: string): void {
    this.cookies.setSession(name, value);
  }
}
