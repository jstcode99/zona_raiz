"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"
import {  useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps } from "react"
import i18next from "i18next"
import GoogleAuth from "./google-auth"
import { Spinner } from "@/components/ui/spinner"
import { SignUpFormValues, signUpSchema } from "@/domain/entities/schemas/signUp"
import { toast } from "sonner"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { signUpAction } from "@/application/actions/signUpAction"
import { useFormStatus } from "react-dom"
import { startTransition } from "react"
import { Form } from "@/components/ui/form"

export function SignUpForm({
  className,
  ...props
}: ComponentProps<"form">) {

  const { pending } = useFormStatus()


  const form = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      last_name: '',
      email: '',
      password: '',
    },
    shouldUnregister: false,
  })

  const { setError } = form

  const mutation = useServerMutation({
    action: signUpAction,
    initialState: { success: false },
    setError,
    onSuccess: () => toast.success(i18next.t('forms.sign-up.success')),
  })


  const onSubmit = (values: SignUpFormValues) => {
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
      <FieldGroup className="gap-2">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{i18next.t('forms.sign-up.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {i18next.t('forms.sign-up.subtitle')}
          </p>
        </div>
        <Form.Input name="name" label={i18next.t('forms.sign-up.fields.name.label')} />
        <Form.Input name="last_name" label={i18next.t('forms.sign-up.fields.last_name.label')} />
        <Form.Input name="email" label={i18next.t('forms.sign-up.fields.email.label')} />
        <Form.Input name="phone" label={i18next.t('forms.sign-up.fields.phone.label')} />
        <Form.Input name="password" type="password" label={i18next.t('forms.sign-up.fields.password.label')} />
        <Form.Input name="password_confirmation" type="password" label={i18next.t('forms.sign-up.fields.password-confirmation.label')} />
        <Field>
          <Button
            type="submit"
            disabled={pending || mutation.isPending}>
            {i18next.t('forms.sign-up.submit')}
            {pending || mutation.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
        <FieldSeparator className="py-4">
          {i18next.t('forms.sign-up.alternatives.title')}
        </FieldSeparator>
        <Field className="py-4">
          <GoogleAuth />
          <FieldDescription className="text-center">
            <span>{i18next.t('forms.sign-up.fields.sign-in.placeholder')}</span>
            <a href="/auth/sign-in" className='ml-1 text-sm'>
              {i18next.t('forms.sign-up.fields.sign-in.label')}
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </Form>
  )
}
