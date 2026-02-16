"use client"

import { ComponentProps, startTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFormStatus } from "react-dom"
import i18next from "i18next"
import { toast } from "sonner"

import {
  userProfileAdminSchema,
  defaultUserProfileAdminValues,
  type UserProfileAdminFormData,
} from "@/domain/entities/schemas/userProfileAdmin"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { updateUserProfileBasicAdminAction } from "@/application/actions/updateUserProfileBasicAdminAction"
import { cn } from "@/lib/utils"

export function UserProfileAdminForm({
  className,
  defaultValues,
  userId,
  ...props
}: ComponentProps<"form"> & {
  userId: string
  defaultValues?: UserProfileAdminFormData
}) {
  const { pending } = useFormStatus()
  const t = i18next.t

  const form = useForm<UserProfileAdminFormData>({
    resolver: yupResolver(userProfileAdminSchema),
    defaultValues: defaultValues ?? defaultUserProfileAdminValues,
    shouldUnregister: false,
  })

  const { setError, setValue } = form

  const update = useServerMutation({
    action: updateUserProfileBasicAdminAction,
    initialState: { success: false },
    setError,
    onSuccess: () => toast.success(t("forms.userAdmin.success")),
  })

  useEffect(() => {
    if (!defaultValues) return
    Object.entries(defaultValues).forEach(([key, value]) => {
      setValue(key as keyof UserProfileAdminFormData, value)
    })
  }, [defaultValues, setValue])

  const onSubmit = (values: UserProfileAdminFormData) => {
    const formData = new FormData()

    formData.append("user_id", userId)

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""))
    })

    startTransition(() => {
      update.action(formData)
    })
  }

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 max-w-2xl mx-auto space-y-8", className)}
      onSubmit={onSubmit}
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          {t("forms.userAdmin.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("forms.userAdmin.subtitle")}
        </p>
      </div>


      {/* Datos personales */}
      <Form.Set legend="Información personal">
        <Form.Input
          name="name"
          label={t("forms.userAdmin.fields.name.label")}
          placeholder={t("forms.userAdmin.fields.name.placeholder")}
        />

        <Form.Input
          name="last_name"
          label={t("forms.userAdmin.fields.last_name.label")}
          placeholder={t("forms.userAdmin.fields.last_name.placeholder")}
        />

        <Form.Input
          name="phone"
          label={t("forms.userAdmin.fields.phone.label")}
          placeholder={t("forms.userAdmin.fields.phone.placeholder")}
        />
      </Form.Set>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={pending || update.isPending}>
          {t("forms.userAdmin.submit")}
          {(pending || update.isPending) && (
            <Spinner data-icon="inline-start" />
          )}
        </Button>
      </div>
    </Form>
  )
}
