"use client"

import { useForm } from "react-hook-form"
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

export function RealEstateRegistrationForm() {
  const { t } = useTranslation()
  const router = useRouter()

  const form = useForm<RealEstateInput>({
    resolver: yupResolver(realEstateSchema),
    defaultValues: defaultRealEstateValues,
    mode: "onBlur",
  })

  const { control, setError, handleSubmit, reset, formState: { isSubmitting } } = form

  const mutation = useServerMutation({
    action: createRealEstateAction,
    setError,
    onSuccess: () => {
      toast.success(t("forms.real-estate.success"))
      reset()
      router.push("/dashboard")
    },
    onError: (error) => {
      console.error("Create real estate error:", error)
    },
  })

  const isLoading = isSubmitting || mutation.isPending

  const onSubmit = handleSubmit((values: RealEstateInput) => {
    const formData = new FormData()
    flatten(values, '', formData)
    mutation.action(formData)
  })


  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">
          {t("forms.real-estate.title")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("forms.real-estate.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <Form.Set legend={t("forms.real-estate.basic-info")}>
            <Form.Input
              name="name"
              label={t("forms.real-estate.fields.name.label")}
              placeholder={t("forms.real-estate.fields.name.placeholder")}
              disabled={isLoading}
            />
            <Form.Textarea
              name="description"
              label={t("forms.real-estate.fields.description.label")}
              placeholder={t("forms.real-estate.fields.description.placeholder")}
              disabled={isLoading}
            />
            <Form.Phone
              name="whatsapp"
              label={t("forms.real-estate.fields.whatsapp.label")}
              placeholder={t("forms.real-estate.fields.whatsapp.placeholder")}
            />
            <Form.CountryStateCity
              countryName="country"
              stateName="state"
              cityName="city"
              countries={countries}
              control={control}
              label={t("forms.real-estate.fields.address.label")}
            />
            <Form.Input
              name="postal_code"
              label={t("forms.real-estate.fields.postal_code.label")}
              placeholder={t("forms.real-estate.fields.postal_code.placeholder")}
              disabled={isLoading}
            />
            <Form.Input
              name="street"
              label={t("forms.real-estate.fields.street.label")}
              placeholder={t("forms.real-estate.fields.street.placeholder")}
              disabled={isLoading}
            />
          </Form.Set>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            {t("forms.real-estate.create")}
          </Button>
        </Form>
      </CardContent>
    </Card>
  )
}