import InquiryTable from "@/features/inquiries/inquiry-table";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from '@/components/ui/card'
import { InquiryFiltersForm } from "@/features/inquiries/inquiry-filters-form";
import { Button } from "@/components/ui/button";
import { IconFilter } from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator";
import { Lang } from "@/i18n/settings";
import { InquirySearchFormInput } from "@/application/validation/inquiry-search.schema";
import { cookies } from "next/headers";
import { appModule } from "@/application/modules/app.module";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/shared/redirect";
import { createRouter } from "@/i18n/router";
import { initI18n } from "@/i18n/server";

interface props {
  params: Promise<{ lang: Lang }>
  searchParams: Promise<InquirySearchFormInput>,
}

export default async function page({ params, searchParams }: props) {
  const filters = await searchParams;
  const { lang } = await params;
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const cookieStore = await cookies()
  const routes = createRouter(lang)

  const { inquiryService, cookiesService } = await appModule(lang, { cookies: cookieStore })

  const realEstateId = await cookiesService.getRealEstateId()

  if (!realEstateId) {
    encodedRedirect('error', routes.inquiries(), t("exceptions:data_not_found"))
  }

  const inquiries = inquiryService.all(filters)

  return (
    <main className="flex-col items-center justify-center space-y-4 px-4 lg:px-6">
      <Card>
        <CardContent className="space-y-4">
          <Collapsible
            className='flex-col space-y-4 space-x-1 justify-end'
          >
            <CollapsibleTrigger asChild>
              <Button>
                <IconFilter />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-2">
              <InquiryFiltersForm />
              <Separator />
            </CollapsibleContent>
          </Collapsible>
          <Suspense fallback={<Spinner />}>
            <InquiryTable inquiries={inquiries} realEstateId={realEstateId} />
          </Suspense>
        </CardContent>
      </Card>
    </main >
  );
}
