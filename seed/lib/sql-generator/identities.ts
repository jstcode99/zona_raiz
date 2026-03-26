// ==========================================
// Profiles SQL Generator
// ==========================================

import { buildInsertSelect } from "./sql-builder";

/**
 * Genera SQL para insertar users.
 */
export function generateIdentitiesSQL(ids: string[]): string {
  let sql = "";

  if (ids.length === 0) {
    return "-- No hay identities para insertar\n";
  }

  const select = `SELECT
      uuid_generate_v4(),
      uuid_generate_v4(),
      id,
      format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
      'email',
      current_timestamp, current_timestamp, current_timestamp
    FROM auth.users
    WHERE id IN (${ids.map((id) => `'${id}'`)})`;

  if (ids.length > 0) {
    sql += `-- Insertando ${ids.length} identities...\n`;
    sql +=
      buildInsertSelect(
        "identities",
        [
          "id",
          "provider_id",
          "user_id",
          "identity_data",
          "provider",
          "last_sign_in_at",
          "created_at",
          "updated_at",
        ],
        select,
        "auth.",
      ) + "\n";
  }

  return sql;
}
