// ==========================================
// Faker Data Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type { SeedProfile, SeedRealEstate, SeedProperty, SeedListing, SeedPropertyImage, SeedFavorite, SeedAgent } from "../types";

// Seed Faker para reproducibilidad
faker.seed(42);

/**
 * Genera un UUID v4 válido usando Faker.
 */
export function generateFakeUUID(): string {
  return faker.string.uuid();
}

/**
 * Genera múltiples UUIDs únicos.
 */
export function generateUniqueUUIDs(count: number): string[] {
  const uuids = new Set<string>();
  while (uuids.size < count) {
    uuids.add(faker.string.uuid());
  }
  return Array.from(uuids);
}

/**
 * Genera un slug único basado en texto.
 */
export function generateFakeSlug(baseText: string): string {
  return faker.helpers.slugify(baseText).toLowerCase().substring(0, 50);
}

// ==========================================
// Generadores específicos para zona_raiz
// ==========================================

const ARGENTINIAN_CITIES = [
  { city: "Mar del Plata", state: "Buenos Aires", postalCode: "7600" },
  { city: "Buenos Aires", state: "Ciudad Autónoma de Buenos Aires", postalCode: "C1425" },
  { city: "Villa Carlos Paz", state: "Córdoba", postalCode: "X5152" },
  { city: "Córdoba", state: "Córdoba", postalCode: "X5000" },
  { city: "Rosario", state: "Santa Fe", postalCode: "S2000" },
  { city: "Mendoza", state: "Mendoza", postalCode: "M5500" },
  { city: "Salta", state: "Salta", postalCode: "A4400" },
  { city: "Bariloche", state: "Río Negro", postalCode: "8400" },
];

const REAL_ESTATE_NAMES = [
  "Inmobiliaria Costa del Plata",
  "Urban Living Argentina",
  "Sierra Propiedades",
  "Bienes Raíces del Sur",
  "Argentina Real Estate Group",
  "Costa Argentina Propiedades",
];

const PROPERTY_TYPES = ["apartment", "house", "condo", "land", "commercial", "office", "warehouse"] as const;

const AMENITIES = ["pool", "gym", "security", "air_conditioning", "elevator", "garden", "balcony", "heating"];

/**
 * Genera inmobiliarias fake.
 */
export function generateFakeRealEstates(count: number): SeedRealEstate[] {
  return Array.from({ length: count }, (_, i) => {
    const location = ARGENTINIAN_CITIES[i % ARGENTINIAN_CITIES.length];
    return {
      id: generateFakeUUID(),
      name: REAL_ESTATE_NAMES[i] || `Inmobiliaria ${faker.company.name()}`,
      description: faker.lorem.paragraph(2),
      whatsapp: faker.helpers.replaceSymbols("+54911########"),
      street: faker.location.streetAddress(),
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      country: "Argentina",
      logoUrl: faker.image.url({ width: 200, height: 200 }),
    };
  });
}

/**
 * Genera propiedades fake.
 */
