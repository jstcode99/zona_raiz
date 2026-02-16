import { UserRepository } from "@/domain/repositories/UserRepository";
import { UserWithProfile } from "@/domain/entities/User";
import { ProfileBasic, UserRole } from "@/domain/entities/Profile";
import { createSupabaseServerClient } from "./supabase.server";
import { createSupabaseRouteClient } from "./supabase.route";
import { cache } from "react";
import { createSupabaseAdminClient } from "./supabase.server-admin";

export class SupabaseUserRepository implements UserRepository {
  findAll = cache(async (): Promise<UserWithProfile[]> => {
    const supabase = await createSupabaseAdminClient();

    // Obtener usuarios de auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      console.log(authError);
      throw new Error("Failed to load users");
    }

    // Obtener perfiles con información de real estate
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        name,
        last_name,
        phone,
        avatar_url,
        role,
        real_estate_id,
        real_estates (
          id,
          name,
          slug
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);

      throw new Error("Failed to load users");
    }

    // Combinar datos
    const users: UserWithProfile[] = authData.users.map((authUser) => {
      const profile = profiles.find((p) => p.id === authUser.id);

      return {
        id: authUser.id,
        user: {
          id: authUser.id,
          email: authUser.email || null,
        },
        profile: profile
          ? {
            name: profile.name,
            last_name: profile.last_name,
            phone: profile.phone,
            avatar_url: profile.avatar_url,
            role: profile.role as UserRole,
            real_estate_id: profile.real_estate_id,
            real_estate: profile.real_estates as any,
          }
          : null,
      };
    });

    return users;
  });

  findById = cache(async (id: string): Promise<UserWithProfile | null> => {
    const supabase = await createSupabaseServerClient();

    const { data: authUser, error: authError } =
      await supabase.auth.admin.getUserById(id);

    if (authError || !authUser) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
        id,
        name,
        last_name,
        phone,
        avatar_url,
        role,
        real_estate_id,
        real_estates (
          id,
          name,
          slug
        )
      `
      )
      .eq("id", id)
      .single();

    if (profileError) {
      return null;
    }

    return {
      user: {
        id: authUser.user.id,
        email: authUser.user.email || null,
      },
      profile: profile
        ? {
          name: profile.name,
          last_name: profile.last_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          role: profile.role as UserRole,
          real_estate_id: profile.real_estate_id,
          real_estate: profile.real_estates as any,
        }
        : null,
    };
  });

  async updateBasic(userId: string, data: ProfileBasic): Promise<void> {
    const supabase = await createSupabaseRouteClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        name: data.name,
        phone: data.phone,
        last_name: data.last_name,
      })
      .eq("id", userId);

    if (error) {
      throw new Error("Failed to update user basic data");
    }
  }

  async updateRole(userId: string, role: UserRole): Promise<void> {
    const supabase = await createSupabaseRouteClient();

    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) {
      throw new Error("Failed to update user role");
    }
  }

  async updateRealEstate(
    userId: string,
    realEstateId: string | null
  ): Promise<void> {
    const supabase = await createSupabaseRouteClient();

    const { error } = await supabase
      .from("profiles")
      .update({ real_estate_id: realEstateId })
      .eq("id", userId);

    if (error) {
      throw new Error("Failed to update user real estate");
    }
  }

  async delete(userId: string): Promise<void> {
    const supabase = await createSupabaseRouteClient();

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error("Failed to delete user");
    }
  }
}
