import { AuthRepository } from "@/domain/repositories/AuthRepository"
import { AuthError } from "@/domain/errors/AuthError"

export async function signUp(
  repo: AuthRepository,
  email: string,
  password: string
) {
  if (password.length < 6) {
    throw new AuthError("Password too short")
  }

  return repo.signUp(email, password)
}
