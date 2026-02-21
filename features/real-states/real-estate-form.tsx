"use client"

import { ComponentProps, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import {
  createRealEstateSchema,
  defaultRealEstateValues,
  type CreateRealEstateFormValues,
} from "@/domain/entities/schemas/realEstateSchema"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { flatten, cn } from "@/lib/utils"
import { createRealEstateAction, updateRealEstateAction } from "@/application/actions/realStateActions"

interface RealEstateFormProps extends ComponentProps<"form"> {
  defaultValues?: CreateRealEstateFormValues
  id?: string
}

export function RealEstateForm({
  className,
  defaultValues,
  id,
  ...props
}: RealEstateFormProps) {
  const { t } = useTranslation()

  const form = useForm<CreateRealEstateFormValues>({
    resolver: yupResolver(createRealEstateSchema),
    defaultValues: defaultRealEstateValues,
    mode: "onBlur",
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty }
  } = form

  const mutation = useServerMutation({
    action: id ? updateRealEstateAction : createRealEstateAction,
    initialState: { success: false },
    setError: form.setError,
    onSuccess: () => {
      toast.success(t("forms.real-estate.success"))
      if (!id) reset() // Limpiar solo en create
    },
    onError: (error) => {
      console.error("Real estate error:", error)
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData()

    const data = flatten(values, '', formData)
    if (id) data.append("id", id)
    console.log(data);
    mutation.action(data)
  })

  const isLoading = isSubmitting || mutation.isPending

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 max-w-3xl mx-auto space-y-8", className)}
      onSubmit={onSubmit}
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          {t("forms.real-estate.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("forms.real-estate.subtitle")}
        </p>
      </div>

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

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !isDirty}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
        {id ? t("forms.real-estate.update") : t("forms.real-estate.create")}
      </Button>
    </Form>
  )
}