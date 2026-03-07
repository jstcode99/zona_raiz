import { OnboardingWrapper } from "@/features/onboarding/onboarding-wrapper"
import { getOnboardingState } from "@/services/onboarding.services"

export default async function OnboardingPage() {
  const state = await getOnboardingState()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <OnboardingWrapper initialState={state} />
    </div>
  )
}