import { Spinner } from "@/components/ui/spinner";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";
import { Card, CardContent, } from '@/components/ui/card'
import { RealEstateForm } from "@/features/real-states/real-estate-form";
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
  const { realEstateService } = await appModule(lang, { cookies: cookieStore })

  const realEstate = await realEstateService.getCachedById(id)

  if (!realEstate || !id) {
    encodedRedirect('error', routes.onboarding(), t("common:exceptions.data_not_found"))
  }

  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <Suspense fallback={<Spinner />}>
        <Card className='w-full border-none sm:max-w-3xl'>
          <CardContent>
            <RealEstateForm
              id={id}
              defaultValues={{
                name: realEstate.name,
                description: realEstate.description,
                whatsapp: realEstate.whatsapp,
                street: realEstate.street,
                city: realEstate.city,
                state: realEstate.state,
                postal_code: realEstate.postal_code,
                country: realEstate.country,
              }}
            />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
