// ==========================================
// Auth & Profile Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedProfile, SeedUser } from "../../types";
import { SeedLogger } from "../logger";

export interface ProfileSeedResult {
  coordinatorProfiles: SeedProfile[];
  agentProfiles: SeedProfile[];
  clientProfiles: SeedProfile[];
}

/**
 * Genera usuarios de auth para Supabase.
 */
export function generateTestUsers(profiles: SeedProfile[]): SeedUser[] {
  return profiles.map((profile) => ({
    id: profile.id,
    email: profile.email,
    password: "Test123456!",
    fullName: profile.fullName,
    phone: profile.phone,
    role: profile.role,
    avatarUrl: profile.avatarUrl,
  }));
}

/**
 * Inserta perfiles en la base de datos.
 */
export async function seedProfiles(
  supabase: SupabaseClient,
  profiles: SeedProfile[],
  truncate: boolean
): Promise<void> {
  const logger = SeedLogger;

  logger.subSection("Seed Profiles");

  if (truncate) {
    logger.info("Truncando perfiles...");
    await supabase.from("profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  logger.info(`Insertando ${profiles.length} perfiles...`);

  const profileInserts = profiles.map((profile) => ({
    id: profile.id,
    email: profile.email,
    full_name: profile.fullName,
    phone: profile.phone,
    role: profile.role,
    avatar_url: profile.avatarUrl || null,
  }));

  const { error } = await supabase
    .from("profiles")
    .upsert(profileInserts, { onConflict: "id" });

  if (error) {
    logger.error("Error insertando perfiles:", error.message);
    throw error;
  }

  logger.success(`✓ ${profiles.length} perfiles insertados`);
}

/**
 * Crea usuarios en auth.users de Supabase.
 * Nota: Requiere admin rights.
 */
export async function seedAuthUsers(
  supabase: SupabaseClient,
  users: SeedUser[]
): Promise<{ success: number; failed: number }> {
  const logger = SeedLogger;

  logger.subSection("Seed Auth Users (Opcional)");

  let success = 0;
  let failed = 0;

  for (const user of users) {
    try {
      // Intentar crear usuario en auth.users
      const { error } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          phone: user.phone,
          role: user.role,
        },
      });

      if (error) {
        // Si el usuario ya existe, no es un error crítico
        if (error.message.includes("already been registered")) {
          logger.debug(`Usuario ${user.email} ya existe, omitiendo...`);
          success++;
        } else {
          logger.warn(`Error creando usuario ${user.email}: ${error.message}`);
          failed++;
        }
      } else {
        success++;
      }
    } catch (err) {
      logger.warn(`Excepción creando usuario ${user.email}:`, err);
      failed++;
    }
  }

  logger.info(`Auth users: ${success} creados, ${failed} fallidos o existentes`);

  return { success, failed };
}
