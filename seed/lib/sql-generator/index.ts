// ==========================================
// SQL Generator - Orquestador principal
// ==========================================

import { faker } from "@faker-js/faker";

import { SeedLogger } from "../logger";
import { SeedOptions, DEFAULT_SEED_OPTIONS } from "../../types";
import {
  generateFakeRealEstates,
  generateFakeProperties,
  generateFakePropertyImages,
  generateFakeListings,
  generateFakeFavorites,
  generateFakeInquiries,
} from "../faker-data";
import { toSeedInquiry } from "../faker-data/inquiries";

import { generateRealEstatesSQL } from "./real-estates";
import { generateRealEstateAgentsSQL } from "./real-estate-agents";
import { generatePropertiesSQL } from "./properties";
import { generatePropertyImagesSQL } from "./property-images";
import { generateListingsSQL } from "./listings";
import { generateFavoritesSQL } from "./favorites";
import { generateInquiriesSQL } from "./inquiries";
import { buildTruncate } from "./sql-builder";
import { EAgentRole } from "@/domain/entities/real-estate-agent.entity";

import type { SeedAgent, SeedListing } from "../../types";
import { generateFakeUsers } from "../faker-data/users";
import { EUserRole } from "@/domain/entities/profile.entity";
import { splitByRatio } from "@/shared/utils/number";
import { generateUsersSQL } from "./user";
import { generateIdentitiesSQL } from "./identities";

const TABLES_TO_TRUNCATE = [
  "enquiries",
  "favorites",
  "listings",
  "property_images",
  "properties",
  "real_estate_agents",
  "profiles",
  "real_estates",
];

/**
 * Genera todo el SQL para el seed.
 * @param options - Opciones de seed
 * @param includeTruncate - Si true, incluye TRUNCATE al inicio
 * @returns String con todo el SQL generado
 */
