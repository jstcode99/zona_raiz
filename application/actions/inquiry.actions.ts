"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { revalidatePath } from "next/cache"
import { getLangServerSide } from "@/shared/utils/lang"
import { cookies } from "next/headers"
import { createRouter } from "@/i18n/router"
import { appModule } from "../modules/app.module"
import { initI18n } from "@/i18n/server"

export const deleteInquiryAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const {
      sessionService,
      inquiryService
    } = await appModule(lang, { cookies: cookieStore })

    const id = formData.get("id") as string
    if (!id) throw new Error(t('validations:required', {
      attribute: 'ID'
    }))

    const userId = await sessionService.getCurrentUserId()

    if (!userId) throw new Error(t('exceptions:unauthorized'))

    const inquiry = await inquiryService.findById(id)
    if (!inquiry || !inquiry.listing) throw new Error(t('exceptions:data_not_found'))

    const isAdmin = await sessionService.isAdmin()
    const isCoordinator = await sessionService.isCoordinator()
    const isAssignedAgent = inquiry.assigned_to === userId

    if (!isAdmin && !isCoordinator && !isAssignedAgent) throw new Error(t('exceptions:unauthorized'))
    await inquiryService.delete(id)

    revalidatePath(routes.inquiries())
  }
)

export const updateInquiryStatusAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const {
      sessionService,
      inquiryService
    } = await appModule(lang, { cookies: cookieStore })

    const id = formData.get("id") as string
    const status = formData.get("status") as string
    if (!id || !status) throw new Error("ID and status required")

    const userId = await sessionService.getCurrentUserId()
    if (!userId) throw new Error("No autorizado")

    const inquiry = await inquiryService.findById(id)
    if (!inquiry || !inquiry.listing) throw new Error(t('exceptions:data_not_found'))

    const isAdmin = await sessionService.isAdmin()
    const isCoordinator = await sessionService.isCoordinator()
    const isAssignedAgent = inquiry.assigned_to === userId

    if (!isAdmin && !isCoordinator && !isAssignedAgent) throw new Error(t('exceptions:unauthorized'))

    await inquiryService.update(id, { status: status as any })
    revalidatePath(routes.inquiries())
  }
)

export const assignInquiryAction = withServerAction(
  async (formData: FormData) => {
    const lang = await getLangServerSide()
    const cookieStore = await cookies()
    const routes = createRouter(lang)
    const i18n = await initI18n(lang)
    const t = i18n.getFixedT(lang)

    const {
      sessionService,
      inquiryService,
      profileService
    } = await appModule(lang, { cookies: cookieStore })

    const id = formData.get("id") as string
    const assigned_to = formData.get("assigned_to") as string
    if (!id || !assigned_to) throw new Error(t('exceptions:unauthorized'))

    const inquiry = await inquiryService.findById(id)
    if (!inquiry || !inquiry.listing) throw new Error(t('exceptions:data_not_found'))

    const userId = await sessionService.getCurrentUserId()
    if (!userId) throw new Error(t('exceptions:unauthorized'))

    const isAdmin = await sessionService.isAdmin()
    const isCoordinator = await sessionService.isCoordinator()

    if (!isAdmin && !isCoordinator) throw new Error(t('exceptions:unauthorized'))
    const realEstateId = inquiry.listing.real_estate_id

    const targetAgent = await profileService.getAgentRoleInRealEstate(assigned_to, realEstateId)
    if (!targetAgent) throw new Error(t('exceptions:unauthorized'))
    
      await inquiryService.update(id, { assigned_to })

    revalidatePath(routes.inquiries())
  }
)
