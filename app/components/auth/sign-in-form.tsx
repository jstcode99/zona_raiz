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
import { Input } from "@/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect, useState } from "react"
import i18next from "i18next"
import GoogleAuth from "./google-auth"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { EyeClosed, Eye } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { useActionMutation } from "@/shared/actions/use-action-mutation"
import { signInAction } from "@/actions/auth.actions"
import { signInSchema } from "@/types/schemas/signIn"
import { toast } from "sonner"

export function SingInForm({
  className,
  ...props
}: ComponentProps<"form">) {

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const form = useForm({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    shouldUnregister: false,
  })

  const mutation = useActionMutation(signInAction)

  useEffect(() => {
    if (mutation.isError) {
      toast.error(i18next.t(mutation.error?.message || 'forms.sign-in.error'))
    }
  }, [mutation.isError])

  return (
    <form
      className="p-6 md:p-8"
      onSubmit={form.handleSubmit(v => mutation.submit(v, { setError: form.setError }))}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{i18next.t('forms.sign-in.title')}</h1>
          <p className="text-muted-foreground text-balance">
            {i18next.t('forms.sign-in.subtitle')}
          </p>
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
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="w-full" htmlFor="form-password">
                  {i18next.t('forms.sign-up.fields.password.label')}
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="form-password"
                    type={showPassword ? 'text' : 'password'}
                    aria-invalid={fieldState.invalid}
                    placeholder={i18next.t('forms.sign-up.fields.password.placeholder')}
                    autoComplete="off"
                  />
                  <InputGroupAddon
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    align="inline-end"
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}

          />
          <a
            href="otp"
            className="ml-auto text-right text-sm underline-offset-2 hover:underline"
          >
            {i18next.t('forms.sign-in.fields.forgot-password.label')}
          </a>
        </Field>
        <Field>
          <Button
            type='submit'
            className='w-full'
            disabled={mutation.isPending}
          >
            {i18next.t('forms.sign-in.submit')}
            {mutation.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          {i18next.t('forms.sign-in.alternatives.title')}
        </FieldSeparator>
        <Field className="flex items-center gap-4">
          <GoogleAuth />
        </Field>
        <FieldDescription className="text-center">
          <span>{i18next.t('forms.sign-in.fields.sign-up.placeholder')}</span>
          <a href="/auth/sign-up" className='ml-1 text-sm'>
            {i18next.t('forms.sign-in.fields.sign-up.label')}
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
