import { Spinner } from "@/components/ui/spinner";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";
import { Card, CardContent } from '@/components/ui/card'
import { ListingForm } from "@/features/listing/listing-form";
import { Lang } from "@/i18n/settings";
import { appModule } from "@/application/modules/app.module";
import { cookies } from "next/headers";
import { createRouter } from "@/i18n/router";
import { initI18n } from "@/i18n/server";

interface props {
  params: Promise<{ lang: Lang, id: string }>
}

export default async function page({ params }: props) {
  const { id, lang } = await params;
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const cookieStore = await cookies()
  const routes = createRouter(lang)
  const { listingService } = await appModule(lang, { cookies: cookieStore })

  const listing = await listingService.getCachedById(id)

  if (!listing) {
    encodedRedirect('error', routes.listings(), t("exceptions:data_not_found"))
  }

  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <Suspense fallback={<Spinner />}>
        <Card className='w-full border-none sm:max-w-4xl'>
          <CardContent>
            <ListingForm
              id={id}
              defaultValues={listing}
            />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
