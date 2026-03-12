"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect } from "react"
import { useTranslation } from "react-i18next"
import GoogleAuth from "./google-auth"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { Form } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2 } from "lucide-react"
import { defaultSignUpValues, SignUpFormInput, signUpSchema } from "@/application/validation/auth.validation"
import { signUpAction } from "@/application/actions/auth.actions"
import { useRoutes } from "@/i18n/client-router"

export function SignUpForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const { t } = useTranslation()
  const router = useRouter()
  const routes = useRoutes()

  const form = useForm<SignUpFormInput>({
    resolver: yupResolver(signUpSchema),
    defaultValues: defaultSignUpValues,
    mode: "onBlur", // Validación al perder foco para mejor UX
  })

  const { setError, handleSubmit, formState: { isSubmitting } } = form

  const mutation = useServerMutation({
    action: signUpAction,
    setError,
    onSuccess: () => {
      toast.success(t('messages:success.sign_up'))
      router.push(routes.signin())
    },
    onError: (error) => {
      console.error("Sign up error:", error)
    },
  })

  // Reset mutation si el usuario empieza a escribir de nuevo
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
      className={cn("py-16 px-6", className)}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-2">
        <div className="flex flex-col items-center gap-1 text-center my-2">
          <h1 className="text-2xl font-bold">{t('titles:sign_up')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t('subtitles:sign_up')}
          </p>
        </div>

        <Form.Input
          name="full_name"
          label={t('fields:full_name')}
          placeholder={t('placeholders:full_name')}
          autoComplete="name"
          disabled={isLoading}
        />

        <Form.Input
          name="email"
          type="email"
          label={t('fields:email')}
          placeholder={t('placeholders:email')}
          autoComplete="email"
          disabled={isLoading}
        />

        <Form.Phone
          name="phone"
          label={t('fields:phone')}
          placeholder={t('placeholders:phone')}
        />

        <Form.Input
          name="password"
          type="password"
          label={t('fields:password')}
          placeholder={t('placeholders:password')}
          autoComplete="new-password"
          disabled={isLoading}
        />

        <Form.Input
          name="password_confirmation"
          type="password"
          label={t('fields:password_confirmation')}
          placeholder={t('placeholders:password_confirmation')}
          autoComplete="new-password"
          disabled={isLoading}
        />
        <div className="flex justify-start gap-2 p-2">
          <Form.Checkbox
            name="type_register"
            label={
              <span className="font-normal text-sm">
                {t('fields:type_register')}
              </span>
            }
          />
        </div>
        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Spinner data-icon="inline-start" className="mr-2" />}
            {t('actions:sign_up')}
          </Button>
        </Field>

        <Field className="py-4">
          <GoogleAuth disabled={isLoading} />

          <FieldDescription className="text-center">
            <Link
              href={routes.signin()}
              className="ml-1 text-sm font-medium text-primary underline-offset-0"
            >
              {t('actions:sign_in')}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </Form>
  )
}