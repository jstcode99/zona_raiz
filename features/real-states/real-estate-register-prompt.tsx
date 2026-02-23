"use client"

import { useTransition } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import i18next from "i18next"

interface Props {
  onSkip: () => void
}

export function RealEstateRegisterPrompt({ onSkip }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleSkip = () => {
    startTransition(async () => {
      await onSkip()
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{i18next.t("pages.onboarding.title")}</CardTitle>
        <CardDescription>
          {i18next.t("pages.onboarding.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full" size="lg">
          <Link href="/onboarding/register-real-estate">
            <Plus className="mr-2 h-4 w-4" />
             {i18next.t("pages.onboarding.call-action")}
          </Link>
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              O
            </span>
          </div>
        </div>
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
          {i18next.t("pages.onboarding.call-home")}
        </Button>
      </CardFooter>
    </Card>
  )
}