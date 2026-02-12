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
import { ComponentProps } from "react"
import i18next from "i18next"
import GoogleAuth from "./google-auth"
import { Spinner } from "@/components/ui/spinner"
import { SignInFormValues, signInSchema } from "@/domain/entities/schemas/signIn"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { signInAction } from "@/application/actions/signInAction"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { startTransition } from "react"
import { cn } from "@/lib/utils"

export function SingInForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const router = useRouter()

  const { pending } = useFormStatus()

  const form = useForm<SignInFormValues>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    shouldUnregister: false,
  })

  const { setError } = form

  const mutation = useServerMutation({
    action: signInAction,
    initialState: { success: false },
    setError,
    onSuccess: () => router.push("/dashboard"),
  })

  const onSubmit = (values: SignInFormValues) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""))
    })

    startTransition(() => {
      mutation.action(formData)
    })
  }

  return (
    <Form
      {...props}
      form={form}
       className={cn("py-4 px-6", className)}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{i18next.t('forms.sign-in.title')}</h1>
          <p className="text-muted-foreground text-balance">
            {i18next.t('forms.sign-in.subtitle')}
          </p>
        </div>
        <Form.Input name="email" label={i18next.t('forms.sign-in.fields.email.label')} />
        <Form.Input name="password" type="password" label={i18next.t('forms.sign-in.fields.password.label')} />
        <Field>
          <Button
            type='submit'
            className='w-full'
            disabled={pending || mutation.isPending}
          >
            {i18next.t('forms.sign-in.submit')}
            {pending || mutation.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
        <FieldSeparator className="py-4">
          {i18next.t('forms.sign-in.alternatives.title')}
        </FieldSeparator>
        <Field className="py-4">
          <GoogleAuth />
        </Field>
        <FieldDescription className="text-center">
          <span>{i18next.t('forms.sign-in.fields.sign-up.placeholder')}</span>
          <a href="/auth/sign-up" className='ml-1 text-sm'>
            {i18next.t('forms.sign-in.fields.sign-up.label')}
          </a>
        </FieldDescription>
      </FieldGroup>
    </Form>
  )
}
