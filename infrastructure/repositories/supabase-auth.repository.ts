import { AuthRepository } from "@/auth/repositories/auth.repository"
import { createSupabaseServerClient } from "../db/supabase.server"
import { AuthUser, SignInDTO, SignupDTO } from "@/auth/types/auth.types"

export class SupabaseAuthRepository implements AuthRepository {

    async signIn({ email, password }: SignInDTO) {
        const supabase = createSupabaseServerClient()

        const { error } = await (await supabase).auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
    }

    async signUp({ email, password, name }: SignupDTO) {
        const supabase = createSupabaseServerClient()

        const { data, error } = await (await supabase).auth.signUp({
            email,
            password,
        })

        if (error) throw error

        await (await supabase).from("profiles").insert({
            id: data.user!.id,
            name,
            role: "user",
        })
    }

    async logout() {
        const supabase = createSupabaseServerClient()
        await (await supabase).auth.signOut()
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        const supabase = createSupabaseServerClient()

        const {
            data: { user },
        } = await (await supabase).auth.getUser()

        if (!user) return null

        const { data: profile } = await (await supabase)
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        return {
            id: user.id,
            email: user.email!,
            role: profile?.role ?? "user",
        }
    }

    async loginWithGoogle() {
        const supabase = createSupabaseServerClient()

        const { data, error } = await (await supabase).auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
            },
        })

        if (error) throw error

        return data.url
    }
}
