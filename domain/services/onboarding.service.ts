import { SessionPort } from "@/domain/ports/sesion.port";
import { ProfilePort } from "@/domain/ports/profile.port";
import { EUserRole } from "@/domain/entities/profile.entity";
import { RealEstateWithRoleEntity } from "@/domain/entities/real-estate.entity";
import { Lang } from "@/i18n/settings";
import { getLangServerSide } from "@/shared/utils/lang";
import { createRouter } from "@/i18n/router";

export type OnboardingState =
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
    const lang = await getLangServerSide();
    const routes = createRouter(lang);

    if (!userId) {
      return { step: "redirect", path: routes.signin() };
    }

    const profile = await this.profilePort.getProfileByUserId(userId);
    const role = profile.role;

    if (role === EUserRole.Client) {
      return { step: "redirect", path: routes.home() };
    }

    if (role === EUserRole.Admin) {
      return { step: "redirect", path: routes.dashboard() };
    }

    if (role === EUserRole.RealEstate) {
      const realEstates = await this.sessionPort.getRealEstatesForUser();
      const count = realEstates.length;

      if (count === 0) {
        return { step: "register-real-estate" };
      }

      if (count === 1) {
        return { step: "redirect", path: routes.dashboard() };
      }

      return {
        step: "select-real-estate",
        realEstates: realEstates,
      };
    }

    return { step: "redirect", path: routes.home() };
  }
}
