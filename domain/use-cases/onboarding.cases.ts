import { ROUTES } from "@/infrastructure/config/constants"
import { ProfilePort } from "@/domain/ports/profile.port"
import { EUserRole } from "@/domain/entities/profile.entity"
import { RealEstateEntity } from "@/domain/entities/real-estate.entity"
import { SessionPort } from "../ports/sesion.port"

export type OnboardingState =
  | { step: "loading" }
  | { step: "select-real-estate"; realEstates: RealEstateEntity[] }
  | { step: "register-real-estate" }
  | { step: "redirect"; path: string }

export class OnboardingUseCase {
  constructor(
    private session: SessionPort,
    private profiles: ProfilePort,
  ) {}

  async getOnboardingState(): Promise<OnboardingState> {
    const userId = await this.session.getCurrentUserId()

    if (!userId) {
      return { step: "redirect", path: ROUTES.SIGN_IN }
    }

    const profile = await this.profiles.getProfileByUserId(userId)
    const role = profile.role

    /**
     * Clientes no necesitan inmobiliaria
     */
    if (role === EUserRole.Client) {
      return { step: "redirect", path: ROUTES.DASHBOARD }
    }

    /**
     * Roles que operan con inmobiliarias
     */
    if (
      role === EUserRole.Agent ||
      role === EUserRole.Coordinator ||
      role === EUserRole.Admin
    ) {
      const realEstates = await this.session.getRealEstatesForUser()

      const count = realEstates.length

      if (count === 0) {
        return { step: "register-real-estate" }
      }

      if (count === 1) {
        return { step: "redirect", path: ROUTES.DASHBOARD }
      }

      return {
        step: "select-real-estate",
        realEstates: realEstates.map(r => r.real_estate),
      }
    }

    return { step: "redirect", path: ROUTES.HOME }
  }
}