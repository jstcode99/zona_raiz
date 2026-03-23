// domain/ports/import.port.ts

import { ImportData } from "../types/import.types";

export interface ImportPort {
  /**
   * Upload a file to storage
   * @param file - File to upload
   * @returns Object containing fileId and URL
   */
  uploadFile(file: File): Promise<{ fileId: string; url: string }>;

  /**
   * Parse file from buffer
   * @param buffer - ArrayBuffer of the file
   * @returns Parsed import data
   */
  parseFileFromBuffer(buffer: ArrayBuffer): ImportData;
}
