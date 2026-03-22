#!/usr/bin/env node

/**
 * ==========================================
 * ZONA_RAIZ - Database Seed Script
 * ==========================================
 * 
 * Script para populate la base de datos con datos de prueba.
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

import "dotenv/config";
import { runSeed, SeedLogger, LogLevel } from "./index";

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
ZONA_RAIZ Database Seed Script
==============================

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
  logger.section("🌱 ZONA_RAIZ SEED");
  
  if (options.dryRun) {
    logger.warn("⚠️  Modo DRY-RUN: Solo se mostrarán los datos que se insertarían");
    // En dry-run simplemente mostramos los datos que tenemos
    const { REAL_ESTATES, PROPERTIES, LISTINGS, PROPERTY_IMAGES } = await import("./data");
    const { generateTestProfiles } = await import("./lib/seeders/profile.seeder");
    
    console.log("\n📊 Datos que se insertarían:");
    console.log(`   - Real Estates: ${REAL_ESTATES.length}`);
    console.log(`   - Properties: ${PROPERTIES.length}`);
    console.log(`   - Listings: ${LISTINGS.length}`);
    console.log(`   - Property Images: ${PROPERTY_IMAGES.length}`);
    
    const profiles = generateTestProfiles({
      realEstateCount: 2,
      agentsPerRealEstate: 3,
      clientsCount: 3,
    });
    console.log(`   - Coordinators: ${profiles.coordinatorProfiles.length}`);
    console.log(`   - Agents: ${profiles.agentProfiles.length}`);
    console.log(`   - Clients: ${profiles.clientProfiles.length}`);
    
    console.log("\n✅ Dry-run completado. Usa 'pnpm seed' para ejecutar.");
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
