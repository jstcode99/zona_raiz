"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import {
  importFileSchema,
  confirmImportSchema,
} from "@/application/validation/import.schema";
import { appModule } from "@/application/modules/app.module";
import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/i18n/router";
import { CACHE_TAGS } from "@/infrastructure/config/constants";
import { ImportTableName } from "@/domain/entities/import-job.entity";
import {
  propertyImportHeaders,
  listingImportHeaders,
  realEstateImportHeaders,
} from "@/application/validation/import";

export const uploadAndParseImportAction = withServerAction(
  async (formData: FormData) => {
    // 1. Validar input
    const raw = Object.fromEntries(formData);
    await importFileSchema.validate(raw, {
      abortEarly: false,
    });

    // 2. Obtener servicios
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    await appModule(lang, { cookies: cookieStore });

    // 3. Crear job de importación
    // Por ahora no hacemos upload de archivo - se maneja en el cliente
    // Los datos parseados se manejan en el cliente por ahora
    // TODO: Implementar almacenamiento temporales de datos parseados
  },
);

export const confirmImportAction = withServerAction(
  async (formData: FormData) => {
    // 1. Validar input
    const raw = Object.fromEntries(formData);
    const validated = await confirmImportSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    });

    // 2. Obtener servicios
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    await appModule(lang, { cookies: cookieStore });

    // 3. Procesar los datos (convertir rows a objetos)
    const headers = validated.headers as string[];
    const rows = validated.rows.map((row) => {
      if (!row) return {};
      const rowArr = row as string[];
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        if (header === undefined) return;
        const value = rowArr[index];
        obj[header] = value ?? "";
      });
      return obj;
    });

    // 4. Aquí iría la lógica de crear/actualizar las entidades
    // Por ahora solo revalidamos cache si hay datos
    if (rows.length > 0) {
      // TODO: Procesar los datos según el tipo de importación
      // await importService.processImportData(rows);
    }

    revalidatePath(routes.dashboard());
    revalidatePath(routes.properties());
    revalidateTag(CACHE_TAGS.PROPERTY.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.PROPERTY.COUNT, { expire: 0 });
  },
);

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
