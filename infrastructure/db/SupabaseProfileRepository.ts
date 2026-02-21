import { cookies } from "next/headers"
import { unstable_cache, revalidateTag } from "next/cache"
import { createSupabaseServerClient } from "./supabase.server"
import { createSupabaseRouteClient } from "./supabase.route"
import { ProfileRepository, UpdateProfileInput } from "@/domain/repositories/ProfileRepository"
import { UserWithProfile } from "@/domain/entities/User"
import { UserRole } from "@/domain/entities/Profile"
import {
  COOKIE_OPTIONS,
  COOKIE_NAMES,
  CACHE_TAGS,
  STORAGE_BUCKETS,
} from "@/infrastructure/config/constants"
import { profileAvatarSchema } from "@/domain/entities/schemas/profileSchema"

export class SupabaseProfileRepository implements ProfileRepository {
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

  private async getCurrentRole(): Promise<UserRole | null> {
    const cookieStore = await cookies()
    const role = cookieStore.get(COOKIE_NAMES.ROLE)?.value
    if (role) return role as UserRole

    try {
      const profile = await this.getCurrentProfileFresh()
      return profile.profile?.role || null
    } catch {
      return null
    }
  }

  private invalidateProfileCache(userId: string): void {
    revalidateTag(CACHE_TAGS.PROFILE.BASE, {})
    revalidateTag(`${CACHE_TAGS.PROFILE.BASE}-${userId}`, {})
  }

  // ==========================================
  // QUERIES
  // ==========================================

  async getCurrentProfileFresh(): Promise<UserWithProfile> {
    const { supabase, user } = await this.ensureAuth()

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, phone, role, created_at")
      .eq("id", user.id)
      .single()

    if (error || !profile) {
      throw new Error("Profile not found")
    }

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

  async getCurrentProfile(): Promise<UserWithProfile> {
    // Get auth outside cached function
    const { supabase, user } = await this.ensureAuth()

    const fetchData = async (userId: string) => {
      // Use passed userId instead of calling ensureAuth
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, phone, role, created_at")
        .eq("id", userId)
        .single()

      if (error || !profile) {
        throw new Error("Profile not found")
      }

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

    const cachedFetch = unstable_cache(
      fetchData,
      [`${CACHE_TAGS.PROFILE.BASE}-${user.id}`],
      {
        revalidate: 300,
        tags: [CACHE_TAGS.PROFILE.BASE, `${CACHE_TAGS.PROFILE.BASE}-${user.id}`]
      }
    )

    return cachedFetch(user.id)
  }

  // ==========================================
  // MUTATIONS
  // ==========================================

  async updateProfile(data: UpdateProfileInput): Promise<void> {
    const { user } = await this.ensureAuth()
    const supabase = await createSupabaseRouteClient()

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

    this.invalidateProfileCache(user.id)
  }

  async updateAvatar(file: File): Promise<string> {
    const { user } = await this.ensureAuth()
    const supabase = await createSupabaseRouteClient()

    await profileAvatarSchema.validate({ file }, { abortEarly: false })

    const fileExt = file.type.split('/')[1] || 'webp'
    const path = `${user.id}/avatar.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        })

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .getPublicUrl(path)

      const avatarUrl = `${publicUrl}?t=${Date.now()}`

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw new Error(`Profile update failed: ${updateError.message}`)

      this.invalidateProfileCache(user.id)

      return avatarUrl

    } catch (error) {
      await supabase.storage.from(STORAGE_BUCKETS.AVATARS).remove([path])
      throw error
    }
  }

  async updateRole(userId: string, role: UserRole): Promise<void> {
    const currentRole = await this.getCurrentRole()

    if (currentRole !== 'admin') {
      throw new Error("Unauthorized: Admin role required")
    }

    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase
      .from("profiles")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) throw new Error(`Failed to update role: ${error.message}`)

    const { data: { user } } = await supabase.auth.getUser()
    if (user?.id === userId) {
      await this.setRoleCookie(role)
    }

    this.invalidateProfileCache(userId)
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
    const profile = await this.getCurrentProfileFresh()
    if (profile.profile?.role) {
      await this.setRoleCookie(profile.profile.role)
    }
  }
}

export const createProfileRepository = (): ProfileRepository => {
  return new SupabaseProfileRepository()
}