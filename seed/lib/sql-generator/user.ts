// ==========================================
// Profiles SQL Generator
// ==========================================

import type { SeedUser } from "../../types";
import { buildMultipleInserts } from "./sql-builder";

/**
 * Genera SQL para insertar users.
 */
export function generateUsersSQL(users: SeedUser[]): string {
  let sql = "";

  if (users.length === 0) {
    return "-- No hay users para insertar\n";
  }

  if (users.length > 0) {
    sql += `-- Insertando ${users.length} users...\n`;
    sql += buildMultipleInserts("users", users, "auth.") + "\n";
  }

  return sql;
}
