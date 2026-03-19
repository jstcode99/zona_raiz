import { ImportData } from "../types/import.types";

export interface ImportPort {
  /**
   * Upload a file to storage
   * @param file - File to upload
   * @returns Object containing fileId and URL
   */
  uploadFile(file: File): Promise<{ fileId: string; url: string }>;

  /**
   * Parse an uploaded file and return the data
   * @param fileId - ID of the uploaded file
   * @returns Parsed import data
   */
  parseFile(fileId: string): Promise<ImportData>;
}