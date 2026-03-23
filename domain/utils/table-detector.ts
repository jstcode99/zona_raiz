import { ImportTableName } from "@/domain/entities/import-job.entity";
import {
  propertyImportHeaders,
  listingImportHeaders,
  realEstateImportHeaders,
} from "@/application/validation/import";

export interface TableDetectionResult {
  table: ImportTableName | null;
  confidence: number;
  matchedHeaders: string[];
  missingHeaders: string[];
}

/**
 * Mapeo de headers en español a inglés para cada tabla
 */
const PROPERTY_HEADERS_ES: Record<string, string> = {
  título: "title",
  titulo: "title",
  tipo_propiedad: "property_type",
  tipo: "property_type",
  ciudad: "city",
  estado: "state",
  país: "country",
  pais: "country",
  código_postal: "postal_code",
  codigo_postal: "postal_code",
  calle: "street",
  barrio: "neighborhood",
  latitud: "latitude",
  longitud: "longitude",
  habitaciones: "bedrooms",
  baños: "bathrooms",
  banos: "bathrooms",
  área_total: "total_area",
  area_total: "total_area",
  área_construida: "built_area",
  area_construida: "built_area",
  área_lote: "lot_area",
  area_lote: "lot_area",
  pisos: "floors",
  año_construcción: "year_built",
  ano_construccion: "year_built",
  parqueaderos: "parking_spots",
  parking: "parking_spots",
  amenities: "amenities",
  descripción: "description",
  descripcion: "description",
};

const LISTING_HEADERS_ES: Record<string, string> = {
  tipo_listado: "listing_type",
  tipo: "listing_type",
  precio: "price",
  moneda: "currency",
  precio_negociable: "price_negotiable",
  estado: "status",
  whatsapp_contacto: "whatsapp_contact",
  whatsapp: "whatsapp_contact",
  id_propiedad: "property_id",
  título_propiedad: "property_title",
  titulo_propiedad: "property_title",
  ciudad_propiedad: "property_city",
  estado_propiedad: "property_state",
  tipo_propiedad: "property_type",
  meta_título: "meta_title",
  meta_titulo: "meta_title",
  meta_descripción: "meta_description",
  meta_descripcion: "meta_description",
  palabras_clave: "keywords",
  keywords: "keywords",
  monto_gastos: "expenses_amount",
  gastos: "expenses_amount",
  gastos_incluidos: "expenses_included",
  tour_virtual: "virtual_tour_url",
  virtual: "virtual_tour_url",
  video_url: "video_url",
  video: "video_url",
  disponible_desde: "available_from",
  duración_mínima_contrato: "minimum_contract_duration",
  duracion_minima: "minimum_contract_duration",
};

const REAL_ESTATE_HEADERS_ES: Record<string, string> = {
  nombre: "name",
  whatsapp: "whatsapp",
  ciudad: "city",
  estado: "state",
  país: "country",
  pais: "country",
  código_postal: "postal_code",
  codigo_postal: "postal_code",
  calle: "street",
  email: "email",
  teléfono: "phone",
  telefono: "phone",
  descripción: "description",
  descripcion: "description",
};

/**
 * Mapeo combinado de todos los headers (ES -> EN)
 */
const ALL_HEADERS_ES: Record<string, string> = {
  ...PROPERTY_HEADERS_ES,
  ...LISTING_HEADERS_ES,
  ...REAL_ESTATE_HEADERS_ES,
};

/**
 * Normaliza un header: lowercase y elimina acentos/tildes
 */
export function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Convierte headers del archivo a formato estándar (inglés)
 * Detecta el idioma y hace la traducción correspondiente
 */
export function normalizeHeaders(fileHeaders: string[]): string[] {
  return fileHeaders.map((header) => {
    const normalized = normalizeHeader(header);
    // Primero buscar coincidencia exacta normalizada
    return ALL_HEADERS_ES[normalized] || normalized;
  });
}

/**
 * Detecta qué tabla corresponde basándose en los headers del archivo
 * Soporta headers en español e inglés, retornando la tabla con mayor coincidencia
 */
export function detectTable(headers: string[]): TableDetectionResult {
  if (!headers || headers.length === 0) {
    return {
      table: null,
      confidence: 0,
      matchedHeaders: [],
      missingHeaders: [],
    };
  }

  // Normalizar headers (convertir español a inglés)
  const normalizedHeaders = normalizeHeaders(headers);

  // Detectar para cada tabla
  const propertyMatch = calculateMatch(
    normalizedHeaders,
    propertyImportHeaders.map((h) => h.toLowerCase()),
  );
  const listingMatch = calculateMatch(
    normalizedHeaders,
    listingImportHeaders.map((h) => h.toLowerCase()),
  );
  const realEstateMatch = calculateMatch(
    normalizedHeaders,
    realEstateImportHeaders.map((h) => h.toLowerCase()),
  );

  // Seleccionar el de mayor confianza
  const matches = [
    { table: ImportTableName.PROPERTIES, ...propertyMatch },
    { table: ImportTableName.LISTINGS, ...listingMatch },
    { table: ImportTableName.REAL_ESTATES, ...realEstateMatch },
  ];

  // Ordenar por confianza descendente
  matches.sort((a, b) => b.confidence - a.confidence);

  const bestMatch = matches[0];

  return {
    table: bestMatch.confidence > 0 ? bestMatch.table : null,
    confidence: bestMatch.confidence,
    matchedHeaders: bestMatch.matchedHeaders,
    missingHeaders: bestMatch.missingHeaders,
  };
}

/**
 * Calcula el % de coincidencia entre headers del archivo y headers esperados
 */
function calculateMatch(
  fileHeaders: string[],
  expectedHeaders: readonly string[],
): {
  confidence: number;
  matchedHeaders: string[];
  missingHeaders: string[];
} {
  const fileSet = new Set(fileHeaders);

  // Headers que coinciden
  const matchedHeaders: string[] = [];
  const missingHeaders: string[] = [];

  for (const header of expectedHeaders) {
    if (fileSet.has(header)) {
      matchedHeaders.push(header);
    } else {
      missingHeaders.push(header);
    }
  }

  // Headers requeridos para cada tabla
  const requiredHeaders = getRequiredHeaders(expectedHeaders);

  const matchedRequired = requiredHeaders.filter((h) => fileSet.has(h));

  // Calcular confianza como % de headers requeridos que coinciden
  const confidence =
    requiredHeaders.length > 0
      ? matchedRequired.length / requiredHeaders.length
      : 0;

  return {
    confidence,
    matchedHeaders,
    missingHeaders,
  };
}

/**
 * Obtiene los headers requeridos para cada tabla
 */
function getRequiredHeaders(expectedHeaders: readonly string[]): string[] {
  // Properties
  if (expectedHeaders === propertyImportHeaders) {
    return ["title", "property_type", "city", "state"];
  }
  // Listings
  if (expectedHeaders === listingImportHeaders) {
    return ["listing_type", "price", "whatsapp_contact"];
  }
  // RealEstates
  if (expectedHeaders === realEstateImportHeaders) {
    return ["name", "whatsapp", "city", "state"];
  }
  return [];
}

/**
 * Verifica si la confianza es suficiente para auto-seleccionar la tabla
 */
export function isConfidenceSufficient(confidence: number): boolean {
  return confidence >= 0.8; // 80%
}
