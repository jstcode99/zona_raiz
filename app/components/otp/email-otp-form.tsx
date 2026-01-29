"use client"

import { Button } from "@/app/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/components/ui/field"
import { cn } from "@/utils/utils"
import { Controller, useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { emailOTP } from "@/types/entities/emailOTP"
import { ComponentProps, useState } from "react"
import i18next from "i18next"
import { useApiMutation } from "@/lib/api/useApiMutation"
import { $api } from "@/lib/api/client"
import { ApiPaths } from "@/types/api/schema"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"
import { Input } from "../ui/input"
import { typeOTP } from "./otp-form"


interface Props {
  type: typeOTP,
  onOTPGenerated: (email: string) => void
}

export function EmailOTPForm({
  className,
  ...props
}: ComponentProps<"form"> & Props) {

  const [error, setError] = useState<string | null>(null)

  const form = useForm<yup.InferType<typeof emailOTP>>({
    resolver: yupResolver(emailOTP),
    defaultValues: {
      email: '',
      type: props.type
    }
  })

  const generateOTP = useApiMutation(
    () => $api.useMutation('post', ApiPaths.generateOTP),
    {
      setFormError: form.setError,
      onSuccess: () => {
        toast.info(i18next.t('forms.otp.send-verification-email'))
        props.onOTPGenerated(form.getValues('email') || '')
      },
    },
  )

  return (
    <form
      className={cn("flex flex-col gap-6 p-6 md:p-8", className)}
      onSubmit={form.handleSubmit((data) => generateOTP.mutate({ body: data }))}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{i18next.t('forms.otp.title')}</h1>
          {error && <p className='text-red-500'>{error}</p>}
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
        <Field>
          <Button
            type="submit"
            disabled={generateOTP.isPending}
          >
            {i18next.t('word.generate')}
            {generateOTP.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
