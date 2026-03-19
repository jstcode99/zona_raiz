"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { importFileSchema } from "@/application/validation/import.schema";
import * as yup from "yup";
import { appModule } from "@/application/modules/app.module";
import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";

export const uploadImportFileAction = withServerAction(
  async (formData: FormData) => {
    // 1. Validar input
    const raw = Object.fromEntries(formData);
    const { file } = await importFileSchema.validate(raw, {
      abortEarly: false,
    });

    // 2. Obtener servicios
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const { importService } = await appModule(lang, { cookies: cookieStore });

    // 3. Ejecutar lógica de upload
    await importService.uploadFile(file);
  },
);

export const parseImportFileAction = withServerAction(
  async (formData: FormData) => {
    // 1. Validar input
    const raw = Object.fromEntries(formData);
    // Asumimos que fileId viene como string en el formData
    const { fileId } = await yup
      .object({
        fileId: yup.string().required("File ID is required"),
      })
      .validate(raw, {
        abortEarly: false,
      });

    // 2. Obtener servicios
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const { importService } = await appModule(lang, { cookies: cookieStore });

    // 3. Ejecutar lógica de parsing
    const data = await importService.parseFile(fileId);

    // return { data };
  },
);
