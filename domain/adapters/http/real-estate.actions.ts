"use server";

import { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import { cookies } from "next/headers";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants";
import { revalidatePath } from "next/cache";
import {
    UpdateLogoRealEstate,
    UpdateRealEstate,
    CreateRealEstate
} from "@/domain/use-cases/real-estate.cases";
import { SupabaseRealEstateAdapter } from "../supabase/supabase-real-state.adapter";
import { logoRealEstateSchema } from "@/domain/entities/schemas/real-estate.schema";
import { realEstateSchema } from "@/domain/entities/schemas/real-estate.schema";

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

export async function createRealEstateAction(formData: FormData): Promise<ActionResult> {
    try {
        const rawData = Object.fromEntries(formData)

        const data = {
            name: rawData.name,
            description: rawData.description,
            whatsapp: rawData.whatsapp,
            address: typeof rawData.address === 'string'
                ? JSON.parse(rawData.address)
                : rawData.address,
        }

        const validated = await realEstateSchema.validate(data, {
            abortEarly: false,
            stripUnknown: true,
        })

        const useCase = new CreateRealEstate(
            new SupabaseRealEstateAdapter(),
        );

        await useCase.execute(validated);

        revalidatePath("/dashboard/my-real-estate")

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

export async function updateLogoRealEstateAction(formData: FormData): Promise<ActionResult> {
    try {
        const rawData = Object.fromEntries(formData)

        const data = await logoRealEstateSchema.validate(rawData, {
            abortEarly: false,
            stripUnknown: true,
        })

        const { id, logo } = data

        const useCase = new UpdateLogoRealEstate(new SupabaseRealEstateAdapter());

        await useCase.execute(id ?? '', logo);

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