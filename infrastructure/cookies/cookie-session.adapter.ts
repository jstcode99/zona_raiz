import { cookies } from "next/headers"
import { COOKIE_NAMES, COOKIE_OPTIONS } from "../config/constants"
import { EUserRole } from "@/domain/entities/profile.entity"
import { EAgentRole } from "@/domain/entities/real-estate-agent.entity"
import { CookiesPort } from "@/domain/ports/cookies.port"

export class CookieSessionAdapter implements CookiesPort{

  async getProfileRole(): Promise<EUserRole | null> {
    const cookieStore = await cookies()
    const role = cookieStore.get(COOKIE_NAMES.ROLE)?.value
    return role as EUserRole ?? null
  }

  async getAgentRole(): Promise<EAgentRole | null> {
    const cookieStore = await cookies()
    const role = cookieStore.get(COOKIE_NAMES.REAL_ESTATE_ROLE)?.value
    return role as EAgentRole ?? null
  }

  async getRealEstateId(): Promise<EAgentRole | null> {
    const cookieStore = await cookies()
    const role = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value
    return role as EAgentRole ?? null
  }

  async clearSession() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAMES.ROLE)
    cookieStore.delete(COOKIE_NAMES.REAL_ESTATE)
    cookieStore.delete(COOKIE_NAMES.REAL_ESTATE_ROLE)
  }

  async setSession(name: string, value: string) {
    const cookieStore = await cookies()
    cookieStore.set(name, value, COOKIE_OPTIONS)
  }

}