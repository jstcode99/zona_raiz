import { PropertyColumns } from "@/features/properties/property-columns";
import PropertiesTable from "@/features/properties/property-table";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from '@/components/ui/card'
import { PropertyFiltersForm } from "@/features/properties/property-form-filters";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { ROUTES } from "@/infrastructure/config/constants";
import { ListingFilters } from "@/domain/entities/listing.entity";
import { listListing } from "@/services/listing.services";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<ListingFilters>
}) {
  const filters = await searchParams;

  const properties = listListing(filters)

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
