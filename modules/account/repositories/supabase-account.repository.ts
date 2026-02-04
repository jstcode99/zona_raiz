import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { AccountRepository } from "./account.repository"
import { AccountProfileDTO } from "../types/account.types"

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

      console.log(error, 'error....');
      
    if (error) throw error
  }
}

