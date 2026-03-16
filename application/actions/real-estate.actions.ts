"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { logoRealEstateSchema, realEstateSchema } from "../validation/real-estate.validation"
import { idSchema } from "../validation/base/id.schema"
import { cookies } from "next/headers"
import { COOKIE_NAMES } from "@/infrastructure/config/constants"
import { mapRealEstateRowToDomain } from "../mappers/real-estate.mapper"
import { revalidatePath } from "next/cache"
import { getLangServerSide } from "@/shared/utils/lang"
import { appModule } from "../modules/app.module"
import { createRouter } from "@/i18n/router"
import { initI18n } from "@/i18n/server"

export const createRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const lang = await getLangServerSide()
        const cookieStore = await cookies()
        const routes = createRouter(lang)

        const { realEstateService } = await appModule(lang, { cookies: cookieStore })

        const input = await realEstateSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false, stripUnknown: true }
        )

        await realEstateService.create(mapRealEstateRowToDomain(input))

        revalidatePath(routes.dashboard())
        revalidatePath(routes.realEstates())
    }
)

export const updateRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const lang = await getLangServerSide()
        const cookieStore = await cookies()
        const routes = createRouter(lang)
        const i18n = await initI18n(lang)
        const t = i18n.getFixedT(lang)

        const { realEstateService } = await appModule(lang, { cookies: cookieStore })

        const id = formData.get("id") as string

        const input = await realEstateSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false }
        )

        await realEstateService.update(id, mapRealEstateRowToDomain(input))

        revalidatePath(routes.realEstates())
        revalidatePath(routes.realEstate(id))
    }
)

export const deleteRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const lang = await getLangServerSide()
        const cookieStore = await cookies()
        const routes = createRouter(lang)

        const { realEstateService } = await appModule(lang, { cookies: cookieStore })

        const id = await idSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false }
        )
        await realEstateService.delete(id)

        revalidatePath(routes.realEstate(id))
        revalidatePath(routes.realEstates())
        revalidatePath(routes.dashboard())
    }
)

export const uploadRealEstateLogoAction = withServerAction(
    async (formData: FormData) => {
        const lang = await getLangServerSide()
        const cookieStore = await cookies()
        const routes = createRouter(lang)

        const { realEstateService } = await appModule(lang, { cookies: cookieStore })

        const { id, logo } = await logoRealEstateSchema.validate(
            Object.fromEntries(formData),
            { abortEarly: false }
        )

        await realEstateService.uploadLogo(id, logo)

        revalidatePath(routes.realEstate(id))
        revalidatePath(routes.realEstates())
        revalidatePath(routes.dashboard())
    }
)

export const setRealEstateAction = withServerAction(
    async (formData: FormData) => {
        const lang = await getLangServerSide()
        const cookieStore = await cookies()
        const routes = createRouter(lang)

        const { cookiesService } = await appModule(lang, { cookies: cookieStore })

        const realEstateId = formData.get("realEstateId") as string

        cookiesService.setSession(COOKIE_NAMES.REAL_ESTATE, realEstateId)
        revalidatePath(routes.dashboard())
    }
)