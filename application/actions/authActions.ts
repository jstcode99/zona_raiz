"use server"

import { SupabaseAuthRepository } from "@/infrastructure/db/SupabaseAuthRepository"
import { ActionResult } from "@/shared/hooks/useServerMutation"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { signUpSchema } from "@/domain/entities/schemas/signUpSchema"
import { signInSchema } from "@/domain/entities/schemas/signInSchema"
import { otpSchema } from "@/domain/entities/schemas/OTPSchema"

export async function signUpAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = Object.fromEntries(formData)
    
    const data = await signUpSchema.validate(rawData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const repo = new SupabaseAuthRepository()
    await repo.signUp(data)

    revalidatePath("/", "layout")
    
    return { success: true }
  } catch (error: unknown) {
    if (error && typeof error === "object" && "name" in error) {
      const err = error as { name: string; path?: string; message: string; errors?: string[] }
      
      if (err.name === "ValidationError") {
        return {
          success: false,
          error: {
            field: err.path,
            message: err.message,
          },
        }
      }
      
      // Error de Supabase (email duplicado, etc.)
      if (err.message?.includes("User already registered")) {
        return {
          success: false,
          error: {
            field: "email",
            message: "Email already registered",
          },
        }
      }
    }

    // Error genérico
    const message = error instanceof Error ? error.message : "Authentication failed"
    
    return {
      success: false,
      error: {
        message,
      },
    }
  }
}

export async function signInAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = Object.fromEntries(formData)
    const data = await signInSchema.validate(rawData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const repo = new SupabaseAuthRepository()
    const user = await repo.signIn(data.email, data.password)

    // Guardar rol en cookie (ya lo hace el repo, pero verificamos)
    if (user.role) {
      const cookieStore = await cookies()
      cookieStore.set("user_role", user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: "/",
      })
    }

    return { success: true }
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      
      if (message.includes("invalid login credentials")) {
        return {
          success: false,
          error: {
            message: "Invalid email or password",
          },
        }
      }
      
      if (message.includes("email not confirmed")) {
        return {
          success: false,
          error: {
            message: "Please confirm your email before signing in",
          },
        }
      }
      
      if (message.includes("too many requests")) {
        return {
          success: false,
          error: {
            message: "Too many attempts. Please try again later",
          },
        }
      }
    }

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Authentication failed",
      },
    }
  }
}

export async function otpAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const email = formData.get("email") as string

    // Validar
    await otpSchema.validate({ email }, { abortEarly: false })

    const repo = new SupabaseAuthRepository()
    await repo.otp(email)

    return { success: true }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ValidationError") {
      return {
        success: false,
        error: {
          field: "email",
          message: error.message,
        },
      }
    }

    return { success: true }
  }
}

export async function signOutAction() {
  const repo = new SupabaseAuthRepository()
  await repo.signOut()
  revalidatePath('/', 'layout');
}