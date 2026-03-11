import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants"
import { ProfileEntity } from "@/domain/entities/profile.entity"

import { authModule } from "@/application/modules/auth.module"

import { initI18n } from "@/i18n/server"
import { createRouter } from "@/i18n/router"
import { Lang } from "@/i18n/settings"

const SUPPORTED_LANGS = ["es", "en"]

function extractLang(request: NextRequest): Lang {
  const segment = request.nextUrl.pathname.split("/")[1]

  if (SUPPORTED_LANGS.includes(segment)) {
    return segment as Lang
  }

  return "es"
}

export async function GET(request: NextRequest) {

  const { searchParams, origin } = new URL(request.url)

  const lang = extractLang(request)

  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)

  const routes = createRouter(lang)

  const cookieStore = await cookies()

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

      return NextResponse.redirect(
        `${origin}${routes.signin()}?error=${t("errors.auth_error")}`
      )
    }

    if (profile.role) {
      cookieStore.set(COOKIE_NAMES.ROLE, profile.role, COOKIE_OPTIONS)
    }

    return NextResponse.redirect(
      `${origin}${routes.onboarding()}`
    )
  }

  /**
   * OTP login o email verification
   */
  if (token_hash && type) {

    profile = await authService.verifyOtp(token_hash, type)

    if (!profile) {

      return NextResponse.redirect(
        `${origin}${routes.otp()}?error=${t("errors.invalid_or_expired_link")}`
      )
    }

    if (profile.role) {
      cookieStore.set(COOKIE_NAMES.ROLE, profile.role, COOKIE_OPTIONS)
    }

    const redirectPath =
      type === "recovery"
        ? routes.otp()
        : routes.onboarding()

    return NextResponse.redirect(
      `${origin}${redirectPath}`
    )
  }

  return NextResponse.redirect(
    `${origin}${routes.signin()}?error=${t("errors.missing_token")}`
  )
}