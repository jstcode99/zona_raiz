"use client"
import { ComponentProps, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { flatten, cn } from "@/lib/utils"
import { defaultRealEstateValues, RealEstateInput, realEstateSchema } from "@/application/validation/real-estate.validation"
import { createRealEstateAction, updateRealEstateAction } from "@/application/actions/real-estate.actions"
import countries from '@/lib/countries.json'

interface RealEstateFormProps extends ComponentProps<"form"> {
  defaultValues?: RealEstateInput
  id?: string
}

export function RealEstateForm({
  className,
  defaultValues,
  id,
}: RealEstateFormProps) {
  const { t } = useTranslation('common')
  const isUpdateMode = Boolean(id)

  const form = useForm<RealEstateInput>({
    resolver: yupResolver(realEstateSchema) as any,
    defaultValues: defaultValues || defaultRealEstateValues,
    mode: "onBlur",
  })

  const {
    reset,
    control,
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

  const onSubmit = async (values: RealEstateInput) => {
    const formData = new FormData()

    const data = flatten(values, '', formData)
    if (id) data.append("id", id)
    mutation.action(data)
  }

  const isLoading = isSubmitting || mutation.isPending

  return (
    <Form
      form={form}
      className={cn("p-4 mx-auto space-y-4", className)}
      onSubmit={onSubmit}
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