"use client";

import { RealEstateSelector } from "../real-states/real-estate-selector";
import { RealEstateRegisterPrompt } from "@/features/real-states/real-estate-register-prompt";
import { OnboardingState } from "@/domain/services/onboarding.service";
import { useRouter } from "next/navigation";
import { PageLoader } from "../loader/page-loader";
import { useEffect } from "react";

interface Props {
  initialState: OnboardingState;
}

export function OnboardingWrapper({ initialState }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (initialState.step === "redirect") {
      router.push(initialState.path);
    }
  }, [initialState, router]);

  if (initialState.step === "redirect") {
    return <PageLoader />;
  }

  if (initialState.step === "select-real-estate") {
    return <RealEstateSelector realEstates={initialState.realEstates} />;
  }

  if (initialState.step === "register-real-estate") {
    return <RealEstateRegisterPrompt />;
  }

  return <PageLoader />;
}
