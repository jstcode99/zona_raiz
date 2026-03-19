import { Spinner } from "@/components/ui/spinner";
import { PropertyForm } from "@/features/properties/property-form";
import { encodedRedirect } from "@/shared/redirect";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { Card, CardContent, } from '@/components/ui/card'
import { PropertyInput } from "@/application/validation/property.schema";
import { Lang } from "@/i18n/settings";
import { initI18n } from "@/i18n/server";
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
  const { cookiesService, propertyService } = await appModule(lang, { cookies: cookieStore })

  const realEstateId = await cookiesService.getRealEstateId()
  const property = await propertyService.getCachedById(id)

  if (!realEstateId) {
    return encodedRedirect('error', routes.onboarding(), t("common:exceptions.data_not_found"))
  }

  if (!property) {
    return encodedRedirect('error', routes.properties(), t("common:exceptions.data_not_found"))
  }

  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <Suspense fallback={<Spinner />}>
        <Card className='w-full border-none sm:max-w-3xl'>
          <CardContent>
            <PropertyForm
              id={id}
              realEstateId={realEstateId}
              defaultValues={property as PropertyInput}
            />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
