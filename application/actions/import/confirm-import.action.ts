// application/actions/import/confirm-import.action.ts

"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/i18n/router";
import { initI18n } from "@/i18n/server";
import { appModule } from "@/application/modules/app.module";
import { CACHE_TAGS } from "@/infrastructure/config/constants";
import { ImportTableName } from "@/domain/entities/import-job.entity";
import {
  propertyImportSchema,
  listingImportSchema,
  realEstateImportSchema,
} from "@/application/validation/import";
import * as yup from "yup";

export interface ConfirmImportInput {
  headers: string[];
  rows: (string | null)[][];
  tableName: ImportTableName;
  fileUrl: string;
  originalFilename: string;
}

export const confirmImportAction = withServerAction(async (formData: FormData) => {
  const lang = await getLangServerSide();
  const cookieStore = await cookies();
  const routes = createRouter(lang);
  const i18n = await initI18n(lang);
  const t = i18n.getFixedT(lang);

  const { importJobService, sessionService, cookiesService } = await appModule(
    lang,
    { cookies: cookieStore }
  );

  // 1. Obtener usuario y real estate
  const userId = await sessionService.getCurrentUserId();
  if (!userId) {
    throw new Error(t("import:exceptions.unauthorized"));
  }

  const realEstateId = await cookiesService.getRealEstateId();
  if (!realEstateId) {
    throw new Error(t("import:exceptions.real-estate-not-found"));
  }

  // 2. Parsear formData
  const raw = Object.fromEntries(formData);
  const headers = JSON.parse(raw.headers as string) as string[];
  const rows = JSON.parse(raw.rows as string) as (string | null)[][];
  const tableName = (raw.tableName as ImportTableName) || ImportTableName.PROPERTIES;
  const fileUrl = (raw.fileUrl as string) || "";
  const originalFilename = (raw.originalFilename as string) || "import.csv";

  // 3. Convertir rows a objetos
  const data: Record<string, unknown>[] = rows.map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      const value = row[index];
      // Convertir strings numéricos
      if (value !== null && value !== undefined && value !== "") {
        const numValue = Number(value);
        obj[header.toLowerCase().trim()] = isNaN(numValue) ? value : numValue;
      } else {
        obj[header.toLowerCase().trim()] = value;
      }
    });
    return obj;
  });

  // 4. Seleccionar schema según tabla
  const schema = (() => {
    switch (tableName) {
      case ImportTableName.PROPERTIES:
        return propertyImportSchema;
      case ImportTableName.LISTINGS:
        return listingImportSchema;
      case ImportTableName.REAL_ESTATES:
        return realEstateImportSchema;
      default:
        return propertyImportSchema;
    }
  })();

  // 5. Validar datos
  const errors: Array<{ row: number; column: string; message: string }> = [];
  const validatedData: Record<string, unknown>[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      const validated = await schema.validate(row, {
        abortEarly: false,
        stripUnknown: true,
      });
      validatedData.push(validated);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((e) => {
          errors.push({
            row: i + 1,
            column: e.path || "unknown",
            message: e.message,
          });
        });
      }
    }
  }

  if (errors.length > 0 && validatedData.length === 0) {
    throw new Error(t("import:exceptions.all-rows-invalid"));
  }

  // 6. Crear job y procesar
  const job = await importJobService.createJob({
    userId,
    realEstateId,
    tableName,
    totalRows: validatedData.length,
    batchSize: 100,
    fileUrl,
    originalFilename,
  });

  // 7. Procesar importación
  await importJobService.processImport(
    job.id,
    validatedData,
    tableName,
    realEstateId,
    userId
  );

  // 8. Revalidar cache según tabla
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
});
