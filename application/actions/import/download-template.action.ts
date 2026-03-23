"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { getLangServerSide } from "@/shared/utils/lang";
import { ImportTableName } from "@/domain/entities/import-job.entity";
import {
  propertyImportHeaders,
  listingImportHeaders,
  realEstateImportHeaders,
} from "@/application/validation/import";

export interface DownloadTemplateResult {
  content: string;
  filename: string;
  mimeType: string;
}

export const downloadTemplateAction = withServerAction(
  async (formData: FormData): Promise<DownloadTemplateResult> => {
    const tableName = formData.get("tableName") as ImportTableName;
    const lang = await getLangServerSide();

    // Obtener headers según tabla
    let headers: readonly string[];
    switch (tableName) {
      case ImportTableName.PROPERTIES:
        headers = propertyImportHeaders;
        break;
      case ImportTableName.LISTINGS:
        headers = listingImportHeaders;
        break;
      case ImportTableName.REAL_ESTATES:
        headers = realEstateImportHeaders;
        break;
      default:
        throw new Error("Invalid table name");
    }

    // Crear CSV con headers (solo headers, sin datos)
    const csvContent = headers.join(",") + "\n";

    // Retornar contenido como string, NO como Blob URL
    return {
      content: csvContent,
      filename: `plantilla-${tableName}-${lang}.csv`,
      mimeType: "text/csv;charset=utf-8;",
    };
  },
);
