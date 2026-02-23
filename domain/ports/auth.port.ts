import {  AuthEmailEntity } from "../entities/auth-user.entity"
import { SignUpFormValues } from "../entities/schemas/sign-up-schema"

export interface AuthPort {
  signIn(email: string, password: string): Promise<AuthEmailEntity>
  signUp(input: SignUpFormValues): Promise<void>
  otp(email: string): Promise<void>
  signOut(): Promise<void>
}