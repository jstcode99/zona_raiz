import { createSupabaseServerClient } from "./supabase.server"
import { createSupabaseRouteClient } from "./supabase.route"
import { encodedRedirect } from "@/shared/redirect"
import { UserWithProfile } from "@/domain/entities/User"

type UpdateProfileInput = {
  name: string
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
      return encodedRedirect("error", "/auth/sign-in", "Invalid credentials");
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, name, avatar_url, last_name, phone, role")
      .eq("id", user.id)
      .single()

    if (error) {
      return encodedRedirect("error", "/auth/sign-in", "Failed to retrieve profile");
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile
        ? {
          role: profile.role,
          name: profile.name,
          last_name: profile.last_name,
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
      return encodedRedirect("error", "/auth/sign-in", "Invalid credentials");
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name: data.name,
        last_name: data.last_name,
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
      return encodedRedirect("error", "/auth/sign-in", "Invalid credentials");
    }

    const path = `${user.id}/avatar.webp`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      return encodedRedirect("error", "/dashboard/account", "Failed to upload avatar");
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