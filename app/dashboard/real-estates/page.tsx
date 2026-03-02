import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { ROUTES } from "@/infrastructure/config/constants";
import { RealEstateFiltersForm } from "@/features/real-states/real-estate-form-filters";
import RealEstatesTable from "@/features/real-states/real-estate-table";
import { listRealEstates } from "@/services/real-estate.services";
import { RealEstateFilters } from "@/domain/entities/real-estate.entity";
import { RealEstateColumns } from "@/features/real-states/real-estate-columns";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<RealEstateFilters>
}) {
  const filters = await searchParams;

  const realEstates = listRealEstates(filters)

  return (
    <main className="flex-col items-center justify-center space-y-4 px-4 lg:px-6">
      <Card>
        <CardContent className='space-y-4'>
          <RealEstateFiltersForm
            debounceMs={400}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className='flex-col space-y-4 justify-end'>
          <Button asChild>
            <Link href={`${ROUTES.DASHBOARD}/${ROUTES.REAL_ESTATES}/new`}>
              <IconPlus />
            </Link>
          </Button>
          <Suspense fallback={<Spinner />}>
            <RealEstatesTable realEstates={realEstates} columns={RealEstateColumns} />
          </Suspense>
        </CardContent>
      </Card>
    </main >
  );
}
