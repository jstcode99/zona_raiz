"use server"

import { signInController, signOutController, signUpController } from "@/modules/auth/controllers/auth.controller"
import { signInSchema } from "@/types/schemas/signIn"
import { SignInDTO, SignUpDTO } from "@/modules/auth/types/auth.types"
import { withValidation } from "@/shared/actions/with-validations"
import { signUpSchema } from "@/types/schemas/signUp"
import { redirect } from 'next/navigation'

export const signInAction = withValidation<SignInDTO, any>(
  signInSchema,
  async (input) => {
    const result = await signInController(input)
    if (!result.ok) {
      return result
    }
    redirect("/dashboard/account")
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