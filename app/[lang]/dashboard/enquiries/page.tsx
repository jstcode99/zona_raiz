import InquiryTable from "@/features/enquiries/enquiry-table";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { EnquiryFiltersForm } from "@/features/enquiries/enquiry-filters-form";
import { Button } from "@/components/ui/button";
import { IconFilter } from "@tabler/icons-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Lang } from "@/i18n/settings";
import { EnquirySearchFormInput } from "@/application/validation/enquiry-search.schema";
import { cookies } from "next/headers";
import { appModule } from "@/application/modules/app.module";
import { encodedRedirect } from "@/shared/redirect";
import { createRouter } from "@/i18n/router";
import { initI18n } from "@/i18n/server";

interface props {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<EnquirySearchFormInput>;
}

export default async function page({ params, searchParams }: props) {
  const filters = await searchParams;
  const { lang } = await params;
  const i18n = await initI18n(lang);
  const t = i18n.getFixedT(lang);
  const cookieStore = await cookies();
  const routes = createRouter(lang);

  const { enquiryService, cookiesService } = await appModule(lang, {
    cookies: cookieStore,
  });

  const realEstateId = (await cookiesService.getRealEstateId()) as string;

  if (!realEstateId) {
    encodedRedirect(
      "error",
      routes.enquiries(),
      t("common:exceptions.data_not_found"),
    );
    return;
  }

  const enquiries = enquiryService.all(filters);

  return (
    <main className="flex-col items-center justify-center space-y-4 px-4 lg:px-6">
      <Card>
        <CardContent className="space-y-4">
          <Collapsible className="flex-col space-y-4 space-x-1 justify-end">
            <CollapsibleTrigger asChild>
              <Button>
                <IconFilter />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-2">
              <EnquiryFiltersForm />
              <Separator />
            </CollapsibleContent>
          </Collapsible>
          <Suspense fallback={<Spinner />}>
            <InquiryTable enquiries={enquiries} realEstateId={realEstateId} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
