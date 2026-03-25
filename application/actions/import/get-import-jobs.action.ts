"use server";

import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";
import { appModule } from "@/application/modules/app.module";
import { toActionResult } from "@/shared/hooks/to-action-result";
import { ImportJobEntity } from "@/domain/entities/import-job.entity";
import { initI18n } from "@/i18n/server";
import { ActionResult } from "@/shared/hooks/action-result";

export async function getImportJobsAction(): Promise<
  ActionResult<ImportJobEntity[]>
> {
  try {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { importJobService, sessionService } = await appModule(lang, {
      cookies: cookieStore,
    });

    const userId = await sessionService.getCurrentUserId();
    if (!userId) {
      throw new Error(t("import:exceptions.unauthorized"));
    }

    const jobs = await importJobService.getUserJobs(userId, 10);
    return { success: true, data: jobs } as ActionResult<ImportJobEntity[]>;
  } catch (error) {
    return toActionResult(error) as ActionResult<ImportJobEntity[]>;
  }
}

export async function getImportJobByIdAction(
  jobId: string,
): Promise<ActionResult<ImportJobEntity | null>> {
  try {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();

    const { importJobService } = await appModule(lang, {
      cookies: cookieStore,
    });

    const job = await importJobService.getJob(jobId);
    return { success: true, data: job } as ActionResult<ImportJobEntity | null>;
  } catch (error) {
    return toActionResult(error) as ActionResult<ImportJobEntity | null>;
  }
}
