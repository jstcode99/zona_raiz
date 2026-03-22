import { appModule } from "@/application/modules/app.module";
import { OnboardingWrapper } from "@/features/onboarding/onboarding-wrapper";
import { Lang } from "@/i18n/settings";
import { cookies } from "next/headers";

interface props {
  params: Promise<{ lang: Lang }>;
}

export default async function page({ params }: props) {
  const { lang } = await params;
  const cookieStore = await cookies();
  const { onboardingService } = await appModule(lang, { cookies: cookieStore });

  const state = await onboardingService.getOnboardingState();

  return (
    <div className="flex items-center">
      <OnboardingWrapper initialState={state} />
    </div>
  );
}
