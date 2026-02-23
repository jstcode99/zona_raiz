"use server";

import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { UpdateLogoRealEstate } from "@/domain/use-cases/update-logo-real-estate.case";
import { SupabaseRealEstateAdapter } from "../supabase/supabase-real-state.adapter";
import { logoRealEstateSchema } from "@/domain/entities/schemas/real-estate.schema";


export async function updateLogoRealEstateAction(formData: FormData): Promise<ActionResult> {
    try {
        const rawData = Object.fromEntries(formData)

        const cookieStore = await cookies()
        const realEstateId = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

        const data = await logoRealEstateSchema.validate(rawData, {
            abortEarly: false,
            stripUnknown: true,
        })

        const useCase = new UpdateLogoRealEstate(new SupabaseRealEstateAdapter());

        await useCase.execute(realEstateId ?? '', data.logo);

        revalidatePath("/dashboard/my-real-estate")

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