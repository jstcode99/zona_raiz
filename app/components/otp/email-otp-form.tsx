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
import { emailOTP } from "@/types/schemas/emailOTP"
import { ComponentProps } from "react"
import i18next from "i18next"
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

  const form = useForm<yup.InferType<typeof emailOTP>>({
    resolver: yupResolver(emailOTP),
    mode: 'onBlur',
    defaultValues: {
      email: '' as string,
      type: props.type
    }
  })

  const onSubmit = async (payload: any) => {
    try {
    } catch (error) {
    }
  }


  return (
    <form
      className={cn("flex flex-col gap-6 p-6 md:p-8", className)}
      onSubmit={form.handleSubmit((payload) => onSubmit(payload))}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
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
        <Field>
          <Button
            type="submit"
          >
            {i18next.t('word.generate')}
            {/* {true && <Spinner data-icon="inline-start" />} */}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
