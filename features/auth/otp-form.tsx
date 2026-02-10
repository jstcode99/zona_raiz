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
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect } from "react"
import i18next from "i18next"
import { Input } from "../ui/input"
import { signInOtpSchema } from "@/domain/entities/schemas/signInOTP"
import { toast } from "sonner"
import { useActionMutation } from "@/shared/actions/use-action-mutation"
import { signInOTPAction } from "@/actions/auth.actions"
import { Spinner } from "../ui/spinner"
import Link from "next/link"

export function OTPForm({
  className,
  ...props
}: ComponentProps<"form">) {

  const form = useForm<yup.InferType<typeof signInOtpSchema>>({
    resolver: yupResolver(signInOtpSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    }
  })

  const mutation = useActionMutation(signInOTPAction)

  useEffect(() => {
    if (!mutation.isPending) {
      form.reset()
    }
    if (mutation.isSuccess) {
      toast.success(i18next.t('forms.otp.send-verification-email'))
    }
  }, [mutation.isPending])

  return (
    <form
      className={cn("p-6 md:p-8", className)}
      onSubmit={form.handleSubmit(v => mutation.submit(v, { setError: form.setError }))}
      {...props}
    >
      <FieldGroup className="gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{i18next.t('forms.otp.title')}</h1>
        </div>
        <Controller
          name="email"
          control={form.control}
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
            disabled={mutation.isPending}
          >
            {i18next.t('words.request')}
            {mutation.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
