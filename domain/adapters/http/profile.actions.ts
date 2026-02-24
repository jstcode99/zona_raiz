"use server";

import { SupabaseProfileAdapter } from "../supabase/supabase-profile.adapter";
import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { profileAvatarSchema, profileSchema } from "@/domain/entities/schemas/profile.schema";
import { revalidatePath } from "next/cache";
import { SupabaseSessionAdapter } from "../supabase/supabase-session.adapter";
import { updateAvatarProfile, UpdateProfile } from "@/domain/use-cases/profile.cases";


export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
    try {
        const rawData = Object.fromEntries(formData)

        const session = new SupabaseSessionAdapter();
        const userId = await session.getCurrentUserId();

        const data = await profileSchema.validate(rawData, {
            abortEarly: false,
            stripUnknown: true,
        })

        const useCase = new UpdateProfile(new SupabaseProfileAdapter());

        await useCase.execute(userId ?? '', data);

        revalidatePath("/dashboard/account")

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

export async function updateAvatarProfileAction(formData: FormData): Promise<ActionResult> {
    try {
        const rawData = Object.fromEntries(formData)

        const session = new SupabaseSessionAdapter();
        const userId = await session.getCurrentUserId();

        const data = await profileAvatarSchema.validate(rawData, {
            abortEarly: false,
            stripUnknown: true,
        })

        const useCase = new updateAvatarProfile(new SupabaseProfileAdapter());

        await useCase.execute(userId ?? '', data.avatar);

        revalidatePath("/dashboard/account")

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