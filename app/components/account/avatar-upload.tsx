"use client"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, Controller } from "react-hook-form"
import { useRef, useTransition } from "react"
import { accountAvatarSchema, AvatarFormValues } from "@/types/schemas/account"
import { updateAccountAvatarAction } from "@/actions/account.actions"
import { optimizeImage } from "@/utils/utils"
import { FieldError } from "../ui/field"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import { SmartAvatar } from "../ui/smart-avatar"

type Props = {
  avatarUrl?: string | null
  name: string
}

export function AvatarUpload({ avatarUrl, name }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const form = useForm({
    resolver: yupResolver(accountAvatarSchema),
  })

  async function onSubmit(data: AvatarFormValues) {
    if (!data.avatar?.length) return

    startTransition(async () => {
      const optimized = await optimizeImage((data.avatar as FileList)[0])

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(optimized)
      updateAccountAvatarAction({
        avatar: dataTransfer.files,
      })
      form.reset()
    })
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        disabled={isPending}
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative"
      >
        <SmartAvatar
          className="size-20"
          src={avatarUrl ?? undefined}
          alt={name}
          fallback={ isPending ? <Spinner /> : name.slice(0, 2).toUpperCase() }
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
              disabled={isPending}
              onChange={(e) => {
                if (isPending) return
                const files = e.target.files
                if (!files) return
                field.onChange(files)
                queueMicrotask(() => {
                  form.handleSubmit(onSubmit)()
                })
              }}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </>
        )}
      />
    </div>
  )
}
