import { Spinner } from "@/components/ui/spinner";
import { PropertyFormValues } from "@/domain/entities/schemas/property.schema";
import { PropertyForm } from "@/features/properties/property-form";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { getPropertyById } from "@/services/property.services";
import { encodedRedirect } from "@/shared/redirect";
import { cookies } from "next/headers";
import { Suspense, use } from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const cookieStore = await cookies()
  const realEstateId = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  const property = use(getPropertyById(id))

  if (!property) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar la propiedad')
  }

  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <Suspense fallback={<Spinner />}>
        <PropertyForm
          id={id}
          realEstateId={realEstateId}
          defaultValues={property as PropertyFormValues}
        />
      </Suspense>
    </main>
  );
}
