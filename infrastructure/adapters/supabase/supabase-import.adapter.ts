import { ImportPort } from "@/domain/ports/import.port";
import { ImportData } from "@/domain/types/import.types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Normalizes a filename for Supabase Storage:
 * - Converts to lowercase
 * - Removes accents/diacritics
 * - Replaces spaces and special characters with hyphens
 * - Keeps original extension
 */
function normalizeFilename(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  const name = lastDot === -1 ? filename : filename.substring(0, lastDot);
  const ext = lastDot === -1 ? '' : filename.substring(lastDot);

  const normalized = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents/diacritics
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphen
    .replace(/-+/g, '-') // Reduce multiple hyphens to one
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  return normalized + ext;
}

export class SupabaseImportAdapter implements ImportPort {
  constructor(private supabase: SupabaseClient) { }

  async uploadFile(file: File): Promise<{ fileId: string; url: string }> {
    // Generate a unique file ID
    const fileId = `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const normalizedFileName = normalizeFilename(file.name);
    const filePath = `${fileId}/${normalizedFileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await this.supabase
      .storage
      .from('imports')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase
      .storage
      .from('imports')
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    return {
      fileId,
      url: urlData.publicUrl
    };
  }

  async parseFile(fileId: string): Promise<ImportData> {
    // TODO: Implement actual file parsing using xlsx library
    // This would involve:
    // 1. Downloading the file from Supabase Storage
    // 2. Using xlsx library to parse the file
    // 3. Extracting headers and rows
    // 4. Returning ImportData structure
    
    // For now, return mock data to match the service implementation
    return {
      headers: ['Name', 'Email', 'Phone', 'Company'],
      rows: [
        ['John Doe', 'john@example.com', '123-456-7890', 'Acme Corp'],
        ['Jane Smith', 'jane@example.com', '098-765-4321', 'Beta Inc'],
        ['Bob Johnson', 'bob@example.com', '555-123-4567', 'Test LLC']
      ]
    };
  }
}