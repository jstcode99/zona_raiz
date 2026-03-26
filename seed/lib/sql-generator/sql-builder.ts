// ==========================================
// SQL Builder - Utility for building SQL INSERT statements
// ==========================================

/**
 * Escapa un valor para uso seguro en SQL de PostgreSQL.
 * Maneja strings, números, booleanos, arrays, fechas y null.
 */
export class RawSQL {
  constructor(public readonly value: string) {}
}

export function raw(value: string): RawSQL {
  return new RawSQL(value);
}

export function escapeValue(value: unknown): string {
  if (value instanceof RawSQL) {
    return value.value;
  }

  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "string") {
    // Escapar comillas simples duplicándolas
    const escaped = value.replace(/'/g, "''");
    return `'${escaped}'`;
  }

  if (Array.isArray(value)) {
    // Convertir arrays a JSON string y escapar
    const isStringArray = value.every((item) => typeof item === "string");

    if (isStringArray) {
      // Formato array nativo de PostgreSQL: ARRAY['a','b','c']
      const items = value.map(
        (item) => `'${String(item).replace(/'/g, "''")}'`,
      );
      return `ARRAY[${items.join(", ")}]`;
    }

    // Si contiene objetos → jsonb
    const jsonStr = JSON.stringify(value);
    const escaped = jsonStr.replace(/'/g, "''");
    return `'${escaped}'::jsonb`;
  }

  if (value instanceof Date) {
    // Fechas en formato ISO
    const escaped = value.toISOString().replace(/'/g, "''");
    return `'${escaped}'`;
  }

  // Para objetos, convertir a JSON string
  const jsonStr = JSON.stringify(value);
  const escaped = jsonStr.replace(/'/g, "''");
  return `'${escaped}'`;
}

/**
 * Construye una sentencia INSERT de SQL.
 * @param table - Nombre de la tabla
 * @param data - Objeto con los datos a insertar
 * @returns String con la sentencia SQL completa
 */
export function buildInsert(
  table: string,
  data: Record<string, unknown>,
  prefixTable: string = "",
): string {
  const columns = Object.keys(data);
  const values = Object.values(data).map(escapeValue);

  return `INSERT INTO ${prefixTable}${table} (${columns.join(", ")}) VALUES (${values.join(", ")});`;
}

/**
 * Construye múltiples INSERT en una sola transacción.
 * @param table - Nombre de la tabla
 * @param dataArray - Array de objetos a insertar
 * @returns String con las sentencias SQL
 */
export function buildMultipleInserts(
  table: string,
  dataArray: Record<string, unknown>[],
  prefixTable: string = "",
): string {
  if (dataArray.length === 0) {
    return "";
  }

  const columns = Object.keys(dataArray[0]);

  const valueLines = dataArray.map((data) => {
    const values = Object.values(data).map(escapeValue);
    return `(${values.join(", ")})`;
  });

  return `INSERT INTO ${prefixTable}${table} (${columns.join(", ")})\n  VALUES ${valueLines.join(",\n")};`;
}

export function buildInsertSelect(
  table: string,
  columns: string[],
  select: string,
  prefixTable: string = "",
): string {
  return `INSERT INTO ${prefixTable ?? ""}${table} (${columns.join(", ")})\n  ${select};`;
}

/**
 * Genera una sentecia TRUNCATE con CASCADE para limpiar tablas.
 * @param tables - Array de nombres de tablas a truncar
 * @returns String con las sentecias TRUNCATE
 */
export function buildTruncate(tables: string[]): string {
  const truncateStatements = tables.map(
    (table) => `TRUNCATE ${table} CASCADE;`,
  );
  return truncateStatements.join("\n");
}
