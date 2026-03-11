"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { SupabaseBrowserClient } from "@/lib/supabase.client"
import { IconBrandGoogle } from "@tabler/icons-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface GoogleAuthProps {
  disabled?: boolean
}

export default function GoogleAuth({ disabled }: GoogleAuthProps) {
  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const supabase = await SupabaseBrowserClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) throw error
    } catch (error) {
      console.error("Google sign in error:", error)
      // El error se maneja via URL params en el callback
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Spinner className="mr-2 h-4 w-4" />
      ) : (
        <IconBrandGoogle className="mr-2 h-4 w-4" />
      )}
      {t('forms.sign-in.alternatives.google')}
    </Button>
  )
}