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
import { detectTable, isConfidenceSufficient } from "@/domain/utils/table-detector";

export interface UploadAndParseResult {
  fileId: string;
  url: string;
  headers: string[];
  rows: string[][];
  detectedTable: ImportTableName | null;
  confidence: number;
}

export const uploadAndParseImportAction = withServerAction(
  async (formData: FormData) => {
    // 1. Obtener servicios
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const { importService } = await appModule(lang, { cookies: cookieStore });

    // 2. Obtener el archivo del formData
    const file = formData.get("file") as File | null;
    if (!file) {
      throw new Error("No file provided");
    }

    // 3. Upload del archivo a Supabase Storage
    const { fileId, url } = await importService.uploadFile(file);

    // 4. Leer el archivo como buffer para parsear
    const arrayBuffer = await file.arrayBuffer();

    // 5. Parsear el archivo
    const importData = importService.parseFileFromBuffer(arrayBuffer);

    // 6. Limpiar datos: filtrar columnas vacías y filas vacías
    const rawHeaders = importData.headers
    const nonEmptyHeaderIndices = rawHeaders
      .map((header, index) => (header && header.trim() ? index : -1))
      .filter((index) => index >= 0)

    // Si no hay headers válidos, usar los que haya (evitar crash)
    const headers =
      nonEmptyHeaderIndices.length > 0
        ? nonEmptyHeaderIndices.map((i) => rawHeaders[i])
        : rawHeaders

    const rows = importData.rows
      .map((row) =>
        nonEmptyHeaderIndices.length > 0
          ? nonEmptyHeaderIndices.map((i) => (row[i] ?? ""))
          : row.map((cell) => (cell ?? ""))
      )
      .filter((row) => row.some((cell) => cell !== ""))

    // 7. Detectar la tabla con headers limpios
    const detectionResult = detectTable(headers);

    // 8. Retornar resultado
    return {
      fileId,
      url,
      headers,
      rows,
      detectedTable: detectionResult.table,
      confidence: detectionResult.confidence,
    } as UploadAndParseResult;
  },
);

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

    // 6. Validar todas las filas
    const validationResult = await importJobService.validateAllRows(
      rows,
      tableName,
      headers,
    );

    return {
      isValid: validationResult.isValid,
      errors: validationResult.errors,
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
    const {
      importJobService,
      sessionService,
      cookiesService,
    } = await appModule(lang, { cookies: cookieStore });

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
    const fileUrl = formData.get("fileUrl") as string | null;
    const originalFilename = formData.get("originalFilename") as string | null;

    // 6. Validar filas antes de crear el job
    const validationResult = await importJobService.validateAllRows(
      rows,
      tableName,
      headers,
    );

    // 7. Si hay errores, retornarlos (no procesamos si hay errores)
    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors,
        message: "Validation failed",
      };
    }

    // 8. Crear el job de importación
    const job = await importJobService.createJob({
      userId,
      realEstateId,
      tableName,
      totalRows: rows.length,
      fileUrl: fileUrl || undefined,
      originalFilename: originalFilename || undefined,
    });

    // 9. Procesar la importación
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
