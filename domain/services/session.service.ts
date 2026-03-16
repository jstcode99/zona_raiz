import { SessionPort } from "@/domain/ports/sesion.port";
import { unstable_cache } from "next/cache";
import { ProfilePort } from "../ports/profile.port";
import { MenuEntity } from "../entities/menu.entity";
import { EAgentRole } from "../entities/real-estate-agent.entity";
import { ROUTES } from "@/infrastructure/config/routes";
import { Lang } from "@/i18n/settings";
import { createRouter } from "@/i18n/router";

export class SessionService {
  constructor(
    private sessionPort: SessionPort,
    private profiles: ProfilePort,
    private lang: Lang,
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

  async getCurrentUserAgentRole(realEstateId: string): Promise<EAgentRole | null> {
    const userId = await this.sessionPort.getCurrentUserId()
    if (!userId) return null
    const agentRole = await this.profiles.getAgentRoleInRealEstate(userId, realEstateId)
    return agentRole?.role ?? null
  }

  async getMenuByRol(): Promise<MenuEntity[]> {
    const routes = createRouter(this.lang)
    const id = await this.sessionPort.getCurrentUserId()
    const role = await this.profiles.getRoleByUserId(id as string)
    switch (role) {
      case EAgentRole.Coordinator:
        return [
          {
            title: "Dashboard",
            url: `${ROUTES.dashboard[this.lang]}`,
            icon: 'layout-dashboard',
          },
          {
            title: "Inmobiliarias",
            url: `${ROUTES.realEstates[this.lang]}`,
            icon: 'map-pin-house',
          },
          {
            title: "Propiedades",
            url: `${ROUTES.properties[this.lang]}`,
            icon: 'building-2',
          },
          {
            title: "Publicaciones",
            url: `${ROUTES.listings[this.lang]}`,
            icon: 'tags',
          },
          {
            title: "Consultas",
            url: `${ROUTES.inquiries[this.lang]}`,
            icon: 'tags',
          }
        ]
      default:
        return [
          {
            title: "Dashboard",
            url: `${ROUTES.dashboard[this.lang]}`,
            icon: 'layout-dashboard',
          },
          {
            title: "Propiedades",
            url: `${ROUTES.properties[this.lang]}`,
            icon: 'building-2',
          },
          {
            title: "Publicaciones",
            url: `${ROUTES.listings[this.lang]}`,
            icon: 'tags',
          },
          {
            title: "Consultas",
            url: `${ROUTES.inquiries[this.lang]}`,
            icon: 'tags',
          }
        ]
    }
  }
}
