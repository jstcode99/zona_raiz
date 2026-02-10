import { AuthRepository } from "@/domain/repositories/AuthRepository"
import { AuthError } from "@/domain/errors/AuthError"

export async function signIn(
  repo: AuthRepository,
  email: string,
  password: string
) {
  if (!email || !password) {
    throw new AuthError("Missing credentials")
  }

  return repo.signIn(email, password)
}
