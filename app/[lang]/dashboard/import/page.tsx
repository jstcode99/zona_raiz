import { Suspense } from "react";
import { getLangServerSide } from "@/infrastructure/shared/utils/lang";
import { initI18n } from "@/i18n/server";
import { ImportPageClient } from "./import-page-client";

export default async function ImportPage() {
  const lang = await getLangServerSide();
  const i18n = await initI18n(lang);
  const t = i18n.getFixedT(lang);

  return (
    <div className="flex-col items-center justify-center space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("import:title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("import:subtitle")}</p>
        </div>
      </div>

      <Suspense fallback={<ImportPageSkeleton />}>
        <ImportPageClient lang={lang} />
      </Suspense>
    </div>
  );
}

function ImportPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      <div className="h-64 bg-muted animate-pulse rounded" />
    </div>
  );
}
