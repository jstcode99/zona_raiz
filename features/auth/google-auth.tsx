'use client'

import { Icon } from '@iconify/react'
import { useGoogleLogin } from '@react-oauth/google'
import i18next from '@/lib/i18n'
import { JSX } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function GoogleAuth(): JSX.Element {
  const router = useRouter()

  const onSubmit = async (token: string) => {
    try {

      router.push('/dashboard')
    } catch (error) {
      console.log(error)
    }
  }

  const signInGoogle = useGoogleLogin({
    onSuccess: (data) => {
      onSubmit(data.access_token)
    },
    onError: () => {
      console.error('Google login failed')
    },
  })

  return (
    <Button
      onClick={() => signInGoogle()}
      variant="outline"
      type='button'
      className="w-full flex gap-2"
    >
      {/* {false ? (
        <Icon
          icon="lucide:loader-circle"
          className="text-[16px] animate-spin"
        />
      ) : (
      )} */}
      <Icon icon="flat-color-icons:google" className="text-[16px]" />
      {i18next.t('forms.sign-in.alternatives.google')}
    </Button>
  )
}
