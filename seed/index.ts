// ==========================================
// Seed Index - Orquestador principal
// ==========================================

import { getSeedClient, verifySeedClient } from "./lib/supabase";
import { SeedLogger, LogLevel } from "./lib/logger";
import { seedAuthUsers } from "./lib/seeders/profile.seeder";
import { seedRealEstates } from "./lib/seeders/real-estate.seeder";
import {
  seedProperties,
  seedPropertyImages,
} from "./lib/seeders/property.seeder";
import { seedListings, getListingStats } from "./lib/seeders/listing.seeder";
import { seedFavorites } from "./lib/seeders/favorite.seeder";
import { seedInquiries } from "./lib/seeders/inquiry.seeder";
import { SeedOptions, DEFAULT_SEED_OPTIONS } from "./types";

// Importar generadores de Faker
import {
  generateFakeRealEstates,
  generateFakeProperties,
  generateFakeListings,
  generateFakePropertyImages,
  generateFakeProfiles,
  generateFakeFavorites,
  generateFakeInquiries,
} from "./lib/faker-data";
import type {
  SeedProfile,
  SeedAgent,
  SeedProperty,
  SeedListing,
} from "./types";

export interface SeedResult {
  success: boolean;
  realEstates: number;
  profiles: number;
  agents: number;
  properties: number;
  listings: number;
  favorites: number;
  inquiries: number;
  errors: string[];
}

export interface SeedStats {
  realEstates: number;
  profiles: number;
  agents: number;
  properties: number;
  listings: number;
  favorites: number;
  inquiries: number;
  listingStats: ReturnType<typeof getListingStats>;
}

const logger = SeedLogger;

/**
 * Ejecuta el seed completo de la base de datos usando Faker.js.
 */
