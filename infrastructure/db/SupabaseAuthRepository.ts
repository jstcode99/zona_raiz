import { cookies } from "next/headers"
import { unstable_cache, revalidateTag } from "next/cache"
import { createSupabaseServerClient } from "./supabase.server"
import { createSupabaseRouteClient } from "./supabase.route"
import { AuthRepository } from "@/domain/repositories/AuthRepository"
import { AuthUser, AuthUserBase } from "@/domain/entities/AuthUser"
import { SignUpFormValues, signUpSchema } from "@/domain/entities/schemas/signUpSchema"
import { signInSchema } from "@/domain/entities/schemas/signInSchema"
import { EUserRole, UserRole } from "@/domain/entities/Profile"
import { RealEstateWithRole } from "@/domain/entities/RealEstate"
import {
  COOKIE_OPTIONS,
  COOKIE_NAMES,
  CACHE_TAGS,
} from "@/infrastructure/config/constants"

export class SupabaseAuthRepository implements AuthRepository {
  // ==========================================
  // HELPERS PRIVADOS
  // ==========================================

  private async ensureAuth() {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error("Authentication required")
    }
    
    return { supabase, user }
  }

  private async setRoleCookie(role: UserRole): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAMES.ROLE, role, COOKIE_OPTIONS)
  }

  private async clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAMES.ROLE)
    cookieStore.delete(COOKIE_NAMES.REAL_ESTATE)
  }

  private invalidateAuthCache(): void {
    revalidateTag(CACHE_TAGS.AUTH.USER, {})
    revalidateTag(CACHE_TAGS.AUTH.SESSION, {})
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  async signIn(email: string, password: string): Promise<AuthUserBase> {
    const validated = await signInSchema.validate({ email, password }, {
      abortEarly: false,
      stripUnknown: true,
    })

    const supabase = await createSupabaseRouteClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (error || !data.user) {
      throw new Error(error?.message || "Invalid credentials")
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, full_name, avatar_url")
      .eq("id", data.user.id)
      .single()

    if (profileError || !profile?.role) {
      await supabase.auth.signOut()
      throw new Error("Profile not found")
    }

    await this.setRoleCookie(profile.role as UserRole)

    return {
      id: data.user.id,
      email: data.user.email!,
      role: profile.role as UserRole,
    }
  }

  async signUp(input: SignUpFormValues): Promise<AuthUserBase> {
    const validated = await signUpSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    })

    const supabase = await createSupabaseRouteClient()

    const { data, error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.full_name,
          phone: validated.phone,
        },
      },
    })

    if (error) {
      if (error.message.includes("user_already_exists")) {
        throw new Error("Email already registered")
      }
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error("Registration failed")
    }

    if (validated.type_register) {
      const { error: roleError } = await supabase
        .from("profiles")
        .update({ role: EUserRole.Coordinator })
        .eq("id", data.user.id)

      if (roleError) {
        console.error("Role update error:", roleError)
      }
    }

    return {
      id: data.user.id,
      email: data.user.email!,
    }
  }

  async otp(email: string): Promise<{ success: boolean }> {
    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(error.message || "OTP request failed")
    }

    return { success: true }
  }

  async signOut(): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    try {
      await supabase.auth.signOut()
      await this.clearAuthCookies()
      this.invalidateAuthCache()
    } catch (error) {
      console.error("Sign out error:", error)
      throw new Error("Sign out failed")
    }
  }

  // ==========================================
  // QUERIES
  // ==========================================

  async getCurrentUserFresh(): Promise<AuthUser | null> {
    const { supabase, user } = await this.ensureAuth()

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, full_name, avatar_url")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.error("Profile fetch error:", profileError)
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      role: profile.role as UserRole,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const fetchData = async () => {
      return this.getCurrentUserFresh()
    }

    const cachedFetch = unstable_cache(
      fetchData,
      [CACHE_TAGS.AUTH.USER],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.AUTH.USER, CACHE_TAGS.AUTH.SESSION]
      }
    )

    return cachedFetch()
  }

  // ==========================================
  // COOKIE MANAGEMENT
  // ==========================================

  async getRoleFromCookie(): Promise<UserRole | null> {
    const cookieStore = await cookies()
    const role = cookieStore.get(COOKIE_NAMES.ROLE)?.value
    return role as UserRole || null
  }

  async refreshRoleCookie(): Promise<void> {
    const user = await this.getCurrentUserFresh()
    
    if (!user) {
      const cookieStore = await cookies()
      cookieStore.delete(COOKIE_NAMES.ROLE)
      return
    }

    await this.setRoleCookie(user.role)
  }

  async setRealEstateCookie(realEstateId: string): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAMES.REAL_ESTATE, realEstateId, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  async getRealEstateFromCookie(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value || null
  }

  // ==========================================
  // REAL ESTATE (post-login)
  // ==========================================

  async getRealEstatesForUser(): Promise<RealEstateWithRole[]> {
    const { user } = await this.ensureAuth()

    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from("real_estate_agents")
      .select(`
        role,
        real_estates (
          id,
          name,
          description,
          whatsapp,
          street,
          city,
          state,
          postal_code,
          country,
          logo_url,
          created_at,
          updated_at
        )
      `)
      .eq("profile_id", user.id)

    if (error) throw new Error(error.message)

    return (data || []).map((item: any) => ({
      real_estate: item.real_estates,
      role: item.role as UserRole,
    }))
  }
}

export const createAuthRepository = (): SupabaseAuthRepository => {
  return new SupabaseAuthRepository()
}