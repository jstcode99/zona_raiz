"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "sonner"
import { CreateListingInput, createListingSchema, defaultPropertyValues } from "@/application/validation/listing.validation"
import { keywordsOptions, ListingEntity, listingStatusOptions, listingTypeOptions } from "@/domain/entities/listing.entity"
import { Form } from "@/components/ui/form"
import { currencyOptions } from "@/domain/entities/currency.enums"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { createListingAction, updateListingAction } from "@/application/actions/listing.actions"
import { flatten } from "@/lib/utils"
import { Phone, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"


interface ListingFormProps {
  id?: string
  property_id?: string
  defaultValues?: Partial<CreateListingInput>
}

export function ListingForm({
  id,
  property_id,
  defaultValues = defaultPropertyValues,
}: ListingFormProps) {
  const { t } = useTranslation('common');

  const isUpdateMode = !!id

  const form = useForm<CreateListingInput>({
    resolver: yupResolver(createListingSchema) as any,
    defaultValues: defaultValues,
  })

  const { reset, setError, watch } = form

  const type = watch("listing_type")

  const mutation = useServerMutation<ListingEntity>({
    action: ((formData: FormData) => {
      if (isUpdateMode && id) {
        return updateListingAction(id, formData);
      }
      return createListingAction(formData);
    }) as any,
    setError,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(t(`forms.listing.${isUpdateMode ? "updated" : "created"}`))
        if (!isUpdateMode) reset()
      }
    },
    onError: (error) => {
      console.error("listing error:", error)
      toast.error(t("forms.listing.error"))
    },
  })

  useEffect(() => {
    if (isUpdateMode && defaultValues) {
      reset(defaultValues)
    }
    if (property_id) {
      reset((prev) => ({
        ...prev,
        property_id,
      }))
    }
  }, [id, defaultValues, reset])

  async function handleSubmit(values: CreateListingInput) {
    try {
      const formData = new FormData();
      const data = flatten(values, "", formData);
      // Asegurar que keywords se envíe como JSON string
      if (values.keywords) {
        data.set("keywords", JSON.stringify(values.keywords));
      }
      mutation.action(data);
    } catch (error) {
      console.error(error)
      toast.error(t("forms.listing.error"))
    }
  }

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      className="space-y-3 max-w-5xl mx-auto"
    >
      <Form.Set legend={t("forms.real-estate.basic-info")} className="my-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Form.Select
            name="listing_type"
            label={t("forms.listing.fields.listing_type.label")}
            options={listingTypeOptions}
          />

          <Form.Select
            name="status"
            label={t("forms.listing.fields.status.label")}
            options={listingStatusOptions}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Form.Input
            name="price"
            label={t("forms.listing.fields.price.label")}
            type="currency"
          />

          <Form.Select
            name="currency"
            label={t("forms.listing.fields.currency.label")}
            options={currencyOptions}
          />

          <Form.Input
            name="expenses_amount"
            label={t("forms.listing.fields.expenses_amount.label")}
            type="currency"
          />
        </div>
      </Form.Set>
      <Form.Set legend={t("forms.real-estate.basic-info")} className="my-3">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Form.Checkbox
            name="price_negotiable"
            label={t("forms.listing.fields.price_negotiable.label")}
          />
          <Form.Checkbox
            name="expenses_included"
            label={t("forms.listing.fields.expenses_included.label")}
          />
          <Form.Checkbox
            name="featured"
            label={
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                {t("forms.listing.fields.featured.label")}
              </span>
            }
          />
        </div>
      </Form.Set>
      <Form.Set legend={t("forms.real-estate.basic-info")} className="my-3">
        <Form.Input
          name="meta_title"
          label={t("forms.listing.fields.meta_title.label")}
        />

        <Form.Textarea
          name="meta_description"
          label={t("forms.listing.fields.meta_description.label")}
          rows={4}
        />

        <Form.Combobox
          name="keywords"
          label={t("forms.listing.fields.keywords.label")}
          multiple
          options={keywordsOptions}
          placeholder="Agregar keyword"
        />
      </Form.Set>
      <Form.Set legend={t("forms.real-estate.basic-info")} className="my-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Form.Url
            name="virtual_tour_url"
            label={t("forms.listing.fields.virtual_tour_url.label")}
          />

          <Form.Url
            name="video_url"
            label={t("forms.listing.fields.video_url.label")}
          />
        </div>
      </Form.Set>
      <Form.Set legend={t("forms.real-estate.basic-info")} className="my-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Form.Date
            name="available_from"
            label={t("forms.listing.fields.available_from.label")}
            fromYear={1950}
            toYear={2050}
          />

          <Form.Input
            className={type === "rent" ? "" : "pointer-events-none opacity-50"}
            name="minimum_contract_duration"
            label={t("forms.listing.fields.minimum_contract_duration.label")}
            type="number"
          />

          <Form.Phone
            name="whatsapp_contact"
            label={
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t("forms.listing.fields.whatsapp_contact.label")}
              </span>
            }
          />
        </div>
      </Form.Set>
      <Button
        type="submit"
        className="w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? t("words.saving")
          : isUpdateMode
            ? t("forms.listing.update")
            : t("forms.listing.create")}
      </Button>
    </Form>
  )
}