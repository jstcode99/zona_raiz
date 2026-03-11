import { PropertyColumns } from "@/features/properties/property-columns";
import PropertiesTable from "@/features/properties/property-table";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from '@/components/ui/card'
import { PropertyFiltersForm } from "@/features/properties/property-form-filters";
import { Button } from "@/components/ui/button";
import { IconFilter, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { COOKIE_NAMES, ROUTES } from "@/infrastructure/config/constants";
import { PropertySearchFormInput } from "@/application/validation/property-search.schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";
import { propertyModule } from "@/application/modules/property.module";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<PropertySearchFormInput>
}) {
  const filters = await searchParams;
  const cookieStore = await cookies()

  const real_estate_id = cookieStore
    .get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  const { propertyService } = await propertyModule()
  const properties = propertyService.getCachedAll({ ...filters, real_estate_id })

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
            <Button asChild>
              <Link href={`${ROUTES.DASHBOARD}/${ROUTES.PROPERTIES}/new`}>
                <IconPlus />
              </Link>
            </Button>
            <CollapsibleContent className="flex flex-col gap-2">
              <PropertyFiltersForm
                debounceMs={400}
              />
              <Separator />
            </CollapsibleContent>
          </Collapsible>
          <Suspense fallback={<Spinner />}>
            <PropertiesTable properties={properties} columns={PropertyColumns} />
          </Suspense>
        </CardContent>
      </Card>
    </main >
  );
}
