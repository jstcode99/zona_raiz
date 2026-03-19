"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect } from "react"
import { useTranslation } from "react-i18next"
import GoogleAuth from "./google-auth"
import { Spinner } from "@/components/ui/spinner"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { defaultSignInValues, SignInFormInput, signInSchema } from "@/application/validation/auth.validation"
import { signInAction } from "@/application/actions/auth.actions"
import { useRoutes } from "@/i18n/client-router"

export function SignInForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const { t } = useTranslation("auth")
  const router = useRouter()
  const routes = useRoutes()

  const form = useForm<SignInFormInput>({
    resolver: yupResolver(signInSchema),
    defaultValues: defaultSignInValues,
    mode: "onBlur", // Validación al perder foco
  })

  const { setError, formState: { isSubmitting } } = form

  const mutation = useServerMutation({
    action: signInAction,
    setError,
    onSuccess: () => {
      router.push(routes.onboarding())
      router.refresh() // Refrescar para actualizar estado de auth
    },
    onError: (error) => {
      console.error("Sign in error:", error)
    }
  })

  // Resetear error cuando el usuario empieza a escribir
  useEffect(() => {
    const subscription = form.watch(() => {
      if (mutation.isError) {
        mutation.reset()
      }
    })
    return () => subscription.unsubscribe()
  }, [form, mutation])

  const onSubmit = (values: SignInFormInput) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    mutation.action(formData)
  }

  const isLoading = isSubmitting || mutation.isPending

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-16 px-6", className)}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('titles.sign_in')}</h1>
          <p className="text-muted-foreground text-balance">
            {t('subtitles.sign_in')}
          </p>
        </div>

        <Form.Input
          name="email"
          type="email"
          label={t('labels.email')}
          placeholder={t('placeholders.email')}
          autoComplete="email"
          disabled={isLoading}
        />

        <Form.Input
          name="password"
          type="password"
          label={t('labels.password')}
          placeholder={t('placeholders.password')}
          autoComplete="current-password"
          disabled={isLoading}
        />
        <Link
          href={routes.otp()}
          className="ml-auto text-right text-sm underline-offset-2 hover:underline"
        >
          {t('actions.otp')}
        </Link>
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Spinner data-icon="inline-start" className="mr-2 h-4 w-4" />}
            {t('actions.sign_in')}
          </Button>
        </Field>
        <Field className="py-4">
          <GoogleAuth disabled={isLoading} />
        </Field>

        <FieldDescription className="text-center">
          <Link
            href={routes.signup()}
            className="ml-1 text-sm font-medium text-primary hover:underline"
          >
            {t('actions.sign_up')}
          </Link>
        </FieldDescription>
      </FieldGroup>
    </Form>
  )
}