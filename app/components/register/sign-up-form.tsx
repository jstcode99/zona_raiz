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
import { Input } from "@/app/components/ui/input"
import { cn } from "@/utils/utils"
import { Controller, useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaSignUp } from "@/types/entities/signUp"
import { ComponentProps, useState } from "react"
import i18next from "i18next"
import GoogleAuth from "../auth/google-auth"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/app/components/ui/input-group"
import { Eye, EyeClosed } from "lucide-react"
import { useApiMutation } from "@/lib/api/useApiMutation"
import { $api } from "@/lib/api/client"
import { useRouter } from 'next/navigation'
import { ApiPaths } from "@/types/api/schema"
import { Spinner } from "../ui/spinner"

export function SignUpForm({
  className,
  ...props
}: ComponentProps<"form">) {

  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const router = useRouter()

  const form = useForm<yup.InferType<typeof schemaSignUp>>({
    resolver: yupResolver(schemaSignUp),
    defaultValues: {
      name: '',
      last_name: '',
      email: '',
      password: '',
    },
  })


  const signUp = useApiMutation(
    () => $api.useMutation('post', ApiPaths.signUp),
    {
      setFormError: form.setError,
      onSuccess: () => {
        let email = form.getValues('email')
        router.push('verify-account/' + encodeURIComponent(email))
      },
    },
  )

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={form.handleSubmit((data) => signUp.mutate({ body: data }))}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{i18next.t('forms.sign-up.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {i18next.t('forms.sign-up.subtitle')}
          </p>
          {error && <p className='text-red-500'>{error}</p>}
        </div>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-name">
                {i18next.t('forms.sign-up.fields.name.label')}
              </FieldLabel>
              <Input
                {...field}
                id="form-name"
                aria-invalid={fieldState.invalid}
                placeholder={i18next.t('forms.sign-up.fields.name.placeholder')}
                autoComplete="on"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="last_name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-last_name">
                {i18next.t('forms.sign-up.fields.last_name.label')}
              </FieldLabel>
              <Input
                {...field}
                id="form-last_name"
                aria-invalid={fieldState.invalid}
                placeholder={i18next.t('forms.sign-up.fields.last_name.placeholder')}
                autoComplete="on"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-email">
                {i18next.t('forms.sign-up.fields.email.label')}
              </FieldLabel>
              <Input
                {...field}
                id="form-email"
                aria-invalid={fieldState.invalid}
                placeholder={i18next.t('forms.sign-up.fields.email.placeholder')}
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-phone">
                {i18next.t('forms.sign-up.fields.phone.label')}
              </FieldLabel>
              <Input
                {...field}
                type="tel"
                id="form-phone"
                pattern="[0-9]{2} [0-9]{3} [0-9]{4} [0-9]{3}"
                maxLength={16}
                minLength={10}
                title={i18next.t('forms.sign-up.fields.phone.placeholder')}
                aria-invalid={fieldState.invalid}
                placeholder={i18next.t('forms.sign-up.fields.phone.placeholder')}
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="w-full" htmlFor="form-password">
                {i18next.t('forms.sign-in.fields.password.label')}
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
        <Controller
          name="password_confirmation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="w-full" htmlFor="form-password-confirmation">
                {i18next.t('forms.sign-up.fields.password-confirmation.label')}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="form-password-confirmation"
                  type={showPassword ? 'text' : 'password'}
                  aria-invalid={fieldState.invalid}
                  placeholder={i18next.t('forms.sign-up.fields.password-confirmation.placeholder')}
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
        <Field>
          <Button type="submit" disabled={signUp.isPending}>
            {i18next.t('forms.sign-up.submit')}
            {signUp.isPending && <Spinner data-icon="inline-start" />}
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
  )
}
