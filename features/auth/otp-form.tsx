"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from "@/utils/utils"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect } from "react"
import i18next from "i18next"
import { Input } from "@/components/ui/input"
import { otpSchema } from "@/domain/entities/schemas/OTP"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { otpAction } from "@/application/actions/otpAction"
import { useFormStatus } from "react-dom"

export function OTPForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const { pending } = useFormStatus()

  const {
    setError,
    control,
    reset
  } = useForm({
    resolver: yupResolver(otpSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
    shouldUnregister: false,
  })

  const mutation = useServerMutation({
    action: otpAction,
    initialState: { success: false },
    setError,
    onSuccess: () => toast.success(i18next.t('forms.otp.success')),
  })


  useEffect(() => {
    if (!mutation.isPending) {
      reset()
    }
  }, [mutation.isPending])

  return (
    <form
      className={cn("p-6 md:p-8", className)}
      {...props}
      action={mutation.action}
    >
      <FieldGroup className="gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{i18next.t('forms.otp.title')}</h1>
        </div>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-email">
                {i18next.t('forms.sign-in.fields.email.label')}
              </FieldLabel>
              <Input
                id="form-email"
                aria-invalid={fieldState.invalid}
                placeholder="m@example.com"
                autoComplete="on"
                {...field}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Link
          href="sign-in"
          className="ml-auto text-right text-sm underline-offset-2 hover:underline"
        >
          {i18next.t('forms.otp.alternatives.bacic')}
        </Link>
        <Field>
          <Button
            type='submit'
            className='w-full'
            disabled={pending || mutation.isPending}
          >
            {i18next.t('forms.otp.submit')}
            {pending || mutation.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
