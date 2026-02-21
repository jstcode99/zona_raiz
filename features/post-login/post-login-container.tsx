"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { PostLoginState, selectRealEstate, skipRealEstateRegistration } from "@/application/actions/postLoginActions"
import { RealEstateSelector } from "../real-states/real-estate-selector"
import { RealEstateRegisterPrompt } from "@/post-login/real-estate-register-prompt/page"
import i18next from "i18next"

interface Props {
  initialState: PostLoginState
}

export function PostLoginContainer({ initialState }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSelectRealEstate = (realEstateId: string) => {
    startTransition(async () => {
      try {
        await selectRealEstate(realEstateId)
        // No necesitas router.push porque selectRealEstate hace redirect
      } catch (error) {
        toast.error(i18next.t("pages.post-login.select-error"))
      }
    })
  }

  const handleSkipRegistration = () => {
    startTransition(async () => {
      try {
        await skipRealEstateRegistration()
      } catch (error) {
        toast.error(i18next.t("pages.post-login.skip"))
      }
    })
  }

  // Estado inicial determina qué mostrar
  if (initialState.step === "loading" || isPending) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{i18next.t("pages.post-login.loading")}</p>
      </div>
    )
  }

  if (initialState.step === "select-real-estate") {
    return (
      <RealEstateSelector 
        realEstates={initialState.realEstates}
        onSelect={handleSelectRealEstate}
        isPending={isPending}
      />
    )
  }

  if (initialState.step === "register-real-estate") {
    return (
      <RealEstateRegisterPrompt 
        onSkip={handleSkipRegistration}
        isPending={isPending}
      />
    )
  }

  // Fallback - no debería llegar aquí
  return null
}