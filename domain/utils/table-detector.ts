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

const ALL_HEADERS_ES: Record<string, string> = {
  ...PROPERTY_HEADERS_ES,
  ...LISTING_HEADERS_ES,
  ...REAL_ESTATE_HEADERS_ES,
};

export function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_]/g, "");
}

export function fixEncoding(str: string): string {
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}

export function normalizeHeaders(fileHeaders: string[]): string[] {
  return fileHeaders.map((header) => {
    const normalized = normalizeHeader(fixEncoding(header));
    return ALL_HEADERS_ES[normalized] || normalized;
  });
}

export function detectTable(headers: string[]): TableDetectionResult {
  if (!headers || headers.length === 0) {
    return {
      table: null,
      confidence: 0,
      matchedHeaders: [],
      missingHeaders: [],
    };
  }

  const normalizedHeaders = normalizeHeaders(headers);

  // ✅ Se pasa la tabla como segundo argumento
  const propertyMatch = calculateMatch(
    normalizedHeaders,
    propertyImportHeaders.map((h) => h.toLowerCase()),
    ImportTableName.PROPERTIES,
  );
  const listingMatch = calculateMatch(
    normalizedHeaders,
    listingImportHeaders.map((h) => h.toLowerCase()),
    ImportTableName.LISTINGS,
  );
  const realEstateMatch = calculateMatch(
    normalizedHeaders,
    realEstateImportHeaders.map((h) => h.toLowerCase()),
    ImportTableName.REAL_ESTATES,
  );

  const matches = [
    { table: ImportTableName.PROPERTIES, ...propertyMatch },
    { table: ImportTableName.LISTINGS, ...listingMatch },
    { table: ImportTableName.REAL_ESTATES, ...realEstateMatch },
  ];

  matches.sort((a, b) => b.confidence - a.confidence);

  const bestMatch = matches[0];

  return {
    table: bestMatch.confidence > 0 ? bestMatch.table : null,
    confidence: bestMatch.confidence,
    matchedHeaders: bestMatch.matchedHeaders,
    missingHeaders: bestMatch.missingHeaders,
  };
}

// ✅ Recibe table como parámetro en lugar de comparar por referencia
function calculateMatch(
  fileHeaders: string[],
  expectedHeaders: readonly string[],
  table: ImportTableName,
): {
  confidence: number;
  matchedHeaders: string[];
  missingHeaders: string[];
} {
  const fileSet = new Set(fileHeaders);

  const matchedHeaders: string[] = [];
  const missingHeaders: string[] = [];

  for (const header of expectedHeaders) {
    if (fileSet.has(header)) {
      matchedHeaders.push(header);
    } else {
      missingHeaders.push(header);
    }
  }

  const requiredHeaders = getRequiredHeaders(table);
  const matchedRequired = requiredHeaders.filter((h) => fileSet.has(h));

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

function getRequiredHeaders(table: ImportTableName): string[] {
  switch (table) {
    case ImportTableName.PROPERTIES:
      return ["title", "property_type", "city", "state"];
    case ImportTableName.LISTINGS:
      return ["listing_type", "price", "whatsapp_contact"];
    case ImportTableName.REAL_ESTATES:
      return ["name", "whatsapp", "city", "state"];
    default:
      return [];
  }
}

export function isConfidenceSufficient(confidence: number): boolean {
  return confidence >= 0.8;
}
