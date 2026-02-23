import { createSupabaseRouteClient } from '@/infrastructure/db/supabase.route'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAMES, COOKIE_OPTIONS, ROUTES } from '@/infrastructure/config/constants'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const supabase = await createSupabaseRouteClient()
  const cookieStore = await cookies()

  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  /**
   * Google / OAuth login
   */
  if (code) {
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !user) {
      console.error('OAuth callback error:', error)
      return NextResponse.redirect(`${ROUTES.SIGN_IN}?error=oauth_error`)
    }

    // Obtener perfil con rol y guardar en cookie
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // No bloqueamos el login si falla el perfil, pero loggeamos
    }

    if (profile?.role) {
      cookieStore.set(COOKIE_NAMES.ROLE, profile.role, COOKIE_OPTIONS)
    }

    return NextResponse.redirect(`${origin}/${ROUTES.ONBOARDING}`)
  }

  /**
   * OTP login (magic link) o verificación de email
   */
  if (token_hash && type) {
    const { data: { user }, error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'recovery' | 'email_change' | 'email',
      token_hash,
    })

    if (error || !user) {
      console.error('OTP verification error:', error)
      return NextResponse.redirect(`${ROUTES.OTP}?error=invalid_or_expired_link`)
    }

    // Para OTP también guardamos el rol si existe
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role) {
      cookieStore.set(COOKIE_NAMES.ROLE, profile.role, COOKIE_OPTIONS)
    }

    // Redirigir según el tipo de verificación
    const redirectPath = type === 'recovery'
      ? ROUTES.OTP  // Si es recuperación, ir a reset
      : ROUTES.ONBOARDING    // Si es login o verificación, al dashboard

    return NextResponse.redirect(`${origin}${redirectPath}`)
  }

  /**
   * Invalid request, missing required parameters
   */
  return NextResponse.redirect(
    `${origin}/auth/sign-in?error=missing_token`
  )
}