"use client"

import { ComponentProps, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import {
  createRealEstateSchema,
  defaultRealEstateValues,
  updateRealEstateSchema,
  type CreateRealEstateFormValues,
  type UpdateRealEstateFormValues
} from "@/domain/entities/schemas/realEstateSchema"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { flatten, cn } from "@/lib/utils"
import { createRealEstateAction, updateRealEstateAction } from "@/application/actions/realStateActions"

interface RealEstateFormProps extends ComponentProps<"form"> {
  defaultValues?: CreateRealEstateFormValues | UpdateRealEstateFormValues
  id?: string
}

export function RealEstateForm({
  className,
  defaultValues,
  id,
  ...props
}: RealEstateFormProps) {
  const { t } = useTranslation()
  const isUpdateMode = Boolean(id)

  const form = useForm<CreateRealEstateFormValues | UpdateRealEstateFormValues>({
    resolver: yupResolver(isUpdateMode ? updateRealEstateSchema : createRealEstateSchema),
    defaultValues: defaultValues || defaultRealEstateValues,
    mode: "onBlur",
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty }
  } = form


  const mutation = useServerMutation({
    action: isUpdateMode ? updateRealEstateAction : createRealEstateAction,
    setError: form.setError,
    onSuccess: () => {
      toast.success(t(`forms.real-estate.${isUpdateMode ? 'updated' : 'created'}`))
      if (!isUpdateMode) reset()
    },
    onError: (error) => {
      console.error("Real estate error:", error)
      toast.error(t("forms.real-estate.error"))
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
    mutation.action(data)
  })

  const isLoading = isSubmitting || mutation.isPending

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 mx-auto space-y-8", className)}
      onSubmit={onSubmit}
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