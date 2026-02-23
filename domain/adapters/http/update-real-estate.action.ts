"use server";

import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { revalidatePath } from "next/cache";
import { realEstateSchema } from "@/domain/entities/schemas/real-estate.schema";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { cookies } from "next/headers";
import { UpdateRealEstate } from "@/domain/use-cases/update-real-estate.case";
import { SupabaseRealEstateAdapter } from "../supabase/supabase-real-state.adapter";

export async function updateRealEstateAction(formData: FormData): Promise<ActionResult> {
    try {
        const cookieStore = await cookies()

        const rawData = Object.fromEntries(formData)

        const data = {
            name: rawData.name,
            description: rawData.description,
            whatsapp: rawData.whatsapp,
            address: typeof rawData.address === 'string'
                ? JSON.parse(rawData.address)
                : rawData.address,
        }
        
        const realEstateId = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

        const validated = await realEstateSchema.validate(data, {
            abortEarly: false,
            stripUnknown: true,
        })

        const useCase = new UpdateRealEstate(new SupabaseRealEstateAdapter());


        await useCase.execute(realEstateId ?? '', validated);
        revalidatePath("/dashboard/real-estates");
        revalidatePath(`/dashboard/real-estates/${realEstateId}`);

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