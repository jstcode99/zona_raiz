import { Profile } from "@/domain/entities/Profile"
import { createSupabaseServerClient } from "./supabase.server"

type UpdateProfileInput = {
  name: string
  last_name?: string
  phone?: string
}

export class SupabaseProfileRepository {
   async getCurrentProfile(): Promise<Profile> {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, avatar_url, last_name, phone, role")
      .eq("id", user.id)
      .single()

    if (error) {
      throw error
    }

    return {
      id: data.id,
      email: user.email!,
      name: data.name,
      last_name: data.last_name,
      phone: data.phone,
      avatar_url: data.avatar_url,
      role: data.role,
    }
  }

  async updateProfile(data: UpdateProfileInput) {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Unauthorized")
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
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    const path = `${user.id}/avatar.webp`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      throw uploadError
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