import { createSupabaseRouteClient } from '@/infrastructure/db/supabase.route'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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
      return NextResponse.redirect(
        `${origin}/auth/sign-in?error=oauth_error`
      )
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
      cookieStore.set('user_role', profile.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
      })
    }

    return NextResponse.redirect(`${origin}/post-login`)
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
      return NextResponse.redirect(
        `${origin}/auth/sign-in?error=invalid_or_expired_link`
      )
    }

    // Para OTP también guardamos el rol si existe
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role) {
      cookieStore.set('user_role', profile.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    // Redirigir según el tipo de verificación
    const redirectPath = type === 'recovery' 
      ? '/auth/reset-password'  // Si es recuperación, ir a reset
      : '/post-login'     // Si es login o verificación, al dashboard

    return NextResponse.redirect(`${origin}${redirectPath}`)
  }

  /**
   * Invalid request, missing required parameters
   */
  return NextResponse.redirect(
    `${origin}/auth/sign-in?error=missing_token`
  )
}