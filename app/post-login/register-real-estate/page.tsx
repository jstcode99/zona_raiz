import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getPostLoginState } from "@/application/actions/postLoginActions"
import { RealEstateRegistrationForm } from "@/features/real-states/real-estate-register-form"

export default async function RegisterRealEstatePage() {
  const state = await getPostLoginState()

  // Type guard para narrowing
  if (state.step === "redirect") {
    redirect(state.url)
  }

  if (state.step === "select-real-estate") {
    redirect("/post-login")
  }

  if (state.step === "loading") {
    redirect("/post-login")
  }

  
  // Ahora TypeScript sabe que state.step === "register-real-estate"
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-lg space-y-4">
        <Button variant="ghost" asChild className="self-start">
          <Link href="/post-login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <RealEstateRegistrationForm />
      </div>
    </div>
  )
}