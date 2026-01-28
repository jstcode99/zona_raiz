"use client"

import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/app/components/ui/field"
import { Input } from "@/app/components/ui/input"
import { cn } from "@/utils/utils"
import * as yup from 'yup'
import i18next from "i18next"
import { GalleryVerticalEnd } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { schemaResetPasswordAttempt } from "@/types/entities/resetPasswordAttempt"
import { useApiMutation } from "@/lib/api/useApiMutation"
import { $api } from "@/lib/api/client"
import { ApiPaths } from "@/types/api/schema"
import { Spinner } from "../ui/spinner"
import GoogleAuth from "../auth/google-auth"
import { useRouter } from "next/navigation"

export function SendCodeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<yup.InferType<typeof schemaResetPasswordAttempt>>({
    resolver: yupResolver(schemaResetPasswordAttempt),
    defaultValues: {
      email: '',
    },
  })

  const sendResetCode = useApiMutation(
    () => $api.useMutation('post', ApiPaths.sendResetCode),
    {
      setFormError: form.setError,
      onSuccess: () => {
        let email = form.getValues('email')
        router.push('valid-code/' + encodeURIComponent(email))
      },
    },
  )

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="py-3">
          <form
            onSubmit={form.handleSubmit((data) => sendResetCode.mutate({ body: data }))}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <a
                  href="/"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Acme Inc.</span>
                </a>
                <h1 className="text-xl font-bold">{i18next.t('forms.forgot-password.title')}</h1>
                <FieldDescription>
                  {i18next.t('forms.forgot-password.subtitle')}
                  {error && <p className='text-red-500'>{error}</p>}
                </FieldDescription>
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
                      {...field}
                      id="form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="m@example.com"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={sendResetCode.isPending}>
                  {i18next.t('forms.forgot-password.submit')}
                  {sendResetCode.isPending && <Spinner data-icon="inline-start" />}
                </Button>
              </Field>
              <FieldSeparator>
                {i18next.t('forms.sign-up.alternatives.title')}
              </FieldSeparator>
              <Field>
                <GoogleAuth />
                <FieldDescription className="text-center">
                  <span>{i18next.t('forms.sign-up.fields.sign-in.placeholder')}</span>
                  <a href="/auth/sign-in" className='ml-1 text-sm'>
                    {i18next.t('forms.sign-up.fields.sign-in.label')}
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
