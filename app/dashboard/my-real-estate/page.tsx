import { encodedRedirect } from "@/shared/redirect"
import { cookies } from "next/headers"
import { COOKIE_NAMES } from "@/infrastructure/config/constants"
import { Card, CardContent } from '@/components/ui/card'
import { RealEstateForm } from "@/features/real-states/real-estate-form"
import { LogoRealEstateUpload } from "@/features/real-states/logo-real-estate-upload"
import { getRealEstateById } from "@/services/real-estate.services"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { getListAgentByRealEstateId } from "@/services/agent.services"
import { SkeletonAgentList } from "@/features/agents/skeleton-agent-list"
import { AgentList } from "@/features/agents/agent-list"
import { Separator } from "@/components/ui/separator"
import { AddAgentForm } from "@/features/agents/add-agent-form"

export default async function MyRealEstatePage() {
  const cookieStore = await cookies()
  const real_estate_id = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  const realEstate = await getRealEstateById(real_estate_id)
  const agents = await getListAgentByRealEstateId(real_estate_id)

  if (!realEstate) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar la inmobiliaria')
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
                      idRealEstate={real_estate_id}
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
                    id={real_estate_id}
                    defaultValues={realEstate}
                  />
                </Suspense>
              </div>
              <Suspense fallback={<SkeletonAgentList />}>
                <div className="w-full overflow-auto max-h-screen lg:col-span-2 flex items-start gap-3">
                  <Separator orientation="vertical" />
                  <div className="flex-col space-x-3 w-full">
                    <AddAgentForm real_estate_id={real_estate_id} />
                    <Separator/>
                    <AgentList
                      real_estate_id={real_estate_id}
                      agents={agents}
                    />
                  </div>
                </div>
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
