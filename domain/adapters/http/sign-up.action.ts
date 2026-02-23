"use server";

import { SupabaseAuthAdapter } from "../supabase/supabase-auth.adapter";
import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { signUpSchema } from "@/domain/entities/schemas/sign-up-schema";
import { SignUp } from "@/domain/use-cases/sign-up.case";
import { revalidatePath } from "next/cache";

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