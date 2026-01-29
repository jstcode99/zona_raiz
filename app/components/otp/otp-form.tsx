"use client"

import { Button } from "@/app/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/app/components/ui/field"
import { cn } from "@/utils/utils"
import { Controller, useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { verifyOTP } from "@/types/entities/verifyOTP"
import { ComponentProps, useEffect, useState } from "react"
import i18next from "i18next"
import { useApiMutation } from "@/lib/api/useApiMutation"
import { $api } from "@/lib/api/client"
import { useRouter } from 'next/navigation'
import { ApiPaths } from "@/types/api/schema"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/ui/input-otp"
import { RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"
import { setTokens, Tokens } from "@/lib/js-cookie"
import { authAction } from "../auth/actions"
import { Spinner } from "../ui/spinner"

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

  const [error, setError] = useState<string | null>(null)
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


  const generateOTP = useApiMutation(
    () => $api.useMutation('post', ApiPaths.generateOTP),
    {
      setFormError: form.setError,
      onSuccess: () => {
        toast.info(i18next.t('forms.otp.send-verification-email'))
      },
    },
  )

  async function auth(tokens: Tokens) {
    const res = await authAction(tokens)
    if (res?.error) setError(res.error)
    router.push('/dashboard/')
  }

  const verifyOTPMutation = useApiMutation(
    () => $api.useMutation('post', ApiPaths.verifyOTP),
    {
      setFormError: form.setError,
      onSuccess: async (tokens: Tokens) => {
        setTokens(tokens)
        await auth(tokens)
      },
    },
  )

  return (
    <form
      {...props}
      className={cn("flex flex-col gap-6 p-6 md:p-8", className)}
      onSubmit={form.handleSubmit((data) => verifyOTPMutation.mutate({ body: data }))}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{
            props.type == typeOTP.AUTH ?
              i18next.t('forms.sign-in.submit') : i18next.t('forms.otp.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {i18next.t('forms.otp.subtitle')}
          </p>
          {error && <p className='text-red-500'>{error}</p>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={generateOTP.isPending}
          onClick={() => {
            generateOTP.mutate({
              body: props,
            })
          }}
        >
          {generateOTP.isPending ? <Spinner /> : <RefreshCwIcon />}
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
            disabled={verifyOTPMutation.isPending}
          >
            {props.type == typeOTP.AUTH ?
              i18next.t('forms.sign-in.submit') : i18next.t('forms.otp.submit')}
            {verifyOTPMutation.isPending && <Spinner data-icon="inline-start" />}
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
