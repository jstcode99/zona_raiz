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
import { inquiryModule } from "@/application/modules/inquiry.module";
import { Lang } from "@/i18n/settings";
import { createRouter } from "@/i18n/router";
import { InquirySearchFormInput } from "@/application/validation/inquiry-search.schema";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";

export default async function page({
  searchParams,
  params
}: {
  searchParams: Promise<InquirySearchFormInput>,
  params: { lang: Lang }
}) {
  const filters = await searchParams;
  const { lang } = await params;

  const routes = createRouter(lang)

  const cookieStore = await cookies()
  const realEstateId = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  const { inquiryService } = await inquiryModule()
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
