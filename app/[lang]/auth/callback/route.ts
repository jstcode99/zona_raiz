import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
} from "@/infrastructure/config/constants";
import { ProfileEntity } from "@/domain/entities/profile.entity";
import { initI18n } from "@/i18n/server";
import { createRouter } from "@/i18n/router";
import { appModule } from "@/application/modules/app.module";
import { detectLang } from "@/i18n/detect-lang";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const lang = detectLang(request);

  const i18n = await initI18n(lang);
  const t = i18n.getFixedT(lang);
  const routes = createRouter(lang);
  const cookieStore = await cookies();

  const { authService } = await appModule(lang, { cookies: cookieStore });

  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  // Extraer tokens del URL (pueden venir en query params o hash parseado por el cliente)
  // Nota: El hash (#) no se envía al servidor, pero algunos setups de OAuth lo mandan como query param
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  let profile: ProfileEntity | null = null;

  /**
   * OAuth implicit flow - access_token en URL hash
   */
  if (accessToken && refreshToken) {
    profile = await authService.setSessionFromAccessToken(
      accessToken,
      refreshToken,
    );

    if (!profile) {
      return NextResponse.redirect(
        `${origin}${routes.signin()}?error=${t("auth:exceptions.auth_error")}`,
      );
    }

    if (profile.role) {
      cookieStore.set(COOKIE_NAMES.ROLE, profile.role, COOKIE_OPTIONS);
    }

    return NextResponse.redirect(`${origin}${routes.onboarding()}`);
  }

  /**
   * OAuth PKCE flow - code en query param
   */
  if (code) {
    profile = await authService.exchangeCodeForSession(code);

    if (!profile) {
      return NextResponse.redirect(
        `${origin}${routes.signin()}?error=${t("auth:exceptions.auth_error")}`,
      );
    }

    if (profile.role) {
      cookieStore.set(COOKIE_NAMES.ROLE, profile.role, COOKIE_OPTIONS);
    }

    return NextResponse.redirect(`${origin}${routes.onboarding()}`);
  }

  /**
   * OTP login o email verification
   */
  if (token_hash && type) {
    profile = await authService.verifyOtp(token_hash, type);

    if (!profile) {
      return NextResponse.redirect(
        `${origin}${routes.otp()}?error=${t("auth:exceptions.invalid_or_expired_link")}`,
      );
    }

    if (profile.role) {
      cookieStore.set(COOKIE_NAMES.ROLE, profile.role, COOKIE_OPTIONS);
    }

    const redirectPath =
      type === "recovery" ? routes.otp() : routes.onboarding();

    return NextResponse.redirect(`${origin}${redirectPath}`);
  }

  return NextResponse.redirect(
    `${origin}${routes.signin()}?error=${t("auth:exceptions.missing_token")}`,
  );
}
