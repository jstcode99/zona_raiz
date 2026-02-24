import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { RealEstateRegistrationForm } from "@/features/real-states/real-estate-register-form"
import { getOnboardingState } from "@/services/onboarding.services"
import { getCurrentUser } from "@/services/session.services"

export default async function RegisterRealEstatePage() {
  const user = await getCurrentUser();
  const state = await getOnboardingState(user?.id ?? '')

  if (state.step === "redirect") {
    redirect(state.path)
  }

  if (state.step === "select-real-estate") {
    redirect("/onboarding")
  }

  if (state.step === "loading") {
    redirect("/onboarding")
  }


  // Ahora TypeScript sabe que state.step === "register-real-estate"
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-lg space-y-4">
        <Button variant="ghost" asChild className="self-start">
          <Link href="/onboarding">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <RealEstateRegistrationForm />
      </div>
    </div>
  )
}