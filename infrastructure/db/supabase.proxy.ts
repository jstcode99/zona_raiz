import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { EUserRole } from "@/domain/entities/profile.entity"
import { COOKIE_NAMES } from "../config/constants"
import { PUBLIC_ROUTES, ROUTES } from "../config/routes"
import { appModule } from "@/application/modules/app.module"
import { detectLang } from "@/i18n/detect-lang"

export async function updateSession(request: NextRequest) {

  const { pathname } = request.nextUrl
  const lang = detectLang(request)

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  let response = createMutableResponse(request)

  const supabase = SupabaseServerClient(request, response)

  const { sessionService, cookiesService } = await appModule(lang, {
    request,
    response
  })

  const redirect = async (path: string) => {
    const res = redirectTo(path, request)
    const { cookiesService } = await appModule(lang, {
      request,
      response: res
    })

    return { res, cookiesService }
  }

  // =========================
  // AUTH
  // =========================

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    return redirectTo(ROUTES.signin[lang], request)
  }

  const role = await cookiesService.getProfileRole()

  if (!role) {
    return redirectTo(ROUTES.signin[lang], request)
  }

  const realEstateId = await cookiesService.getRealEstateId()

  // =========================
  // CLIENT
  // =========================

  if (role === EUserRole.Client) {

    const { res, cookiesService } = await redirect(ROUTES.home[lang])

    cookiesService.setSession(
      COOKIE_NAMES.REAL_ESTATE_ROLE,
      "client"
    )

    return res
  }

  // =========================
  // ADMIN
  // =========================

  if (role === EUserRole.Admin) {

    cookiesService.setSession(
      COOKIE_NAMES.REAL_ESTATE_ROLE,
      "admin"
    )

    if (isRoute(pathname, ROUTES.dashboard[lang])) {
      return response
    }

    return redirectTo(ROUTES.dashboard[lang], request)
  }

  // =========================
  // REAL ESTATE
  // =========================

  if (role !== EUserRole.RealEstate) {
    return redirectTo(ROUTES.home[lang], request)
  }


  // 🔁 Sin contexto
  if (!realEstateId) {

    const realEstates = await sessionService.getRealEstatesForUser()

    if (realEstates.length === 1) {

      const current = realEstates[0]

      const { res, cookiesService } = await redirect(
        ROUTES.dashboard[lang]
      )

      cookiesService.setSession(
        COOKIE_NAMES.REAL_ESTATE,
        current.real_estate.id
      )

      cookiesService.setSession(
        COOKIE_NAMES.REAL_ESTATE_ROLE,
        current.role
      )

      return res
    }

    if (!isRoute(pathname, ROUTES.onboarding[lang])) {
      return redirectTo(ROUTES.onboarding[lang], request)
    }

    return response
  }

  // =========================
  // CONTEXTO ACTIVO
  // =========================

  const realEstates = await sessionService.getRealEstatesForUser()

  const current = realEstates.find(
    (r) => r.real_estate.id === realEstateId
  )

  if (current) {
    cookiesService.setSession(
      COOKIE_NAMES.REAL_ESTATE_ROLE,
      current.role
    )
  }

  if (isRoute(pathname, ROUTES.onboarding[lang])) {
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