export function generateFakeProperties(
  count: number,
  realEstateIds: string[]
): SeedProperty[] {
  if (realEstateIds.length === 0) return [];

  return Array.from({ length: count }, (_, i) => {
    const realEstateId = realEstateIds[i % realEstateIds.length];
    const location = faker.location;
    const propertyType = faker.helpers.arrayElement([...PROPERTY_TYPES]);
    const bedrooms = propertyType === "land" || propertyType === "commercial" 
      ? undefined 
      : faker.number.int({ min: 1, max: 5 });

    return {
      id: generateFakeUUID(),
      realEstateId,
      title: `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} ${faker.number.int({ min: 1, max: 5 })} ambientes en ${faker.location.city()}`,
      slug: generateFakeSlug(`${propertyType} ${faker.location.city()} ${faker.number.int(1000)}`),
      description: faker.lorem.paragraph(3),
      propertyType,
      street: location.streetAddress(),
      city: location.city(),
      state: location.state(),
      country: "Argentina",
      postalCode: location.zipCode(),
      neighborhood: location.county(),
      latitude: location.latitude(),
      longitude: location.longitude(),
      bedrooms,
      bathrooms: bedrooms ? faker.number.int({ min: 1, max: bedrooms + 1 }) : undefined,
      totalArea: faker.number.int({ min: 50, max: 1000 }),
      builtArea: faker.number.int({ min: 40, max: 800 }),
      lotArea: propertyType === "house" || propertyType === "land" 
        ? faker.number.int({ min: 200, max: 2000 }) 
        : undefined,
      floors: propertyType === "house" ? faker.number.int({ min: 1, max: 3 }) : propertyType === "apartment" ? 1 : undefined,
      yearBuilt: faker.number.int({ min: 1970, max: 2024 }),
      parkingSpots: propertyType !== "land" ? faker.number.int({ min: 0, max: 3 }) : undefined,
      amenities: faker.helpers.arrayElements(AMENITIES, { min: 1, max: 5 }),
    };
  });
}

/**
 * Genera listados fake.
 */
export function generateFakeListings(
  count: number,
  properties: SeedProperty[],
  whatsappContact: string
): SeedListing[] {
  if (properties.length === 0) return [];

  return Array.from({ length: count }, (_, i) => {
    const property = properties[i % properties.length];
    const listingType = faker.helpers.arrayElement(["sale", "rent"]);
    const currency = listingType === "rent" ? "ARS" : faker.helpers.arrayElement(["USD", "ARS"]);
    const price = listingType === "sale" 
      ? faker.number.int({ min: 50000, max: 1000000 })
      : faker.number.int({ min: 100000, max: 5000000 });

    return {
      id: generateFakeUUID(),
      propertyId: property.id,
      agentId: "",
      listingType,
      price,
      currency,
      priceNegotiable: faker.datatype.boolean(),
      whatsappContact,
      expensesAmount: faker.number.int({ min: 5000, max: 100000 }),
      expensesIncluded: faker.datatype.boolean(),
      status: faker.helpers.weightedArrayElement([
        { value: "active", weight: 70 },
        { value: "draft", weight: 10 },
        { value: "paused", weight: 10 },
        { value: "sold", weight: 5 },
        { value: "rented", weight: 5 },
      ]),
      featured: faker.datatype.boolean({ probability: 0.2 }),
      featuredUntil: faker.datatype.boolean({ probability: 0.2 }) 
        ? faker.date.future({ years: 0.5 }).toISOString() 
        : undefined,
      metaTitle: `${property.title} - ${listingType === "sale" ? "Venta" : "Alquiler"}`,
      metaDescription: faker.lorem.sentence(),
      keywords: faker.helpers.arrayElements(["apartment", "house", "pool", "garden", "modern", "luxury", "city", "sea"], 3),
      viewsCount: faker.number.int({ min: 0, max: 1000 }),
      inquiriesCount: faker.number.int({ min: 0, max: 50 }),
      whatsappClicks: faker.number.int({ min: 0, max: 100 }),
      publishedAt: faker.date.recent({ days: 90 }).toISOString(),
      minimumContractDuration: listingType === "rent" ? faker.number.int({ min: 6, max: 36 }) : undefined,
      availableFrom: listingType === "rent" ? faker.date.soon({ days: 30 }).toISOString().split("T")[0] : undefined,
    };
  });
}

/**
 * Genera imágenes fake para propiedades.
 */
