import { Spinner } from "@/components/ui/spinner";
import { PropertyFormValues } from "@/domain/entities/schemas/property.schema";
import { PropertyForm } from "@/features/properties/property-form";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { getPropertyById } from "@/services/property.services";
import { encodedRedirect } from "@/shared/redirect";
import { cookies } from "next/headers";
import { Suspense } from "react";
import AuthBackgroundShape from '@/assets/svg/background-shape'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import i18next from "i18next";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const cookieStore = await cookies()
  const realEstateId = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  const property = await getPropertyById(id)

  if (!property) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar la propiedad')
  }

  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <Suspense fallback={<Spinner />}>
        <Card className='w-full border-none sm:max-w-3xl'>
          <CardContent>
            <PropertyForm
              id={id}
              realEstateId={realEstateId}
              defaultValues={property as PropertyFormValues}
            />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
