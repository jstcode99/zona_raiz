import { SupabaseClient } from "@supabase/supabase-js"
import { UserPort } from "@/domain/user.port"
import { UserEntity } from "@/domain/entities/user.entity"
import { EUserRole } from "@/domain/entities/profile.entity"

export class SupabaseUserAdapter implements UserPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async getUserById(userId: string): Promise<UserEntity | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    if (!data) {
      return null
    }

    return data as UserEntity
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    if (!data) {
      return null
    }

    return data as UserEntity
  }

  async listUsers(filters?: Parameters<UserPort["listUsers"]>[0]): Promise<UserEntity[]> {
    const query = this.supabase
      .from("users")
      .select("id, email, full_name, role, created_at, updated_at")
      .order("created_at", { ascending: false })

    if (filters?.role) {
      query.eq("role", filters.role)
    }

    if (filters?.search && filters.search.trim().length >= 2) {
      const q = filters.search.trim()
      query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return (data ?? []) as UserEntity[]
  }

  async createUser(
    data: Omit<UserEntity, "id" | "created_at" | "updated_at">
  ): Promise<UserEntity> {
    const now = new Date().toISOString()

    const { data: created, error } = await this.supabase
      .from("users")
      .insert({
        ...data,
        created_at: now,
        updated_at: now,
      })
      .select("*")
      .single()

    if (error) {
      throw error
    }

    return created as UserEntity
  }

  async updateUser(
    userId: string,
    data: Partial<Omit<UserEntity, "id">>
  ): Promise<void> {
    const { error } = await this.supabase
      .from("users")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      throw error
    }
  }

  async updateUserRole(userId: string, role: EUserRole): Promise<void> {
    const { error } = await this.supabase
      .from("users")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      throw error
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from("users")
      .delete()
      .eq("id", userId)

    if (error) {
      throw error
    }
  }
}

