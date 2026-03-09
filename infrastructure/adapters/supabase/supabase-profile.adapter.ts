import { SupabaseClient } from "@supabase/supabase-js"
import { ProfilePort } from "@/domain/ports/profile.port"
import { ProfileEntity, EUserRole } from "@/domain/entities/profile.entity"
import { STORAGE_BUCKETS } from "@/infrastructure/config/constants"

export class SupabaseProfileAdapter implements ProfilePort {
  constructor(private readonly supabase: SupabaseClient) { }

  async searchProfilesByEmail(email: string): Promise<ProfileEntity[]> {
    
    if (!email || email.length < 2) return []

    const { data, error } = await this.supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, phone, role, created_at")
      .ilike("email", `%${email}%`)
      .limit(10)
      
    if (error) throw error

    return data
  }

  async getRoleByUserId(userId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    if (error) throw error
    return data.role
  }

  async getProfileByUserId(userId: string): Promise<ProfileEntity> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) throw error
    return data
  }

  async updateProfile(userId: string, data: Partial<ProfileEntity>) {
    const { error } = await this.supabase
      .from("profiles")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) throw error
  }

  async updatePathAvatarProfile(userId: string, avatarUrl: string) {
    const { error } = await this.supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId)

    if (error) throw error
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.type.split('/')[1] || 'webp'
    const path = `${userId}/avatar.${fileExt}`
    try {
      const { error: uploadError } = await this.supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        })

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { data: { publicUrl } } = this.supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .getPublicUrl(path)

      const avatarUrl = `${publicUrl}?t=${Date.now()}`
      return avatarUrl

    } catch (error) {
      await this.supabase.storage.from(STORAGE_BUCKETS.AVATARS).remove([path])
      throw error
    }
  }

  async updateRole(userId: string, role: EUserRole) {
    const { error } = await this.supabase
      .from("profiles")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) throw error
  }

  async count(filters?: { start_date?: string; end_date?: string; real_estate_id?: string }): Promise<number> {
    let query = this.supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    if (filters?.start_date) {
      query = query.gte("created_at", filters.start_date)
    }
    if (filters?.end_date) {
      query = query.lte("created_at", filters.end_date)
    }

    const { count, error } = await query

    if (error) throw new Error(error.message)

    return count || 0
  }
}