export function generateFakePropertyImages(
  count: number,
  properties: SeedProperty[]
): SeedPropertyImage[] {
  if (properties.length === 0) return [];

  const images: SeedPropertyImage[] = [];
  
  properties.forEach((property, propIndex) => {
    const imageCount = faker.number.int({ min: 2, max: 5 });
    
    for (let i = 0; i < imageCount; i++) {
      images.push({
        id: generateFakeUUID(),
        propertyId: property.id,
        publicUrl: faker.image.url({ width: 1200, height: 800 }),
        filename: `image-${propIndex}-${i}.jpg`,
        fileSize: faker.number.int({ min: 100000, max: 500000 }),
        mimeType: "image/jpeg",
        width: 1200,
        height: 800,
        displayOrder: i,
        isPrimary: i === 0,
        altText: `Imagen ${i + 1} de ${property.title}`,
      });
    }
  });

  return images;
}

/**
 * Genera perfiles fake (coordinadores, agentes, clientes).
 */
export function generateFakeProfiles(options: {
  coordinators: number;
  agentsPerCoordinator: number;
  clients: number;
}): {
  coordinators: SeedProfile[];
  agents: SeedProfile[];
  clients: SeedProfile[];
} {
  const coordinators: SeedProfile[] = [];
  const agents: SeedProfile[] = [];
  const clients: SeedProfile[] = [];

  // Generar coordinadores
  for (let i = 0; i < options.coordinators; i++) {
    coordinators.push({
      id: faker.string.uuid(),
      email: `coordinador${i + 1}@zonaraiz.test`,
      fullName: faker.person.fullName(),
      phone: `+54911${faker.number.int({ min: 10000000, max: 99999999 })}`,
      role: "real-estate",
      avatarUrl: faker.image.url({ width: 200, height: 200 }),
    });
  }

  // Generar agentes
  for (let i = 0; i < options.coordinators * options.agentsPerCoordinator; i++) {
    agents.push({
      id: faker.string.uuid(),
      email: `agente${i + 1}@zonaraiz.test`,
      fullName: faker.person.fullName(),
      phone: `+54911${faker.number.int({ min: 10000000, max: 99999999 })}`,
      role: "real-estate",
      avatarUrl: faker.image.url({ width: 200, height: 200 }),
    });
  }

  // Generar clientes
  for (let i = 0; i < options.clients; i++) {
    clients.push({
      id: faker.string.uuid(),
      email: `cliente${i + 1}@zonaraiz.test`,
      fullName: faker.person.fullName(),
      phone: `+54911${faker.number.int({ min: 10000000, max: 99999999 })}`,
      role: "client",
      avatarUrl: faker.image.url({ width: 200, height: 200 }),
    });
  }

  return { coordinators, agents, clients };
}

/**
 * Genera favoritos fake.
 */
export function generateFakeFavorites(
  count: number,
  clients: SeedProfile[],
  listings: SeedListing[]
): SeedFavorite[] {
  const favorites: SeedFavorite[] = [];
  const usedPairs = new Set<string>();

  const activeListings = listings.filter(l => l.status === "active");

  while (favorites.length < count && favorites.length < clients.length * activeListings.length) {
    const client = faker.helpers.arrayElement(clients);
    const listing = faker.helpers.arrayElement(activeListings);
    const pairKey = `${client.id}-${listing.id}`;

    if (!usedPairs.has(pairKey)) {
      usedPairs.add(pairKey);
      favorites.push({
        id: generateFakeUUID(),
        profileId: client.id,
        listingId: listing.id,
      });
    }
  }

  return favorites;
}

// ==========================================
// Inquiry Generators
// ==========================================

export interface GeneratedInquiry {
  id?: string;
  listingId: string;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  status: string;
  notes?: string;
  assignedTo?: string;
  contactedAt?: string;
  convertedAt?: string;
  createdAt?: string;
}

