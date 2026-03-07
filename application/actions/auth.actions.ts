"use server"

import { cookies } from "next/headers"
import { handleError } from "@/application/errors/handle-error"
import { otpSchema, signInSchema, signUpSchema } from "../validation/auth.validation"
import { withServerAction } from "@/shared/hooks/with-server-action"
import { createAuthModule } from "../containers/auth.container"
import { CACHE_TAGS, COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants"
import { revalidateTag } from "next/cache"

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

      const { useCases } = await createAuthModule()

      await useCases.signUp(input)

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

      const { useCases } = await createAuthModule()
      const role = await useCases.signIn(input.email, input.password)

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

      const { useCases } = await createAuthModule()
      await useCases.signOut()

      cookieStore.delete(COOKIE_NAMES.ROLE)
      cookieStore.delete(COOKIE_NAMES.REAL_ESTATE)
      cookieStore.delete(COOKIE_NAMES.REAL_ESTATE_ROLE)
      
      revalidateTag(CACHE_TAGS.AUTH.USER, {})
      revalidateTag(CACHE_TAGS.AUTH.SESSION, {})
    
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

      const { useCases } = await createAuthModule()

      await useCases.sendOtp(input.email)

    } catch (error) {
      handleError(error)
    }
  }
)