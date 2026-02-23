"use server";

import { cookies } from "next/headers";
import { SupabaseAuthAdapter } from "../supabase/supabase-auth.adapter";
import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { SignOut } from "@/domain/use-cases/sign-out.case";
import { CACHE_TAGS, COOKIE_NAMES } from "@/infrastructure/config/constants";
import { revalidateTag } from "next/cache";

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