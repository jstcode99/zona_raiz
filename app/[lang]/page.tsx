import { Lang } from "@/i18n/settings"
import { LandingNav } from "@/features/landing/landing-nav"
import { LandingHero } from "@/features/landing/landing-hero"
import { LandingTrust } from "@/features/landing/landing-trust"
import { LandingListings } from "@/features/landing/landing-listings"
import { LandingCities } from "@/features/landing/landing-cities"
import { LandingFooter } from "@/features/landing/landing-footer"
import { getLandingData } from "@/application/actions/landing.actions"
import { cookies } from "next/headers"
import { appModule } from "@/application/modules/app.module"

interface HomePageProps {
  params: Promise<{ lang: Lang }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  const cookieStore = await cookies()
  const { sessionService } = await appModule(lang, { cookies: cookieStore })
  const userId = await sessionService.getCurrentUserId()
  const isLoggedIn = !!userId

  const landingData = await getLandingData()

  const heroCities = landingData.cities.map(c => ({ name: c.name, slug: c.slug }))

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <LandingNav lang={lang} isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <LandingHero lang={lang} cities={heroCities} />
        <LandingTrust lang={lang} stats={landingData.stats} />
        <LandingListings lang={lang} listings={landingData.listings} />
        <LandingCities lang={lang} cities={landingData.cities} />
      </main>
      <LandingFooter lang={lang} />
    </div>
  )
}