export async function runSeed(
  options: Partial<SeedOptions> = {},
): Promise<SeedResult> {
  const errors: string[] = [];

  // Mezclar opciones con valores por defecto
  const opts: SeedOptions = {
    ...DEFAULT_SEED_OPTIONS,
    ...options,
  };

  logger.setLevel(LogLevel.INFO);
  logger.section("🌱 ZONA_RAIZ DATABASE SEED (Faker.js)");
  logger.info("Iniciando proceso de seed con datos generados dinámicamente...");
  logger.info(`Opciones: truncate=${opts.truncate}, skipAuth=${opts.skipAuth}`);

  // 1. Verificar conexión
  logger.subSection("Verificando conexión");
  const isConnected = await verifySeedClient();
  if (!isConnected) {
    const error = "No se pudo conectar a Supabase";
    logger.error(error);
    return {
      success: false,
      realEstates: 0,
      profiles: 0,
      agents: 0,
      properties: 0,
      listings: 0,
      favorites: 0,
      inquiries: 0,
      errors: [error],
    };
  }

  // 2. Obtener cliente
  const supabase = getSeedClient();

  // 3. Generar perfiles fake con Faker
  logger.subSection("Generando perfiles con Faker");
  const { coordinators, agents, clients } = generateFakeProfiles({
    coordinators: opts.realEstateCount!,
    agentsPerCoordinator: opts.agentsPerRealEstate!,
    clients: opts.clientsCount!,
  });

  // Alias para compatibilidad
  const coordinatorProfiles = coordinators;
  const agentProfiles = agents;
  const clientProfiles = clients;

  const allProfiles: SeedProfile[] = [
    ...coordinatorProfiles,
    ...agentProfiles,
    ...clientProfiles,
  ];
  logger.info(
    `Generados ${allProfiles.length} perfiles (${coordinatorProfiles.length} coordinadores, ${agentProfiles.length} agentes, ${clientProfiles.length} clientes)`,
  );

  // 4. Crear usuarios en auth.users - los perfiles se crean automáticamente via trigger
  const profileIdMap: Map<string, string> = new Map(); // authUserId -> profileId
  if (!opts.skipAuth) {
    try {
      const usersToCreate = allProfiles.map((profile) => ({
        ...profile,
        password: "Test123456!",
      }));
      const authResult = await seedAuthUsers(
        supabase,
        usersToCreate,
        opts.truncate!,
      );
      logger.info(
        `Auth users: ${authResult.success} creados, ${authResult.failed} fallidos`,
      );

      // OBTENER los profile_ids creados por el trigger
      // El trigger handle_new_user() crea perfiles con IDs diferentes a los user_id
      const authUserIds = usersToCreate.map((u) => u.id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id")
        .in("id", authUserIds);

      if (profilesError) {
        logger.warn(`Error obteniendo perfiles: ${profilesError.message}`);
      } else if (profiles) {
        profiles.forEach((p) => {
          profileIdMap.set(p.id, p.id);
        });
        logger.info(
          `✓ Mapeados ${profiles.length} perfiles (auth_user_id → profile_id)`,
        );
      }
    } catch (err) {
      logger.warn(`Error creando auth users: ${err}`);
    }
  } else {
    logger.warn("⚠️  Saltando creación de auth.users (--skip-auth)");
    logger.warn(
      "   Esto puede causar FK violations si los usuarios no existen",
    );
  }

  // 6. Generar inmobiliarias fake con Faker
  const fakeRealEstates = generateFakeRealEstates(opts.realEstateCount!);
  logger.info(`Generadas ${fakeRealEstates.length} inmobiliarias con Faker`);

  // 7. Insertar inmobiliarias y agentes (obtenemos los IDs reales de la BD)
  let agentsResult: SeedAgent[] = [];
  let realEstateIds: string[] = [];
  try {
    const reResult = await seedRealEstates(
      supabase,
      {
        realEstates: fakeRealEstates,
        coordinatorProfiles,
        agentProfiles,
      },
      opts.truncate!,
    );
    agentsResult = reResult.agents;
    realEstateIds = reResult.realEstates.map((re) => re.id);
  } catch (err) {
    const error = `Error insertando inmobiliarias: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 8. Generar e insertar propiedades fake con Faker
  // IMPORTANTE: Usar los IDs reales de las inmobiliarias
  const fakeProperties = generateFakeProperties(
    opts.propertiesPerRealEstate! * opts.realEstateCount!,
    realEstateIds,
  );

  let insertedProperties: SeedProperty[] = [];
  try {
    const propResult = await seedProperties(
      supabase,
      fakeProperties,
      agentsResult,
      opts.truncate!,
    );
    insertedProperties = propResult.properties;
  } catch (err) {
    const error = `Error insertando propiedades: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 9. Generar e insertar imágenes fake con Faker
  // Usar las propiedades con IDs reales
  const fakeImages = generateFakePropertyImages(0, insertedProperties);
  let insertedImagesCount = 0;
  try {
    const imagesResult = await seedPropertyImages(
      supabase,
      fakeImages,
      opts.truncate!,
    );
    insertedImagesCount = imagesResult.length;
  } catch (err) {
    const error = `Error insertando imágenes: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 10. Generar e insertar listings fake con Faker
  // Usar las propiedades con IDs reales
  const fakeListings = generateFakeListings(
    opts.listingsPerProperty! * insertedProperties.length,
    insertedProperties,
    fakeRealEstates[0]?.whatsapp || "+5491100000000",
  );

  let insertedListings: SeedListing[] = [];
  try {
    insertedListings = await seedListings(
      supabase,
      fakeListings,
      insertedProperties,
      agentsResult,
      opts.truncate!,
    );
    const stats = getListingStats(insertedListings);
    logger.info(
      `Stats: ${stats.total} total, ${stats.active} activos, ${stats.featured} destacados`,
    );
  } catch (err) {
    const error = `Error insertando listings: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 11. Generar e insertar favoritos fake con Faker
  const activeListings = insertedListings.filter((l) => l.status === "active");
  const fakeFavorites = generateFakeFavorites(
    opts.favoritesCount!,
    clientProfiles,
    activeListings,
  );
  try {
    await seedFavorites(supabase, fakeFavorites, opts.truncate!);
  } catch (err) {
    const error = `Error insertando favoritos: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 12. Generar e insertar inquiries fake con Faker
  const fakeInquiries = generateFakeInquiries(
    insertedListings,
    agentsResult,
    opts.inquiriesCount!,
  );
  try {
    await seedInquiries(supabase, fakeInquiries, opts.truncate!);
  } catch (err) {
    const error = `Error insertando inquiries: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // Resumen final
  logger.section("📊 RESUMEN DE SEED");
  logger.success(`✅ Seed completado con Faker.js`);
  logger.info(`   - Inmobiliarias: ${fakeRealEstates.length}`);
  logger.info(`   - Perfiles: ${allProfiles.length}`);
  logger.info(`   - Agentes: ${agentsResult.length}`);
  logger.info(`   - Propiedades: ${insertedProperties.length}`);
  logger.info(`   - Imágenes: ${insertedImagesCount}`);
  logger.info(`   - Listados: ${insertedListings.length}`);
  logger.info(`   - Favoritos: ${fakeFavorites.length}`);
  logger.info(`   - Inquiries: ${fakeInquiries.length}`);

  if (errors.length > 0) {
    logger.warn(`⚠️ ${errors.length} errores encontrados:`);
    errors.forEach((err) => logger.error(`  - ${err}`));
  }

  return {
    success: errors.length === 0,
    realEstates: fakeRealEstates.length,
    profiles: allProfiles.length,
    agents: agentsResult.length,
    properties: insertedProperties.length,
    listings: insertedListings.length,
    favorites: fakeFavorites.length,
    inquiries: fakeInquiries.length,
    errors,
  };
}

// Exportar para uso como módulo
export type { SeedOptions } from "./types";
export { DEFAULT_SEED_OPTIONS } from "./types";
export { SeedLogger, LogLevel } from "./lib/logger";
