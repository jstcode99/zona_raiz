// ==========================================
// Real Estate Agents SQL Generator
// ==========================================

import type { SeedAgent } from "../../types";
import { buildMultipleInserts } from "./sql-builder";

/**
 * Genera SQL para insertar relaciones de agentes con inmobiliarias.
 */
export function generateRealEstateAgentsSQL(agents: SeedAgent[]): string {
  if (agents.length === 0) {
    return "-- No hay agentes para insertar\n";
  }

  const header = `-- Insertando ${agents.length} relaciones agente-inmobiliaria...\n`;
  const sql = buildMultipleInserts("real_estate_agents", agents);

  return header + sql + "\n";
}