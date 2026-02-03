"use server"

import { signInController, signUpController } from "@/modules/user/auth/controllers/auth.controller"
import { signInSchema } from "@/types/schemas/signIn"
import { SignInDTO, SignUpDTO } from "@/modules/user/auth/types/auth.types"
import { withValidation } from "@/shared/actions/with-validations"
import { signUpSchema } from "@/types/schemas/signUp"
import { revalidatePath } from "next/cache"

export const signInAction = withValidation<SignInDTO, any>(
  signInSchema,
  async (input) => {
    const result = await signInController(input)
    revalidatePath("/")
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