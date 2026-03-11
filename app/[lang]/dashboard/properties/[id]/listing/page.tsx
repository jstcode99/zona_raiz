import { encodedRedirect } from "@/shared/redirect";
import { Card, CardContent } from '@/components/ui/card'
import { ListingForm } from "@/features/listing/listing-form";
import { PropertyCard } from "@/features/properties/property-card";
import { propertyImageModule } from "@/application/modules/property-image.module";
import { propertyModule } from "@/application/modules/property.module";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const { propertyService } = await propertyModule()
  const { propertyImageService } = await propertyImageModule()
  const property = await propertyService.getCachedById(id)
  const images = await propertyImageService.getCachedByPropertyId(id)

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
