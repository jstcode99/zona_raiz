import { AuthEmailEntity } from "@/domain/entities/auth-user.entity";
import { EUserRole } from "@/domain/entities/profile.entity";
import { SignUpFormValues } from "@/domain/entities/schemas/sign-up-schema";
import { AuthPort } from "@/domain/ports/auth.port";
import { createSupabaseRouteClient } from "@/infrastructure/db/supabase.route";

export class SupabaseAuthAdapter implements AuthPort {

  async signIn(email: string, password: string): Promise<AuthEmailEntity> {
    const supabase = await createSupabaseRouteClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) throw error ?? new Error("No autenticado");

    return {
      id: data.user.id,
      email: data.user.email as string
    };
  }

  async signUp(input: SignUpFormValues): Promise<void> {

    const supabase = await createSupabaseRouteClient()

    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.full_name,
          phone: input.phone,
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
      const { error: roleError } = await supabase
        .from("profiles")
        .update({ role: EUserRole.Coordinator })
        .eq("id", data.user.id)

      if (roleError) {
        console.error("Role update error:", roleError)
      }
    }
  }

  async otp(email: string): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(error.message || "OTP request failed")
    }
  }

  async signOut(): Promise<void> {
    const supabase = await createSupabaseRouteClient()

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
      throw new Error("Sign out failed")
    }
  }

}