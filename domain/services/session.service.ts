import { SessionPort } from "@/domain/ports/sesion.port";
import { unstable_cache } from "next/cache";
import { ProfilePort } from "../ports/profile.port";
import { MenuEntity } from "../entities/menu.entity";
import { EAgentRole } from "../entities/real-estate-agent.entity";
import { Lang } from "@/i18n/settings";
import { createRouter } from "@/i18n/router";
import { CookiesPort } from "../ports/cookies.port";
import { EUserRole } from "../entities/profile.entity";
import { initI18n } from "@/i18n/server";

export class SessionService {
  constructor(
    private sessionPort: SessionPort,
    private profiles: ProfilePort,
    private cookiesPort: CookiesPort,
    private lang: Lang,
  ) {}

  isAuth() {
    return this.sessionPort.isAuth();
  }

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
      },
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
      },
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
      },
    )();
  }

  async getCurrentUserAgentRole(
    realEstateId: string,
  ): Promise<EAgentRole | null> {
    const userId = await this.sessionPort.getCurrentUserId();
    if (!userId) return null;
    const agentRole = await this.profiles.getAgentRoleInRealEstate(
      userId,
      realEstateId,
    );
    return agentRole?.role ?? null;
  }

  async getMenuByRol(): Promise<MenuEntity[]> {
    const routes = createRouter(this.lang);
    const i18n = await initI18n(this.lang);
    const t = i18n.getFixedT(this.lang);

    const id = await this.sessionPort.getCurrentUserId();
    const role = await this.profiles.getRoleByUserId(id as string);
    switch (role) {
      case EAgentRole.Coordinator:
        return [
          {
            title: t("components:nav.dashboard"),
            url: routes.dashboard(),
            icon: "layout-dashboard",
          },
          {
            title: t("components:nav.real_estates"),
            url: routes.realEstates(),
            icon: "map-pin-house",
          },
          {
            title: t("components:nav.properties"),
            url: routes.properties(),
            icon: "building-2",
          },
          {
            title: t("components:nav.listings"),
            url: routes.listings(),
            icon: "tags",
          },
          {
            title: t("components:nav.users"),
            url: routes.users(),
            icon: "tags",
          },
          {
            title: t("components:nav.inquiries"),
            url: routes.inquiries(),
            icon: "tags",
          },
          {
            title: t("components:nav.import"),
            url: routes.import(),
            icon: "tags",
          },
        ];
      default:
        return [
          {
            title: t("components:nav.dashboard"),
            url: routes.dashboard(),
            icon: "layout-dashboard",
          },
          {
            title: t("components:nav.properties"),
            url: routes.properties(),
            icon: "building-2",
          },
          {
            title: t("components:nav.listings"),
            url: routes.listings(),
            icon: "tags",
          },
          {
            title: t("components:nav.inquiries"),
            url: routes.inquiries(),
            icon: "tags",
          },
          {
            title: t("components:nav.users"),
            url: routes.users(),
            icon: "users",
          },
          {
            title: t("components:nav.imports"),
            url: routes.import(),
            icon: "xls",
          },
        ];
    }
  }

  async isAdmin(): Promise<boolean> {
    return (await this.cookiesPort.getProfileRole()) === EUserRole.Admin;
  }

  async isCoordinator(): Promise<boolean> {
    return (await this.cookiesPort.getAgentRole()) === EAgentRole.Coordinator;
  }

  async isAgent(): Promise<boolean> {
    return (await this.cookiesPort.getAgentRole()) === EAgentRole.Agent;
  }
}
