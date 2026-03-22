import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RealEstateRegistrationForm } from "@/features/real-states/real-estate-register-form";
import { Lang } from "@/i18n/settings";
import { createRouter } from "@/i18n/router";
import { cookies } from "next/headers";
import { appModule } from "@/application/modules/app.module";
import { Spinner } from "@/components/ui/spinner";

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

  if (state.step === "loading") {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <Button variant="ghost" asChild className="self-start">
          <Link href={routes.onboarding()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <RealEstateRegistrationForm />
      </div>
    </div>
  );
}
