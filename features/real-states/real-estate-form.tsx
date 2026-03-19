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
  const { t } = useTranslation('real-estates')
  const isUpdateMode = Boolean(id)

  const form = useForm<RealEstateInput>({
    resolver: yupResolver(realEstateSchema),
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
      toast.success(t(`messages.${isUpdateMode ? 'updated' : 'created'}`))
      if (!isUpdateMode) reset()
    },
    onError: (error) => {
      console.error("Real estate error:", error)
      toast.error(t("messages.error"))
    },
  })


  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  useEffect(() => {
    const subscription = form.watch(() => {
      if (mutation.isError) mutation.reset()
    })
    return () => subscription.unsubscribe()
  }, [form, mutation])

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

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !isDirty}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
        {id ? t("actions.update") : t("actions.create")}
      </Button>
    </Form>
  )
}