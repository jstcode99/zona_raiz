// ==========================================
// Seed Index - Orquestador principal
// ==========================================

import { getSeedClient, verifySeedClient } from "./lib/supabase";
import { SeedLogger, LogLevel } from "./lib/logger";
import { seedProfiles, seedAuthUsers } from "./lib/seeders/profile.seeder";
import { seedRealEstates } from "./lib/seeders/real-estate.seeder";
import { seedProperties, seedPropertyImages } from "./lib/seeders/property.seeder";
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
import type { SeedProfile, SeedAgent } from "./types";

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
export async function runSeed(options: Partial<SeedOptions> = {}): Promise<SeedResult> {
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
    return { success: false, realEstates: 0, profiles: 0, agents: 0, properties: 0, listings: 0, favorites: 0, inquiries: 0, errors: [error] };
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
  
  const allProfiles: SeedProfile[] = [...coordinatorProfiles, ...agentProfiles, ...clientProfiles];
  logger.info(`Generados ${allProfiles.length} perfiles (${coordinatorProfiles.length} coordinadores, ${agentProfiles.length} agentes, ${clientProfiles.length} clientes)`);

  // 4. Insertar perfiles (primero para tener las FK disponibles)
  try {
    await seedProfiles(supabase, allProfiles, opts.truncate!);
  } catch (err) {
    const error = `Error insertando perfiles: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 5. Generar inmobiliarias fake con Faker
  const fakeRealEstates = generateFakeRealEstates(opts.realEstateCount!);
  logger.info(`Generadas ${fakeRealEstates.length} inmobiliarias con Faker`);

  // 6. Crear usuarios en auth (opcional, puede fallar si ya existen)
  if (!opts.skipAuth) {
    try {
      const usersToCreate = allProfiles.map((profile) => ({
        id: profile.id,
        email: profile.email,
        password: "Test123456!",
        fullName: profile.fullName,
        phone: profile.phone,
        role: profile.role,
        avatarUrl: profile.avatarUrl,
      }));
      const authResult = await seedAuthUsers(supabase, usersToCreate);
      logger.info(`Auth users: ${authResult.success} creados, ${authResult.failed} fallidos`);
    } catch (err) {
      logger.warn(`Error creando auth users (no crítico): ${err}`);
    }
  }

  // 7. Insertar inmobiliarias y agentes
  let agentsResult: SeedAgent[] = [];
  try {
    const reResult = await seedRealEstates(supabase, {
      realEstates: fakeRealEstates,
      coordinatorProfiles,
      agentProfiles,
    }, opts.truncate!);
    agentsResult = reResult.agents;
  } catch (err) {
    const error = `Error insertando inmobiliarias: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 8. Generar e insertar propiedades fake con Faker
  const realEstateIds = fakeRealEstates.map((re) => re.id);
  const fakeProperties = generateFakeProperties(opts.propertiesPerRealEstate! * opts.realEstateCount!, realEstateIds);
  
  let insertedProperties = fakeProperties;
  try {
    const propResult = await seedProperties(supabase, fakeProperties, agentsResult, opts.truncate!);
    insertedProperties = propResult.properties;
  } catch (err) {
    const error = `Error insertando propiedades: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 9. Generar e insertar imágenes fake con Faker
  const fakeImages = generateFakePropertyImages(0, insertedProperties); // count=0 para auto-generar por propiedad
  try {
    await seedPropertyImages(supabase, fakeImages, opts.truncate!);
  } catch (err) {
    const error = `Error insertando imágenes: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 10. Generar e insertar listings fake con Faker
  const fakeListings = generateFakeListings(
    opts.listingsPerProperty! * insertedProperties.length,
    insertedProperties,
    fakeRealEstates[0]?.whatsapp || "+5491100000000"
  );
  
  let insertedListings = fakeListings;
  try {
    insertedListings = await seedListings(supabase, fakeListings, insertedProperties, agentsResult, opts.truncate!);
    const stats = getListingStats(insertedListings);
    logger.info(`Stats: ${stats.total} total, ${stats.active} activos, ${stats.featured} destacados`);
  } catch (err) {
    const error = `Error insertando listings: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 11. Generar e insertar favoritos fake con Faker
  const activeListings = insertedListings.filter((l) => l.status === "active");
  const fakeFavorites = generateFakeFavorites(opts.favoritesCount!, clientProfiles, activeListings);
  try {
    await seedFavorites(supabase, fakeFavorites, opts.truncate!);
  } catch (err) {
    const error = `Error insertando favoritos: ${err}`;
    logger.error(error);
    errors.push(error);
  }

  // 12. Generar e insertar inquiries fake con Faker
  const fakeInquiries = generateFakeInquiries(insertedListings, agentsResult, opts.inquiriesCount!);
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
  logger.info(`   - Imágenes: ${fakeImages.length}`);
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
