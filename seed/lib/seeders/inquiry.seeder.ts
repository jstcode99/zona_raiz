// ==========================================
// Inquiry Seeder
// ==========================================

import { SupabaseClient } from "@supabase/supabase-js";
import { SeedLogger } from "../logger";
import type { GeneratedInquiry } from "../faker-data";

// Re-export from faker-data for backwards compatibility
export type { GeneratedInquiry };
export { generateFakeInquiries as generateInquiries } from "../faker-data";

/**
 * Inserta inquiries en la base de datos.
 */
export async function seedInquiries(
  supabase: SupabaseClient,
  inquiries: GeneratedInquiry[],
  truncate: boolean
): Promise<void> {
  const logger = SeedLogger;

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
    // id se autogenera con gen_random_uuid() en la BD
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
    created_at: inq.createdAt || new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("inquiries")
    .insert(inquiryInserts);

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
