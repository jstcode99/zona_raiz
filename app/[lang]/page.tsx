import { Lang } from "@/i18n/settings"
import { LandingNav } from "@/features/landing/landing-nav"
import { LandingHero } from "@/features/landing/landing-hero"
import { LandingTrust } from "@/features/landing/landing-trust"
import { LandingListings } from "@/features/landing/landing-listings"
import { LandingCities } from "@/features/landing/landing-cities"

interface HomePageProps {
  params: Promise<{ lang: Lang }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params

  return (
    <div className="bg-white min-h-screen">
      <LandingNav lang={lang} />
      <LandingHero lang={lang} />
      <LandingTrust lang={lang} />
      <LandingListings lang={lang} />
      <LandingCities lang={lang} />
    </div>
  )
}