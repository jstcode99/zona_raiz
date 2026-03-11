"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { realEstateModule } from "../modules/real-estate.module"
import { logoRealEstateSchema, realEstateSchema } from "../validation/real-estate.validation"
import { idSchema } from "../validation/base/id.schema"
import { cookies } from "next/headers"
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants"
import { mapRealEstateRowToDomain } from "../mappers/real-estate.mapper"
import { revalidatePath } from "next/cache"
import { ROUTES } from "@/infrastructure/config/routes"
import { getRoute } from "@/i18n/get-route"

export const createRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const { realEstateService } = await realEstateModule()

        const input = await realEstateSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false, stripUnknown: true }
        )

        await realEstateService.create(mapRealEstateRowToDomain(input))
    }
)

export const updateRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const { realEstateService } = await realEstateModule()

        const id = formData.get("id") as string

        const input = await realEstateSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false }
        )

        await realEstateService.update(id, mapRealEstateRowToDomain(input))

        revalidatePath(`${ROUTES.realEstates.es}`)
        revalidatePath(`${getRoute('realEstates', 'es', { id })}`)
        revalidatePath(`${ROUTES.realEstates.en}`)
        revalidatePath(`${getRoute('realEstates', 'en', { id })}`)
    }
)

export const deleteRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const { realEstateService } = await realEstateModule()
        const id = await idSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false }
        )
        await realEstateService.delete(id)

        revalidatePath(`${ROUTES.realEstates.es}`)
        revalidatePath(`${getRoute('realEstates', 'es', { id })}`)
        revalidatePath(`${ROUTES.realEstates.en}`)
        revalidatePath(`${getRoute('realEstates', 'en', { id })}`)
    }
)

export const uploadRealEstateLogoAction = withServerAction(
    async (formData: FormData) => {
        const { realEstateService } = await realEstateModule()

        const { id, logo } = await logoRealEstateSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false }
        )

        await realEstateService.uploadLogo(id, logo)

        revalidatePath(`${ROUTES.realEstates.es}`)
        revalidatePath(`${getRoute('realEstates', 'es', { id })}`)
        revalidatePath(`${ROUTES.realEstates.en}`)
        revalidatePath(`${getRoute('realEstates', 'en', { id })}`)
    }
)

export const setRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const cookieStore = await cookies()
        const realEstateId = formData.get("realEstateId") as string
        cookieStore.set(COOKIE_NAMES.REAL_ESTATE, realEstateId, COOKIE_OPTIONS)
    }
)