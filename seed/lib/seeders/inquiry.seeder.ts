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
  truncate: boolean,
): Promise<void> {
  const logger = SeedLogger;

  logger.subSection("Seed Inquiries");

  if (truncate) {
    logger.info("Truncando inquiries...");
    await supabase
      .from("inquiries")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
  }

  if (inquiries.length === 0) {
    logger.warn("No hay inquiries para insertar");
    return;
  }

  logger.info(`Insertando ${inquiries.length} inquiries...`);

  const { error } = await supabase.from("inquiries").insert(inquiries);

  if (error) {
    logger.error("Error insertando inquiries:", error.message);
    throw error;
  }

  logger.success(`✓ ${inquiries.length} inquiries insertados`);

  // Mostrar distribución de estados
  const statusCounts = inquiries.reduce(
    (acc, inq) => {
      acc[inq.status] = (acc[inq.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  logger.info("Distribución de estados:", statusCounts);
}
