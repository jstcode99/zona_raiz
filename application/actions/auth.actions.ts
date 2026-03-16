"use server"

import { cookies } from "next/headers"
import { handleError } from "@/application/errors/handle-error"
import { otpSchema, signInSchema, signUpSchema } from "../validation/auth.validation"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { authModule } from "../modules/auth.module"
import { CACHE_TAGS, COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants"
import { revalidateTag } from "next/cache"
import { getLangServerSide } from "@/shared/utils/lang"

function formDataToObject(fd: FormData) {
  return Object.fromEntries(fd)
}

export const signUpAction = withServerAction(
  async (formData: FormData) => {
    try {
      const input = await signUpSchema.validate(
        formDataToObject(formData),
        { abortEarly: false }
      )
      const lang = await getLangServerSide()
      const { authService } = await authModule(lang)
      await authService.signUp(input)

    } catch (error) {
      handleError(error)
    }
  }
)

export const signInAction = withServerAction(
  async (formData: FormData) => {
    try {
      const input = await signInSchema.validate(
        formDataToObject(formData),
        { abortEarly: false }
      )

      const lang = await getLangServerSide()
      const { authService } = await authModule(lang)
      const role = await authService.signIn(input.email, input.password)

      const cookieStore = await cookies()
      cookieStore.set(COOKIE_NAMES.ROLE, role, COOKIE_OPTIONS)

    } catch (error) {
      handleError(error)
    }
  }
)

export const signOutAction = withServerAction(
  async () => {
    try {
      const cookieStore = await cookies()

      const lang = await getLangServerSide()
      const { authService } = await authModule(lang)
      await authService.signOut()

      cookieStore.delete(COOKIE_NAMES.ROLE)
      cookieStore.delete(COOKIE_NAMES.REAL_ESTATE)
      cookieStore.delete(COOKIE_NAMES.REAL_ESTATE_ROLE)

    } catch (error) {
      handleError(error)
    }
  }
)


export const sentOtpAction = withServerAction(
  async (formData: FormData) => {
    try {
      const input = await otpSchema.validate(
        formDataToObject(formData),
        { abortEarly: false }
      )
      const lang = await getLangServerSide()
      const { authService } = await authModule(lang)
      await authService.sendOtp(input.email)

    } catch (error) {
      handleError(error)
    }
  }
)