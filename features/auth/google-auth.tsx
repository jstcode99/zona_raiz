"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { IconBrandGoogle } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { signInWithGoogleAction } from "@/application/actions/auth.actions"
import { toast } from "sonner"

interface GoogleAuthProps {
  disabled?: boolean
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export default function GoogleAuth({ disabled }: GoogleAuthProps) {
  const { t } = useTranslation("auth")

  const { action: handleGoogleSignIn, isPending } = useServerMutation({
    action: signInWithGoogleAction,
    onSuccess: () => {
      // Read redirect URL from cookie set by server action
      const redirectUrl = getCookie("oauth_redirect_url")
      if (redirectUrl) {
        // Clear the cookie after use
        document.cookie = "oauth_redirect_url=; Max-Age=0"
        window.location.href = redirectUrl
      } else {
        toast.error(t("errors.googleSignIn"))
      }
    },
    onError: (error) => {
      toast.error(error.message || t("errors.googleSignIn"))
    },
  })

  const onClick = () => {
    const formData = new FormData()
    formData.set("redirectTo", `${window.location.origin}/auth/callback`)
    handleGoogleSignIn(formData)
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={disabled || isPending}
    >
      {isPending ? (
        <Spinner className="mr-2 h-4 w-4" />
      ) : (
        <IconBrandGoogle className="mr-2 h-4 w-4" />
      )}
      {t('actions.google')}
    </Button>
  )
}
