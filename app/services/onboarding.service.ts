import { SupabaseProfileAdapter } from "@/domain/adapters/supabase/supabase-profile.adapter";
import { SupabaseSessionAdapter } from "@/domain/adapters/supabase/supabase-session.adapter";
import { GetStateOnboarding, OnboardingState } from "@/domain/use-cases/get-state-onboarding.case";

export async function getOnboardingState(userId: string): Promise<OnboardingState> {
    const useCase = new GetStateOnboarding(
        new SupabaseProfileAdapter(),
        new SupabaseSessionAdapter(),
    );
    return useCase.execute(userId);
}