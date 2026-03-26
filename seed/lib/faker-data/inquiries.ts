// ==========================================
// Inquiries Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type { SeedInquiry } from "../../types";
import { EnquirySource, EnquiryStatus } from "@/domain/entities/enquiry.enums";

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
  listings: { id: string; status: string }[],
  agentIds: string[],
  count: number,
): GeneratedInquiry[] {
  if (listings.length === 0 || agentIds.length === 0) return [];

  const inquiries: GeneratedInquiry[] = [];
  const activeListings = listings.filter((l) => l.status === "active");

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

/**
 * Convierte GeneratedInquiry a SeedInquiry
 */
export function toSeedInquiry(
  inquiry: GeneratedInquiry,
  id?: string,
): SeedInquiry {
  return {
    id: id || faker.string.uuid(),
    listing_id: inquiry.listingId,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
    source: inquiry.source as EnquirySource,
    utm_source: inquiry.utmSource,
    utm_medium: inquiry.utmMedium,
    utm_campaign: inquiry.utmCampaign,
    referrer: inquiry.referrer,
    status: inquiry.status as EnquiryStatus,
    notes: inquiry.notes,
    assigned_to: inquiry.assignedTo,
  };
}