const INQUIRY_TEMPLATES = [
  {
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+5491145678901",
    message: "Me interesa esta propiedad. ¿Está disponible para visitarla este fin de semana?",
    source: "web",
  },
  {
    name: "Juan Pérez",
    email: "jperez@email.com",
    phone: "+5491156789012",
    message: "¿El precio es negociable? ¿Incluye los muebles?",
    source: "web",
  },
  {
    name: "Ana Martínez",
    email: "anam@email.com",
    phone: "+5491134567890",
    message: "¿Tienen fotos adicionales? ¿La pileta es temperada?",
    source: "whatsapp",
  },
  {
    name: "Carlos Ruiz",
    email: "cruiz@email.com",
    phone: "+5491167890123",
    message: "Necesito algo urgente para mudar mi familia en 2 meses.",
    source: "phone",
  },
  {
    name: "Laura Sánchez",
    email: "laura.s@email.com",
    phone: "+5491123456789",
    message: "¿Aceptan permuta con un propiedad más chica?",
    source: "referral",
  },
  {
    name: "Diego Fernández",
    email: "dfernandez@email.com",
    message: "Me gustaría recibir más información sobre esta propiedad.",
    source: "web",
  },
  {
    name: "Patricia López",
    email: "pato.lopez@email.com",
    phone: "+5491143210987",
    message: "¿El edificio tiene gimnasio? ¿Las expensas son altas?",
    source: "whatsapp",
  },
  {
    name: "Roberto García",
    email: "rgarcia@email.com",
    message: "Estoy buscando inversión. ¿Es buena zona para alquilar?",
    source: "web",
  },
  {
    name: "Elena Castro",
    email: "elena.castro@email.com",
    phone: "+5491178901234",
    message: "¿Pueden enviarme más fotos del dormitorio principal?",
    source: "web",
  },
  {
    name: "Miguel Torres",
    email: "m.torres@email.com",
    phone: "+5491189012345",
    message: "¿Está cerca de transporte público y escuelas?",
    source: "email",
  },
];

const STATUS_WEIGHTS = [
  { value: "new", weight: 0.3 },
  { value: "contacted", weight: 0.3 },
  { value: "qualified", weight: 0.2 },
  { value: "converted", weight: 0.1 },
  { value: "lost", weight: 0.1 },
];

/**
 * Genera inquiries (consultas/leads) distribuidos entre listados activos.
 */
export function generateFakeInquiries(
  listings: SeedListing[],
  agents: SeedAgent[],
  count: number
): GeneratedInquiry[] {
  if (listings.length === 0 || agents.length === 0) return [];

  const inquiries: GeneratedInquiry[] = [];
  const activeListings = listings.filter((l) => l.status === "active");
  const agentIds = agents.map((a) => a.profileId);

  for (let i = 0; i < count; i++) {
    const template = INQUIRY_TEMPLATES[i % INQUIRY_TEMPLATES.length];
    const listing = activeListings[i % activeListings.length];
    const assignedAgent = agentIds[i % agentIds.length];

    // Determinar estado basado en weights
    const status = faker.helpers.weightedArrayElement(STATUS_WEIGHTS);

    // Generar timestamps basados en la distribución de estados
    const daysAgo = faker.number.int({ min: 1, max: 30 });
    const createdAt = faker.date.recent({ days: daysAgo }).toISOString();

    let contactedAt: string | undefined;
    let convertedAt: string | undefined;
    let notes: string | undefined;

    if (status !== "new") {
      contactedAt = faker.date.recent({ days: Math.max(1, daysAgo - 1) }).toISOString();
    }

    if (status === "qualified") {
      notes = "Cliente serio, presupuesto aprobado.";
    }

    if (status === "converted") {
      convertedAt = faker.date.recent({ days: Math.max(1, daysAgo - 5) }).toISOString();
      notes = "Cliente convirtió. Firmó boleto de compra.";
    }

    if (status === "lost") {
      notes = "Cliente decidió por otra propiedad.";
    }

    inquiries.push({
      listingId: listing.id,
      name: template.name,
      email: template.email,
      phone: template.phone,
      message: template.message,
      source: template.source,
      status,
      assignedTo: assignedAgent,
      contactedAt,
      convertedAt,
      notes,
      createdAt,
    });
  }

  return inquiries;
}
