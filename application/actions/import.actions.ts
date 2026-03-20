"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { importFileSchema, confirmImportSchema } from "@/application/validation/import.schema";
import { appModule } from "@/application/modules/app.module";
import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/i18n/router";
import { CACHE_TAGS } from "@/infrastructure/config/constants";

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
