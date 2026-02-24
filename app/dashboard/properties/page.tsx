import { PropertyColumns, PropertyRow } from "@/features/properties/property-columns";
import PropertiesTable from "@/features/properties/property-table";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from '@/components/ui/card'
import { listProperties } from "@/services/property.services";
import { PropertyFiltersForm } from "@/features/properties/property-form-filters";
import { PropertyFilters } from "@/domain/entities/property.entity";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { ROUTES } from "@/infrastructure/config/constants";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<PropertyFilters>
}) {
  const filters = await searchParams;

  const properties = listProperties(filters)

  return (
    <main className="flex-col items-center justify-center space-y-4 px-4 lg:px-6">
      <Card>
        <CardContent className='space-y-4'>
          <PropertyFiltersForm
            debounceMs={400}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className='flex-col space-y-4 justify-end'>
          <Button asChild>
            <Link href={`${ROUTES.DASHBOARD}/${ROUTES.PROPERTIES}/new`}>
              <IconPlus />
            </Link>
          </Button>
          <Suspense fallback={<Spinner />}>
            <PropertiesTable properties={properties} columns={PropertyColumns} />
          </Suspense>
        </CardContent>
      </Card>
    </main >
  );
}
