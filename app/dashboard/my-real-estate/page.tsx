
import { encodedRedirect } from "@/shared/redirect"
import { createRealEstateRepository } from "@/infrastructure/db/SupabaseRealEstateRepository"
import { cookies } from "next/headers"
import { COOKIE_NAMES } from "@/infrastructure/config/constants"
import { Card, CardContent } from '@/components/ui/card'
import { RealEstateAgentsCard } from "@/features/real-states/real-estate-agents-card"
import { RealEstateForm } from "@/features/real-states/real-estate-form"

export default async function MyRealEstatePage() {
  const cookieStore = await cookies()
  const id = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  const repo = createRealEstateRepository()
  const realEstate = await repo.findByIdFresh(id)
  const agents = await repo.getAgents(id)

  if (!realEstate) {
    return encodedRedirect('error', '/dashboard', 'No se pudo cargar tu inmobiliaria')
  }

  const defaultValues = {
    id: id,
    name: realEstate.name,
    description: realEstate.description,
    whatsapp: realEstate.whatsapp,
    address: {
      street: realEstate.street,
      city: realEstate.city,
      state: realEstate.state,
      postal_code: realEstate.postal_code,
      country: realEstate.country,
      logo: undefined
    },
  }

  if (!agents) {
    return encodedRedirect('error', '/dashboard', 'No se pudo cargar el los agentes')
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
                  <img
                    src={realEstate.logo_url}
                    className='size-20 rounded-lg'
                    alt='logo'
                  />
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-xl font-medium'>{realEstate.name}</span>
                    <span className='text-muted-foreground text-sm'>{realEstate.whatsapp}</span>
                  </div>
                </div>
                <RealEstateForm className="w-full px-0" id={id} defaultValues={defaultValues} />
              </div>
              <RealEstateAgentsCard agents={agents} className="shadow-none lg:col-span-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
