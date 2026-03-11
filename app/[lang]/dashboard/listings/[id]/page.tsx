import { Spinner } from "@/components/ui/spinner";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";
import { Card, CardContent } from '@/components/ui/card'
import { ListingForm } from "@/features/listing/listing-form";
import { listingModule } from "@/application/modules/listing.module";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const { listingService } = await listingModule()
  const listing = await listingService.getCachedById(id)

  if (!listing) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar la lista')
  }

  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <Suspense fallback={<Spinner />}>
        <Card className='w-full border-none sm:max-w-4xl'>
          <CardContent>
            <ListingForm
              id={id}
              defaultValues={listing}
            />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
