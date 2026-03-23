// infrastructure/adapters/supabase/supabase-import.adapter.ts

import { ImportPort } from "@/domain/ports/import.port";
import { ImportData } from "@/domain/types/import.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { STORAGE_BUCKETS, IMPORT_CONFIG } from "@/infrastructure/config/constants";

export class SupabaseImportAdapter implements ImportPort {
  constructor(private supabase: SupabaseClient) {}

  async uploadFile(file: File): Promise<{ fileId: string; url: string }> {
    // Validate file size
    if (file.size > IMPORT_CONFIG.MAX_FILE_SIZE) {
      throw new Error(
        `File too large. Maximum size is ${IMPORT_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
    }

    // Validate file type
    if (
      !IMPORT_CONFIG.ALLOWED_FILE_TYPES.includes(
        file.type as (typeof IMPORT_CONFIG.ALLOWED_FILE_TYPES)[number]
      )
    ) {
      throw new Error(
        "File type not supported. Allowed types: .xlsx, .xls, .csv"
      );
    }

    // Generate a unique file ID
    const fileId = `import-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const filePath = `${fileId}/${file.name}`;

    // Upload file to Supabase Storage
    const { data, error } = await this.supabase.storage
      .from(STORAGE_BUCKETS.IMPORTS)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(STORAGE_BUCKETS.IMPORTS)
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error("Failed to get public URL for uploaded file");
    }

    return {
      fileId,
      url: urlData.publicUrl,
    };
  }

  async parseFile(_fileId: string): Promise<ImportData> {
    // This method is not used directly anymore - parsing happens client-side
    // or via the server action with the file buffer
    // Keeping for interface compatibility
    throw new Error(
      "Use uploadAndParseImportAction with file buffer instead"
    );
  }

  /**
   * Parse file from buffer (used in server action)
   * @param buffer - ArrayBuffer of the file
   */
  parseFileFromBuffer(buffer: ArrayBuffer): ImportData {
    // Dynamic import to avoid SSR issues with xlsx
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const XLSX = require("xlsx");

    // Read the workbook
    const workbook = XLSX.read(buffer, { type: "array" });

    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    }) as (string | number | null | undefined)[][];

    if (jsonData.length === 0) {
      return { headers: [], rows: [] };
    }

    // First row is headers
    const headers = jsonData[0].map((h) => String(h).trim());
    const rows = jsonData.slice(1).map((row) =>
      row.map((cell) => {
        if (cell === null || cell === undefined) return "";
        // Convert numbers to string, keep other types
        return typeof cell === "number" ? cell : String(cell);
      })
    );

    return { headers, rows };
  }
}
