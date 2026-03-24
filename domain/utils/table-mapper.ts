import { ImportTableName } from "@/domain/entities/import-job.entity";
import {
  propertyImportHeaders,
  listingImportHeaders,
  realEstateImportHeaders,
} from "@/application/validation/import";
import { fixEncoding, normalizeHeader } from "./table-detector";

/**
 * Resultado de mapear headers del archivo a headers de una tabla
 */
export interface TableMapping {
  sourceIndex: number; // índice en headers del archivo (-1 si no hay coincidencia)
  targetHeader: string; // header de la tabla destino
  confidence: number; // confianza del mapeo (0-1)
  mappedValue?: string; // valor mapeado de la fila
}

/**
 * Resultado completo del mapeo de datos
 */
export interface MappingResult {
  headers: string[]; // headers de la tabla destino
  rows: (string | null)[][]; // filas transformadas
  mappings: TableMapping[]; // mapeos para cada columna
  unmappedColumns: string[]; // columnas del archivo sin mapeo
}

/**
 * Obtiene los headers esperados para cada tabla
 */
export function getTableHeaders(tableName: ImportTableName): string[] {
  switch (tableName) {
    case ImportTableName.PROPERTIES:
      return [...propertyImportHeaders];
    case ImportTableName.LISTINGS:
      return [...listingImportHeaders];
    case ImportTableName.REAL_ESTATES:
      return [...realEstateImportHeaders];
    default:
      return [];
  }
}

/**
 * Mapea headers del archivo a headers de la tabla seleccionada
 * Retorna un array de mapeos donde cada posición corresponde a un header de la tabla
 */
export function mapHeadersToTable(
  sourceHeaders: string[],
  targetHeaders: string[],
): TableMapping[] {
  const mappings: TableMapping[] = [];

  // Normalizar headers del archivo una vez
  const normalizedSource = sourceHeaders.map((h) =>
    normalizeHeader(fixEncoding(h)),
  );
  for (const targetHeader of targetHeaders) {
    const normalizedTarget = normalizeHeader(fixEncoding(targetHeader));
    // 1. Buscar coincidencia exacta
    let sourceIndex = normalizedSource.findIndex((s) => s === normalizedTarget);
    // 2. Si no hay coincidencia exacta, buscar por sinonimos/parcial
    if (sourceIndex === -1) {
      sourceIndex = findBestMatch(normalizedTarget, normalizedSource);
    }

    mappings.push({
      sourceIndex,
      targetHeader,
      confidence: sourceIndex >= 0 ? 1 : 0,
    });
  }

  return mappings;
}

/**
 * Encuentra la mejor coincidencia para un header target en los headers fuente
 */
function findBestMatch(target: string, sources: string[]): number {
  // Crear mapa de sinonimos comunes
  const synonyms: Record<string, string[]> = {
    name: ["name", "nombre", "titulo", "titulo", "asunto", "subject"],
    title: ["name", "nombre", "titulo", "titulo", "asunto", "subject"],
    property_type: ["type", "tipo", "tipo_propiedad", "clase", "class"],
    city: ["ciudad", "localidad", "municipio", "location"],
    state: ["estado", "provincia", "region", "departamento"],
    country: ["pais", "país", "nation", "pais"],
    street: ["calle", "direccion", "dirección", "address", "addr"],
    phone: ["telefono", "teléfono", "tel", "mobile", "celular", "cel"],
    whatsapp: ["whatsapp", "wa", "wapp"],
    email: ["correo", "email", "mail", "e-mail"],
    description: ["descripcion", "descripción", "detalle", "details", "obs"],
    bedrooms: ["habitaciones", "rooms", "room", "dormitorios", "dorm"],
    bathrooms: ["banos", "baños", "bath", "sanitarios", "baths"],
    price: ["precio", "cost", "valor", "amount"],
  };

  // Verificar sinonimos
  const targetSynonyms = synonyms[target] || [];
  for (const synonym of targetSynonyms) {
    const index = sources.findIndex((s) => s === synonym);
    if (index >= 0) return index;
  }

  // 3. Busqueda parcial (contiene)
  const partialIndex = sources.findIndex(
    (s) => s.includes(target) || target.includes(s),
  );
  if (partialIndex >= 0 && partialIndex < sources.length / 2) {
    // Solo retornar si es una coincidencia razonablemente buena
    return partialIndex;
  }

  return -1;
}

/**
 * Transforma los datos del archivo para que coincidan con la estructura de la tabla
 */
export function transformDataToTable(
  sourceHeaders: string[],
  sourceRows: (string | null)[][],
  targetHeaders: string[],
): MappingResult {
  // Obtener mapeos
  const mappings = mapHeadersToTable(sourceHeaders, targetHeaders);

  // Transformar cada fila
  const rows: (string | null)[][] = sourceRows.map((sourceRow) => {
    const newRow: (string | null)[] = [];

    for (const mapping of mappings) {
      if (mapping.sourceIndex >= 0 && mapping.sourceIndex < sourceRow.length) {
        newRow.push(sourceRow[mapping.sourceIndex]);
      } else {
        newRow.push(null); // columna sin dato en el archivo
      }
    }

    return newRow;
  });

  // Identificar columnas sin mapeo
  const mappedTargetIndices = new Set(
    mappings.filter((m) => m.sourceIndex >= 0).map((m) => m.sourceIndex),
  );
  const unmappedColumns: string[] = [];
  sourceHeaders.forEach((header, index) => {
    if (!mappedTargetIndices.has(index)) {
      unmappedColumns.push(header);
    }
  });

  return {
    headers: targetHeaders,
    rows,
    mappings,
    unmappedColumns,
  };
}

/**
 * Obtiene los headers originales del archivo para referencia
 */
export function getOriginalHeaders(
  transformedHeaders: string[],
  originalHeaders: string[],
  mappings: TableMapping[],
): string[] {
  return transformedHeaders.map((targetHeader, index) => {
    const mapping = mappings[index];
    if (
      mapping &&
      mapping.sourceIndex >= 0 &&
      mapping.sourceIndex < originalHeaders.length
    ) {
      return originalHeaders[mapping.sourceIndex];
    }
    return targetHeader; // Si no hay mapeo, usar el header de la tabla
  });
}
