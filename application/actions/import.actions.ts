"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { appModule } from "@/application/modules/app.module";
import { getLangServerSide } from "@/infrastructure/shared/utils/lang";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/i18n/router";
import { CACHE_TAGS } from "@/infrastructure/config/constants";
import { ImportTableName } from "@/domain/entities/import-job.entity";
import { initI18n } from "@/i18n/server";
import { ImportError } from "@/features/import/import.types";
import { mapHeadersToTable } from "@/domain/utils/table-mapper";
import {
  propertyImportHeaders,
  listingImportHeaders,
  realEstateImportHeaders,
  propertyImportHeadersES,
  listingImportHeadersES,
  realEstateImportHeadersES,
} from "@/application/validation/import";
/**
 * Obtiene los headers esperados (en inglés) para una tabla
 */
function getExpectedHeaders(tableName: ImportTableName): string[] {
  switch (tableName) {
    case ImportTableName.PROPERTIES:
      return [...propertyImportHeaders];
    case ImportTableName.LISTINGS:
      return [...listingImportHeaders];
    case ImportTableName.REAL_ESTATES:
      return [...realEstateImportHeaders];
    default:
      return [];
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    row: number;
    column: string;
    value: string | number | null;
    message: string;
  }>;
  validatedData: Record<string, unknown>[];
}
export interface ProcessImportInput {
  headers: string[];
  rows: (string | null)[][];
  tableName: ImportTableName;
}

export const processImportAction = withServerAction(
  async (formData: FormData) => {
    // 1. Obtener servicios
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { importJobService, sessionService, cookiesService } =
      await appModule(lang, { cookies: cookieStore });

    // 2. Obtener userId y realEstateId
    const userId = await sessionService.getCurrentUserId();
    if (!userId) {
      throw new Error(t("import:exceptions.unauthorized"));
    }

    const realEstateId = await cookiesService.getRealEstateId();
    if (!realEstateId) {
      throw new Error(t("import:exceptions.real-estate-not-found"));
    }

    // 3. Parsear formData
    const raw = Object.fromEntries(formData);
    const headers = JSON.parse(raw.headers as string) as string[];
    const rows = JSON.parse(raw.rows as string) as (string | null)[][];
    const tableName =
      (raw.tableName as ImportTableName) || ImportTableName.PROPERTIES;

    // 4. Mapear headers del archivo a headers del schema (inglés)
    const expectedHeaders = getExpectedHeaders(tableName);
    const mapping = mapHeadersToTable(headers, expectedHeaders);
    // Transformar rows a objetos con claves en expectedHeaders (inglés)
    const transformedRows = rows.map((row) => {
      const obj: Record<string, unknown> = {};
      mapping.forEach((map, targetIndex) => {
        const targetHeader = expectedHeaders[targetIndex];
        console.log(targetHeader);
        if (map.sourceIndex >= 0) {
          const value = row[map.sourceIndex];
          if (value !== null && value !== undefined && value !== "") {
            const numValue = Number(value);
            obj[targetHeader] = isNaN(numValue) ? value : numValue;
          } else {
            obj[targetHeader] = value ?? "";
          }
        } else {
          obj[targetHeader] = "";
        }
      });
      return obj;
    });

    // Crear mapa de header esperado (inglés) -> header de display (original del archivo)
    const headerMap = new Map<string, string>();
    mapping.forEach((map, targetIndex) => {
      const targetHeader = expectedHeaders[targetIndex];
      if (map.sourceIndex >= 0) {
        headerMap.set(targetHeader, headers[map.sourceIndex]);
      } else {
        headerMap.set(targetHeader, targetHeader);
      }
    });
    // 5. Validar filas antes de crear el job
    const validationResult = await importJobService.validateAllRows(
      transformedRows,
      tableName,
      expectedHeaders,
    );
    // 6. Si hay errores, lanzar excepción para que withServerAction la capture
    if (!validationResult.isValid) {
      // Traducir errores a headers de display
      const displayErrors = validationResult.errors.map((err: ImportError) => ({
        ...err,
        column: headerMap.get(err.column) || err.column,
      }));
      return {
        success: false,
        errors: displayErrors.map((err: ImportError) => ({
          field: `${err.row}_${err.column}`,
          message: err.message,
          row: err.row,
          column: err.column,
          value: err.value,
        })),
      } as any;
    }

    // 7. Crear el job de importación (SIN fileUrl ni originalFilename)
    const job = await importJobService.createJob({
      userId,
      realEstateId,
      tableName,
      totalRows: rows.length,
      batchSize: 100,
    });

    // 8. Procesar la importación
    const summary = await importJobService.processImport(
      job.id,
      validationResult.validatedData,
      tableName,
      realEstateId,
      userId,
    );

    // 9. Invalidar cache según tabla
    switch (tableName) {
      case ImportTableName.PROPERTIES:
        revalidateTag(CACHE_TAGS.PROPERTY.ALL, { expire: 0 });
        revalidateTag(CACHE_TAGS.PROPERTY.COUNT, { expire: 0 });
        revalidatePath(routes.properties());
        break;
      case ImportTableName.LISTINGS:
        revalidateTag(CACHE_TAGS.LISTING.ALL, { expire: 0 });
        revalidateTag(CACHE_TAGS.LISTING.COUNT, { expire: 0 });
        revalidatePath(routes.listings());
        break;
      case ImportTableName.REAL_ESTATES:
        revalidateTag(CACHE_TAGS.REAL_ESTATE.ALL, { expire: 0 });
        revalidateTag(CACHE_TAGS.REAL_ESTATE.COUNT, { expire: 0 });
        revalidatePath(routes.realEstates());
        break;
    }
    revalidateTag(CACHE_TAGS.IMPORT_JOB.ALL, { expire: 0 });
    revalidatePath(routes.dashboard());

    if (summary.failedRows > 0) {
      // Obtener los errores del job completado para mostrarlos al cliente
      const completedJob = await importJobService.getJob(job.id);
      const jobErrors = completedJob?.errors ?? [];

      return {
        success: false,
        errors: jobErrors.map((err: ImportError) => ({
          field: `${err.row}_${err.column}`,
          message: err.message,
          row: err.row,
          column: err.column,
          value: err.value,
        })),
      } as any;
    }

    return {
      success: true,
      jobId: job.id,
      summary,
    };
  },
);

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
