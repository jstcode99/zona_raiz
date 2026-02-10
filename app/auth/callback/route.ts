import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  if (!token_hash || !type) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=missing_token`
    )
  }
  const { error } = await (await supabase).auth.verifyOtp({
    type: type as 'signup' | 'recovery' | 'email_change' | 'email',
    token_hash,
  })

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/sign-in?error=invalid_or_expired_link`
    )
  }

  // ✅ sesión creada + cookies seteadas
  return NextResponse.redirect(`${origin}/dashboard/account`)
}