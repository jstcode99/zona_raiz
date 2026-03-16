import { Spinner } from "@/components/ui/spinner";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";
import { Card, CardContent, } from '@/components/ui/card'
import { PropertyImagesManager } from "@/features/image-manager/property-images-manager";
import { Lang } from "@/i18n/settings";
import { initI18n } from "@/i18n/server";
import { cookies } from "next/headers";
import { createRouter } from "@/i18n/router";
import { appModule } from "@/application/modules/app.module";

interface props {
  params: Promise<{ lang: Lang, id: string }>
}

export default async function page({ params }: props) {
  const { lang, id } = await params;
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const cookieStore = await cookies()
  const routes = createRouter(lang)
  const { cookiesService, propertyService, propertyImageService } = await appModule(lang, { cookies: cookieStore })

  const realEstateId = await cookiesService.getRealEstateId()
  const property = await propertyService.getCachedById(id)

  if (!realEstateId) {
    encodedRedirect('error', routes.onboarding(), t("exceptions:data_not_found"))
  }

  if (!property) {
    encodedRedirect('error', routes.properties(), t("exceptions:data_not_found"))
  }

  const fetchImages = propertyImageService.getCachedByPropertyId(id)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <h2 className="text-4xl font-bold mb-2">
            {t("titles:property_gallery")}
          </h2>
          <p className="opacity-70">
            {t("subtitles:property_gallery")}
          </p>
        </header>

        <Card>
          <CardContent>
            <div className='w-full'>
              <Suspense fallback={<Spinner />}>
                <PropertyImagesManager
                  propertyId={id}
                  fetch={fetchImages}
                />
              </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">25MB</p>
                <p className="text-xs uppercase tracking-wider mt-1 opacity-70">{t("section:max_file_size")}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">10</p>
                <p className="text-xs uppercase tracking-wider mt-1 opacity-70">{t("section:max_file_quantity")}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">PNG, JPG, WEBP</p>
                <p className="text-xs uppercase tracking-wider mt-1 opacity-70">{t("section:formats_files")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
