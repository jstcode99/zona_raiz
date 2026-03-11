import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { EUserRole } from "@/domain/entities/profile.entity"
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
} from "../config/constants"
import { sessionModule } from "@/application/modules/session.module"
import { PUBLIC_ROUTES, ROUTES } from "../config/routes"
import { getServerLang } from "@/lib/utils"

// ==========================================
// MIDDLEWARE
// ==========================================

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl
  const lang = getServerLang(request)

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const response = createMutableResponse(request)
  const supabase = SupabaseServerClient(request, response)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    return redirectTo(ROUTES.signin[lang], request)
  }

  const isRealEstateRoute = isRoute(pathname, ROUTES.dashboard[lang])

  const role = request.cookies.get(COOKIE_NAMES.ROLE)?.value as EUserRole | undefined
  const realEstateId = request.cookies.get(COOKIE_NAMES.REAL_ESTATE)?.value

  if (!role) {
    return redirectTo(ROUTES.signin[lang], request)
  }

  // 🚫 CLIENTE no entra en rutas protegidas (/dashboard, /real-estate, etc.)
  if (role === EUserRole.Client) {
    const res = redirectTo(ROUTES.home[lang], request)
    res.cookies.set(COOKIE_NAMES.REAL_ESTATE_ROLE, "client", COOKIE_OPTIONS)
    return res
  }

  // 👮‍♂️ Admin solo puede ver /dashboard (y rutas públicas)
  if (role === EUserRole.Admin) {
    if (isRealEstateRoute) {
      const res = redirectTo(ROUTES.dashboard[lang], request)
      res.cookies.set(COOKIE_NAMES.REAL_ESTATE_ROLE, "admin", COOKIE_OPTIONS)
      return res
    }

    // En rutas válidas protegidas, marcamos su rol en cookie y seguimos
    response.cookies.set(COOKIE_NAMES.REAL_ESTATE_ROLE, "admin", COOKIE_OPTIONS)
    return response
  }

  // A partir de aquí solo queda EUserRole.RealEstate en rutas protegidas
  if (role !== EUserRole.RealEstate) {
    return redirectTo(ROUTES.home[lang], request)
  }


  // ==========================================
  // ==========================================
  // REAL ESTATE CONTEXT GUARD (para rol RealEstate)
  // ==========================================

  // 🔁 Si NO tiene contexto → intentar auto-selección
  const { sessionService } = await sessionModule(lang)

  if (!realEstateId) {
    const realEstates = await sessionService.getRealEstatesForUser()

    // ⭐ Solo uno → guardar cookie de inmobiliaria + rol (agent/coordinator) y entrar a /real-estate
    if (realEstates.length === 1) {
      const current = realEstates[0]
      const res = redirectTo(ROUTES.dashboard[lang], request)
      res.cookies.set(COOKIE_NAMES.REAL_ESTATE, current.real_estate.id, COOKIE_OPTIONS)
      res.cookies.set(COOKIE_NAMES.REAL_ESTATE_ROLE, current.role, COOKIE_OPTIONS)
      return res
    }

    // ❗ Ninguno o varios → onboarding
    if (!isRoute(pathname, ROUTES.onboarding[lang])) {
      return redirectTo(ROUTES.onboarding[lang], request)
    }

    return response
  }

  // ✅ Ya tiene contexto → actualizar cookie de rol en la inmobiliaria activa
  const realEstates = await sessionService.getRealEstatesForUser()
  const current = realEstates.find(
    (item) => item.real_estate.id === realEstateId
  )

  if (current) {
    response.cookies.set(COOKIE_NAMES.REAL_ESTATE_ROLE, current.role, COOKIE_OPTIONS)
  }

  // No puede ir a onboarding si ya tiene contexto
  if (realEstateId && isRoute(pathname, ROUTES.onboarding[lang])) {
    return redirectTo(ROUTES.dashboard[lang], request)
  }

  return response
}

// ==========================================
// HELPERS
// ==========================================

function createMutableResponse(request: NextRequest) {
  return NextResponse.next({
    request: { headers: request.headers },
  })
}

function SupabaseServerClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
}

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => isRoute(pathname, route))
}

function isRoute(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(base + "/")
}

function redirectTo(path: string, request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = path
  return NextResponse.redirect(url)
}