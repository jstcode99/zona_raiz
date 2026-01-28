'use client'

import { Icon } from '@iconify/react'
import { useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import i18next from '@/lib/i18n'

import { $api } from '@/lib/api/client'
import { ApiPaths } from '@/types/api/schema'
import { useApiMutation } from '@/lib/api/useApiMutation'
import { setTokens, Tokens } from '@/lib/js-cookie'
import { JSX } from 'react'
import { Button } from '../ui/button'

export default function GoogleAuth(): JSX.Element {
  const router = useRouter()

  const signInSocial = useApiMutation(
    () => $api.useMutation('post', ApiPaths.signInSocial),
    {
      onSuccess: (tokens) => {
        setTokens(tokens as Tokens)
        router.push('/welcome')
      },
    },
  )

  const login = useGoogleLogin({
    onSuccess: (data) => {
      signInSocial.mutate({
        body: {
          token: data.access_token,
        },
        params: {
          path: {
            driver: 'google',
          },
        },
      })
    },
    onError: () => {
      console.error('Google login failed')
    },
  })

  return (
    <Button
      onClick={() => login()}
      variant="outline"
      type='button'
      className="w-full flex gap-2"
      disabled={signInSocial.isPending}
    >
      {signInSocial.isPending ? (
        <Icon
          icon="lucide:loader-circle"
          className="text-[16px] animate-spin"
        />
      ) : (
        <Icon icon="flat-color-icons:google" className="text-[16px]" />
      )}
      {i18next.t('forms.sign-in.alternatives.google')}
    </Button>
  )
}
