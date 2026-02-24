"use server";

import { SupabaseAuthAdapter } from "../supabase/supabase-auth.adapter";
import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { otpSchema } from "@/domain/entities/schemas/email-otp.schema";
import { OTP, SignIn, SignOut, SignUp } from "@/domain/use-cases/auth.cases";
import { signInSchema } from "@/domain/entities/schemas/sign-in-schema";
import { cookies } from "next/headers";

import { SupabaseProfileAdapter } from "../supabase/supabase-profile.adapter";
import { COOKIE_NAMES, COOKIE_OPTIONS, CACHE_TAGS } from "@/infrastructure/config/constants";
import { revalidateTag } from "next/cache";
import { signUpSchema } from "@/domain/entities/schemas/sign-up-schema";
import { revalidatePath } from "next/cache";

export async function otpAction(formData: FormData): Promise<ActionResult> {
    try {
        const rawData = Object.fromEntries(formData)

        const { email } = await otpSchema.validate(rawData, {
            abortEarly: false,
            stripUnknown: true,
        })

        const useCase = new OTP(
            new SupabaseAuthAdapter(),
        );

        await useCase.execute(email);

        return { success: true };
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
        return { success: false }
    }
}

export async function signInAction(formData: FormData): Promise<ActionResult> {
    try {
        const rawData = Object.fromEntries(formData)

        const { email, password } = await signInSchema.validate(rawData, {
            abortEarly: false,
            stripUnknown: true,
        })

        const useCase = new SignIn(
            new SupabaseAuthAdapter(),
            new SupabaseProfileAdapter()
        );

        const { role } = await useCase.execute({
            email: email as string,
            password: password as string
        });
        
        const cookieStore = await cookies()
        cookieStore.set(COOKIE_NAMES.ROLE, role, COOKIE_OPTIONS)

        return { success: true };

    } catch (e: any) {
        if (e.name === "ValidationError") {
            return { success: false, error: { message: e.message } };
        }
        return {
            success: false,
            error: { field: "root", message: "Credenciales inválidas" }
        };
    }
}

export async function signUpAction(formData: FormData): Promise<ActionResult> {
     try {
        const rawData = Object.fromEntries(formData)

        const data = await signUpSchema.validate(rawData, {
            abortEarly: false,
            stripUnknown: true,
        })

        const useCase = new SignUp(
            new SupabaseAuthAdapter(),
        );

        await useCase.execute(data);
        
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

export async function signOutAction(): Promise<ActionResult> {
    try {
        const cookieStore = await cookies()

        const useCase = new SignOut(
            new SupabaseAuthAdapter(),
        );
        await useCase.execute();

        cookieStore.delete(COOKIE_NAMES.ROLE)
        cookieStore.delete(COOKIE_NAMES.REAL_ESTATE)
        revalidateTag(CACHE_TAGS.AUTH.USER, {})
        revalidateTag(CACHE_TAGS.AUTH.SESSION, {})
        return { success: true };
    } catch (e: any) {
        if (e.name === "ValidationError") {
            return { success: false, error: { message: e.message } };
        }
        return {
            success: false,
            error: { field: "root", message: "Credenciales inválidas" }
        };
    }
}