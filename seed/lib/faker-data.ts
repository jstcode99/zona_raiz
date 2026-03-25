// ==========================================
// Faker Data Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type {
  SeedProfile,
  SeedRealEstate,
  SeedProperty,
  SeedListing,
  SeedPropertyImage,
  SeedFavorite,
  SeedAgent,
} from "../types";
import { ListingStatus, ListingType } from "@/domain/entities/listing.enums";
import { currencyOptions } from "@/domain/entities/currency.enums";
import {
  keywordsOptions,
  listingTypeOptions,
} from "@/domain/entities/listing.entity";
import { generateSlug } from "@/lib/utils";
import { PropertyType } from "@/domain/entities/property.enums";
import {
  amenitiesOptions,
  propertyTypeOptions,
} from "@/domain/entities/property.entity";
import { EUserRole } from "@/domain/entities/profile.entity";

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
// ==========================================
// Generadores específicos para zona_raiz
// ==========================================

const REAL_ESTATE_NAMES = [
  "Inmobiliaria Costa del Plata",
  "Urban Living Argentina",
  "Sierra Propiedades",
  "Bienes Raíces del Sur",
  "Argentina Real Estate Group",
  "Costa Argentina Propiedades",
];

/**
 * Genera inmobiliarias fake.
 */
export function generateFakeRealEstates(count: number): SeedRealEstate[] {
  return Array.from({ length: count }, (_, i) => {
    const location = faker.location;

    return {
      id: generateFakeUUID(),
      name: REAL_ESTATE_NAMES[i] || `Inmobiliaria ${faker.company.name()}`,
      description: faker.lorem.paragraph(2),
      whatsapp: faker.helpers.replaceSymbols("+54911########"),
      street: faker.location.streetAddress(),
      city: location.city(),
      state: location.city(),
      postal_code: location.city(),
      country: location.county(),
      logo_url: faker.image.url({ width: 200, height: 200 }),
    };
  });
}

/**
 * Genera propiedades fake.
 */
export function generateFakeProperties(
  count: number,
  realEstateIds: string[],
): SeedProperty[] {
  if (realEstateIds.length === 0) return [];

  return Array.from({ length: count }, (_, i) => {
    const realEstateId = realEstateIds[i % realEstateIds.length];
    const location = faker.location;
    const propertyTypes = propertyTypeOptions.map((v) => v.value);

    const propertyType = faker.helpers.arrayElement(propertyTypes);
    const bedrooms =
      propertyType === "land" || propertyType === "commercial"
        ? 0
        : faker.number.int({ min: 1, max: 5 });

    const bathrooms =
      propertyType === "land" || propertyType === "commercial"
        ? 0
        : faker.number.int({ min: 1, max: 5 });

    const totalArea = faker.number.int({ min: 50, max: 1000 });
    const builtArea = faker.number.int({ min: 40, max: 800 });
    const lotArea =
      propertyType === PropertyType.House || propertyType === PropertyType.Land
        ? faker.number.int({ min: 200, max: 2000 })
        : 0;
    const floors =
      propertyType === PropertyType.House
        ? faker.number.int({ min: 1, max: 3 })
        : propertyType === PropertyType.Apartment
          ? 1
          : 0;
    const yearBuilt = faker.number.int({ min: 1970, max: 2024 });
    const parkingSpots =
      propertyType !== PropertyType.Land
        ? faker.number.int({ min: 0, max: 3 })
        : 0;
    const amenities = faker.helpers.arrayElements(amenitiesOptions, {
      min: 1,
      max: 5,
    });
    const title = `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} ${faker.number.int({ min: 1, max: 5 })} ambientes en ${faker.location.city()}`;

    return {
      id: generateFakeUUID(),
      real_estate_id: realEstateId,
      title,
      slug: generateSlug(title),
      description: faker.lorem.paragraph(3),
      property_type: propertyType,
      street: location.streetAddress(),
      city: location.city(),
      state: location.state(),
      country: "Colombia",
      postal_code: location.zipCode(),
      neighborhood: location.county(),
      latitude: location.latitude(),
      longitude: location.longitude(),
      bedrooms,
      bathrooms,
      total_area: totalArea,
      built_area: builtArea,
      lot_area: lotArea,
      floors: floors,
      year_built: yearBuilt,
      parking_spots: parkingSpots,
      amenities,
    };
  });
}

/**
 * Genera listados fake.
 */
