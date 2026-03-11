import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { COOKIE_NAMES, COOKIE_OPTIONS, ROUTES } from "@/infrastructure/config/constants"
import { ProfileEntity } from "@/domain/entities/profile.entity"
import { authModule } from "@/application/modules/auth.module"
import { initI18n } from "@/i18n/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const lang = request.nextUrl.pathname.split("/")[1] || "es"
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)

  const cookieStore = await cookies()
  // wiring manual por request
  const { authService } = await authModule()

  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type")

  let profile: ProfileEntity | null = null
  /**
   * OAuth login
   */
  if (code) {
    profile = await authService.exchangeCodeForSession(code)

    if (!profile) {
      return NextResponse.redirect(`${ROUTES.SIGN_IN}?error=${t('errors.auth_error')}`)
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
    profile = await authService.verifyOtp(token_hash, type)

    if (!profile) {
      console.error("OTP verification error:")
      return NextResponse.redirect(`${ROUTES.OTP}?error=${t('errors.invalid_or_expired_link')}`)
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

  return NextResponse.redirect(`${origin}/auth/sign-in?error=${t('errors.missing_token')}`)
}