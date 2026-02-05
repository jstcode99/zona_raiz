import { AuthService } from "../services/auth.service"
import { SupabaseAuthRepository } from "../repositories/supabase-auth.repository"
import { ok, fail } from "@/shared/actions/action-helpers"
import { SignInDTO, SignUpDTO } from "../types/auth.types"

const service = new AuthService(new SupabaseAuthRepository())

export async function signInController(data: SignInDTO) {
  try {
    await service.signIn(data)
    return ok()
  } catch (e: any) {
    return fail({
      code: "AUTH_ERROR",
      message: e.message,
    })
  }
}

export async function signUpController(data: SignUpDTO) {
  try {
    await service.signUp(data)
    return ok()
  } catch (e: any) {
    return fail({
      code: "AUTH_ERROR",
      message: e.message,
    })
  }
}


export async function signOutController() {
  try {
    await service.signOut()
    return ok()
  } catch (e: any) {
    return fail({
      code: "AUTH_ERROR",
      message: e.message,
    })
  }
}