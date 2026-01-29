'use client'

import { ThemeProvider } from 'next-themes';
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createQueryClient } from '@/lib/queryClient'
import AppToaster from '@/app/components/ui/toast'
import { ReactNode, useState } from 'react'
import '@/lib/i18n'

export function Providers({
  children,
  dehydratedState
}: {
  children: ReactNode,
  dehydratedState?: unknown
}) {
  const clientIdGoogle = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const [queryClient] = useState(createQueryClient)

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
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <GoogleOAuthProvider clientId={clientIdGoogle}>
            <AppToaster />
            {children}
          </GoogleOAuthProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  )
}