"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, Controller } from "react-hook-form"
import { useRef, useTransition } from "react"
import { profileAvatarSchema, AvatarFormValues } from "@/domain/entities/schemas/profile"
import { optimizeImage } from "@/utils/utils"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { updateAvatarAction } from "@/application/actions/updateAvatarAction"

type Props = {
  avatarUrl?: string | null
  name: string
}

export function AvatarUpload({ avatarUrl, name }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<AvatarFormValues>({
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
    <div className="flex flex-col items-start gap-3">
      <button
        disabled={mutation.isPending || isPending}
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative"
      >
        <SmartAvatar
          className="size-20"
          src={avatarUrl ?? undefined}
          alt={name}
          fallback={
            mutation.isPending ? <Spinner /> : name.slice(0, 2).toUpperCase()
          }
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          Cambiar
        </span>
      </button>

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
    </div>
  )
}
