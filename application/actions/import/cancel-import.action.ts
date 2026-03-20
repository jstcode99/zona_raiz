// application/actions/import/cancel-import.action.ts

"use server";

import { withServerAction } from "@/shared/hooks/with-server-action";
import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { createRouter } from "@/i18n/router";
import { appModule } from "@/application/modules/app.module";
import { CACHE_TAGS } from "@/infrastructure/config/constants";

export const cancelImportAction = withServerAction(async (jobId: string) => {
  const lang = await getLangServerSide();
  const cookieStore = await cookies();
  const routes = createRouter(lang);

  const { importJobService, sessionService } = await appModule(lang, {
    cookies: cookieStore,
  });

  const userId = await sessionService.getCurrentUserId();
  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  await importJobService.cancelJob(jobId);

  revalidateTag(CACHE_TAGS.IMPORT_JOB.ALL, { expire: 0 });
  revalidatePath(routes.dashboard());
});
