import { cookies } from 'next/headers'

export interface SessionUser {
  id: number
  role: 'admin' | 'agent' | 'client'
}

export async function getSession(): Promise<SessionUser | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/me`,
    {
      headers: {
        Cookie: cookies().toString(),
      },
      cache: 'no-store',
    },
  )

  if (!res.ok) return null

  return res.json()
}
