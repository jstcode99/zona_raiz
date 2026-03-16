import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { IconFilter, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { RealEstateFiltersForm } from "@/features/real-states/real-estate-form-filters";
import RealEstatesTable from "@/features/real-states/real-estate-table";
import { RealEstateFilters } from "@/domain/entities/real-estate.entity";
import { RealEstateColumns } from "@/features/real-states/real-estate-columns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator";
import { Lang } from "@/i18n/settings";
import { initI18n } from "@/i18n/server";
import { cookies } from "next/headers";
import { createRouter } from "@/i18n/router";
import { appModule } from "@/application/modules/app.module";

interface props {
  params: Promise<{ lang: Lang }>
  searchParams: Promise<RealEstateFilters>
}

export default async function page({ params, searchParams }: props) {
  const { lang } = await params;
  const filters = await searchParams;
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const cookieStore = await cookies()
  const routes = createRouter(lang)
  const { realEstateService } = await appModule(lang, { cookies: cookieStore })

  const realEstates = realEstateService.getCachedAll(filters)

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
            <Button asChild>
              <Link href={`${routes.realEstates()}/new`}>
                <IconPlus />
              </Link>
            </Button>
            <CollapsibleContent className="flex flex-col gap-2 mb-3">
              <RealEstateFiltersForm
                debounceMs={400}
              />
              <Separator />
            </CollapsibleContent>
          </Collapsible>
          <Suspense fallback={<Spinner />}>
            <RealEstatesTable realEstates={realEstates} columns={RealEstateColumns} />
          </Suspense>
        </CardContent>
      </Card>
    </main >
  );
}
