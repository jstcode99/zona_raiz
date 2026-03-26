// ==========================================
// Profiles SQL Generator
// ==========================================

import type { SeedProfile } from "../../types";
import { buildMultipleInserts } from "./sql-builder";

/**
 * Genera SQL para insertar perfiles (coordinadores, agentes, clientes).
 */
export function generateProfilesSQL(
  coordinators: SeedProfile[],
  agents: SeedProfile[],
  clients: SeedProfile[],
): string {
  let sql = "";

  if (coordinators.length > 0) {
    sql += `-- Insertando ${coordinators.length} coordinadores...\n`;
    sql += buildMultipleInserts("profiles", coordinators) + "\n";
  }

  if (agents.length > 0) {
    sql += `-- Insertando ${agents.length} agentes...\n`;
    sql += buildMultipleInserts("profiles", agents) + "\n";
  }

  if (clients.length > 0) {
    sql += `-- Insertando ${clients.length} clientes...\n`;
    sql += buildMultipleInserts("profiles", clients) + "\n";
  }

  if (sql === "") {
    return "-- No hay perfiles para insertar\n";
  }

  return sql;
}