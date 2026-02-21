"use client"

import { useTransition } from "react"
import { useTranslation } from "react-i18next"
import { RealEstateWithRole } from "@/domain/entities/RealEstate"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Loader2, ArrowRight } from "lucide-react"

interface Props {
  realEstates: RealEstateWithRole[]
  onSelect: (realEstateId: string) => void
  isPending: boolean
}

export function RealEstateSelector({ realEstates, onSelect, isPending }: Props) {
  const { t } = useTranslation()
  const [selectingId, startSelecting] = useTransition()

  const handleSelect = (id: string) => {
    startSelecting(() => {
      onSelect(id)
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "default"
      case "coordinator": return "secondary"
      case "agent": return "outline"
      default: return "outline"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{t("pages.post-login-selection.title")}</CardTitle>
        <CardDescription>
          {t("pages.post-login-selection.subtitle", { count: realEstates.length })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {realEstates.map(({ real_estate, role }) => (
          <Button
            key={real_estate.id}
            variant="outline"
            className="w-full h-auto p-4 justify-between text-left hover:border-primary"
            onClick={() => handleSelect(real_estate.id)}
            disabled={isPending || selectingId}
          >
            <div className="flex items-center gap-4">
              {real_estate.logo_url ? (
                <img
                  src={real_estate.logo_url}
                  alt={real_estate.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-semibold">{real_estate.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {real_estate.address || t("words.no-address")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getRoleBadgeVariant(role)}>
                {t(`roles.${role}`)}
              </Badge>
              {selectingId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}