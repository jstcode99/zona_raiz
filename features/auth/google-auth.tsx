'use client'

import { Icon } from '@iconify/react'
import { useGoogleLogin } from '@react-oauth/google'
import i18next from '@/lib/i18n'
import { JSX } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createSupabaseBrowserClient } from '@/lib/supabase.client'

const supabase = await createSupabaseBrowserClient()

export default function GoogleAuth(): JSX.Element {
  const router = useRouter()

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Button
      onClick={() => signInGoogle()}
      variant="outline"
      type='button'
      className="w-full flex gap-2"
    >
      <Icon icon="flat-color-icons:google" className="text-[16px]" />
      {i18next.t('forms.sign-in.alternatives.google')}
    </Button>
  )
}
