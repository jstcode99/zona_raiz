import { SupabaseClient } from "@supabase/supabase-js"
import { UserPort } from "@/domain/user.port"
import { UserEntity } from "@/domain/entities/user.entity"
import { EUserRole } from "@/domain/entities/profile.entity"

export class SupabaseUserAdapter implements UserPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async getUserById(userId: string): Promise<UserEntity | null> {
    const { data, error } = await this.supabase
      .from("profiles")
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
      .from("profiles")
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
      .from("profiles")
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
    const { data: invited, error: inviteError } =
      await this.supabase.auth.admin.inviteUserByEmail(data.email, {
        data: {
          full_name: data.full_name ?? "",
          role: data.role,
        },
      })

    if (inviteError) {
      throw inviteError
    }

    const userId = invited?.user?.id
    if (!userId) {
      throw new Error("Supabase invite did not return a user id")
    }

    const created = await this.getProfileWithRetry(userId)
    if (!created) {
      throw new Error(`Profile not created for user ${userId}`)
    }

    return created
  }

  async updateUser(
    userId: string,
    data: Partial<Omit<UserEntity, "id">>
  ): Promise<void> {
    const { email, full_name, role, created_at, updated_at, ...rest } = data

    if (email || full_name !== undefined || role) {
      const { error: authError } = await this.supabase.auth.admin.updateUserById(
        userId,
        {
          ...(email ? { email } : {}),
          ...(full_name !== undefined || role
            ? {
                user_metadata: {
                  ...(full_name !== undefined ? { full_name } : {}),
                  ...(role ? { role } : {}),
                },
              }
            : {}),
        }
      )

      if (authError) {
        throw authError
      }
    }

    const profileUpdate = {
      ...(email ? { email } : {}),
      ...(full_name !== undefined ? { full_name } : {}),
      ...(role ? { role } : {}),
      ...rest,
    }

    if (Object.keys(profileUpdate).length === 0) {
      return
    }

    const { error: profileError } = await this.supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", userId)

    if (profileError) {
      throw profileError
    }
  }

  async updateUserRole(userId: string, role: EUserRole): Promise<void> {
    const { error: authError } = await this.supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { role },
      }
    )

    if (authError) {
      throw authError
    }

    const { error: profileError } = await this.supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)

    if (profileError) {
      throw profileError
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await this.supabase.auth.admin.deleteUser(userId)
    if (error) {
      throw error
    }
  }

  private async getProfileWithRetry(userId: string): Promise<UserEntity | null> {
    const attempts = 5
    for (let i = 0; i < attempts; i++) {
      const profile = await this.getUserById(userId)
      if (profile) return profile

      await new Promise((resolve) => setTimeout(resolve, 75))
    }

    return null
  }
}

