import { createOnboardingModule } from "@/application/containers/onboarding.container";
import { OnboardingState } from "@/domain/use-cases/onboarding.cases";

export async function getOnboardingState(): Promise<OnboardingState> {
    const { useCases } = await createOnboardingModule()

    return useCases.getOnboardingState();
}