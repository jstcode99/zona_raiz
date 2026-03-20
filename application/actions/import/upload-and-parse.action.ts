// application/actions/import/upload-and-parse.action.ts

"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";
import { appModule } from "@/application/modules/app.module";
import { importFileSchema } from "@/application/validation/import.schema";
import { ImportTableName } from "@/domain/entities/import-job.entity";
import { initI18n } from "@/i18n/server";

export interface UploadAndParseInput {
  file: File;
  tableName: ImportTableName;
}

export const uploadAndParseImportAction = withServerAction(
  async (formData: FormData) => {
    // 1. Validar input
    const raw = Object.fromEntries(formData);
    const validated = await importFileSchema.validate(raw, {
      abortEarly: false,
    });

    const file = validated.file as File;
    const tableName = (raw.tableName as ImportTableName) || ImportTableName.PROPERTIES;

    // 2. Obtener servicios
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);
    
    const { importAdapter, importJobService, sessionService, cookiesService } =
      await appModule(lang, {
        cookies: cookieStore,
      });

    // 3. Obtener usuario y real estate actual
    const userId = await sessionService.getCurrentUserId();
    if (!userId) {
      throw new Error(t("import:exceptions.unauthorized"));
    }

    const realEstateId = await cookiesService.getRealEstateId();
    if (!realEstateId) {
      throw new Error(t("import:exceptions.real-estate-not-found"));
    }

    // 4. Subir archivo
    const uploadResult = await importAdapter.uploadFile(file);

    // 5. Parsear archivo para obtener filas
    const parsedData = await importAdapter.parseFile(uploadResult.fileId);

    // 6. Crear job de importación
    await importJobService.createJob({
      userId,
      realEstateId,
      tableName,
      totalRows: parsedData.rows.length,
      batchSize: 100,
      fileUrl: uploadResult.url,
      originalFilename: file.name,
    });
  }
);
