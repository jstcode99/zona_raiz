"use client";

import { RealEstateSelector } from "../real-states/real-estate-selector";
import { RealEstateRegisterPrompt } from "@/features/real-states/real-estate-register-prompt";
import { OnboardingState } from "@/domain/services/onboarding.service";
import { redirect, RedirectType } from "next/navigation";
import { PageLoader } from "../loader/page-loader";
interface Props {
  initialState: OnboardingState;
}

export function OnboardingWrapper({ initialState }: Props) {
  // Estado inicial determina qué mostrar
  if (initialState.step === "loading") {
    return <PageLoader />;
  }

  if (initialState.step === "select-real-estate") {
    return <RealEstateSelector realEstates={initialState.realEstates} />;
  }

  if (initialState.step === "redirect") {
    redirect(initialState.path, RedirectType.push);
  }

  if (initialState.step === "register-real-estate") {
    return <RealEstateRegisterPrompt onSkip={() => redirect("/")} />;
  }

  return <PageLoader />;
}
