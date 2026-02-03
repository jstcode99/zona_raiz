import { createSupabaseServerClient } from "@/infrastructure/db/supabase.server"
import { AuthRepository } from "./auth.repository"
import { AuthUser, SignInDTO, SignUpDTO } from "../types/auth.types"

export class SupabaseAuthRepository implements AuthRepository {
  private async client() {
    return await createSupabaseServerClient()
  }

  async signIn(data: SignInDTO): Promise<void> {
    const supabase = await this.client()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) throw error
  }

  async signUp(payload: SignUpDTO): Promise<void> {
    const supabase = await this.client()
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/confirm', // Redirect after email confirmation
        // captchaToken: payload?.captchaToken,
        data: {
          name: payload.name,
          last_name: payload.last_name,
          phone: payload.phone,
        },
      },
    })
    if (error) throw error
  }

  async logout(): Promise<void> {
    const supabase = await this.client()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = await this.client()
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user as AuthUser | null
  }

  async loginWithGoogle(): Promise<string> {
    const supabase = await this.client()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    })
    if (error) throw error
    return data.url
  }
}

