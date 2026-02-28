import { Spinner } from "@/components/ui/spinner";
import { getPropertyById } from "@/services/property.services";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";
import { Card, CardContent, } from '@/components/ui/card'
import { PropertyImagesManager } from "@/features/image-manager/property-images-manager";
import { getPropertyImagesById } from "@/services/property-image.services"

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const property = await getPropertyById(id)

  if (!property) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar la propiedad')
  }
  const fetchImages = getPropertyImagesById(id)

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

        <div className="border rounded-2xl p-8 shadow-lg">
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
        </div>
      </div>
    </main>
  );
}
