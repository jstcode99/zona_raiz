"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import {
  createRealEstateSchema,
  defaultRealEstateValues,
  type CreateRealEstateFormValues,
} from "@/domain/entities/schemas/realEstateSchema"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Form } from "@/components/ui/form"
import { Building2 } from "lucide-react"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { createRealEstateAction } from "@/application/actions/realStateActions"
import { flatten } from "@/lib/utils"

export function RealEstateRegistrationForm() {
  const { t } = useTranslation()
  const router = useRouter()

  const form = useForm<CreateRealEstateFormValues>({
    resolver: yupResolver(createRealEstateSchema),
    defaultValues: defaultRealEstateValues,
    mode: "onBlur",
  })

  const { setError, handleSubmit, reset, formState: { isSubmitting } } = form

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

  const onSubmit = handleSubmit((values: CreateRealEstateFormValues) => {
    const formData = new FormData()
    flatten(values, '', formData)

    for (const [k, v] of formData.entries()) {
      console.log(`${k}:`, v)
    }

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
            <Form.Phone
              name="whatsapp"
              label={t("forms.real-estate.fields.whatsapp.label")}
              placeholder={t("forms.real-estate.fields.whatsapp.placeholder")}
            />
            <Form.Address
              name="address"
              label={t("forms.real-estate.fields.address.label")}
            />
            <Form.Textarea
              name="description"
              label={t("forms.real-estate.fields.description.label")}
              placeholder={t("forms.real-estate.fields.description.placeholder")}
              disabled={isLoading}
            />
            <Form.File
              name="logo"
              label={t("forms.real-estate.fields.logo.label")}
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