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
import { verifyAccount } from "@/types/entities/verifyAccount"
import { ComponentProps, useState } from "react"
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
import { Tokens } from "@/lib/js-cookie"
import { authAction } from "../auth/actions"
import { Spinner } from "../ui/spinner"

interface Props {
  email: string
}

export function VerifyAccountForm({
  className,
  ...props
}: ComponentProps<"form"> & Props) {

  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<yup.InferType<typeof verifyAccount>>({
    resolver: yupResolver(verifyAccount)
  })



  const sendVerificationEmail = useApiMutation(
    () => $api.useMutation('post', ApiPaths.sendVerificationEmail),
    {
      setFormError: form.setError,
      onSuccess: () => {
        toast.info(i18next.t('forms.verify-account.send-verification-email'))
      },
    },
  )

  async function auth(tokens: Tokens) {
    const res = await authAction(tokens)
    if (res?.error) setError(res.error)
    router.push('/dashboard/')
  }

  const verifyAccountMutation = useApiMutation(
    () => $api.useMutation('post', ApiPaths.verifyAccount),
    {
      setFormError: form.setError,
      onSuccess: async (tokens: Tokens) => {
        await auth(tokens)
      },
    },
  )

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={form.handleSubmit((data) => verifyAccountMutation.mutate({ body: data }))}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{i18next.t('forms.verify-account.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {i18next.t('forms.verify-account.subtitle')}
          </p>
          {error && <p className='text-red-500'>{error}</p>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            sendVerificationEmail.mutate({
              body: {
                email: decodeURIComponent(props.email) as string,
              },
            })
          }}
        >
          <RefreshCwIcon />
          {i18next.t('forms.verify-account.alternatives.title')}
        </Button>
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="otp-verification">
                  {i18next.t('forms.verify-account.fields.code.label')}
                </FieldLabel>
              </div>
              <InputOTP
                maxLength={6}
                id="otp"
                data-invalid={fieldState.invalid}
                onChange={(value) => form.setValue('code', parseInt(value))}
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
          disabled={verifyAccountMutation.isPending}
          >
            {i18next.t('forms.verify-account.submit')}
            {verifyAccountMutation.isPending && <Spinner data-icon="inline-start"/>}
          </Button>
        </Field>
        <FieldSeparator>
        </FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            <span>{i18next.t('forms.sign-up.fields.sign-in.placeholder')}</span>
            <a href="/auth/sign-in" className='ml-1 text-sm'>
              {i18next.t('forms.sign-up.fields.sign-in.label')}
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
