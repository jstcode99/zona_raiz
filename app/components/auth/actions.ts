'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Tokens } from '@/lib/js-cookie'

export async function authAction(
    tokens: Tokens
): Promise<{ error?: string }> {

    const cookieStore = await cookies()

    cookieStore.set('accessToken', tokens.access_token, {
        httpOnly: true,
        secure: true,
        path: '/',
    })

    cookieStore.set('refreshToken', tokens.refresh_token, {
        httpOnly: true,
        secure: true,
        path: '/',
    })

    redirect('/')
}
