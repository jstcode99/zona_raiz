import { ROUTES } from "@/infrastructure/config/constants";
import { ProfilePort } from "../ports/profile.port";
import { EUserRole } from "../entities/profile.entity";
import { SessionPort } from "../ports/sesion.port";

export type OnboardingState =
  | { step: "loading" }
  | { step: "select-real-estate"; realEstates: any[] }
  | { step: "register-real-estate" }
  | { step: "redirect", path: string }

export class GetStateOnboarding {
  constructor(
    private profiles: ProfilePort,
    private session: SessionPort
  ) { }

  async execute(userId: string): Promise<OnboardingState> {

    const profile = await this.profiles.getProfileByUserId(userId);
    const role = profile?.role

    // Clientes no necesitan real estate
    if (role === EUserRole.Client) {
      return { step: "redirect", path: ROUTES.DASHBOARD }
    }

    // Para agentes, coordinadores y admins
    if (role === "agent" || role === "coordinator" || role === "admin") {
      const realEstates = await this.session.getRealEstatesForUser();
      const count = realEstates.length

      // 0 real estates → Registrar
      if (count === 0) {
        return { step: "register-real-estate" }
      }

      // 1 real estate → No debería llegar aquí (middleware lo maneja), pero por si acaso
      if (count === 1) {
        return { step: "redirect", path: ROUTES.DASHBOARD }
      }

      // Varios real estates → Seleccionar
      return { step: "select-real-estate", realEstates }
    }

    return { step: "redirect", path: ROUTES.HOME }
  }
}