export function generateAllSQL(
  options: SeedOptions = DEFAULT_SEED_OPTIONS,
  includeTruncate: boolean = false,
): string {
  // Inicializar faker con seed para reproducibilidad
  faker.seed(42);

  SeedLogger.section("Generando SQL para Seed");
  SeedLogger.info(`Opciones: ${JSON.stringify(options)}`);

  const {
    clientsCount = 3,
    realEstateCount = 2,
    agentsPerRealEstate = 3,
    propertiesPerRealEstate = 5,
    listingsPerProperty = 1,
    favoritesCount = 5,
    inquiriesCount = 8,
  } = options;

  let sql = "";

  // 1. TRUNCATE opcional
  if (includeTruncate) {
    SeedLogger.info("Generando TRUNCATE...");
    sql += "-- ==========================================\n";
    sql += "-- TRUNCATE TABLES (para datos limpios)\n";
    sql += "-- ==========================================\n\n";
    sql += buildTruncate(TABLES_TO_TRUNCATE) + "\n\n";
    sql += `TRUNCATE auth.identities, auth.users CASCADE;` + "\n\n";
  }

  // 1. Generar usuarios (coordinadores, agentes, clientes)
  SeedLogger.info("Usarios...");

  const { p1: CoordinatorsCount, p2: AgentsCount } =
    splitByRatio(agentsPerRealEstate);

  SeedLogger.info(
    `Generando ${clientsCount + agentsPerRealEstate + 1} usuarios...`,
  );

  const admim = generateFakeUsers(1, EUserRole.Admin);
  const clients = generateFakeUsers(clientsCount, EUserRole.Client);
  const coordinators = generateFakeUsers(
    CoordinatorsCount,
    EUserRole.RealEstate,
  );
  const agents = generateFakeUsers(AgentsCount, EUserRole.RealEstate);

  const idUsers = [admim, clients, agents, coordinators]
    .flat()
    .map((u) => u.id);

  sql += generateUsersSQL(admim);
  sql += generateUsersSQL(clients);
  sql += generateUsersSQL(agents);
  sql += generateUsersSQL(coordinators);
  sql += generateIdentitiesSQL(idUsers);

  SeedLogger.success(
    `✓ 1 Admin, ${coordinators.length} coordinadores, ${agents.length} agentes, ${clients.length} clientes`,
  );

  // 2. Generar inmobiliarias
  SeedLogger.info(`Generando ${realEstateCount} inmobiliarias...`);
  const realEstates = generateFakeRealEstates(realEstateCount);
  sql += generateRealEstatesSQL(realEstates);
  SeedLogger.success(`✓ ${realEstates.length} inmobiliarias`);

  // 4. Generar relaciones real_estate_agents
  SeedLogger.info("Generando relaciones agente-inmobiliaria...");
  const realEstateAgents: SeedAgent[] = [];
  const realEstateIds = realEstates.map((re) => re.id);

  // Asignar cada coordinator a una inmobiliaria
  coordinators.forEach((coordinator, index) => {
    realEstateAgents.push({
      id: faker.string.uuid(),
      real_estate_id: realEstateIds[index % realEstateIds.length],
      profile_id: coordinator.id,
      role: EAgentRole.Coordinator,
    });
  });

  // Asignar cada agente a una inmobiliaria (distribuir uniformemente)
  agents.forEach((agent, index) => {
    realEstateAgents.push({
      id: faker.string.uuid(),
      real_estate_id: realEstateIds[index % realEstateIds.length],
      profile_id: agent.id,
      role: EAgentRole.Agent,
    });
  });

  sql += generateRealEstateAgentsSQL(realEstateAgents);
  SeedLogger.success(
    `✓ ${realEstateAgents.length} relaciones agente-inmobiliaria`,
  );

  // 5. Generar propiedades
  SeedLogger.info(
    `Generando ${realEstateCount * propertiesPerRealEstate} propiedades...`,
  );
  const propertyCount = realEstateCount * propertiesPerRealEstate;
  const properties = generateFakeProperties(propertyCount, realEstateIds);
  sql += generatePropertiesSQL(properties);
  SeedLogger.success(`✓ ${properties.length} propiedades`);

  // 6. Generar imágenes de propiedades
  SeedLogger.info("Generando imágenes de propiedades...");
  const propertyImages = generateFakePropertyImages(
    properties.length * 3,
    properties.map((p) => ({ id: p.id, title: p.title })) as any,
  );
  sql += generatePropertyImagesSQL(propertyImages);
  SeedLogger.success(`✓ ${propertyImages.length} imágenes`);

  // 7. Generar listados
  SeedLogger.info(
    `Generando ${properties.length * listingsPerProperty} listados...`,
  );
  const whatsappContact = "+5491112345678";
  const listings: SeedListing[] = generateFakeListings(
    properties.length * listingsPerProperty,
    properties.map((p) => ({ id: p.id, title: p.title })) as any,
    whatsappContact,
  );

  realEstateIds.forEach((id) => {
    const agentsRealEstate = realEstateAgents
      .filter((realEstateAgent) => realEstateAgent.real_estate_id == id)
      .map((a) => a.id);
    const propertiesRealEstate = properties
      .filter((p) => p.real_estate_id == id)
      .map((p) => p.id);

    listings
      .filter((l) => propertiesRealEstate.some((v) => v === l.property_id))
      .forEach((listing, index) => {
        listing.agent_id = agentsRealEstate[index % agentsRealEstate.length];
      });
  });
  // Asignar agentes a listados (asignar aleatorio)
  const agentIds = realEstateAgents.map((a) => a.id);

  sql += generateListingsSQL(listings);
  SeedLogger.success(`✓ ${listings.length} listados`);

  // 8. Generar favoritos
  SeedLogger.info(`Generando ${favoritesCount} favoritos...`);
  const favorites = generateFakeFavorites(
    favoritesCount,
    clients.map((c) => ({ id: c.id })) as any,
    listings.map((l) => ({ id: l.id, status: l.status })) as any,
  );
  sql += generateFavoritesSQL(favorites);
  SeedLogger.success(`✓ ${favorites.length} favoritos`);

  // 9. Generar inquiries
  SeedLogger.info(`Generando ${inquiriesCount} inquiries...`);
  const generatedInquiries = generateFakeInquiries(
    listings.map((l) => ({ id: l.id, status: l.status })) as any,
    agentIds as any,
    inquiriesCount,
  );
  const inquiries = generatedInquiries.map((gi) =>
    toSeedInquiry(gi, faker.string.uuid()),
  );
  sql += generateInquiriesSQL(inquiries);
  SeedLogger.success(`✓ ${inquiries.length} inquiries`);

  // Resumen final
  SeedLogger.section("SQL Generado Exitosamente");
  const totalInserts =
    realEstates.length +
    coordinators.length +
    agents.length +
    clients.length +
    realEstateAgents.length +
    properties.length +
    propertyImages.length +
    listings.length +
    favorites.length +
    inquiries.length;
  SeedLogger.info(`Total de inserts: ${totalInserts}`);

  return sql;
}
