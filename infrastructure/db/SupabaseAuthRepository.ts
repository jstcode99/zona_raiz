import { AuthRepository } from "@/domain/repositories/AuthRepository"
import { AuthUser } from "@/domain/entities/AuthUser"
import { createSupabaseServerClient } from "./supabase.server"
import { revalidatePath } from "next/cache"

export class SupabaseAuthRepository implements AuthRepository {
  async signIn(email: string, password: string): Promise<AuthUser> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      throw new Error("Invalid credentials")
    }

    return {
      id: data.user.id,
      email: data.user.email!,
    }
  }

  async signUp(email: string, password: string): Promise<AuthUser> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error || !data.user) {
      throw new Error("Sign up failed")
    }

    return {
      id: data.user.id,
      email: data.user.email!,
    }
  }


  async otp(email: string): Promise<{ success: boolean }> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })

    if (error || !data.user) {
      throw new Error("Sign up failed")
    }

    return { success: true }
  }

  async signOut(): Promise<void> {
    const supabase = await createSupabaseServerClient()
    try {
      await supabase.auth.signOut()
      revalidatePath('/', 'layout')
    } catch (error) {
      throw new Error("Failed to sign out")
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()

    if (!data.user) return null

    return {
      id: data.user.id,
      email: data.user.email!,
    }
  }
}
