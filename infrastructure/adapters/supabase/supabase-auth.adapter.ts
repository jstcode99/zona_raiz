import { SupabaseClient } from "@supabase/supabase-js"
import { AuthPort, SignUpData } from "@/domain/ports/auth.port"
import { EUserRole } from "@/domain/entities/profile.entity"

export class SupabaseAuthAdapter implements AuthPort {
  constructor(private readonly supabase: SupabaseClient) { }

  async signUp(input: SignUpData) {
    const { error, data } = await this.supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.full_name,
          phone: input.phone,
          role: input.type_register ? EUserRole.RealEstate : EUserRole.Client
        },
      },
    })

    if (error) {
      if (error.message.includes("user_already_exists")) {
        throw new Error("Email already registered")
      }
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error("Registration failed")
    }

    if (input.type_register) {
      const { error: roleError } = await this.supabase
        .from("profiles")
        .update({ role: EUserRole.RealEstate })
        .eq("id", data.user.id)

      if (roleError) {
        console.error("Role update error:", roleError)
      }
    }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    if (!data.user) throw new Error("User not found")

    return { userId: data.user.id }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async sendOtp(email: string) {
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })
    if (error) throw error
  }

  async exchangeCodeForSession(token: string): Promise<{ userId: string }> {
    const { data, error } = await this.supabase.auth.exchangeCodeForSession(token)

    if (error) throw error

    if (!data.user) throw new Error("User not found")

    return { userId: data.user.id }
  }

  async verifyOtp(token: string, type: "signup" | "recovery" | "email_change" | "email"): Promise<{ userId: string }> {
    const { data: { user }, error } = await this.supabase.auth.verifyOtp({
      type: type as "signup" | "recovery" | "email_change" | "email",
      token_hash: token,
    })
    if (error) throw error

    if (!user) throw new Error("User not found")

    return { userId: user.id }
  }

}