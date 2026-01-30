'use client'

import { ThemeProvider } from 'next-themes';
import { GoogleOAuthProvider } from '@react-oauth/google'
import AppToaster from '@/components/ui/toast'
import { ReactNode } from 'react'
import '@/lib/i18n'

export function Providers({
  children,
  dehydratedState
}: {
  children: ReactNode,
  dehydratedState?: unknown
}) {
  const clientIdGoogle = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!clientIdGoogle) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined')
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
        <GoogleOAuthProvider clientId={clientIdGoogle}>
          <AppToaster />
          {children}
        </GoogleOAuthProvider>
    </ThemeProvider>
  )
}