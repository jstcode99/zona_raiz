"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { getLangServerSide } from "@/shared/utils/lang";
import { ImportTableName } from "@/domain/entities/import-job.entity";
import {
  propertyImportHeaders,
  listingImportHeaders,
  realEstateImportHeaders,
  propertyImportHeadersES,
  listingImportHeadersES,
  realEstateImportHeadersES,
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

    // Seleccionar headers según tabla e idioma
    const isSpanish = lang === "es";
    let headers: readonly string[];

    switch (tableName) {
      case ImportTableName.PROPERTIES:
        headers = isSpanish ? propertyImportHeadersES : propertyImportHeaders;
        break;
      case ImportTableName.LISTINGS:
        headers = isSpanish ? listingImportHeadersES : listingImportHeaders;
        break;
      case ImportTableName.REAL_ESTATES:
        headers = isSpanish
          ? realEstateImportHeadersES
          : realEstateImportHeaders;
        break;
      default:
        throw new Error("Invalid table name");
    }

    // Crear CSV con headers en el idioma correspondiente
    const csvContent = Array.from(headers).join(",") + "\n";

    // Retornar contenido como string, NO como Blob URL
    return {
      content: csvContent,
      filename: `plantilla-${tableName}-${lang}.csv`,
      mimeType: "text/csv;charset=utf-8;",
    };
  },
);
