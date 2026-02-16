"use client"

import { ComponentProps, startTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import i18next from "i18next"
import { toast } from "sonner"

import {
  userRealStateAdminSchema,
} from "@/domain/entities/schemas/userProfileAdmin"

import { Form } from "@/components/ui/form"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { updateUserRealStateAdminAction } from "@/application/actions/updateUserRealStateAdminAction"
import { cn } from "@/lib/utils"

export function UserProfileAdminForm({
  className,
  defaultValues,
  userId,
  realEstateOptions,
  ...props
}: ComponentProps<"form"> & {
  userId: string
  defaultValues?: {
    real_state_id?: string
  }
  realEstateOptions: { label: string; value: string }[]
}) {
  const t = i18next.t

  const form = useForm({
    resolver: yupResolver(userRealStateAdminSchema),
    defaultValues: {
      real_state_id: ''
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
    if (!defaultValues?.real_state_id) return
    setValue('real_state_id', defaultValues.real_state_id)
  }, [defaultValues, setValue])

  useEffect(() => {
    if (watch('real_state_id') != defaultValues?.real_state_id) {
      form.handleSubmit
    }
  }, [defaultValues, setValue])

  const onSubmit = (real_state_id: string) => {
    const formData = new FormData()

    formData.append("user_id", userId)
    formData.append("real_state_id", real_state_id)

    startTransition(() => {
      update.action(formData)
    })
  }

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 max-w-2xl mx-auto space-y-8", className)}
      onSubmit={(v) => onSubmit(v.real_state_id as string)}
    >
      {/* Real state */}
      <Form.Set legend="Inmobiliaria">
        <Form.Select
          name="real_estate_id"
          label={t("forms.userAdmin.fields.real_estate.label")}
          options={realEstateOptions}
          placeholder="Sin asignar"
        />
      </Form.Set>
    </Form>
  )
}
