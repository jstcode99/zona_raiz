"use server"

import { inquiryModule } from "@/application/modules/inquiry.module"
import { revalidatePath } from "next/cache"

export async function deleteInquiryAction(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) throw new Error("ID required")
  const { inquiryService } = await inquiryModule()
  await inquiryService.delete(id)
  revalidatePath("/dashboard/inquiries")
}

export async function updateInquiryStatusAction(formData: FormData) {
  const id = formData.get("id") as string
  const status = formData.get("status") as string
  if (!id || !status) throw new Error("ID and status required")
  const { inquiryService } = await inquiryModule()
  await inquiryService.update(id, { status: status as any })
  revalidatePath("/dashboard/inquiries")
}

export async function assignInquiryAction(formData: FormData) {
  const id = formData.get("id") as string
  const assigned_to = formData.get("assigned_to") as string
  if (!id || !assigned_to) throw new Error("ID and assigned_to required")
  const { inquiryService } = await inquiryModule()
  await inquiryService.update(id, { assigned_to })
  revalidatePath("/dashboard/inquiries")
}
