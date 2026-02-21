"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, Controller } from "react-hook-form"
import { useRef, useTransition } from "react"
import { profileAvatarSchema, AvatarFormValues } from "@/domain/entities/schemas/profileSchema"
import { optimizeImage } from "@/lib/utils"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { updateAvatarAction } from "@/application/actions/profileAction"

type Props = {
  avatarUrl?: string | null
  full_name: string
}

export function AvatarUpload({ avatarUrl, full_name = '' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    resolver: yupResolver(profileAvatarSchema),
  })

  const mutation = useServerMutation({
    action: updateAvatarAction,
    initialState: { success: false },
    setError: form.setError,
  })

  async function onSubmit(data: AvatarFormValues) {
    if (!data.avatar) return

    startTransition(async () => {
      const optimized = await optimizeImage(data.avatar!)

      const formData = new FormData()
      formData.append("avatar", optimized)

      mutation.action(formData)
      form.reset()
    })
  }

  return (
    <>
      <SmartAvatar
        className="cursor-pointer size-25"
        src={avatarUrl ?? undefined}
        alt={full_name}
        onClick={() => inputRef.current?.click()}
        fallback={
          isPending || mutation.isPending ? <Spinner /> : full_name.slice(0, 2).toUpperCase() ?? ''
        }
      />
      <Controller
        control={form.control}
        name="avatar"
        render={({ field, fieldState }) => (
          <>
            <Input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={mutation.isPending}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                form.setValue("avatar", file, { shouldValidate: true })
                queueMicrotask(() => {
                  form.handleSubmit(onSubmit)()
                })
              }}
            />
            {fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </>
        )}
      />
    </>
  )
}
