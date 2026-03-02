import { Spinner } from "@/components/ui/spinner";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";
import { Card, CardContent, } from '@/components/ui/card'
import { getRealEstateById } from "@/services/real-estate.services";
import { RealEstateForm } from "@/features/real-states/real-estate-form";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const realEstate = await getRealEstateById(id)

  if (!realEstate) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar la inmobiliaria')
  }

  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <Suspense fallback={<Spinner />}>
        <Card className='w-full border-none sm:max-w-3xl'>
          <CardContent>
            <RealEstateForm
              id={id}
              defaultValues={{
                name: realEstate.name,
                description: realEstate.description,
                whatsapp: realEstate.whatsapp,
                address: {
                  street: realEstate.street,
                  city: realEstate.city,
                  state: realEstate.state,
                  postal_code: realEstate.postal_code,
                  country: realEstate.country,
                }
              }}
            />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
