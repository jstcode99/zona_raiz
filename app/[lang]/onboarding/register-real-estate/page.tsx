import { redirect } from "next/navigation";
import { RealEstateRegistrationForm } from "@/features/real-states/real-estate-register-form";
import { Lang } from "@/i18n/settings";
import { createRouter } from "@/i18n/router";
import { cookies } from "next/headers";
import { appModule } from "@/application/modules/app.module";
import BackButton from "@/components/ui/back-button";

interface props {
  params: Promise<{ lang: Lang }>;
}
export default async function page({ params }: props) {
  const { lang } = await params;
  const cookieStore = await cookies();
  const { onboardingService } = await appModule(lang, {
    cookies: cookieStore,
  });

  const state = await onboardingService.getOnboardingState();

  const routes = createRouter(lang);

  if (state.step === "redirect") {
    redirect(state.path);
  }

  if (state.step === "select-real-estate") {
    redirect(routes.onboarding());
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <BackButton />
        <RealEstateRegistrationForm />
      </div>
    </div>
  );
}
