import { Spinner } from "@/components/ui/spinner";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";
import { Card, CardContent } from '@/components/ui/card'
import { ListingForm } from "@/features/listing/listing-form";
import { getPropertyById } from "@/services/property.services";
import { getPropertyImagesById } from "@/services/property-image.services";
import { PropertyCard } from "@/features/properties/property-card";

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
    <div className="mx-auto px-4 sm:px-6 lg:px-2 space-y-2 lg:max-w-5xl w-full">
      <PropertyCard
        property={property}
        images={images ? images.map(img => img.public_url as string) : []}
      />
      <Card>
        <CardContent>
          <ListingForm
            property_id={id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
