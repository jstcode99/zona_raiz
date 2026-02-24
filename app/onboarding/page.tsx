import { OnboardingWrapper } from "@/features/onboarding/onboarding-wrapper"
import { getOnboardingState } from "@/services/onboarding.services"
import { getCurrentUser } from "@/services/session.services"

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  const state = await getOnboardingState(user?.id ?? '')

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <OnboardingWrapper initialState={state} />
    </div>
  )
}