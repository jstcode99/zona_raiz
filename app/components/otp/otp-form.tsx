"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { cn } from "@/utils/utils"
import { Controller, useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect } from "react"
import i18next from "i18next"
import { useRouter } from 'next/navigation'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { verifyOTP } from "@/types/schemas/verifyOTP"

export enum typeOTP {
  AUTH = 'auth',
  VERIFY = 'verify'
}

interface Props {
  email: string
  type: typeOTP
}

export function OTPForm({
  className,
  ...props
}: ComponentProps<"form"> & Props) {

  const router = useRouter()

  const form = useForm<yup.InferType<typeof verifyOTP>>({
    resolver: yupResolver(verifyOTP),
    defaultValues: {
      code: '',
      email: '',
      type: ''
    }
  })

  useEffect(() => {
    form.reset({
      email: props.email,
      type: props.type
    })
  }, [props.email, props.type])


  const onGenerateOTP = async (payload: any) => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = async (payload: any) => {

    try {
      router.push('/dashboard')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form
      {...props}
      className={cn("flex flex-col gap-6 p-6 md:p-8", className)}
      onSubmit={form.handleSubmit((payload) => onSubmit(payload))}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{
            props.type == typeOTP.AUTH ?
              i18next.t('forms.sign-in.submit') : i18next.t('forms.otp.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {i18next.t('forms.otp.subtitle')}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onGenerateOTP(props)
          }}
        >
          {/* {generateOTP.isPending ? <Spinner /> : <RefreshCwIcon />} */}
          {i18next.t('forms.otp.alternatives.title')}
        </Button>
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="otp-verification">
                  {i18next.t('forms.otp.fields.code.label')}
                </FieldLabel>
              </div>
              <InputOTP
                maxLength={6}
                id="otp"
                data-invalid={fieldState.invalid}
                onChange={(value) => form.setValue('code', value)}
              >
                <InputOTPGroup className="w-full flex items-center justify-center gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
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
            {props.type == typeOTP.AUTH ? i18next.t('forms.sign-in.submit') : i18next.t('forms.otp.submit')}
            {/* {verifiedOTP.isPending && <Spinner data-icon="inline-start" />} */}
          </Button>
        </Field>
        <FieldSeparator>
        </FieldSeparator>
        {
          props.type == typeOTP.VERIFY &&
          <Field>
            <FieldDescription className="text-center">
              <span>{i18next.t('forms.sign-up.fields.sign-in.placeholder')}</span>
              <a href="/auth/sign-in" className='ml-1 text-sm'>
                {i18next.t('forms.sign-up.fields.sign-in.label')}
              </a>
            </FieldDescription>
          </Field>
        }
      </FieldGroup>
    </form>
  )
}
