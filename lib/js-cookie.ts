'use client'

import Cookies from 'js-cookie'
import { toast } from 'sonner'

// -----------------------------
// ENV (Next.js)
// -----------------------------
const REFRESH_TOKEN_URL =
  process.env.NEXT_PUBLIC_API_REFRESH_TOKEN!

// -----------------------------
// Types
// -----------------------------
export interface Tokens {
  access_token: string
  refresh_token: string
}

// -----------------------------
// Cookie helpers (DOMAIN-LOCKED)
// -----------------------------
export function getCurrentAccessToken(): string | undefined {
  return Cookies.get('accessToken')
}

export function getCurrentRefreshToken(): string | undefined {
  return Cookies.get('refreshToken')
}

export function setTokens(tokens: Tokens): void {
  const isSecure = window.location.protocol === 'https:'

  // ❗ NO domain → solo este dominio exacto
  const cookieOptions: Cookies.CookieAttributes = {
    secure: isSecure,
    sameSite: 'strict',
  }

  Cookies.set('accessToken', tokens.access_token, cookieOptions)
  Cookies.set('refreshToken', tokens.refresh_token, cookieOptions)
}

export function removeSession(): void {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
}

// -----------------------------
// Refresh token
// -----------------------------
export async function refreshToken(): Promise<string> {
  const refresh = getCurrentRefreshToken()

  if (!refresh) {
    removeSession()
    throw new Error('No refresh token')
  }

  const response = await fetch(REFRESH_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${refresh}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refresh }),
  })

  if (!response.ok) {
    removeSession()
    window.location.href = '/sign-in'
    throw new Error('Refresh failed')
  }

  const newTokens = (await response.json()) as Tokens
  setTokens(newTokens)

  return newTokens.access_token
}

// -----------------------------
// Error toast helper
// -----------------------------
export const showFetchError = async (response: Response) => {
  try {
    const data = await response.clone().json()
    const message =
      data?.message ??
      data?.detail ??
      response.statusText ??
      'Unknown error'

    toast.error(`Error ${response.status}`, {
      description: message,
    })

    return data
  } catch {
    toast.error('Unexpected error', {
      description: 'Could not parse error response',
    })
  }
}

// -----------------------------
// Fetch wrapper with refresh
// -----------------------------
let refreshingPromise: Promise<string> | null = null

export async function withRefresh(
  fetchFn: () => Promise<Response>,
  onRefreshFail: () => void = removeSession,
): Promise<Response> {
  const res = await fetchFn()

  if (res.status !== 401) return res

  if (!refreshingPromise) {
    refreshingPromise = refreshToken().finally(() => {
      refreshingPromise = null
    })
  }

  try {
    await refreshingPromise
    return await fetchFn()
  } catch {
    onRefreshFail()
    return res
  }
}
