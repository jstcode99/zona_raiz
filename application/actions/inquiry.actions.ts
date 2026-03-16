"use server"

import { withServerAction } from "@/shared/hooks/with-server-action"
import { inquiryModule } from "@/application/modules/inquiry.module"
import { sessionModule } from "@/application/modules/session.module"
import { profileModule } from "@/application/modules/profile.module"
import { revalidatePath } from "next/cache"
import { getLangServerSide } from "@/shared/utils/lang"
import { EUserRole } from "@/domain/entities/profile.entity"
import { EAgentRole } from "@/domain/entities/real-estate-agent.entity"

export const deleteInquiryAction = withServerAction(
  async (formData: FormData) => {
    const id = formData.get("id") as string
    if (!id) throw new Error("ID required")

    const lang = await getLangServerSide()
    const { inquiryService } = await inquiryModule()
    const { sessionService } = await sessionModule(lang)

    const userId = await sessionService.getCurrentUserId()
    if (!userId) throw new Error("No autorizado")

    const userRole = await sessionService.getCurrentUserAgentRole()
    if (!userRole) throw new Error("No tienes rol en la inmobiliaria")

    const inquiry = await inquiryService.findById(id)
    if (!inquiry || !inquiry.listing) throw new Error("Inquiry no encontrada")

    const isAdmin = userRole === 'admin'
    const isCoordinator = userRole === 'coordinator'
    const isAssignedAgent = inquiry.assigned_to === userId

    if (!isAdmin && !isCoordinator && !isAssignedAgent) {
      throw new Error("No tienes permiso para eliminar esta consulta. Debes ser administrador, coordinador o el agente asignado.")
    }

    await inquiryService.delete(id)
    revalidatePath("/dashboard/inquiries")
  }
)

export const updateInquiryStatusAction = withServerAction(
  async (formData: FormData) => {
    const id = formData.get("id") as string
    const status = formData.get("status") as string
    if (!id || !status) throw new Error("ID and status required")

    const lang = await getLangServerSide()
    const { inquiryService } = await inquiryModule()
    const { sessionService } = await sessionModule(lang)

    const userId = await sessionService.getCurrentUserId()
    if (!userId) throw new Error("No autorizado")

    const userRole = await sessionService.getCurrentUserAgentRole()
    if (!userRole) throw new Error("No tienes rol en la inmobiliaria")

    const inquiry = await inquiryService.findById(id)
    if (!inquiry || !inquiry.listing) throw new Error("Inquiry no encontrada")

    const isAdmin = userRole === 'admin'
    const isCoordinator = userRole === 'coordinator'
    const isAssignedAgent = inquiry.assigned_to === userId

    if (!isAdmin && !isCoordinator && !isAssignedAgent) {
      throw new Error("No tienes permiso para cambiar el estado de esta consulta. Debes ser administrador, coordinador o el agente asignado.")
    }

    await inquiryService.update(id, { status: status as any })
    revalidatePath("/dashboard/inquiries")
  }
)

export const assignInquiryAction = withServerAction(
  async (formData: FormData) => {
    const id = formData.get("id") as string
    const assigned_to = formData.get("assigned_to") as string
    if (!id || !assigned_to) throw new Error("ID and assigned_to required")

    const lang = await getLangServerSide()
    const { inquiryService } = await inquiryModule()
    const { sessionService } = await sessionModule(lang)
    const { profileService } = await profileModule(lang)
    
    const inquiry = await inquiryService.findById(id)
    if (!inquiry || !inquiry.listing) throw new Error("Inquiry no encontrada")

    const userId = await sessionService.getCurrentUserId()
    if (!userId) throw new Error("No autorizado")

    const roleProfile = await profileService.getCachedRoleByUserId(userId)
    if (!roleProfile) throw new Error("No tienes rol en el perfil")

    const roleRealEstate = await sessionService.getCurrentUserAgentRole()
    if (!roleRealEstate) throw new Error("No tienes rol en la inmobiliaria")

    const isAdmin = roleProfile === EUserRole.Admin
    const isCoordinator = roleRealEstate === EAgentRole.Coordinator

    if (!isAdmin && !isCoordinator) {
      throw new Error("No tienes permiso para asignar esta consulta. Solo administradores y coordinadores pueden asignar agentes.")
    }

    const realEstateId = inquiry.listing.real_estate_id

    // Verificar que el agente a asignar pertenezca a la misma inmobiliaria
    const targetAgent = await profileService.getAgentRoleInRealEstate(assigned_to, realEstateId)

    if (!targetAgent) {
      throw new Error("El agente seleccionado no pertenece a la inmobiliaria de esta propiedad.")
    }

    await inquiryService.update(id, { assigned_to })
    revalidatePath("/dashboard/inquiries")
  }
)
