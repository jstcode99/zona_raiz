// application/actions/import/download-template.action.ts

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
  url: string;
  filename: string;
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

    // Crear CSV con headers
    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Retornar URL para descarga
    return { url, filename: `plantilla-${tableName}-${lang}.csv` };
  },
);