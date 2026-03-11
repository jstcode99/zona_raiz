import { onboardingModule } from "@/application/modules/onboarding.module"
import { OnboardingWrapper } from "@/features/onboarding/onboarding-wrapper"
import { Lang } from "@/i18n/settings"

export default async function OnboardingPage({
  params
}: Readonly<{
  params: { lang: Lang }
}>) {
  const { lang } = await params;

  const { onboardingService } = await onboardingModule(lang)
  const state = await onboardingService.getOnboardingState()  

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <OnboardingWrapper initialState={state} />
    </div>
  )
}