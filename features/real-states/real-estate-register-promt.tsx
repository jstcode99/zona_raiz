"use client"

import { useTransition } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

interface Props {
  onSkip: () => void
  isPending: boolean
}

export function RealEstateRegisterPrompt({ onSkip, isPending }: Props) {
  const { t } = useTranslation()
  const [isSkipping, startSkipping] = useTransition()

  const handleSkip = () => {
    startSkipping(() => {
      onSkip()
    })
  }

  const showSkipLoader = isPending || isSkipping

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{t("postLogin.noRealEstateTitle")}</CardTitle>
        <CardDescription>
          {t("postLogin.noRealEstateDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full" size="lg">
          <Link href="/post-login/register-real-estate">
            <Plus className="mr-2 h-4 w-4" />
            {t("postLogin.createRealEstate")}
          </Link>
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t("common.or")}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={handleSkip}
          disabled={showSkipLoader}
        >
          {showSkipLoader ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {t("postLogin.continueAsClient")}
        </Button>
      </CardFooter>
    </Card>
  )
}