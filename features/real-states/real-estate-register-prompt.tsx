"use client"

import { useTransition } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { useRoutes } from "@/i18n/client-router"

interface Props {
  onSkip: () => void
}

export function RealEstateRegisterPrompt({ onSkip }: Props) {
  const { t } = useTranslation('real-estates')
  const routes = useRoutes()

  const [isPending, startTransition] = useTransition()

  const handleSkip = () => {
    startTransition(async () => {
      await onSkip()
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{t("titles.onboarding")}</CardTitle>
        <CardDescription>
          {t("subtitles.onboarding")}
        </CardDescription>
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
        <Button
          variant="ghost"
          className="w-full"
          onClick={handleSkip}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {t("words.back_home")}
        </Button>
      </CardFooter>
    </Card>
  )
}