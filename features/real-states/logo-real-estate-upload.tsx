"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, Controller } from "react-hook-form"
import { useRef, useTransition } from "react"
import { optimizeImage } from "@/lib/utils"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { SmartAvatar } from "@/components/ui/smart-avatar"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { LogoFormValues, logoRealEstateSchema } from "@/domain/entities/schemas/real-estate.schema"
import { updateLogoRealEstateAction } from "@/domain/adapters/http/update-logo-real-estate.action"

type Props = {
  logoUrl?: string | null
  name: string
}

export function LogoRealEstateUpload({ logoUrl, name = '' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    resolver: yupResolver(logoRealEstateSchema),
  })

  const mutation = useServerMutation({
    action: updateLogoRealEstateAction,
    setError: form.setError,
  })

  async function onSubmit(data: LogoFormValues) {
    if (!data.logo) return

    startTransition(async () => {
      const optimized = await optimizeImage(data.logo!)

      const formData = new FormData()
      formData.append("logo", optimized)

      mutation.action(formData)
      form.reset()
    })
  }

  return (
    <>
      <SmartAvatar
        className="cursor-pointer size-25"
        src={logoUrl ?? undefined}
        alt={name}
        onClick={() => inputRef.current?.click()}
        fallback={
          isPending || mutation.isPending ? <Spinner /> : name.slice(0, 2).toUpperCase() ?? ''
        }
      />
      <Controller
        control={form.control}
        name="logo"
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
                form.setValue("logo", file, { shouldValidate: true })
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