export function generateFakeListings(
  count: number,
  properties: SeedProperty[],
  whatsappContact: string,
): SeedListing[] {
  if (properties.length === 0) return [];

  return Array.from({ length: count }, (_, i) => {
    const property = properties[i % properties.length];
    const id = generateFakeUUID();
    const listingType = faker.helpers.arrayElement(
      listingTypeOptions.map((v) => v.value),
    );
    const price = faker.number.int({ min: 50000, max: 1000000 });
    const currency = faker.helpers.arrayElement(
      currencyOptions.map((v) => v.value),
    );
    const priceNegotiable = faker.datatype.boolean();
    const expensesAmount = faker.number.int({ min: 5000, max: 100000 });
    const expensesIncluded = faker.datatype.boolean();

    const status = faker.helpers.weightedArrayElement([
      { value: ListingStatus.ACTIVE, weight: 70 },
      { value: ListingStatus.DRAFT, weight: 10 },
    ]);

    const featured = faker.datatype.boolean({ probability: 0.2 });
    const keywords = faker.helpers.arrayElements(keywordsOptions, 3);

    const featuredUntil = faker.datatype.boolean({ probability: 0.2 })
      ? faker.date.future({ years: 0.5 }).toISOString()
      : undefined;

    const metaTitle = `${property.title} - ${
      listingType === ListingType.SALE ? "Venta" : "Alquiler"
    }`;

    const metaDescription = faker.lorem.sentence();

    const viewsCount = faker.number.int({ min: 0, max: 1000 });
    const enquiriesCount = faker.number.int({ min: 0, max: 50 });
    const whatsappClicks = faker.number.int({ min: 0, max: 100 });

    const publishedAt = faker.date.recent({ days: 90 }).toISOString();

    const minimumContractDuration =
      listingType === ListingType.RENT
        ? faker.number.int({ min: 6, max: 36 })
        : undefined;

    const availableFrom =
      listingType === ListingType.RENT
        ? faker.date.soon({ days: 30 }).toISOString().split("T")[0]
        : undefined;

    return {
      id,
      property_id: property.id,
      agent_id: "",
      listing_type: listingType,
      price,
      currency,
      price_negotiable: priceNegotiable,
      whatsapp_contact: whatsappContact,
      expenses_amount: expensesAmount,
      expenses_included: expensesIncluded,
      status,
      featured,
      keywords,
      featured_until: featuredUntil,
      meta_title: metaTitle,
      meta_description: metaDescription,
      views_count: viewsCount,
      enquiries_count: enquiriesCount,
      whatsapp_clicks: whatsappClicks,
      published_at: publishedAt,
      minimum_contract_duration: minimumContractDuration,
      available_from: availableFrom,
    };
  });
}

/**
 * Genera imágenes fake para propiedades.
 */
export function generateFakePropertyImages(
  count: number,
  properties: SeedProperty[],
): SeedPropertyImage[] {
  if (properties.length === 0) return [];

  const images: SeedPropertyImage[] = [];

  properties.forEach((property, propIndex) => {
    const imageCount = faker.number.int({ min: 2, max: 5 });

    for (let i = 0; i < imageCount; i++) {
      images.push({
        id: generateFakeUUID(),
        property_id: property.id,
        public_url: faker.image.url({ width: 1200, height: 800 }),
        filename: `image-${propIndex}-${i}.jpg`,
        file_size: faker.number.int({ min: 100000, max: 500000 }),
        mime_type: "image/jpeg",
        width: 1200,
        height: 800,
        display_order: i,
        is_primary: i === 0,
        alt_text: `Imagen ${i + 1} de ${property.title}`,
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
      full_name: faker.person.fullName(),
      phone: `+57 ${faker.number.int({ min: 10000000, max: 99999999 })}`,
      role: EUserRole.RealEstate,
      avatar_url: faker.image.url({ width: 200, height: 200 }),
    });
  }

  // Generar agentes
  for (
    let i = 0;
    i < options.coordinators * options.agentsPerCoordinator;
    i++
  ) {
    agents.push({
      id: faker.string.uuid(),
      email: `agente${i + 1}@zonaraiz.test`,
      full_name: faker.person.fullName(),
      phone: `+57 ${faker.number.int({ min: 10000000, max: 99999999 })}`,
      role: EUserRole.RealEstate,
      avatar_url: faker.image.url({ width: 200, height: 200 }),
    });
  }

  // Generar clientes
  for (let i = 0; i < options.clients; i++) {
    clients.push({
      id: faker.string.uuid(),
      email: `cliente${i + 1}@zonaraiz.test`,
      full_name: faker.person.fullName(),
      phone: `+57 ${faker.number.int({ min: 10000000, max: 99999999 })}`,
      role: EUserRole.RealEstate,
      avatar_url: faker.image.url({ width: 200, height: 200 }),
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
  listings: SeedListing[],
): SeedFavorite[] {
  const favorites: SeedFavorite[] = [];
  const usedPairs = new Set<string>();

  const activeListings = listings.filter((l) => l.status === "active");

  while (
    favorites.length < count &&
    favorites.length < clients.length * activeListings.length
  ) {
    const client = faker.helpers.arrayElement(clients);
    const listing = faker.helpers.arrayElement(activeListings);
    const pairKey = `${client.id}-${listing.id}`;

    if (!usedPairs.has(pairKey)) {
      usedPairs.add(pairKey);
      favorites.push({
        id: generateFakeUUID(),
        profile_id: client.id,
        listing_id: listing.id,
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
    phone: "+57 45678901",
    message:
      "Me interesa esta propiedad. ¿Está disponible para visitarla este fin de semana?",
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
  count: number,
): GeneratedInquiry[] {
  if (listings.length === 0 || agents.length === 0) return [];

  const inquiries: GeneratedInquiry[] = [];
  const activeListings = listings.filter((l) => l.status === "active");
  const agentIds = agents.map((a) => a.profile_id);

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
      contactedAt = faker.date
        .recent({ days: Math.max(1, daysAgo - 1) })
        .toISOString();
    }

    if (status === "qualified") {
      notes = "Cliente serio, presupuesto aprobado.";
    }

    if (status === "converted") {
      convertedAt = faker.date
        .recent({ days: Math.max(1, daysAgo - 5) })
        .toISOString();
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
