import { UserRepository } from "@/domain/repositories/UserRepository"
import { User } from "@/domain/entities/User"
import { createSupabaseServerClient } from "./supabase.server"

export class SupabaseUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const supabase = await createSupabaseServerClient()

    const { data } = await supabase
      .from("profiles")
      .select("id, email, name")
      .eq("id", id)
      .single()

    return data ?? null
  }

  async updateName(id: string, name: string) {
    const supabase = await createSupabaseServerClient()

    await supabase
      .from("profiles")
      .update({ name })
      .eq("id", id)
  }
}