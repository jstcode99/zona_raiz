// ==========================================
// Inquiries SQL Generator
// ==========================================

import type { SeedInquiry } from "../../types";
import { buildMultipleInserts } from "./sql-builder";

/**
 * Genera SQL para insertar inquiries (consultas/leads).
 */
export function generateInquiriesSQL(inquiries: SeedInquiry[]): string {
  if (inquiries.length === 0) {
    return "-- No hay inquiries para insertar\n";
  }

  const header = `-- Insertando ${inquiries.length} inquiries...\n`;
  const sql = buildMultipleInserts("enquiries", inquiries);

  return header + sql + "\n";
}