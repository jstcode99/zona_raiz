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
  const { t } = useTranslation()

  const form = useForm<ProfileInput>({
    resolver: yupResolver(profileSchema),
    defaultValues: defaultValues,
    mode: "onBlur",
  })

  const { 
    handleSubmit, 
    reset, 
    formState: { isSubmitting, isDirty } 
  } = form

  const mutation = useServerMutation({
    action: updateProfileAction,
    setError: form.setError,
    onSuccess: () => {
      toast.success(t('forms.profile.success') || 'Profile updated successfully')
      reset(form.getValues()) // Reset dirty state
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

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData()
    
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    mutation.action(formData)
  })

  const isLoading = isSubmitting || mutation.isPending

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 max-w-xl mx-auto space-y-8", className)}
      onSubmit={onSubmit}
    >
      <FieldGroup className="space-y-4">
        <Form.Input 
          name="full_name" 
          label={t('forms.profile.fields.full_name.label') || 'Full Name'}
          autoComplete="name"
          disabled={isLoading}
        />
        
        <Form.Phone 
          name="phone" 
          label={t('forms.profile.fields.phone.label') || 'Phone'}
        />

        <Field className="pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isDirty}
          >
            {isLoading && <Spinner data-icon="inline-start" className="mr-2 h-4 w-4" />}
            {t('words.save') || 'Save'}
          </Button>
          
          {!isDirty && !isLoading && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              {t('forms.profile.noChanges') || 'No changes to save'}
            </p>
          )}
        </Field>
      </FieldGroup>
    </Form>
  )
}