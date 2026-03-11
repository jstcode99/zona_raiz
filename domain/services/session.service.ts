import { SessionPort } from "@/domain/ports/sesion.port";
import { unstable_cache } from "next/cache";
import { ProfilePort } from "../ports/profile.port";
import { MenuEntity } from "../entities/menu.entity";
import { EAgentRole } from "../entities/real-estate-agent.entity";
import { ROUTES } from "@/infrastructure/config/constants";

export class SessionService {
  constructor(
    private sessionPort: SessionPort,
    private profiles: ProfilePort,
  ) { }

  getCurrentUserId() {
    return this.sessionPort.getCurrentUserId();
  }

  getCachedCurrentUserId() {
    return unstable_cache(
      async () => this.sessionPort.getCurrentUserId(),
      ["session:user-id"],
      {
        revalidate: 300,
        tags: ["session", "user-id"],
      }
    )();
  }

  getCurrentUser() {
    return this.sessionPort.getCurrentUser();
  }

  getCachedCurrentUser() {
    return unstable_cache(
      async () => this.sessionPort.getCurrentUser(),
      ["session:current-user"],
      {
        revalidate: 300,
        tags: ["session", "current-user"],
      }
    )();
  }

  getRealEstatesForUser() {
    return this.sessionPort.getRealEstatesForUser();
  }

  getCachedRealEstatesForUser() {
    return unstable_cache(
      async () => this.sessionPort.getRealEstatesForUser(),
      ["session:real-estates"],
      {
        revalidate: 300,
        tags: ["session", "real-estates"],
      }
    )();
  }

  async getMenuByRol(): Promise<MenuEntity[]> {
    const id = await this.sessionPort.getCurrentUserId()
    const role = await this.profiles.getRoleByUserId(id as string)
    switch (role) {
      case EAgentRole.Coordinator:
        return [
          {
            title: "Dashboard",
            url: `${ROUTES.DASHBOARD}`,
            icon: 'layout-dashboard',
          },
          {
            title: "Inmobiliarias",
            url: `${ROUTES.DASHBOARD}${ROUTES.REAL_ESTATES}`,
            icon: 'map-pin-house',
          },
          {
            title: "Propiedades",
            url: `${ROUTES.DASHBOARD}${ROUTES.PROPERTIES}`,
            icon: 'building-2',
          },
          {
            title: "Listados",
            url: `${ROUTES.DASHBOARD}${ROUTES.LISTING}`,
            icon: 'list-check',
          }
        ]
      default:
        return [
          {
            title: "Dashboard",
            url: `${ROUTES.DASHBOARD}`,
            icon: 'layout-dashboard',
          },
          {
            title: "Inmobiliarias",
            url: `${ROUTES.DASHBOARD}${ROUTES.REAL_ESTATES}`,
            icon: 'map-pin-house',
          },
          {
            title: "Propiedades",
            url: `${ROUTES.DASHBOARD}${ROUTES.PROPERTIES}`,
            icon: 'building-2',
          },
          {
            title: "Listados",
            url: `${ROUTES.DASHBOARD}${ROUTES.LISTING}`,
            icon: 'list-check',
          }
        ]
    }
  }
}
