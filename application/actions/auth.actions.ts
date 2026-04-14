"use server";

import {
  otpSchema,
  signInSchema,
  signUpSchema,
} from "@/application/validation/auth.validation";
import { withServerAction } from "@/shared/hooks/with-server-action";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { revalidatePath } from "next/cache";
import { getLangServerSide } from "@/infrastructure/shared/utils/lang";
import { createRouter } from "@/i18n/router";
import { cookies } from "next/headers";
import { appModule } from "@/application/modules/app.module";
import * as yup from "yup";
import { EUserRole } from "@/domain/entities/profile.entity";

const googleAuthSchema = yup.object({
  redirectTo: yup.string().required(),
});

export const signInWithGoogleAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const { authService } = await appModule(lang, { cookies: cookieStore });

    const raw = Object.fromEntries(formData);
    const input = await googleAuthSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    });


    const redirectUrl = await authService.signInWithOAuth(
      "google",
      input.redirectTo,
    );

    // Guardar redirect URL en cookie para que el cliente la lea
    cookieStore.set("oauth_redirect_url", redirectUrl, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60, // 1 minuto
    });
  },
);

function formDataToObject(fd: FormData) {
  return Object.fromEntries(fd);
}

export const signUpAction = withServerAction(async (formData: FormData) => {
  const input = await signUpSchema.validate(formDataToObject(formData), {
    abortEarly: false,
  });
  const lang = await getLangServerSide();
  const cookieStore = await cookies();
  const { authService } = await appModule(lang, { cookies: cookieStore });

  await authService.signUp(input);
});

export const signInAction = withServerAction(async (formData: FormData) => {
  const input = await signInSchema.validate(formDataToObject(formData), {
    abortEarly: false,
  });
  const lang = await getLangServerSide();
  const cookieStore = await cookies();
  const routes = createRouter(lang);
  const { authService, cookiesService, sessionService } = await appModule(
    lang,
    {
      cookies: cookieStore,
    },
  );

  const role = await authService.signIn(input.email, input.password);
  cookiesService.setSession(COOKIE_NAMES.ROLE, role);

  if (role === EUserRole.RealEstate || role === EUserRole.Admin) {
    const realEstates = await sessionService.getRealEstatesForUser();

    if (realEstates.length === 1) {
      const current = realEstates[0];
      cookiesService.setSession(
        COOKIE_NAMES.REAL_ESTATE,
        current.real_estate.id,
      );
      cookiesService.setSession(COOKIE_NAMES.REAL_ESTATE_ROLE, current.role);
    }

    return { redirectTo: routes.onboarding() }; // ✅ faltaba este return
  }

  return { redirectTo: routes.home() };
});

export const signOutAction = withServerAction(async () => {
  const lang = await getLangServerSide();
  const routes = createRouter(lang);
  const cookieStore = await cookies();

  const { authService, cookiesService } = await appModule(lang, {
    cookies: cookieStore,
  });

  await authService.signOut();

  cookiesService.clearSession();
  revalidatePath(routes.dashboard());
});

export const sentOtpAction = withServerAction(async (formData: FormData) => {
  const input = await otpSchema.validate(formDataToObject(formData), {
    abortEarly: false,
  });

  const lang = await getLangServerSide();
  const cookieStore = await cookies();
  const { authService } = await appModule(lang, { cookies: cookieStore });

  await authService.sendOtp(input.email);
});
