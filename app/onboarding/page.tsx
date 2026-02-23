import { OnboardingWrapper } from "@/features/onboarding/onboarding-wrapper"
import { getOnboardingState } from "@/services/onboarding.service"
import { getCurrentUserCached } from "@/services/session.service"

export default async function OnboardingPage() {
  const user = await getCurrentUserCached();
  const state = await getOnboardingState(user?.id ?? '')

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <OnboardingWrapper initialState={state} />
    </div>
  )
}