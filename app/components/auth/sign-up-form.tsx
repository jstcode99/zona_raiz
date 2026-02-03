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
import { cn } from "@/utils/utils"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, useEffect, useRef, useState } from "react"
import i18next from "i18next"
import GoogleAuth from "./google-auth"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Eye, EyeClosed } from "lucide-react"
import { Spinner } from "../ui/spinner"
import { signUpSchema } from "@/types/schemas/signUp"
import { signUpAction } from "@/actions/auth.actions"
import { useActionMutation } from "@/shared/actions/use-action-mutation"
import { toast } from "sonner"
// import HCaptcha from '@hcaptcha/react-hcaptcha'

export function SignUpForm({
  className,
  ...props
}: ComponentProps<"form">) {

  const [showPassword, setShowPassword] = useState<boolean>(false)
  // const captcha = useRef<any>(null)

  const form = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      captchaToken: '',
    },
  })

  const mutation = useActionMutation(signUpAction)

  useEffect(() => {
    if (!mutation.isPending) {
      form.reset()
    }
    if (mutation.isSuccess) {
      toast.success(i18next.t('forms.sign-up.success'))
    }
  }, [mutation.isPending])


  return (
    <form
      className={cn("py-4 px-6", className)}
      {...props}
      onSubmit={form.handleSubmit(v => {
        mutation.submit(v, { setError: form.setError })
      })}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{i18next.t('forms.sign-up.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {i18next.t('forms.sign-up.subtitle')}
          </p>
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
                  id="form-password-confirmation"
                  type={showPassword ? 'text' : 'password'}
                  aria-invalid={fieldState.invalid}
                  placeholder={i18next.t('forms.sign-up.fields.password-confirmation.placeholder')}
                  autoComplete="off"
                  {...field}
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
        {/* <Controller
          name="captchaToken"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <HCaptcha 
                ref={captcha} 
                sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || ''}
                onVerify={(token) => field.onChange(token)} 
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        /> */}

        <Field>
          <Button type="submit">
            {i18next.t('forms.sign-up.submit')}
            {mutation.isPending && <Spinner data-icon="inline-start" />}
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
