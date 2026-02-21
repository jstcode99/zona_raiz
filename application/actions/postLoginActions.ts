"use server"

import { cookies } from 'next/headers'
import { redirect } from "next/navigation"
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants"
import { createAuthRepository } from '@/infrastructure/db/SupabaseAuthRepository'
import { createProfileRepository } from '@/infrastructure/db/SupabaseProfileRepository'

const authRepo = createAuthRepository()
const profileRepo = createProfileRepository()

export type PostLoginState =
  | { step: "loading" }
  | { step: "select-real-estate"; realEstates: any[] }
  | { step: "register-real-estate" }

export async function getPostLoginState(): Promise<PostLoginState> {
  const cookieStore = await cookies()

  // Si ya tiene real estate, no debería estar aquí (middleware lo redirige)
  const existingRealEstate = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value
  if (existingRealEstate) {
    redirect("/dashboard")
  }

  const profile = await profileRepo.getCurrentProfileFresh()
  const role = profile.profile?.role

  // Clientes no necesitan real estate
  if (role === "client") {
    redirect("/")
  }

  // Para agentes, coordinadores y admins
  if (role === "agent" || role === "coordinator" || role === "admin") {
    const realEstates = await authRepo.getRealEstatesForUser()
    const count = realEstates.length

    // 0 real estates → Registrar
    if (count === 0) {
      return { step: "register-real-estate" }
    }

    // 1 real estate → No debería llegar aquí (middleware lo maneja), pero por si acaso
    if (count === 1) {
      redirect("/dashboard")
    }

    // Varios real estates → Seleccionar
    return { step: "select-real-estate", realEstates }
  }

  redirect("/")
}

export async function selectRealEstate(realEstateId: string) {
  // El middleware manejará la cookie en la próxima request
  // Por ahora solo redirigimos (la cookie se seteará vía middleware o puedes hacerlo aquí)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAMES.REAL_ESTATE, realEstateId, COOKIE_OPTIONS)
  redirect("/dashboard")
}

export async function skipRealEstateRegistration() {
  redirect("/")
}