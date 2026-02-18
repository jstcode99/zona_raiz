// infrastructure/db/SupabaseProfileRepository.ts
import { cookies } from "next/headers"
import { createSupabaseServerClient } from "./supabase.server"
import { createSupabaseRouteClient } from "./supabase.route"
import { UserWithProfile } from "@/domain/entities/User"
import { UserRole } from "@/domain/entities/Profile"
import { ProfileRepository, UpdateProfileInput } from "@/domain/repositories/ProfileRepository"

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 días
  path: "/",
}

const ROLE_COOKIE_NAME = "user_role"

export class SupabaseProfileRepository implements ProfileRepository {
  
  async getCurrentProfile(): Promise<UserWithProfile> {
    const supabase = await createSupabaseServerClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, phone, role, created_at")
      .eq("id", user.id)
      .single()

    if (error || !profile) {
      throw new Error("Profile not found")
    }

    // Sincronizar cookie de rol
    await this.setRoleCookie(profile.role as UserRole)

    return {
      user: {
        id: user.id,
        email: user.email!,
      },
      profile: {
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        phone: profile.phone,
        role: profile.role as UserRole,
        created_at: profile.created_at,
      },
    }
  }

  async updateProfile(data: UpdateProfileInput): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone: data.phone,
        avatar_url: data.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }
  }

  async updateAvatar(file: File): Promise<string> {
    const supabase = await createSupabaseRouteClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Authentication required")
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, WebP and GIF are allowed")
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error("File too large. Maximum size is 5MB")
    }

    const fileExt = file.type.split('/')[1] || 'webp'
    const path = `${user.id}/avatar.${fileExt}`

    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      })

    if (uploadError) {
      throw new Error(`Failed to upload avatar: ${uploadError.message}`)
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(path)

    // Añadir timestamp para evitar caché
    const avatarUrl = `${publicUrl}?t=${Date.now()}`

    // Actualizar perfil
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      // Rollback: eliminar archivo subido
      await supabase.storage.from("avatars").remove([path])
      throw new Error(`Failed to update profile: ${updateError.message}`)
    }

    return avatarUrl
  }

  async updateRole(userId: string, role: UserRole): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    // Verificar que el usuario actual sea admin
    const currentRole = await this.getCurrentRole()
    if (currentRole !== 'admin') {
      throw new Error("Unauthorized: Admin role required")
    }

    const { error } = await supabase
      .from("profiles")
      .update({ 
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      throw new Error(`Failed to update role: ${error.message}`)
    }

    // Si el usuario actualiza su propio rol, actualizar cookie
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.id === userId) {
      await this.setRoleCookie(role)
    }
  }

  async getRoleFromCookie(): Promise<UserRole | null> {
    const cookieStore = await cookies()
    const role = cookieStore.get(ROLE_COOKIE_NAME)?.value
    return role as UserRole || null
  }

  async refreshRoleCookie(): Promise<void> {
    const profile = await this.getCurrentProfile()
    if (profile.profile?.role) {
      await this.setRoleCookie(profile.profile.role)
    }
  }

  // Métodos privados auxiliares

  private async getCurrentRole(): Promise<UserRole | null> {
    // Intentar obtener de cookie primero (más rápido)
    const cookieRole = await this.getRoleFromCookie()
    if (cookieRole) return cookieRole

    // Fallback: obtener de la base de datos
    try {
      const profile = await this.getCurrentProfile()
      return profile.profile?.role || null
    } catch {
      return null
    }
  }

  private async setRoleCookie(role: UserRole): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(ROLE_COOKIE_NAME, role, COOKIE_OPTIONS)
  }
}