"use client"

import { ComponentProps, startTransition, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFormStatus } from "react-dom"
import i18next from "i18next"
import { toast } from "sonner"

import {
  realEstateSchema,
  defaultRealEstateValues,
  type RealEstateFormData,
} from "@/domain/entities/schemas/realEstate"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { createRealEstateAction } from "@/application/actions/createRealEstateAction"
import { updateRealEstateAction } from "@/application/actions/updateRealEstateAction"
import { cn, slugify } from "@/lib/utils"

export function RealEstateForm({
  className,
  defaultValues,
  id,
  ...props
}: ComponentProps<"form"> & {
  defaultValues?: RealEstateFormData
  id?: string
}) {
  const { pending } = useFormStatus()
  const t = i18next.t

  const form = useForm<RealEstateFormData>({
    resolver: yupResolver(realEstateSchema),
    defaultValues: defaultValues ?? defaultRealEstateValues,
    shouldUnregister: false,
  })

  const { watch, setError, setValue } = form
  const slugEditedRef = useRef(false)
  const name = watch("name")

  const create = useServerMutation({
    action: createRealEstateAction,
    initialState: { success: false },
    setError,
    onSuccess: () => toast.success(t("forms.realEstate.success")),
  })

  const update = useServerMutation({
    action: updateRealEstateAction,
    initialState: { success: false },
    setError,
    onSuccess: () => toast.success(t("forms.realEstate.success")),
  })

  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as keyof RealEstateFormData, value)
      })
    }
  }, [defaultValues, setValue])

  useEffect(() => {
    if (!slugEditedRef.current && name) {
      form.setValue("slug", slugify(name), {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [name, form])

  const handleSlugFocus = () => {
    slugEditedRef.current = true
  }

  const onSubmit = (values: RealEstateFormData) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""))
    })

    startTransition(() => {
      if (id?.trim()) {
        formData.append("id", String(id))
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
      className={cn("py-6 px-6 max-w-3xl mx-auto space-y-8", className)}
      onSubmit={onSubmit}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          {t("forms.realEstate.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("forms.realEstate.subtitle")}
        </p>
      </div>

      {/* Información básica */}
      <Form.Set legend="Información básica">
        <Form.Input
          name="name"
          label={t("forms.realEstate.fields.name.label")}
          placeholder={t("forms.realEstate.fields.name.placeholder")}
        />

        <Form.Input
          name="slug"
          label={t("forms.realEstate.fields.slug.label")}
          placeholder={t("forms.realEstate.fields.slug.placeholder")}
          onFocus={handleSlugFocus}
        />

        <Form.Input
          name="logo_url"
          label={t("forms.realEstate.fields.logo_url.label")}
          placeholder={t("forms.realEstate.fields.logo_url.placeholder")}
        />

        <Form.Textarea
          name="description"
          label={t("forms.realEstate.fields.description.label")}
          placeholder={t("forms.realEstate.fields.description.placeholder")}
        />
      </Form.Set>

      {/* Contacto */}
      <Form.Set legend="Contacto">
        <Form.Input
          name="phone"
          label={t("forms.realEstate.fields.phone.label")}
          placeholder={t("forms.realEstate.fields.phone.placeholder")}
        />

        <Form.Input
          name="whatsapp"
          label={t("forms.realEstate.fields.whatsapp.label")}
          placeholder={t("forms.realEstate.fields.whatsapp.placeholder")}
        />
      </Form.Set>

      {/* Ubicación */}
      <Form.Set legend="Ubicación">
        <Form.Input
          name="address"
          label={t("forms.realEstate.fields.address.label")}
          placeholder={t("forms.realEstate.fields.address.placeholder")}
        />

        <Form.Input
          name="city"
          label={t("forms.realEstate.fields.city.label")}
          placeholder={t("forms.realEstate.fields.city.placeholder")}
        />

        <Form.Input
          name="state"
          label={t("forms.realEstate.fields.state.label")}
          placeholder={t("forms.realEstate.fields.state.placeholder")}
        />

        <Form.Input
          name="country"
          label={t("forms.realEstate.fields.country.label")}
          placeholder={t("forms.realEstate.fields.country.placeholder")}
        />
      </Form.Set>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={pending || update.isPending || create.isPending}
        >
          {t("forms.realEstate.submit")}
          {(pending || update.isPending || create.isPending) && (
            <Spinner data-icon="inline-start" />
          )}
        </Button>
      </div>
    </Form>
  )
}
