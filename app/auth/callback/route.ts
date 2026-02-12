import { createSupabaseRouteClient } from '@/infrastructure/db/supabase.route'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const supabase = await createSupabaseRouteClient()

  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  /**
   * Google / OAuth login
   */
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        `${origin}/auth/sign-in?error=oauth_error`
      )
    }

    return NextResponse.redirect(`${origin}/dashboard/account`)
  }

  /**
   * OTP login (magic link)
   */
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'recovery' | 'email_change' | 'email',
      token_hash,
    })

    if (error) {
      return NextResponse.redirect(
        `${origin}/auth/sign-in?error=invalid_or_expired_link`
      )
    }

    return NextResponse.redirect(`${origin}/dashboard/account`)
  }

  /**
   * Invalid request, missing required parameters
   */
  return NextResponse.redirect(
    `${origin}/auth/sign-in?error=missing_token`
  )
}
