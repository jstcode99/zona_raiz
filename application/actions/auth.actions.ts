"use server";

import {
  otpSchema,
  signInSchema,
  signUpSchema,
} from "@/application/validation/auth.validation";
import { withServerAction } from "@/shared/hooks/with-server-action";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { revalidatePath } from "next/cache";
import { getLangServerSide } from "@/shared/utils/lang";
import { createRouter } from "@/i18n/router";
import { cookies } from "next/headers";
import { appModule } from "@/application/modules/app.module";

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
  const { authService, cookiesService } = await appModule(lang, {
    cookies: cookieStore,
  });

  const role = await authService.signIn(input.email, input.password);

  cookiesService.setSession(COOKIE_NAMES.ROLE, role);
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
