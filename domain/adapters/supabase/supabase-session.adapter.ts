import { AuthUserEntity } from "@/domain/entities/auth-user.entity";
import { EUserRole } from "@/domain/entities/profile.entity";
import { RealEstateEntity, RealEstateWithRoleEntity } from "@/domain/entities/real-estate.entity";
import { SessionPort } from "@/domain/ports/sesion.port";
import { createSupabaseRouteClient } from "@/infrastructure/db/supabase.route";

export class SupabaseSessionAdapter implements SessionPort {
    private async ensureAuth() {
        const supabase = await createSupabaseRouteClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            throw new Error("Authentication required")
        }

        return { user }
    }

    async getCurrentUserId(): Promise<string | null> {
        const { user } = await this.ensureAuth()
        return user?.id ?? null;
    }

    async getCurrentUser(): Promise<AuthUserEntity | null> {
        const { user } = await this.ensureAuth()
        const supabase = await createSupabaseRouteClient()

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id, role, full_name, avatar_url")
            .eq("id", user.id)
            .single()

        if (profileError || !profile) {
            console.error("Profile fetch error:", profileError)
            return null
        }

        return {
            id: user.id,
            email: user.email!,
            role: profile.role as EUserRole,
            fullName: profile.full_name,
            avatarUrl: profile.avatar_url,
        }
    }

    async getRealEstatesForUser(): Promise<RealEstateWithRoleEntity[]> {
        const { user } = await this.ensureAuth()
        const supabase = await createSupabaseRouteClient()

        const { data, error } = await supabase
            .from("real_estate_agents")
            .select(`
          role,
          real_estates (
            id,
            name,
            description,
            whatsapp,
            street,
            city,
            state,
            postal_code,
            country,
            logo_url,
            created_at,
            updated_at
          )
      `)
            .eq("profile_id", user.id)

        if (error) throw new Error(error.message)

        return data.map((item: any) => ({
            real_estate: item.real_estates as RealEstateEntity,
            role: item.role as EUserRole,
        }))
    }
}