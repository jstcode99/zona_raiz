import { cookies as nextCookies } from "next/headers";
import { CookieContext } from "../../interfaces/http/http-context";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "../config/constants";
import { EUserRole } from "@/domain/entities/profile.entity";
import { EAgentRole } from "@/domain/entities/real-estate-agent.entity";
import { CookiesPort } from "@/domain/ports/cookies.port";

export class CookiesAdapter implements CookiesPort {
  constructor(private ctx: CookieContext) {}

  // -------------------------
  // READ
  // -------------------------

  private async getReadStore() {
    if (this.ctx.cookies) {
      return this.ctx.cookies;
    }

    if (this.ctx.request) {
      return this.ctx.request.cookies;
    }

    return await nextCookies();
  }

  // -------------------------
  // WRITE
  // -------------------------

  private setCookie(name: string, value: string) {
    if (this.ctx.response) {
      this.ctx.response.cookies.set(name, value, COOKIE_OPTIONS);
      return;
    }

    if (this.ctx.cookies && "set" in this.ctx.cookies) {
      this.ctx.cookies.set(name, value);
    }
  }

  private deleteCookie(name: string) {
    if (this.ctx.response) {
      this.ctx.response.cookies.delete(name);
      return;
    }

    if (this.ctx.cookies && "delete" in this.ctx.cookies) {
      this.ctx.cookies.delete(name);
    }
  }

  // -------------------------
  //  IP Client
  // -------------------------

  async hasIP(): Promise<boolean> {
    const store = await this.getReadStore();
    return !!store.get(COOKIE_NAMES.IP_CLIENT);
  }

  // -------------------------
  // DOMAIN API
  // -------------------------

  async getProfileRole(): Promise<EUserRole | null> {
    const store = await this.getReadStore();
    const role = store.get(COOKIE_NAMES.ROLE)?.value;
    return (role as EUserRole) ?? null;
  }

  async getAgentRole(): Promise<EAgentRole | null> {
    const store = await this.getReadStore();
    const role = store.get(COOKIE_NAMES.REAL_ESTATE_ROLE)?.value;
    return (role as EAgentRole) ?? null;
  }

  async getRealEstateId(): Promise<string | null> {
    const store = await this.getReadStore();
    return store.get(COOKIE_NAMES.REAL_ESTATE)?.value ?? null;
  }

  async clearSession() {
    this.deleteCookie(COOKIE_NAMES.ROLE);
    this.deleteCookie(COOKIE_NAMES.REAL_ESTATE);
    this.deleteCookie(COOKIE_NAMES.REAL_ESTATE_ROLE);
  }

  async setSession(name: string, value: string) {
    this.setCookie(name, value);
  }
}
