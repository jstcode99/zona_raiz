"use client"

import { ComponentProps, startTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFormStatus } from "react-dom"
import i18next from "i18next"
import { toast } from "sonner"

import {
  propertySchema,
  defaultPropertyValues,
  type PropertyFormData
} from "@/domain/entities/schemas/property"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { createPropertyAction } from "@/application/actions/createPropertyAction"
import { cn } from "@/lib/utils"
import { updatePropertyAction } from "@/application/actions/updatePropertyAction"

export function PropertyForm({
  className,
  defaultValues,
  id,
  ...props
}: ComponentProps<"form"> & {
  defaultValues?: PropertyFormData
  id?:string
}) {
  const { pending } = useFormStatus()
  const t = i18next.t

  const form = useForm<PropertyFormData>({
    resolver: yupResolver(propertySchema),
    defaultValues: defaultValues ?? defaultPropertyValues,
    shouldUnregister: false,
  })

  const { setError, setValue } = form



  const create = useServerMutation({
    action: createPropertyAction,
    initialState: { success: false },
    setError,
    onSuccess: () => {
      toast.success(t("forms.property.success"))
    },
  })

  const update = useServerMutation({
    action: updatePropertyAction,
    initialState: { success: false },
    setError,
    onSuccess: () => {
      toast.success(t("forms.property.success"))
    },
  })

  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as keyof PropertyFormData, value)
      })
    }
  }, [defaultValues, setValue])


  const onSubmit = (values: PropertyFormData) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""))
    })

    startTransition(() => {
      if (id?.trim()) {
        formData.append('id', String(id ?? ""))
        update.action(formData)
      } else { 
        create.action(formData)
      }
    })
  }

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 max-w-4xl mx-auto space-y-8", className)}
      onSubmit={onSubmit}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          {t("forms.property.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("forms.property.subtitle")}
        </p>
      </div>
      {/* Ubicación */}
      <Form.Set legend="Ubicación">
        <Form.Input
          name="address"
          label={t("forms.property.fields.address.label")}
          placeholder={t("forms.property.fields.address.placeholder")}
        />

        <Form.Input
          name="neighborhood"
          label={t("forms.property.fields.neighborhood.label")}
          placeholder={t("forms.property.fields.neighborhood.placeholder")}
        />

        <Form.Input
          name="city"
          label={t("forms.property.fields.city.label")}
          placeholder={t("forms.property.fields.city.placeholder")}
        />

        <Form.Input
          name="state"
          label={t("forms.property.fields.state.label")}
          placeholder={t("forms.property.fields.state.placeholder")}
        />

        <Form.Input
          name="country"
          label={t("forms.property.fields.country.label")}
          placeholder={t("forms.property.fields.country.placeholder")}
        />

        <Form.Input
          name="latitude"
          type="number"
          label={t("forms.property.fields.latitude.label")}
          placeholder={t("forms.property.fields.latitude.placeholder")}
        />

        <Form.Input
          name="longitude"
          type="number"
          label={t("forms.property.fields.longitude.label")}
          placeholder={t("forms.property.fields.longitude.placeholder")}
        />

        <Form.Input
          name="google_maps_url"
          label={t("forms.property.fields.google_maps_url.label")}
          placeholder={t("forms.property.fields.google_maps_url.placeholder")}
        />
      </Form.Set>

      {/* Características */}
      <Form.Set legend="Características">
        <Form.Input
          name="bedrooms"
          type="number"
          label={t("forms.property.fields.bedrooms.label")}
          placeholder={t("forms.property.fields.bedrooms.placeholder")}
        />

        <Form.Input
          name="bathrooms"
          type="number"
          label={t("forms.property.fields.bathrooms.label")}
          placeholder={t("forms.property.fields.bathrooms.placeholder")}
        />

        <Form.Input
          name="area_m2"
          type="number"
          label={t("forms.property.fields.area_m2.label")}
          placeholder={t("forms.property.fields.area_m2.placeholder")}
        />
      </Form.Set>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={pending || update.isPending || create.isPending }
        >
          {t("forms.property.submit")}
          {(pending || update.isPending || create.isPending) && (
            <Spinner data-icon="inline-start" />
          )}
        </Button>
      </div>
    </Form>
  )
}
