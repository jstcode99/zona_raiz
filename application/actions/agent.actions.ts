"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { agentToggleSchema } from "../validation/agent.validation"
import { revalidatePath, revalidateTag } from "next/cache"
import { getLangServerSide } from "@/shared/utils/lang"
import { cookies } from "next/headers"
import { appModule } from "../modules/app.module"
import { createRouter } from "@/i18n/router"
import { initI18n } from "@/i18n/server"
import { CACHE_TAGS } from "@/infrastructure/config/constants"

export const addAgentAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { agentService } = await appModule(lang, { cookies: cookieStore })

    const { real_estate_id, profile_id } =
      await agentToggleSchema.validate(Object.fromEntries(formData), { abortEarly: false })

    await agentService.addAgent(real_estate_id, profile_id)

    revalidatePath(routes.realEstates())
    revalidatePath(routes.realEstate(real_estate_id))

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.AGENT.PRINCIPAL, { expire: 0 })
    revalidateTag(CACHE_TAGS.AGENT.BY_REAL_ESTATE(real_estate_id), { expire: 0 })
  }
)

export const removeAgentAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const { agentService } = await appModule(lang, { cookies: cookieStore })

    const { real_estate_id, profile_id } =
      await agentToggleSchema.validate(Object.fromEntries(formData), { abortEarly: false })

    await agentService.removeAgent(real_estate_id, profile_id)

    revalidatePath(routes.realEstates())
    revalidatePath(routes.realEstate(real_estate_id))

    // Invalidar tags específicos del cache
    revalidateTag(CACHE_TAGS.AGENT.PRINCIPAL, { expire: 0 })
    revalidateTag(CACHE_TAGS.AGENT.BY_REAL_ESTATE(real_estate_id), { expire: 0 })
  }
)
