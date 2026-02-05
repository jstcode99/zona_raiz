"use server"

import { signInController, signInOTPController, signOutController, signUpController } from "@/modules/auth/controllers/auth.controller"
import { signInSchema } from "@/types/schemas/signIn"
import { SignInDTO, SignInOtpDTO, SignUpDTO } from "@/modules/auth/types/auth.types"
import { withValidation } from "@/shared/actions/with-validations"
import { signUpSchema } from "@/types/schemas/signUp"
import { redirect } from 'next/navigation'
import { signInOtpSchema } from "@/types/schemas/signInOTP"
import { revalidatePath } from "next/cache"

export const signInAction = withValidation<SignInDTO, any>(
  signInSchema,
  async (input) => {
    const result = await signInController(input)
    if (!result.ok) {
      return result
    }
    revalidatePath('/dashboard')
    redirect('/dashboard/account')
  }
)

export const signInOTPAction = withValidation<SignInOtpDTO, any>(
  signInOtpSchema,
  async (input) => {
    const result = await signInOTPController(input)
    if (!result.ok) {
      return result
    }
    return result
  }
)

export const signUpAction = withValidation<SignUpDTO, any>(
  signUpSchema,
  async (input) => {
    const result = await signUpController(input)
    return result
  }
)

export async function signOutAction() {
  const result = await signOutController()
  if (!result.ok) {
    return result
  }
  redirect("/auth/sign-in")
}