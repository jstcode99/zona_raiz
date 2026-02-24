import { Spinner } from "@/components/ui/spinner";
import { RealEstateForm } from "@/features/real-states/real-estate-form";
import { getRealEstateById } from "@/services/real-estate.services";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense, use } from "react";
import { Card, CardContent } from '@/components/ui/card'
import { LogoRealEstateUpload } from "@/features/real-states/logo-real-estate-upload";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const realEstate = use(getRealEstateById(id))

  if (!realEstate) {
    return encodedRedirect('error', '/dashboard/admin/real-states', 'No se pudo cargar el la inmobiliaria')
  }

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-2 '>
      <div className='flex justify-center'>
        <Card>
          <CardContent className='space-y-4'>
            <div className='grid lg:grid-cols-5 lg:min-w-6xl gap-6'>
              <div className='flex flex-col gap-7 lg:col-span-3'>
                <span className='text-lg font-semibold'>Inmobiliaria</span>
                <div className='flex items-center gap-3'>
                  <Suspense fallback={<Spinner />}>
                    <LogoRealEstateUpload
                      idRealEstate={id}
                      logoUrl={realEstate.logo_url || ''}
                      name={realEstate.name || ''}
                    />
                  </Suspense>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-xl font-medium'>{realEstate.name}</span>
                    <span className='text-muted-foreground text-sm'>{realEstate.whatsapp}</span>
                  </div>
                </div>
                <Suspense fallback={<Spinner />}>
                  <RealEstateForm
                    className="w-full px-0"
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
                </Suspense>
              </div>
              {/* <RealEstateAgentsCard agents={agents} className="shadow-none lg:col-span-2" /> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
