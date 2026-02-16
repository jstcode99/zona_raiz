"use client"

import { ComponentProps, startTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import i18next from "i18next"
import { toast } from "sonner"

import {
  userRoleStateAdminSchema,
  userRoleOptions,
} from "@/domain/entities/schemas/userProfileAdmin"

import { Form } from "@/components/ui/form"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { updateUserRealStateAdminAction } from "@/application/actions/updateUserRealStateAdminAction"
import { cn } from "@/lib/utils"
import { UserRole } from "@/domain/entities/Profile"

export function UserProfileAdminForm({
  className,
  defaultValues,
  userId,
  realEstateOptions,
  ...props
}: ComponentProps<"form"> & {
  userId: string
  defaultValues?: {
    role?: UserRole
  }
  realEstateOptions: { label: string; value: string }[]
}) {
  const t = i18next.t

  const form = useForm({
    resolver: yupResolver(userRoleStateAdminSchema),
    defaultValues: {
      role: UserRole.Agent
    },
    shouldUnregister: false,
  })

  const { setError, setValue, watch } = form

  const update = useServerMutation({
    action: updateUserRealStateAdminAction,
    initialState: { success: false },
    setError,
    onSuccess: () => toast.success(t("forms.userAdmin.success")),
  })

  useEffect(() => {
    if (!defaultValues?.role) return
    setValue('role', defaultValues.role)
  }, [defaultValues, setValue])

  useEffect(() => {
    if (watch('role') != defaultValues?.role) {
      form.handleSubmit
    }
  }, [defaultValues, setValue])

  const onSubmit = (role: string) => {
    const formData = new FormData()

    formData.append("user_id", userId)
    formData.append("role", role)

    startTransition(() => {
      update.action(formData)
    })
  }

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 max-w-2xl mx-auto space-y-8", className)}
      onSubmit={(v) => onSubmit(v.role as string)}
    >
      {/* Rol */}
      <Form.Set legend="Rol">
        <Form.Select
          name="role"
          label={t("forms.userAdmin.fields.role.label")}
          options={userRoleOptions}
          placeholder="Sin asignar"
        />
      </Form.Set>
    </Form>
  )
}
