import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from '@/components/ui/card'
import { PropertyFiltersForm } from "@/features/properties/property-form-filters";
import { Button } from "@/components/ui/button";
import { IconFilter, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { ROUTES } from "@/infrastructure/config/constants";
import { listListing } from "@/services/listing.services";
import { ListingSearchFormInput } from "@/application/validation/listing-search.schema";
import ListingTable from "@/features/listing/listing-table";
import { ListingColumns } from "@/features/listing/listing-columns";
import { ListingFiltersForm } from "@/features/listing/listing-form-filters";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<ListingSearchFormInput>
}) {
  const filters = await searchParams;

  const listing = listListing(filters)

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
            <ListingTable listing={listing} columns={ListingColumns} />
          </Suspense>
        </CardContent>
      </Card>
    </main >
  );
}
