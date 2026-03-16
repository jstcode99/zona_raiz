import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { IconFilter } from "@tabler/icons-react";
import { ListingSearchFormInput } from "@/application/validation/listing-search.schema";
import ListingTable from "@/features/listing/listing-table";
import { ListingFiltersForm } from "@/features/listing/listing-form-filters";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";
import { initI18n } from "@/i18n/server";
import { Lang } from "@/i18n/settings";
import { createRouter } from "@/i18n/router";
import { appModule } from "@/application/modules/app.module";
import { encodedRedirect } from "@/shared/redirect";


interface props {
  params: Promise<{ lang: Lang}>
  searchParams: Promise<ListingSearchFormInput>
}

export default async function page({ params, searchParams }: props) {
  const { lang } = await params;
  const filters = await searchParams;
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const cookieStore = await cookies()
  const routes = createRouter(lang)
  const { cookiesService, listingService } = await appModule(lang, { cookies: cookieStore })

  const realEstateId = await cookiesService.getRealEstateId()
 
  if (!realEstateId) {
    encodedRedirect('error', routes.onboarding(), t("exceptions:data_not_found"))
  }
  
  const listing = listingService.getCachedAll({
    ...filters,
    realEstateId
  })

  return (
    <main className="flex-col items-center justify-center space-y-4 px-4 lg:px-6">
      <Card>
        <CardContent >
          <Collapsible
            className='flex-col space-y-4 space-x-1 justify-end'
          >
            <CollapsibleTrigger asChild>
              <Button>
                <IconFilter />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-2 mb-3">
              <ListingFiltersForm
                debounceMs={400}
              />
              <Separator />
            </CollapsibleContent>
          </Collapsible>
          <Suspense fallback={<Spinner />}>
            <ListingTable listing={listing} />
          </Suspense>
        </CardContent>
      </Card>
    </main >
  );
}
