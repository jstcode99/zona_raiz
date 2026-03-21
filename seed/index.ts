// ==========================================
// Seed Index - Orquestador principal
// ==========================================

import { getSeedClient, verifySeedClient } from "./lib/supabase";
import { SeedLogger, LogLevel } from "./lib/logger";
import { generateTestProfiles, generateTestUsers, seedProfiles, seedAuthUsers } from "./lib/seeders/profile.seeder";
import { seedRealEstates } from "./lib/seeders/real-estate.seeder";
import { seedProperties, seedPropertyImages } from "./lib/seeders/property.seeder";
import { seedListings, getListingStats } from "./lib/seeders/listing.seeder";
import { generateFavorites, seedFavorites } from "./lib/seeders/favorite.seeder";
import { generateInquiries, seedInquiries } from "./lib/seeders/inquiry.seeder";
import { SeedOptions, DEFAULT_SEED_OPTIONS } from "./types";
import { REAL_ESTATES, PROPERTIES, LISTINGS, PROPERTY_IMAGES } from "./data";

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
 * Ejecuta el seed completo de la base de datos.
 */
export async function runSeed(options: Partial<SeedOptions> = {}): Promise<SeedResult> {
  const errors: string[] = [];
  
  // Mezclar opciones con valores por defecto
  const opts: SeedOptions = {
    ...DEFAULT_SEED_OPTIONS,
    ...options,
  };

  logger.setLevel(LogLevel.INFO);
  logger.section("🌱 ZONA_RAIZ DATABASE SEED");
  logger.info("Iniciando proceso de seed...");
  logger.info(`Opciones: truncate=${opts.truncate}, skipAuth=${opts.skipAuth}`);

  // 1. Verificar conexión
  logger.subSection("Verificando conexión");
  const isConnected = await verifySeedClient();
  if (!isConnected) {
    const error = "No se pudo conectar a Supabase";
    logger.error(error);
    return { success: false, realEstates: 0, profiles: 0, agents: 0, properties: 0, listings: 0, favorites: 0, inquiries: 0, errors: [error] };
  }

  // 2. Obtener cliente
  const supabase = getSeedClient();

  // 3. Generar perfiles de prueba
  logger.subSection("Generando perfiles");
  const { coordinatorProfiles, agentProfiles, clientProfiles } = generateTestProfiles({
    realEstateCount: opts.realEstateCount!,
    agentsPerRealEstate: opts.agentsPerRealEstate!,
    clientsCount: opts.clientsCount!,
  });
  const allProfiles = [...coordinatorProfiles, ...agentProfiles, ...clientProfiles];
  logger.info(`Generados ${allProfiles.length} perfiles (${coordinatorProfiles.length} coordinadores, ${agentProfiles.length} agentes, ${clientProfiles.length} clientes)`);

  // 4. Generar usuarios de auth
  const allUsers = generateTestUsers(allProfiles);

  // 5. Insertar perfiles (primero para tener las FK disponibles)
  try {
    await seedProfiles(supabase, allProfiles, opts.truncate!);
  } catch (err) {
    const error = `Error insertando perfiles: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 6. Crear usuarios en auth (opcional, puede fallar si ya existen)
  if (!opts.skipAuth) {
    try {
      const authResult = await seedAuthUsers(supabase, allUsers);
      logger.info(`Auth users: ${authResult.success} creados, ${authResult.failed} fallidos`);
    } catch (err) {
      logger.warn(`Error creando auth users (no crítico): ${err}`);
    }
  }

  // 7. Insertar inmobiliarias y agentes
  let agents: Awaited<ReturnType<typeof seedRealEstates>>["agents"] = [];
  try {
    const reResult = await seedRealEstates(supabase, {
      realEstates: REAL_ESTATES,
      coordinatorProfiles,
      agentProfiles,
    }, opts.truncate!);
    agents = reResult.agents;
  } catch (err) {
    const error = `Error insertando inmobiliarias: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 8. Insertar propiedades
  let insertedProperties = PROPERTIES;
  try {
    const propResult = await seedProperties(supabase, PROPERTIES, agents, opts.truncate!);
    insertedProperties = propResult.properties;
  } catch (err) {
    const error = `Error insertando propiedades: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 9. Insertar imágenes de propiedades
  try {
    await seedPropertyImages(supabase, PROPERTY_IMAGES, opts.truncate!);
  } catch (err) {
    const error = `Error insertando imágenes: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 10. Insertar listings
  let insertedListings = LISTINGS;
  try {
    insertedListings = await seedListings(supabase, LISTINGS, insertedProperties, agents, opts.truncate!);
    const stats = getListingStats(insertedListings);
    logger.info(`Stats: ${stats.total} total, ${stats.active} activos, ${stats.featured} destacados`);
  } catch (err) {
    const error = `Error insertando listings: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 11. Generar e insertar favoritos
  const activeListings = insertedListings.filter((l) => l.status === "active");
  const favorites = generateFavorites(clientProfiles, activeListings, opts.favoritesCount!);
  try {
    await seedFavorites(supabase, favorites, opts.truncate!);
  } catch (err) {
    const error = `Error insertando favoritos: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 12. Generar e insertar inquiries
  const inquiries = generateInquiries(insertedListings, agents, opts.inquiriesCount!);
  try {
    await seedInquiries(supabase, inquiries, opts.truncate!);
  } catch (err) {
    const error = `Error insertando inquiries: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // Resumen final
  logger.section("📊 RESUMEN DE SEED");
  logger.success(`✅ Seed completado`);
  logger.info(`   - Inmobiliarias: ${REAL_ESTATES.length}`);
  logger.info(`   - Perfiles: ${allProfiles.length}`);
  logger.info(`   - Agentes: ${agents.length}`);
  logger.info(`   - Propiedades: ${insertedProperties.length}`);
  logger.info(`   - Imágenes: ${PROPERTY_IMAGES.length}`);
  logger.info(`   - Listados: ${insertedListings.length}`);
  logger.info(`   - Favoritos: ${favorites.length}`);
  logger.info(`   - Inquiries: ${inquiries.length}`);
  
  if (errors.length > 0) {
    logger.warn(`⚠️ ${errors.length} errores encontrados:`);
    errors.forEach((err) => logger.error(`  - ${err}`));
  }

  return {
    success: errors.length === 0,
    realEstates: REAL_ESTATES.length,
    profiles: allProfiles.length,
    agents: agents.length,
    properties: insertedProperties.length,
    listings: insertedListings.length,
    favorites: favorites.length,
    inquiries: inquiries.length,
    errors,
  };
}

// Exportar para uso como módulo
export type { SeedOptions } from "./types";
export { DEFAULT_SEED_OPTIONS } from "./types";
export { SeedLogger, LogLevel } from "./lib/logger";
