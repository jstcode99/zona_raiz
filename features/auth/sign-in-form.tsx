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
import { defaultSignInValues, SignInFormValues, signInSchema } from "@/domain/entities/schemas/sign-in-schema"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/infrastructure/config/constants"
import { signInAction } from "@/domain/adapters/http/auth.actions"

export function SignInForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const { t } = useTranslation()
  const router = useRouter()

  const form = useForm<SignInFormValues>({
    resolver: yupResolver(signInSchema),
    defaultValues: defaultSignInValues,
    mode: "onBlur", // Validación al perder foco
  })

  const { setError, handleSubmit, formState: { isSubmitting } } = form

  const mutation = useServerMutation({
    action: signInAction,
    setError,
    onSuccess: () => {
      router.push(ROUTES.ONBOARDING)
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

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData()
    
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    mutation.action(formData)
  })

  const isLoading = isSubmitting || mutation.isPending

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-4 px-6", className)}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('forms.sign-in.title')}</h1>
          <p className="text-muted-foreground text-balance">
            {t('forms.sign-in.subtitle')}
          </p>
        </div>

        <Form.Input 
          name="email" 
          type="email"
          label={t('forms.sign-in.fields.email.label')}
          placeholder={t('forms.sign-in.fields.email.placeholder')}
          autoComplete="email"
          disabled={isLoading}
        />
        
        <Form.Input 
          name="password" 
          type="password"
          label={t('forms.sign-in.fields.password.label')}
          placeholder={t('forms.sign-in.fields.password.placeholder')}
          autoComplete="current-password"
          disabled={isLoading}
        />

        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Spinner data-icon="inline-start" className="mr-2 h-4 w-4" />}
            {t('forms.sign-in.submit')}
          </Button>
        </Field>

        <FieldSeparator className="py-4">
          {t('forms.sign-in.alternatives.title')}
        </FieldSeparator>

        <Field className="py-4">
          <GoogleAuth disabled={isLoading} />
        </Field>

        <FieldDescription className="text-center">
          <span>{t('forms.sign-in.fields.sign-up.placeholder')}</span>
          <Link 
            href="/auth/sign-up" 
            className="ml-1 text-sm font-medium text-primary hover:underline"
          >
            {t('forms.sign-in.fields.sign-up.label')}
          </Link>
        </FieldDescription>
      </FieldGroup>
    </Form>
  )
}