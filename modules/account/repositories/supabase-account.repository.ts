import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { AccountRepository } from "./account.repository"
import { AccountAvatarUpdateDTO, AccountProfileDTO } from "../types/account.types"

export class SupabaseAccountRepository implements AccountRepository {
  private async client() {
    return await createSupabaseServerClient()
  }

  async getAccountProfile(): Promise<AccountProfileDTO | null> {
    const supabase = await this.client()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  }

  async updateAccountProfile(data: AccountProfileDTO): Promise<void> {
    const supabase = await this.client()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        last_name: data.last_name,
        phone: data.phone,
      })
      .eq('id', user.id)

    if (error) throw error
  }

  async updateAccountAvatar(
    data: AccountAvatarUpdateDTO
  ): Promise<void> {
    const supabase = await this.client()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("User not authenticated")
    }

    // ✅ Avatar optional
    if (!data.avatar || data.avatar.length === 0) {
      return
    }

    const file = data.avatar[0]

    const fileExt = file.name.split(".").pop()
    const filePath = `${user.id}/avatar.${fileExt}`

    // ⬆️ replace avatar
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "0",
      })

    if (uploadError) throw uploadError

    // 📎 public url 
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    const avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`

    // 🧠 save path
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id)

    if (updateError) throw updateError
  }
}

