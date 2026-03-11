'use client'

import { ThemeProvider } from 'next-themes';
import { GoogleOAuthProvider } from '@react-oauth/google'
import AppToaster from '@/components/ui/toast'
import { ReactNode } from 'react'
import { I18nProvider } from "@/i18n/provider"

export function Providers({
  children,
}: {
  children: ReactNode,
}) {
  const clientIdGoogle = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!clientIdGoogle) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined')
  }

  return (
    <I18nProvider>
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
    </I18nProvider>
  )
}