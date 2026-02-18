import { createSupabaseServerClient } from "./supabase.server"
import { createSupabaseRouteClient } from "./supabase.route"
import { UserWithProfile } from "@/domain/entities/User"

type UpdateProfileInput = {
  full_name: string
  last_name?: string
  phone?: string
}

export class SupabaseProfileRepository {
  async getCurrentProfile(): Promise<UserWithProfile> {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Invalid credentials")
    }

    const { data: profile , error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, avatar_url, role")
      .eq("id", user.id)
      .single()

    if (error) {
      throw new Error("Failed to retrieve profile")
    }

    if (!profile) {
      throw new Error("Failed to retrieve profile")
    }


    return {
      user: {
        id: user.id,
        email: user.email as string,
      },
      profile: profile
        ? {
          role: profile.role,
          full_name: profile.full_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
        }
        : null,
    }
  }

  async updateProfile(data: UpdateProfileInput) {
    const supabase = await createSupabaseRouteClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Invalid credentials")
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone: data.phone,
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(error.message)
    }
  }

  async updateAvatar(file: File) {
    const supabase = await createSupabaseRouteClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Invalid credentials")
    }

    const path = `${user.id}/avatar.webp`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      throw new Error("Failed to upload avatar")
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(path)

    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id)

    if (profileError) {
      throw profileError
    }
  }
}