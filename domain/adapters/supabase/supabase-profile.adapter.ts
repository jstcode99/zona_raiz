import { EUserRole, ProfileEntity } from "@/domain/entities/profile.entity";
import { ProfileFormValues } from "@/domain/entities/schemas/profile.schema";
import { ProfilePort } from "@/domain/ports/profile.port";
import { STORAGE_BUCKETS } from "@/infrastructure/config/constants";
import { createSupabaseRouteClient } from "@/infrastructure/db/supabase.route";

export class SupabaseProfileAdapter implements ProfilePort {
  async getRoleByUserId(userId: string): Promise<string> {
    const supabase = await createSupabaseRouteClient();

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    if (profileError || !data) throw profileError ?? new Error("Perfil no encontrado");
    return data.role as string;
  }

  async getProfileByUserId(userId: string): Promise<ProfileEntity> {
    const supabase = await createSupabaseRouteClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, phone, role, created_at")
      .eq("id", userId)
      .single()

    if (error || !profile) {
      throw new Error("Profile not found")
    }

    return {
      id: profile.id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      phone: profile.phone,
      role: profile.role as EUserRole,
      created_at: profile.created_at,
    }
  }

  async updateProfile(userId: string, input: ProfileFormValues): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: input.full_name,
        phone: input.phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }
  }

  async updatePathAvatarProfile(userId: string, avatarUrl: string): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) throw new Error(`Profile update failed: ${updateError.message}`)

  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const supabase = await createSupabaseRouteClient()

    const fileExt = file.type.split('/')[1] || 'webp'
    const path = `${userId}/avatar.${fileExt}`

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
      return avatarUrl

    } catch (error) {
      await supabase.storage.from(STORAGE_BUCKETS.AVATARS).remove([path])
      throw error
    }
  }

  async updateRole(userId: string, role: EUserRole): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase
      .from("profiles")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) throw new Error(`Failed to update role: ${error.message}`)
  }
}