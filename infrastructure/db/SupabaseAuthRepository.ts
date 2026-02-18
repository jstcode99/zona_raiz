import { AuthRepository } from "@/domain/repositories/AuthRepository"
import { AuthUser, AuthUserBase } from "@/domain/entities/AuthUser"
import { createSupabaseServerClient } from "./supabase.server"
import { revalidatePath } from "next/cache"
import { createSupabaseRouteClient } from "./supabase.route"
import { SignUpFormValues } from "@/domain/entities/schemas/signUp"
import { UserRole } from "@/domain/entities/Profile"
import { RealEstate, RealEstateWithRole } from "@/domain/entities/RealEstate"
import { cookies } from "next/headers"



export class SupabaseAuthRepository implements AuthRepository {
  async signIn(email: string, password: string): Promise<AuthUserBase> {
    const supabase = await createSupabaseRouteClient()
    const cookieStore = await cookies()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })


    if (error || !data.user) {
      throw new Error("Invalid credentials")
    }

    const userRole = await this.getCurrentUser()

    if (!userRole?.role) {
      throw new Error("Invalid credentials")
    }

    cookieStore.set("role", userRole.role, {
      httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
      maxAge: 60 * 60 * 24 * 7, // Cookie expiration time (e.g., one week)
      path: "/",
    });

    return {
      id: data.user.id,
      email: data.user.email!,
    }
  }

  async signUp(input: SignUpFormValues): Promise<AuthUserBase> {
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


    if (error || !data.user) {
      console.log(error);
      throw new Error("Sign up failed")
    }

    return {
      id: data.user.id,
      email: data.user.email!,
    }
  }


  async otp(email: string): Promise<{ success: boolean }> {
    const supabase = await createSupabaseRouteClient()

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
    const supabase = await createSupabaseRouteClient()
    try {
      await supabase.auth.signOut()
      revalidatePath('/', 'layout')
    } catch (error) {
      throw new Error("Sign v failed")
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()

    if (!data.user)
      throw new Error("Authentication required")

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", data.user.id)
      .single()

    if (error || !profile) {
      throw new Error("Profile not found")
    }

    return {
      id: data.user.id,
      email: data.user.email as string,
      role: profile.role,
    }
  }

  async getCurrentRealState(): Promise<string> {
    const supabase = await createSupabaseServerClient()
    const user = await this.getCurrentUser()

    if (!user) throw new Error("Authentication required")

    const { data, error } = await supabase
      .from("real_estate_agents")
      .select("real_estate_id")
      .eq("profile_id", user.id)
      .single()

    if (error || !data) {
      throw new Error("User has no real estate assigned")
    }

    return data.real_estate_id
  }


  async getRealStates(): Promise<RealEstate[]> {
    const supabase = await createSupabaseServerClient()
    const user = await this.getCurrentUser()

    if (!user) throw new Error("Authentication required")

    const { data, error } = await supabase
      .from("real_estate_agents")
      .select(`
      real_estates (
        id,
        name,
        description,
        logo_url,
        created_at
      )
    `)
      .eq("profile_id", user.id)

    if (error) throw error

    console.log(data);
    
    return data
  }

  async getMyRealEstateWithRole(): Promise<RealEstateWithRole> {
    const supabase = await createSupabaseServerClient()
    const user = await this.getCurrentUser()

    if (!user) throw new Error("Authentication required")

    const { data, error } = await supabase
      .from("real_estate_agents")
      .select(`
      role,
      real_estates (
        id,
        name,
        description,
        logo_url
      )
    `)
      .eq("profile_id", user.id)
      .single()

    if (error || !data) throw new Error("No real estate found")

    return {
      real_state: data.real_estates[0] as RealEstate,
      role: data.role as UserRole
    }
  }
}
