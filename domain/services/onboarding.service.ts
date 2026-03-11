import { SessionPort } from "@/domain/ports/sesion.port";
import { ProfilePort } from "@/domain/ports/profile.port";
import { EUserRole } from "@/domain/entities/profile.entity";
import { RealEstateWithRoleEntity } from "@/domain/entities/real-estate.entity";
import { ROUTES } from "@/infrastructure/config/routes";
import { Lang } from "@/i18n/settings";

export type OnboardingState = 
  | { step: "loading" }
  | { step: "redirect"; path: string }
  | { step: "register-real-estate" }
  | { step: "select-real-estate"; realEstates: RealEstateWithRoleEntity[] };

export class OnboardingService {
  constructor(
    private sessionPort: SessionPort,
    private profilePort: ProfilePort,
    private lang: Lang,
  ) {}

  async getOnboardingState(): Promise<OnboardingState> {
    const userId = await this.sessionPort.getCurrentUserId();

    if (!userId) {
      return { step: "redirect", path: ROUTES.signin[this.lang] };
    }

    const profile = await this.profilePort.getProfileByUserId(userId);
    const role = profile.role;

    if (role === EUserRole.Client) {
      return { step: "redirect", path: "/" };
    }

    if (role === EUserRole.Admin) {
      return { step: "redirect", path: ROUTES.dashboard[this.lang] };
    }

    if (role === EUserRole.RealEstate) {
      const realEstates = await this.sessionPort.getRealEstatesForUser();
      const count = realEstates.length;

      if (count === 0) {
        return { step: "register-real-estate" };
      }

      if (count === 1) {
        return { step: "redirect", path: ROUTES.dashboard[this.lang] };
      }

      return {
        step: "select-real-estate",
        realEstates: realEstates,
      };
    }

    return { step: "redirect", path: "/" };
  }
}
