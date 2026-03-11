import { OnboardingWrapper } from "@/features/onboarding/onboarding-wrapper"
import { createOnboardingService } from "@/application/containers/onboarding-service.container"

export default async function OnboardingPage() {
  const onboardingService = await OnboardingService()
  const state = await onboardingService.getOnboardingState()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <OnboardingWrapper initialState={state} />
    </div>
  )
}