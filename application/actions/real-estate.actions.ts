"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { createRealEstateModule } from "../containers/real-estate.container"
import { logoRealEstateSchema, realEstateSchema } from "../validation/real-estate.validation"
import { idSchema } from "../validation/base/id.schema"
import { cookies } from "next/headers"
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants"
import { mapRealEstateRowToDomain } from "../mappers/real-estate.mapper"
import { revalidatePath } from "next/cache"

export const createRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const { useCases } = await createRealEstateModule()

        const input = await realEstateSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false, stripUnknown: true }
        )

        await useCases.create(mapRealEstateRowToDomain(input))
    }
)

export const updateRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const { useCases } = await createRealEstateModule()

        const id = formData.get("id") as string

        const input = await realEstateSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false }
        )

        await useCases.update(id, mapRealEstateRowToDomain(input))

        revalidatePath("/dashboard/real-estates");
        revalidatePath(`/dashboard/real-estates/${id}`);
    }
)

export const deleteRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const { useCases } = await createRealEstateModule()
        const id = await idSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false }
        )
        await useCases.delete(id)
        revalidatePath("/dashboard/real-estates");
        revalidatePath(`/dashboard/real-estates/${id}`);
    }
)

export const uploadRealEstateLogoAction = withServerAction(
    async (formData: FormData) => {
        const { useCases } = await createRealEstateModule()

        const { id, logo } = await logoRealEstateSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false }
        )

        await useCases.uploadLogo(id, logo)

        revalidatePath("/dashboard/real-estates");
        revalidatePath(`/dashboard/real-estates/${id}`);
    }
)

export const setRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const cookieStore = await cookies()
        const realEstateId = formData.get("realEstateId") as string
        cookieStore.set(COOKIE_NAMES.REAL_ESTATE, realEstateId, COOKIE_OPTIONS)
    }
)