"use server";

import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { cookies } from "next/headers";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants";

export async function setRealEstateAction(realEstateId: string): Promise<ActionResult> {
    try {
        const cookieStore = await cookies()
        cookieStore.set(COOKIE_NAMES.REAL_ESTATE, realEstateId, COOKIE_OPTIONS)
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