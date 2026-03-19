"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { ProfileInput, profileSchema } from "@/application/validation/profile.validation"
import { updateProfileAction } from "@/application/actions/profile.actions"

interface ProfileFormProps extends ComponentProps<"form"> {
  defaultValues: ProfileInput
}

export function ProfileForm({
  className,
  defaultValues,
  ...props
}: ProfileFormProps) {
  const { t } = useTranslation('profile')

  const form = useForm<ProfileInput>({
    resolver: yupResolver(profileSchema),
    defaultValues: defaultValues,
    mode: "onBlur",
  })

  const {
    reset,
    formState: { isSubmitting, isDirty }
  } = form

  const mutation = useServerMutation({
    action: updateProfileAction,
    setError: form.setError,
    onSuccess: () => {
      toast.success(t('messages.success'))
      reset(form.getValues())
    },
    onError: (error) => {
      console.error("Profile update error:", error)
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

  const onSubmit = async (values: ProfileInput) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    mutation.action(formData)
  }

  const isLoading = isSubmitting || mutation.isPending

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 max-w-xl mx-auto space-y-8", className)}
      onSubmit={onSubmit}
    >
      <Form.Set className="space-y-4">
        <Form.Input
          name="full_name"
          label={t('labels.full_name')}
          autoComplete="name"
          disabled={isLoading}
        />

        <Form.Phone
          name="phone"
          label={t('labels.phone')}
        />

        <Field className="pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isDirty}
          >
            {isLoading && <Spinner data-icon="inline-start" className="mr-2 h-4 w-4" />}
            {t('actions.save_changes')}
          </Button>
        </Field>
      </Form.Set>
    </Form>
  )
}