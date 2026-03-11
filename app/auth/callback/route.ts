import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { COOKIE_NAMES, COOKIE_OPTIONS, ROUTES } from "@/infrastructure/config/constants"
import { createAuthModule } from "@/application/modules/auth.module"
import { ProfileEntity } from "@/domain/entities/profile.entity"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const cookieStore = await cookies()
  // wiring manual por request
  const authModule = await AuthModule()

  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")

  let profile: ProfileEntity | null = null 
  /**
   * OAuth login
   */
  if (code) {
    profile = await authModule.useCases.exchangeCodeForSession(code)

    if (!profile) {
      console.error("OAuth callback error")
      return NextResponse.redirect(`${ROUTES.SIGN_IN}?error=oauth_error`)
    }

    if (profile?.role) {
      cookieStore.set(COOKIE_NAMES.ROLE, profile.role, COOKIE_OPTIONS)
    }

    return NextResponse.redirect(`${origin}/${ROUTES.ONBOARDING}`)
  }

  /**
   * OTP login o email verification
   */
  if (token_hash && type) {
    profile = await authModule.useCases.verifyOtp(token_hash, type)

    if (!profile) {
      console.error("OTP verification error:")
      return NextResponse.redirect(`${ROUTES.OTP}?error=invalid_or_expired_link`)
    }

    if (profile?.role) {
      cookieStore.set(COOKIE_NAMES.ROLE, profile.role, COOKIE_OPTIONS)
    }

    const redirectPath =
      type === "recovery"
        ? ROUTES.OTP
        : ROUTES.ONBOARDING

    return NextResponse.redirect(`${origin}${redirectPath}`)
  }

  return NextResponse.redirect(`${origin}/auth/sign-in?error=missing_token`)
}