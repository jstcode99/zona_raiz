"use client"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect } from "react"
import i18next from "i18next"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useFormStatus } from "react-dom"
import { profileSchema } from "@/domain/entities/schemas/profile"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { updateProfileAction } from "../../application/actions/updateProfileAction"


export function AccountForm({
  className,
  defaultValues,
  ...props
}: ComponentProps<"form"> & {
  defaultValues: {
    name: string
    last_name: string
    phone: string
  }
}) {

  const { pending } = useFormStatus()

  const {
    setError,
    control,
    reset
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      last_name: '',
      phone: '',
    },
    shouldUnregister: false,
  })

  const mutation = useServerMutation({
    action: updateProfileAction,
    initialState: { success: false },
    setError,
    onSuccess: () => toast.success('Perfil actualizado correctamente'),
  })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues])

  return (
    <form
      className="px-6"
      {...props}
      action={mutation.action}
    >
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-name">
                {i18next.t('forms.sign-up.fields.name.label')}
              </FieldLabel>
              <Input
                {...field}
                id="form-name"
                aria-invalid={fieldState.invalid}
                placeholder={i18next.t('forms.sign-up.fields.name.placeholder')}
                autoComplete="on"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="last_name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-last_name">
                {i18next.t('forms.sign-up.fields.last_name.label')}
              </FieldLabel>
              <Input
                {...field}
                id="form-last_name"
                aria-invalid={fieldState.invalid}
                placeholder={i18next.t('forms.sign-up.fields.last_name.placeholder')}
                autoComplete="on"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-phone">
                {i18next.t('forms.sign-up.fields.phone.label')}
              </FieldLabel>
              <Input
                {...field}
                type="tel"
                id="form-phone"
                maxLength={16}
                minLength={10}
                title={i18next.t('forms.sign-up.fields.phone.placeholder')}
                aria-invalid={fieldState.invalid}
                placeholder={i18next.t('forms.sign-up.fields.phone.placeholder')}
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Field>
          <Button
            type='submit'
            className='w-full'
            disabled={pending ||mutation.isPending}
          >
            {i18next.t('words.save')}
            {pending || mutation.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
