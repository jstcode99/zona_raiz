import { AuthRepository } from "@/domain/repositories/AuthRepository"
import { AuthError } from "@/domain/errors/AuthError"

export async function otp(
  repo: AuthRepository,
  email: string,
) {
  if (email.trim().length === 0) {
    throw new AuthError("Email is required")
  }
  return repo.otp(email)
}
