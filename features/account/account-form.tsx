"use client"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps, startTransition, useEffect } from "react"
import i18next from "i18next"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useFormStatus } from "react-dom"
import { defaultUserProfileValues, profileFormValues, profileSchema,  } from "@/domain/entities/schemas/profile"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { updateProfileAction } from "../../application/actions/updateProfileAction"
import { PropertyFormData } from "@/domain/entities/schemas/property"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"

export function AccountForm({
  className,
  defaultValues,
  ...props
}: ComponentProps<"form"> & {
  defaultValues: profileFormValues
}) {

  const { pending } = useFormStatus()

  const form = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: defaultUserProfileValues,
    shouldUnregister: false,
  })

  const { setError, reset } = form

  const mutation = useServerMutation({
    action: updateProfileAction,
    initialState: { success: false },
    setError,
    onSuccess: () => toast.success('Perfil actualizado correctamente'),
  })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues])

  const onSubmit = (values: PropertyFormData) => {
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
      className={cn("py-6 px-6 max-w-xl mx-auto space-y-8", className)}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <Form.Input name="full_name" label={i18next.t('forms.sign-up.fields.full_name.label')} />
        <Form.Input name="phone" label={i18next.t('forms.sign-up.fields.phone.label')} />
        <Field>
          <Button
            type='submit'
            className='w-full'
            disabled={pending || mutation.isPending}
          >
            {i18next.t('words.save')}
            {pending || mutation.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
      </FieldGroup>
    </Form>
  )
}
