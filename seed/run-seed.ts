#!/usr/bin/env node

/**
 * ==========================================
 * ZONA_RAIZ - Database Seed Script
 * ==========================================
 *
 * Script para populate la base de datos con datos de prueba generados con Faker.js.
 *
 * Uso:
 *   pnpm seed              # Ejecutar con opciones por defecto
 *   pnpm seed --dry-run    # Solo mostrar qué se insertaría
 *   pnpm seed --skip-auth  # Omitir creación de auth users
 *
 * Variables de entorno necesarias:
 *   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
 *
 */

import * as dotenv from "dotenv";
import { runSeed, SeedLogger, LogLevel } from "./index";
import { faker } from "@faker-js/faker";
import {
  generateFakeRealEstates,
  generateFakeProperties,
  generateFakeListings,
  generateFakePropertyImages,
  generateFakeProfiles,
} from "./lib/faker-data";

dotenv.config({ path: `.env.local` });
// Seed Faker para reproducibilidad en dry-run
faker.seed(42);

// Configurar logger
const logger = SeedLogger;
logger.setLevel(LogLevel.INFO);

// Parsear argumentos de línea de comandos
const args = process.argv.slice(2);
const options: {
  dryRun?: boolean;
  skipAuth?: boolean;
  truncate?: boolean;
} = {};

for (const arg of args) {
  switch (arg) {
    case "--dry-run":
      options.dryRun = true;
      break;
    case "--skip-auth":
      options.skipAuth = true;
      break;
    case "--no-truncate":
      options.truncate = false;
      break;
    case "--help":
    case "-h":
      console.log(`
ZONA_RAIZ Database Seed Script (Faker.js)
========================================

Uso:
  pnpm seed [opciones]

Opciones:
  --dry-run     Solo muestra qué se insertaría (no ejecuta)
  --skip-auth   Omitir creación de usuarios en auth.users
  --no-truncate No truncar tablas antes de insertar
  --help, -h    Mostrar esta ayuda

Variables de entorno:
  NEXT_PUBLIC_SUPABASE_URL     URL del proyecto Supabase
  SUPABASE_SERVICE_ROLE_KEY   Service Role Key de Supabase

Ejemplo:
  # Desarrollo local con Supabase local
  NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \\
  SUPABASE_SERVICE_ROLE_KEY=your-local-key \\
  pnpm seed

  # Producción
  NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co \\
  SUPABASE_SERVICE_ROLE_KEY=your-production-key \\
  pnpm seed --skip-auth
`);
      process.exit(0);
  }
}

async function main() {
  logger.section("🌱 ZONA_RAIZ SEED (Faker.js)");

  if (options.dryRun) {
    logger.warn(
      "⚠️  Modo DRY-RUN: Solo se mostrarán los datos que se insertarían",
    );

    console.log("\n📊 Datos que se insertarían (generados con Faker.js):");

    // Generar datos fake para mostrar en dry-run
    const fakeRealEstates = generateFakeRealEstates(3);
    console.log(`   - Real Estates: ${fakeRealEstates.length}`);

    const realEstateIds = fakeRealEstates.map((re) => re.id);
    const fakeProperties = generateFakeProperties(15, realEstateIds);
    console.log(`   - Properties: ${fakeProperties.length}`);

    const fakeListings = generateFakeListings(
      fakeProperties.length,
      fakeProperties,
      fakeRealEstates[0]?.whatsapp || "+5491100000000",
    );
    console.log(`   - Listings: ${fakeListings.length}`);

    const fakeImages = generateFakePropertyImages(0, fakeProperties);
    console.log(`   - Property Images: ${fakeImages.length}`);

    const { coordinators, agents, clients } = generateFakeProfiles({
      coordinators: 3,
      agentsPerCoordinator: 3,
      clients: 3,
    });
    console.log(`   - Coordinators: ${coordinators.length}`);
    console.log(`   - Agents: ${agents.length}`);
    console.log(`   - Clients: ${clients.length}`);

    const totalProfiles = coordinators.length + agents.length + clients.length;
    const favoritesCount = Math.min(
      5,
      clients.length * fakeListings.filter((l) => l.status === "active").length,
    );
    const inquiriesCount = 8;

    console.log(`   - Total Profiles: ${totalProfiles}`);
    console.log(`   - Favorites: ~${favoritesCount}`);
    console.log(`   - Inquiries: ~${inquiriesCount}`);

    console.log(
      "\n✅ Dry-run completado. Datos generados con Faker.js (seed=42).",
    );
    console.log("   Usa 'pnpm seed' para ejecutar la inserción real.");
    return;
  }

  try {
    const result = await runSeed({
      skipAuth: options.skipAuth,
      truncate: options.truncate,
    });

    if (result.success) {
      logger.success("\n🎉 Seed completado exitosamente!");
      process.exit(0);
    } else {
      logger.error("\n❌ Seed completado con errores");
      if (result.errors.length > 0) {
        console.log("\nErrores:");
        result.errors.forEach((err) => console.log(`  - ${err}`));
      }
      process.exit(1);
    }
  } catch (error) {
    logger.error("\n💥 Error Fatal:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error no capturado:", error);
  process.exit(1);
});
