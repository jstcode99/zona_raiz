import { Spinner } from "@/components/ui/spinner";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";
import { Card, CardContent } from '@/components/ui/card'
import { ListingForm } from "@/features/listing/listing-form";
import { getPropertyById } from "@/services/property.services";
import { PropertyCard } from "@/features/properties/property-card";
import { getPropertyImagesById } from "@/services/property-image.services";
import { PropertyDetail } from "@/features/properties/property-details";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const property = await getPropertyById(id)
  const images = await getPropertyImagesById(id)


  if (!property) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar la propiedad')
  }

  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6'>
      <Suspense fallback={<Spinner />}>
        <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-2">
          <Card className='border-none'>
            <CardContent>
              <ListingForm
                property_id={id}
              />
            </CardContent>
          </Card>
          <Card className='border-none '>
            <CardContent>
              <PropertyDetail
                property={property}
                images={images ? images.map(img => img.public_url as string) : []}
              />
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </div>
  );
}
