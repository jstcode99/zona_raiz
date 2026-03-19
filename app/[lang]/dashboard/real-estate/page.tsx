import { encodedRedirect } from "@/shared/redirect"
import { cookies } from "next/headers"
import { Card, CardContent } from '@/components/ui/card'
import { RealEstateForm } from "@/features/real-states/real-estate-form"
import { LogoRealEstateUpload } from "@/features/real-states/logo-real-estate-upload"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { SkeletonAgentList } from "@/features/agents/skeleton-agent-list"
import { AgentList } from "@/features/agents/agent-list"
import { Separator } from "@/components/ui/separator"
import { AddAgentForm } from "@/features/agents/add-agent-form"
import { Lang } from "@/i18n/settings"
import { initI18n } from "@/i18n/server"
import { createRouter } from "@/i18n/router"
import { appModule } from "@/application/modules/app.module"

interface props {
  params: Promise<{ lang: Lang }>
}

export default async function page({ params }: props) {
  const { lang } = await params;
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const cookieStore = await cookies()
  const routes = createRouter(lang)
  const { realEstateService, cookiesService, agentService } = await appModule(lang, { cookies: cookieStore })

  const realEstateId = await cookiesService.getRealEstateId() as string
  const realEstate = await realEstateService.getCachedById(realEstateId)

  if (!realEstate || !realEstateId) {
    encodedRedirect('error', routes.onboarding(), t("common:exceptions.data_not_found"))
  }

  const agents = await agentService.getCachedListAgents(realEstateId)

  return (
    <Card className="mx-auto px-4 sm:px-6 lg:px-2">
      <CardContent className='grid lg:grid-cols-5 grid-cols-1 gap-2 lg:min-w-5xl w-full'>
        <div className='flex flex-col gap-2 lg:col-span-3'>
          <span className='text-lg font-semibold'>{t('words:real_estate')}</span>
          <div className='flex items-center gap-3'>
            <Suspense fallback={<Spinner />}>
              <LogoRealEstateUpload
                idRealEstate={realEstateId}
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
              id={realEstateId}
              defaultValues={realEstate}
            />
          </Suspense>
        </div>
        <Suspense fallback={<SkeletonAgentList />}>
          <div className="lg:col-span-2 lg:border-l lg:pl-6">
            <AddAgentForm realEstateId={realEstateId} />
            <Separator />
            <AgentList
              realEstateId={realEstateId}
              agents={agents}
            />
          </div>
        </Suspense>
      </CardContent>
    </Card>
  )
}
