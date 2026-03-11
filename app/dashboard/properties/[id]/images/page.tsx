import { Spinner } from "@/components/ui/spinner";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";
import { Card, CardContent, } from '@/components/ui/card'
import { PropertyImagesManager } from "@/features/image-manager/property-images-manager";
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

  if (!property) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar la propiedad')
  }
  const fetchImages = propertyImageService.getCachedByPropertyId(id)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <h2 className="text-4xl font-bold mb-2">
            Galleria de la propiedad
          </h2>
          <p className="opacity-70">
            Gestiona y sube tus fotos de forma segura
          </p>
        </header>

        <Card>
          <CardContent>
            <div className='w-full'>
              <Suspense fallback={<Spinner />}>
                <PropertyImagesManager
                  propertyId={id}
                  fetch={fetchImages}
                />
              </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">25MB</p>
                <p className="text-xs uppercase tracking-wider mt-1 opacity-70">Máx. por archivo</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">10</p>
                <p className="text-xs uppercase tracking-wider mt-1 opacity-70">Se recomiendoa máx archivos .</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">PNG, JPG, WEBP</p>
                <p className="text-xs uppercase tracking-wider mt-1 opacity-70">Formatos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
