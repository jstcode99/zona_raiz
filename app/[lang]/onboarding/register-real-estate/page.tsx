import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { RealEstateRegistrationForm } from "@/features/real-states/real-estate-register-form"
import { onboardingModule } from "@/application/modules/onboarding.module"
import { Lang } from "@/i18n/settings"
import { createRouter } from "@/i18n/router"

export default async function page({
  params
}: Readonly<{
  params: { lang: Lang }
}>) {
  const { lang } = await params;
  const { onboardingService } = await onboardingModule(lang)
  const state = await onboardingService.getOnboardingState()
  const routes = createRouter(lang)

  if (state.step === "redirect") {
    redirect(state.path)
  }

  if (state.step === "select-real-estate") {
    redirect(routes.onboarding())
  }

  if (state.step === "loading") {
    redirect(routes.onboarding())
  }


  // Ahora TypeScript sabe que state.step === "register-real-estate"
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-lg space-y-4">
        <Button variant="ghost" asChild className="self-start">
          <Link href={routes.onboarding()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <RealEstateRegistrationForm />
      </div>
    </div>
  )
}