// domain/services/import.service.ts

import { ImportPort } from "../ports/import.port";
import { ImportData } from "../types/import.types";

export class ImportService {
  constructor(private port: ImportPort) {}

  /**
   * Upload a file to storage
   * @param file - File to upload
   * @returns Object containing fileId and URL
   */
  async uploadFile(file: File): Promise<{ fileId: string; url: string }> {
    return this.port.uploadFile(file);
  }

  /**
   * Parse file from buffer
   * @param buffer - ArrayBuffer of the file
   * @returns Parsed import data
   */
  parseFileFromBuffer(buffer: ArrayBuffer): ImportData {
    return this.port.parseFileFromBuffer(buffer);
  }
}
