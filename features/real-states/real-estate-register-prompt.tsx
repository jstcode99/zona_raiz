"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/client-router";

export function RealEstateRegisterPrompt() {
  const { t } = useTranslation("real-estates");
  const routes = useRoutes();

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{t("titles.onboarding")}</CardTitle>
        <CardDescription>{t("subtitles.onboarding")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full" size="lg">
          <Link href={routes.onboardingReaEstate()}>
            <Plus className="mr-2 h-4 w-4" />
            {t("actions.create")}
          </Link>
        </Button>
      </CardContent>
      <CardFooter>
        <Link href={`${routes.home()}`}>
          <Button variant="ghost" className="w-full">
            <ArrowRight className="mr-2 h-4 w-4" />
            {t("words.back_home")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
