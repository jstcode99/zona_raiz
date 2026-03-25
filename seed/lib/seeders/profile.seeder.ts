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

async function truncateUsers(supabase: SupabaseClient) {
  const logger = SeedLogger;
  let success = 0;
  let failed = 0;

  const { data: usersData, error: fetchError } =
    await supabase.auth.admin.listUsers();

  if (fetchError) {
    logger.error("Error fetching users:", fetchError);
    return;
  }

  const users = usersData.users;
  logger.info(`Encontrados ${users.length} usuarios a eliminar.`);

  for (const user of users) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user.id,
    );
    if (deleteError) {
      failed++;
      logger.error(`Failed to delete user ${user.id}:`, deleteError);
    } else {
      success++;
    }
  }

  logger.info(
    `Auth users truncados: ${success} eliminados, ${failed} fallidos`,
  );
}

/**
 * Inserta perfiles en la base de datos.
 */
export async function seedProfiles(
  supabase: SupabaseClient,
  profiles: SeedProfile[],
  truncate: boolean,
): Promise<void> {
  const logger = SeedLogger;
  logger.subSection("Seed Profiles");

  if (truncate) {
    logger.info("Truncando perfiles...");
    await supabase
      .from("profiles")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
  }

  logger.info(`Insertando ${profiles.length} perfiles...`);
  const { error } = await supabase
    .from("profiles")
    .upsert(profiles, { onConflict: "id" });

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
  users: SeedUser[],
  truncate: boolean,
): Promise<{ success: number; failed: number }> {
  const logger = SeedLogger;
  logger.subSection("Seed Auth Users");

  if (truncate) {
    logger.info("Truncando users...");
    await truncateUsers(supabase); // ✅ await — antes no esperaba y causaba race condition
  }

  let success = 0;
  let failed = 0;

  for (const user of users) {
    try {
      const { error } = await supabase.auth.admin.createUser({
        ...user,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
        },
      });

      if (error) {
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

  logger.info(
    `Auth users: ${success} creados, ${failed} fallidos o existentes`,
  );
  return { success, failed };
}
