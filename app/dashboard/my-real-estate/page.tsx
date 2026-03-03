import { encodedRedirect } from "@/shared/redirect"
import { cookies } from "next/headers"
import { COOKIE_NAMES } from "@/infrastructure/config/constants"
import { Card, CardContent } from '@/components/ui/card'
import { RealEstateForm } from "@/features/real-states/real-estate-form"
import { LogoRealEstateUpload } from "@/features/real-states/logo-real-estate-upload"
import { getRealEstateById } from "@/services/real-estate.services"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"

export default async function MyRealEstatePage() {
  const cookieStore = await cookies()
  const id = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  const realEstate = await getRealEstateById(id)

  if (!realEstate) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar la inmobiliaria')
  }

  console.log(realEstate);
  

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
                    defaultValues={realEstate}
                  />
                </Suspense>
              </div>
              {/* <RealEstateAgentsCard agents={agents} className="shadow-none lg:col-span-2" /> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
