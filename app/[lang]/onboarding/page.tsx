import { onboardingModule } from "@/application/modules/onboarding.module"
import { OnboardingWrapper } from "@/features/onboarding/onboarding-wrapper"

export default async function OnboardingPage() {
  const { onboardingService } = await onboardingModule()
  const state = await onboardingService.getOnboardingState()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <OnboardingWrapper initialState={state} />
    </div>
  )
}