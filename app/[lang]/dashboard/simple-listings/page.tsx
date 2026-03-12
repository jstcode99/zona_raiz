import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from '@/components/ui/card'
import SimpleListingTable from "@/features/listing/simple-listing-table";
import { SimpleListingColumns } from "@/features/listing/simple-listing-columns";
import { listingModule } from "@/application/modules/listing.module";

export default async function page() {
  const { listingService } = await listingModule();
  
  const listings = listingService.getCachedSimplePublished(10);

  return (
    <main className="flex-col items-center justify-center space-y-4 px-4 lg:px-6">
      <Card>
        <CardContent>
          <div className="p-4 border-b">
            <h1 className="text-lg font-semibold">Últimas 10 Propiedades Publicadas</h1>
            <p className="text-sm text-muted-foreground">Tabla simple con agente asignado</p>
          </div>
          <Suspense fallback={<Spinner />}>
            <SimpleListingTable listings={listings} columns={SimpleListingColumns} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
