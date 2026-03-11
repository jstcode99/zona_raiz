"use client"

import { Loader2 } from "lucide-react"
import { RealEstateSelector } from "../real-states/real-estate-selector"
import { useTranslation } from "react-i18next"
import { RealEstateRegisterPrompt } from "@/features/real-states/real-estate-register-prompt"
import { OnboardingState } from "@/domain/services/onboarding.service"
import { redirect } from "next/navigation"

interface Props {
  initialState: OnboardingState
}

export function OnboardingWrapper({ initialState }: Props) {
  const { t } = useTranslation('pages')

  // Estado inicial determina qué mostrar
  if (initialState.step === "loading") {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("pages.post-login.loading")}</p>
      </div>
    )
  }

  if (initialState.step === "select-real-estate") {
    return (
      <RealEstateSelector
        realEstates={initialState.realEstates}
      />
    )
  }

  if (initialState.step === "redirect") {
    return redirect(initialState.path)
  }

  if (initialState.step === "register-real-estate") {
    return (
      <RealEstateRegisterPrompt onSkip={() => redirect('/')} />
    )
  }

  return null
}