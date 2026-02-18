"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect } from "react"
import { useTranslation } from "react-i18next"
import GoogleAuth from "./google-auth"
import { Spinner } from "@/components/ui/spinner"
import { SignUpFormValues, signUpSchema } from "@/domain/entities/schemas/signUp"
import { toast } from "sonner"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { signUpAction } from "@/application/actions/signUpAction"
import { Form } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SignUpForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const { t } = useTranslation()
  const router = useRouter()

  const form = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
    mode: "onBlur", // Validación al perder foco para mejor UX
  })

  const { setError, handleSubmit, formState: { isSubmitting } } = form

  const mutation = useServerMutation({
    action: signUpAction,
    initialState: { success: false },
    setError,
    onSuccess: () => {
      toast.success(t('forms.sign-up.success'))
      router.push("/auth/sign-in?registered=true")
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
      className={cn("py-4 px-6", className)}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-2">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t('forms.sign-up.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t('forms.sign-up.subtitle')}
          </p>
        </div>

        <Form.Input 
          name="full_name" 
          label={t('forms.sign-up.fields.full_name.label')}
          autoComplete="name"
          disabled={isLoading}
        />
        
        <Form.Input 
          name="email" 
          type="email"
          label={t('forms.sign-up.fields.email.label')}
          autoComplete="email"
          disabled={isLoading}
        />
        
        <Form.Input 
          name="phone" 
          type="tel"
          label={t('forms.sign-up.fields.phone.label')}
          autoComplete="tel"
          disabled={isLoading}
        />
        
        <Form.Input 
          name="password" 
          type="password" 
          label={t('forms.sign-up.fields.password.label')}
          autoComplete="new-password"
          disabled={isLoading}
        />
        
        <Form.Input 
          name="password_confirmation" 
          type="password" 
          label={t('forms.sign-up.fields.password-confirmation.label')}
          autoComplete="new-password"
          disabled={isLoading}
        />

        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Spinner data-icon="inline-start" className="mr-2" />}
            {t('forms.sign-up.submit')}
          </Button>
        </Field>

        <FieldSeparator className="py-4">
          {t('forms.sign-up.alternatives.title')}
        </FieldSeparator>

        <Field className="py-4">
          <GoogleAuth disabled={isLoading} />
          
          <FieldDescription className="text-center">
            <span>{t('forms.sign-up.fields.sign-in.placeholder')}</span>
            <Link 
              href="/auth/sign-in" 
              className="ml-1 text-sm font-medium text-primary hover:underline"
            >
              {t('forms.sign-up.fields.sign-in.label')}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </Form>
  )
}