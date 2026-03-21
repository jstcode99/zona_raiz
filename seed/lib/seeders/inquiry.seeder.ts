// ==========================================
// Inquiry Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import type { SeedInquiry, SeedListing, SeedAgent } from "../types";
import { SeedLogger } from "../lib/logger";

export interface GeneratedInquiry extends Omit<SeedInquiry, "listingId"> {
  listingId: string;
}

/**
 * Genera inquiries (consultas/leads) distribuidos entre listados activos.
 */
export function generateInquiries(
  listings: SeedListing[],
  agents: SeedAgent[],
  count: number
): GeneratedInquiry[] {
  const inquiries: GeneratedInquiry[] = [];
  const activeListings = listings.filter((l) => l.status === "active");
  
  const agentIds = agents.map((a) => a.profileId);

  const inquiryTemplates = [
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

  const statuses = ["new", "contacted", "qualified", "converted", "lost"];
  const statusWeights = [0.3, 0.3, 0.2, 0.1, 0.1]; // Distribución de estados

  for (let i = 0; i < count; i++) {
    const template = inquiryTemplates[i % inquiryTemplates.length];
    const listing = activeListings[i % activeListings.length];
    const assignedAgent = agentIds[i % agentIds.length];

    // Determinar estado basado en weights
    const rand = Math.random();
    let cumulative = 0;
    let status = "new";
    for (let j = 0; j < statuses.length; j++) {
      cumulative += statusWeights[j];
      if (rand <= cumulative) {
        status = statuses[j];
        break;
      }
    }

    // Generar timestamps basados en la distribución de estados
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    let contactedAt: string | undefined;
    let convertedAt: string | undefined;
    let notes: string | undefined;

    if (status !== "new") {
      contactedAt = new Date(Date.now() - (daysAgo - 1) * 24 * 60 * 60 * 1000).toISOString();
    }

    if (status === "qualified") {
      notes = "Cliente serio, presupuesto aprobado.";
    }

    if (status === "converted") {
      convertedAt = new Date(Date.now() - (daysAgo - 5) * 24 * 60 * 60 * 1000).toISOString();
      notes = "Cliente convirtió. Firmó boleto de compra.";
    }

    if (status === "lost") {
      notes = "Cliente decidió por otra propiedad.";
    }

    inquiries.push({
      id: `in-${String(i + 1).padStart(4, "0")}`,
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
      created_at: createdAt,
    });
  }

  return inquiries;
}

/**
 * Inserta inquiries en la base de datos.
 */
export async function seedInquiries(
  supabase: SupabaseClient,
  inquiries: GeneratedInquiry[],
  truncate: boolean
): Promise<void> {
  const logger = new SeedLogger();

  logger.subSection("Seed Inquiries");

  if (truncate) {
    logger.info("Truncando inquiries...");
    await supabase.from("inquiries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  }

  if (inquiries.length === 0) {
    logger.warn("No hay inquiries para insertar");
    return;
  }

  logger.info(`Insertando ${inquiries.length} inquiries...`);

  const inquiryInserts = inquiries.map((inq) => ({
    id: inq.id,
    listing_id: inq.listingId,
    name: inq.name,
    email: inq.email || null,
    phone: inq.phone || null,
    message: inq.message || null,
    source: inq.source,
    utm_source: inq.utmSource || null,
    utm_medium: inq.utmMedium || null,
    utm_campaign: inq.utmCampaign || null,
    referrer: inq.referrer || null,
    status: inq.status,
    notes: inq.notes || null,
    assigned_to: inq.assignedTo || null,
    contacted_at: inq.contactedAt || null,
    converted_at: inq.convertedAt || null,
    created_at: inq.created_at || new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("inquiries")
    .upsert(inquiryInserts, { onConflict: "id" });

  if (error) {
    logger.error("Error insertando inquiries:", error.message);
    throw error;
  }

  logger.success(`✓ ${inquiries.length} inquiries insertados`);

  // Mostrar distribución de estados
  const statusCounts = inquiries.reduce((acc, inq) => {
    acc[inq.status] = (acc[inq.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  logger.info("Distribución de estados:", statusCounts);
}
