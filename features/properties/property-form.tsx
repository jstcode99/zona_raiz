"use client"

import { ComponentProps, startTransition, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFormStatus } from "react-dom"
import i18next from "i18next"
import { toast } from "sonner"

import {
  propertySchema,
  defaultPropertyValues,
  type PropertyFormData,
  businessTypeOptions,
  statusOptions,
  currencyOptions,
} from "@/domain/entities/schemas/property"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { createPropertyAction } from "@/application/actions/createPropertyAction"
import { cn, slugify } from "@/lib/utils"
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

  const { watch, setError, setValue } = form

  const slugEditedRef = useRef(false)

  const title = watch("title")

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

  useEffect(() => {
    if (!slugEditedRef.current && title) {
      form.setValue("slug", slugify(title), {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [title, form])

  const handleSlugFocus = () => {
    slugEditedRef.current = true
  }


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

      {/* Información básica */}
      <Form.Set legend="Información básica">
        <Form.Input
          name="title"
          label={t("forms.property.fields.title.label")}
          placeholder={t("forms.property.fields.title.placeholder")}
        />

        <Form.Input
          name="slug"
          label={t("forms.property.fields.slug.label")}
          placeholder={t("forms.property.fields.slug.placeholder")}
          onFocus={handleSlugFocus}
        />

        <Form.Textarea
          name="description"
          label={t("forms.property.fields.description.label")}
          placeholder={t("forms.property.fields.description.placeholder")}
        />

        <Form.Select
          name="business_type"
          label={t("forms.property.fields.business_type.label")}
          placeholder={t("forms.property.fields.business_type.placeholder")}
          options={[...businessTypeOptions]}
        />

        <Form.Select
          name="status"
          label={t("forms.property.fields.status.label")}
          placeholder={t("forms.property.fields.status.placeholder")}
          options={[...statusOptions]}
        />
      </Form.Set>

      {/* SEO */}
      <Form.Set legend="SEO">
        <Form.Input
          name="meta_title"
          label={t("forms.property.fields.meta_title.label")}
          placeholder={t("forms.property.fields.meta_title.placeholder")}
        />

        <Form.Textarea
          name="meta_description"
          label={t("forms.property.fields.meta_description.label")}
          placeholder={t("forms.property.fields.meta_description.placeholder")}
        />
      </Form.Set>

      {/* Precio */}
      <Form.Set legend="Precio">
        <Form.Input
          name="price"
          type="number"
          label={t("forms.property.fields.price.label")}
          placeholder={t("forms.property.fields.price.placeholder")}
        />

        <Form.Select
          name="currency"
          label={t("forms.property.fields.currency.label")}
          placeholder={t("forms.property.fields.currency.placeholder")}
          options={[...currencyOptions]}
        />
      </Form.Set>

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

      {/* Contacto */}
      <Form.Set legend="Contacto">
        <Form.Input
          name="whatsapp_contact"
          label={t("forms.property.fields.whatsapp_contact.label")}
          placeholder={t("forms.property.fields.whatsapp_contact.placeholder")}
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
