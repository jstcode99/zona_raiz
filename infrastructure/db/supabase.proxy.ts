import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { EUserRole } from "@/domain/entities/profile.entity"
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  ROUTES,
  PUBLIC_ROUTES,
} from "../config/constants"
import { SupabaseSessionAdapter } from "@/infrastructure/adapters/supabase/supabase-session.adapter"
import { createSessionModule } from "@/application/containers/session.container"

// ==========================================
// MIDDLEWARE
// ==========================================

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const response = createMutableResponse(request)
  const supabase = createSupabaseServerClient(request, response)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    return redirectTo(ROUTES.SIGN_IN, request)
  }

  const role = request.cookies.get(COOKIE_NAMES.ROLE)?.value as EUserRole | undefined
  const realEstateId = request.cookies.get(COOKIE_NAMES.REAL_ESTATE)?.value

  if (!role) {
    return redirectTo(ROUTES.SIGN_IN, request)
  }

  // 🚫 CLIENTE no entra a dashboard
  if (role === EUserRole.Client) {
    return redirectTo(ROUTES.HOME, request)
  }


  // ==========================================
  // REAL ESTATE CONTEXT GUARD
  // ==========================================

  // 👇 Roles que necesitan contexto de real estate
  if (requiresRealEstateContext(role)) {

    // 🔁 Si NO tiene contexto → intentar auto-selección
    if (!realEstateId) {
      const { useCases } = await createSessionModule()
      const realEstates = await useCases.getRealEstatesForUser()

      // ⭐ Solo uno → guardar cookie y entrar al dashboard
      if (realEstates.length === 1) {
        const res = redirectTo(ROUTES.DASHBOARD, request)
        res.cookies.set(
          COOKIE_NAMES.REAL_ESTATE,
          realEstates[0].real_estate.id,
          COOKIE_OPTIONS
        )
        return res
      }

      // ❗ Ninguno o varios → onboarding
      if (!isRoute(pathname, ROUTES.ONBOARDING)) {
        return redirectTo(ROUTES.ONBOARDING, request)
      }

      return response
    }

    // ✅ Ya tiene contexto → no puede ir a onboarding
    if (realEstateId && isRoute(pathname, ROUTES.ONBOARDING)) {
      return redirectTo(ROUTES.DASHBOARD, request)
    }
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

function createSupabaseServerClient(
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

function requiresRealEstateContext(role: EUserRole) {
  return (
    role === EUserRole.Admin ||
    role === EUserRole.Agent ||
    role === EUserRole.Coordinator
  )
}

function redirectTo(path: string, request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = path
  return NextResponse.redirect(url)
}