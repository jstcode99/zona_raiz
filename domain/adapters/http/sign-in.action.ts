"use server";
import { cookies } from "next/headers";

import { signInSchema } from "@/domain/entities/schemas/sign-in-schema";
import { SignIn } from "@/domain/use-cases/sign-in.case";
import { SupabaseAuthAdapter } from "../supabase/supabase-auth.adapter";
import { SupabaseProfileAdapter } from "../supabase/supabase-profile.adapter";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants";
import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";


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