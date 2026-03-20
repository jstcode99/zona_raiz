"use client"

import { Resolver, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Form } from "@/components/ui/form"
import { Building2 } from "lucide-react"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { flatten } from "@/lib/utils"
import { defaultRealEstateValues, RealEstateInput, realEstateSchema } from "@/application/validation/real-estate.validation"
import { createRealEstateAction } from "@/application/actions/real-estate.actions"
import countries from '@/lib/countries.json'
import { useRoutes } from "@/i18n/client-router"

export function RealEstateRegistrationForm() {
  const { t } = useTranslation('real-estates')
  const router = useRouter()
  const routes = useRoutes()

  const form = useForm<RealEstateInput>({
    resolver: yupResolver(realEstateSchema) as Resolver<RealEstateInput>,
    defaultValues: defaultRealEstateValues,
    mode: "onBlur",
  })

  const { control, setError, reset, formState: { isSubmitting } } = form

  const mutation = useServerMutation({
    action: createRealEstateAction,
    setError,
    onSuccess: () => {
      toast.success(t("messages.created"))
      reset()
      router.push(routes.dashboard())
    },
    onError: (error) => {
      console.error("Create real estate error:", error)
    },
  })

  const isLoading = isSubmitting || mutation.isPending

  const onSubmit = async (values: RealEstateInput) => {
    const formData = new FormData()
    flatten(values, '', formData)
    mutation.action(formData)
  }


  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <Form.Set legend={t("sections.basic_info")}>
            <Form.Input
              name="name"
              label={t("labels.name")}
              placeholder={t("placeholders.name")}
              disabled={isLoading}
            />
            <Form.Textarea
              name="description"
              label={t("labels.description")}
              placeholder={t("placeholders.description")}
              disabled={isLoading}
            />
            <Form.Phone
              name="whatsapp"
              label={t("labels.whatsapp")}
              placeholder={t("placeholders.whatsapp")}
            />
            <Form.CountryStateCity
              countryName="country"
              stateName="state"
              cityName="city"
              countries={countries}
              control={control}
              label={t("labels.address")}
            />
            <Form.Input
              name="postal_code"
              label={t("labels.postal_code")}
              placeholder={t("placeholders.postal_code")}
              disabled={isLoading}
            />
            <Form.Input
              name="street"
              label={t("labels.street")}
              placeholder={t("placeholders.street")}
              disabled={isLoading}
            />
          </Form.Set>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            {t("actions.create")}
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}