"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import {
  importDataSchema,
  confirmImportSchema,
} from "@/application/validation/import.schema";
import { appModule } from "@/application/modules/app.module";
import { getLangServerSide } from "@/shared/utils/lang";
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

export const validateImportAction = withServerAction(
  async (formData: FormData) => {
    // 1. Validar input
    const raw = Object.fromEntries(formData);
    const validated = await importDataSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    });

    // 2. Obtener servicios
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const { importJobService, sessionService } = await appModule(lang, {
      cookies: cookieStore,
    });

    // 3. Obtener userId y realEstateId
    const userId = await sessionService.getCurrentUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // 4. Convertir rows a objetos
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
    }) as Record<string, unknown>[];

    // 5. Obtener tableName del formData
    const tableName = formData.get("tableName") as ImportTableName;

    // 6. Mapear headers del archivo a headers del schema (inglés)
    const expectedHeaders = getExpectedHeaders(tableName);
    const mapping = mapHeadersToTable(headers, expectedHeaders, tableName);

    // Transformar rows a objetos con claves en expectedHeaders (inglés)
    const transformedRows = rows.map((row) => {
      const obj: Record<string, unknown> = {};
      mapping.forEach((map, targetIndex) => {
        const targetHeader = expectedHeaders[targetIndex];
        if (map.sourceIndex >= 0) {
          const headerKey = headers[map.sourceIndex];
          const value = row[headerKey];
          // Convertir strings numéricos
          if (value !== null && value !== undefined && value !== "") {
            const numValue = Number(value);
            obj[targetHeader] = isNaN(numValue) ? value : numValue;
          } else {
            obj[targetHeader] = value ?? "";
          }
        } else {
          obj[targetHeader] = ""; // No hay correspondencia, dejar vacío
        }
      });
      return obj;
    });

    // 7. Crear mapa de header esperado (inglés) -> header de display (original del archivo)
    const headerMap = new Map<string, string>();
    mapping.forEach((map, targetIndex) => {
      const targetHeader = expectedHeaders[targetIndex];
      if (map.sourceIndex >= 0) {
        headerMap.set(targetHeader, headers[map.sourceIndex]);
      } else {
        headerMap.set(targetHeader, targetHeader);
      }
    });

    // 8. Validar todas las filas
    const validationResult = await importJobService.validateAllRows(
      transformedRows,
      tableName,
      expectedHeaders,
    );

    // 9. Traducir errores a headers de display
    const displayErrors = validationResult.errors.map((err) => ({
      ...err,
      column: headerMap.get(err.column) || err.column,
    }));

    return {
      isValid: validationResult.isValid,
      errors: displayErrors,
      validatedData: validationResult.validatedData,
    } as ValidationResult;
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
    const { importJobService, sessionService, cookiesService } =
      await appModule(lang, { cookies: cookieStore });

    // 3. Obtener userId y realEstateId
    const userId = await sessionService.getCurrentUserId();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const realEstateId = await cookiesService.getRealEstateId();
    if (!realEstateId) {
      throw new Error("Real estate not found");
    }

    // 4. Convertir rows a objetos
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

    // 5. Obtener tabla del formData
    const tableName = formData.get("tableName") as ImportTableName;

    // 6. Mapear headers del archivo a headers del schema (inglés)
    const expectedHeaders = getExpectedHeaders(tableName);
    const mapping = mapHeadersToTable(headers, expectedHeaders, tableName);

    // Transformar rows a objetos con claves en expectedHeaders (inglés)
    const transformedRows = rows.map((row) => {
      const obj: Record<string, unknown> = {};
      mapping.forEach((map, targetIndex) => {
        const targetHeader = expectedHeaders[targetIndex];
        if (map.sourceIndex >= 0) {
          const headerKey = headers[map.sourceIndex];
          const value = row[headerKey];
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

    // 7. Validar filas antes de crear el job
    const validationResult = await importJobService.validateAllRows(
      transformedRows,
      tableName,
      expectedHeaders,
    );

    // 8. Si hay errores, lanzar excepción para que withServerAction la capture
    if (!validationResult.isValid) {
      const errorMessage = "Validation failed";

      // Traducir errores a headers de display
      const displayErrors = validationResult.errors.map((err) => ({
        ...err,
        column: headerMap.get(err.column) || err.column,
      }));

      // Crear un error que incluya los detalles de validación
      const validationError = new Error(errorMessage);
      // Agregar los errores específicos al error para que el cliente los pueda leer
      (validationError as any).validationErrors = displayErrors;
      throw validationError;
    }

    // 9. Crear el job de importación (SIN fileUrl ni originalFilename)
    const job = await importJobService.createJob({
      userId,
      realEstateId,
      tableName,
      totalRows: rows.length,
    });

    // 10. Procesar la importación
    const summary = await importJobService.processImport(
      job.id,
      validationResult.validatedData,
      tableName,
      realEstateId,
      userId,
    );

    // 10. Invalidar cache
    revalidatePath(routes.dashboard());
    revalidatePath(routes.properties());
    revalidatePath(routes.listings());
    revalidatePath(routes.realEstates());
    revalidateTag(CACHE_TAGS.PROPERTY.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.PROPERTY.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.LISTING.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.LISTING.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.REAL_ESTATE.PRINCIPAL, { expire: 0 });
    revalidateTag(CACHE_TAGS.REAL_ESTATE.ALL, { expire: 0 });
    revalidateTag(CACHE_TAGS.IMPORT_JOB.ALL, { expire: 0 });

    return {
      success: true,
      jobId: job.id,
      summary,
    };
  },
);

// processImportAction - nueva action sin upload de archivo
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
    const mapping = mapHeadersToTable(headers, expectedHeaders, tableName);

    // Transformar rows a objetos con claves en expectedHeaders (inglés)
    const transformedRows = rows.map((row) => {
      const obj: Record<string, unknown> = {};
      mapping.forEach((map, targetIndex) => {
        const targetHeader = expectedHeaders[targetIndex];
        if (map.sourceIndex >= 0) {
          const value = row[map.sourceIndex];
          // Convertir strings numéricos
          if (value !== null && value !== undefined && value !== "") {
            const numValue = Number(value);
            obj[targetHeader] = isNaN(numValue) ? value : numValue;
          } else {
            obj[targetHeader] = value ?? "";
          }
        } else {
          obj[targetHeader] = ""; // No hay correspondencia, dejar vacío
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

    console.log(transformedRows);
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

    return {
      success: true,
      jobId: job.id,
      summary,
    };
  },
);
