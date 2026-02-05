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
import { Spinner } from "../ui/spinner"
import { useActionMutation } from "@/shared/actions/use-action-mutation"
import { toast } from "sonner"
import { accountSchema } from "@/types/schemas/account"
import { AccountProfileDTO } from "@/modules/account/types/account.types"
import { updateAccountAction } from "@/actions/account.actions"


export function AccountForm({
  className,
  defaultValues,
  ...props
}: ComponentProps<"form"> & {
  defaultValues: AccountProfileDTO
}) {
  const form = useForm({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      name: '',
      last_name: '',
      phone: '',
    },
  })

  const mutation = useActionMutation(updateAccountAction)

  useEffect(() => {
    if (mutation.isError) {
      toast.error(i18next.t(mutation.error?.message || 'forms.sign-in.error'))
      console.log('Mutation Error:', mutation.error);
    }
  }, [mutation.isError])

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues])

  return (
    <form
      className="px-6"
      onSubmit={form.handleSubmit(v => mutation.submit(v, { setError: form.setError }))}
      {...props}
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
            disabled={mutation.isPending}
          >
            {i18next.t('words.save')}
            {mutation.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
