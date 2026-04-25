import { ImportTableName } from "@/domain/entities/import-job.entity";
import {
  propertyImportHeaders,
  listingImportHeaders,
  realEstateImportHeaders,
} from "@/application/validation/import";
import { fixEncoding, normalizeHeader } from "./table-detector";
import { similarityScore } from "@/shared/utils/string";

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

const synonyms: Record<string, string[]> = {
  name: ["name", "nombre", "titulo", "asunto", "subject"],
  title: ["name", "nombre", "titulo", "asunto", "subject"],
  property_type: ["type", "tipo", "tipo_propiedad", "clase", "class"],
  city: ["ciudad", "localidad", "municipio", "location"],
  state: ["estado", "provincia", "region", "departamento"],
  country: ["pais", "país", "nation"],
  street: ["calle", "direccion", "dirección", "address", "addr"],
  phone: ["telefono", "teléfono", "tel", "mobile", "celular", "cel"],
  whatsapp: ["whatsapp", "wa", "wapp"],
  email: ["correo", "email", "mail", "e-mail"],
  description: ["descripcion", "descripción", "detalle", "details", "obs"],
  bedrooms: ["habitaciones", "rooms", "room", "dormitorios", "dorm", "cuartos"],
  bathrooms: ["banos", "baños", "bath", "sanitarios", "baths", "wc"],
  price: ["precio", "cost", "valor", "amount"],
  postal_code: ["zip", "código_postal", "codigo_postal", "postal", "cp"],

  // --- nuevos ---
  latitude: ["lat", "latitud", "coord_lat", "geo_lat"],
  longitude: [
    "lng",
    "lon",
    "longitud",
    "coord_lon",
    "coord_lng",
    "geo_lon",
    "geo_lng",
  ],
  neighborhood: [
    "barrio",
    "colonia",
    "sector",
    "zona",
    "urbanizacion",
    "urbanización",
  ],
  built_area: [
    "area_construida",
    "área_construida",
    "construccion",
    "construcción",
    "m2_construidos",
  ],
  lot_area: [
    "area_lote",
    "área_lote",
    "lote",
    "terreno",
    "m2_terreno",
    "superficie_lote",
  ],
  floors: ["pisos", "plantas", "niveles", "nivel", "floor", "num_pisos"],
  year_built: [
    "año_construccion",
    "ano_construccion",
    "año_construido",
    "ano_construido",
    "año",
    "built_year",
  ],
  parking_spots: [
    "parking",
    "estacionamiento",
    "garaje",
    "garage",
    "cochera",
    "parqueadero",
    "parqueaderos",
    "parqueos",
  ],
  amenities: [
    "amenidades",
    "comodidades",
    "extras",
    "caracteristicas",
    "características",
    "servicios",
    "facilities",
  ],
  listing_type: [
    "tipo_listado",
    "tipo_anuncio",
    "tipo_publicacion",
    "tipo_oferta",
    "modalidad",
    "operation_type",
    "tipo_operacion",
  ],
  currency: ["moneda", "divisa", "tipo_moneda", "coin"],
  price_negotiable: [
    "negociable",
    "precio_negociable",
    "negotiable",
    "a_convenir",
    "flexible",
  ],
  status: [
    "estado",
    "estatus",
    "activo",
    "disponible",
    "available",
    "estado_listado",
  ],
  virtual_tour_url: [
    "tour_virtual",
    "recorrido_virtual",
    "tour_360",
    "url_tour",
    "virtual_tour",
    "3d_tour",
  ],
  video_url: [
    "video",
    "url_video",
    "link_video",
    "youtube",
    "vimeo",
    "video_link",
  ],
  available_from: [
    "disponible_desde",
    "fecha_disponible",
    "fecha_inicio",
    "inicio_disponibilidad",
    "from_date",
  ],
  minimum_contract_duration: [
    "duracion_minima",
    "contrato_minimo",
    "min_contrato",
    "plazo_minimo",
    "min_duration",
  ],
  whatsapp_contact: [
    "whatsapp",
    "wa",
    "wapp",
    "telefono_wa",
    "contacto_whatsapp",
    "cel_whatsapp",
  ],
};

function findBestMatch(target: string, sources: string[]): number {
  const targetSynonyms = synonyms[target] ?? [];
  for (const synonym of targetSynonyms) {
    const index = sources.findIndex((s) => s === synonym);
    if (index >= 0) return index;
  }

  // 2. Levenshtein para typos/variaciones estructurales
  const THRESHOLD = 0.75;
  let bestIndex = -1;
  let bestScore = 0;

  for (const [i, source] of sources.entries()) {
    const score = similarityScore(target, source);
    if (score > bestScore && score >= THRESHOLD) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return bestIndex;
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
