// infrastructure/repositories/SupabaseAuthRepository.ts
import { cookies } from "next/headers"
import { createSupabaseServerClient } from "./supabase.server"
import { createSupabaseRouteClient } from "./supabase.route"
import { AuthRepository } from "@/domain/repositories/AuthRepository"
import { AuthUser, AuthUserBase } from "@/domain/entities/AuthUser"
import { SignUpFormValues } from "@/domain/entities/schemas/signUp"
import { UserRole } from "@/domain/entities/Profile"

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 días
  path: "/",
}

const ROLE_COOKIE_NAME = "user_role"

export class SupabaseAuthRepository implements AuthRepository {

  async signIn(email: string, password: string): Promise<AuthUserBase> {
    const supabase = await createSupabaseRouteClient()
    const cookieStore = await cookies()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      throw new Error("Invalid credentials")
    }

    // Obtener perfil con rol
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, full_name, avatar_url")
      .eq("id", data.user.id)
      .single()

    if (profileError || !profile?.role) {
      // Sign out si no hay perfil completo
      await supabase.auth.signOut()
      throw new Error("Profile not found")
    }

    // Guardar rol en cookie
    cookieStore.set(ROLE_COOKIE_NAME, profile.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return {
      id: data.user.id,
      email: data.user.email!,
      role: profile.role as UserRole,
    }
  }

  async signUp(input: SignUpFormValues): Promise<AuthUserBase> {
    const supabase = await createSupabaseRouteClient()

    // Verificar si el email ya existe (para mejor mensaje de error)
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", input.email)
      .maybeSingle()

    if (existingUser) {
      throw new Error("User already registered")
    }

    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.full_name,
          phone: input.phone,
          // El trigger handle_new_user asignará 'client' por defecto
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })

    if (error) {
      // Mapear errores de Supabase a mensajes amigables
      if (error.message.includes("User already registered")) {
        throw new Error("Email already registered")
      }
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error("Registration failed")
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
    const cookieStore = await cookies()

    try {
      await supabase.auth.signOut()

      // Limpiar cookie de rol
      cookieStore.delete(ROLE_COOKIE_NAME)

    } catch (error) {
      console.error("Sign out error:", error)
      throw new Error("Sign out failed")
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = await createSupabaseServerClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

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

  // Método utilitario para leer el rol desde cookie (útil en middleware)
  async getRoleFromCookie(): Promise<UserRole | null> {
    const cookieStore = await cookies()
    const role = cookieStore.get(ROLE_COOKIE_NAME)?.value
    return role as UserRole || null
  }

  // Método para refrescar la cookie de rol (útil si cambia el rol)
  async refreshRoleCookie(): Promise<void> {
    const user = await this.getCurrentUser()
    if (!user) {
      const cookieStore = await cookies()
      cookieStore.delete(ROLE_COOKIE_NAME)
      return
    }

    const cookieStore = await cookies()
    cookieStore.set(ROLE_COOKIE_NAME, user.role, COOKIE_OPTIONS)
  }
}