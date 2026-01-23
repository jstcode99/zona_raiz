'use client'

import { ThemeProvider } from 'next-themes';
import { QueryClientProvider, HydrationBoundary } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createQueryClient } from '@/lib/queryClient'
import AppToaster from '@/app/components/ui/toast'
import { ReactNode, useState } from 'react'

export function Providers({
  children,
  dehydratedState
}: {
  children: ReactNode,
  dehydratedState?: unknown
}) {
  const clientIdGoogle = ``
  const [queryClient] = useState(createQueryClient)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
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