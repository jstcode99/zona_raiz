import { EUserRole } from "@/domain/entities/profile.entity"

export const ROUTE_TRANSLATIONS = {
    "/autenticacion/login": "/auth/sign-in",
    "/autenticacion/registro": "/auth/sign-up",
    "/autenticacion/otp": "/auth/otp",

    "/ciudad/:slug": "/city/:slug",
    "/departamento/:slug": "/estate/:slug",
    "/pais/:slug": "/country/:slug",

    "/panel": "/dashboard",

    "/propiedades": "/properties",
    "/propiedades/nueva": "/properties/new",
    "/propiedades/:id": "/properties/:id",

    "/incorporacion": "/onboarding",
    "/incorporacion/registrar-inmobiliaria": "/onboarding/register-real-estate",

    "/panel/account": "/dashboard/perfil",

    "/panel/publicaciones": "/dashboard/listing",
    "/panel/publicaciones/:id": "/dashboard/listing/:id",

    "/panel/inmobiliaria": "/dashboard/real-estate",

    "/panel/inmobiliarias/nueva": "/dashboard/real-estates/new",
    "/panel/inmobiliarias/:id": "/dashboard/real-estates/:id",

    "/panel/usuarios": "/dashboard/users",
    "/panel/usuarios/nuevo": "/dashboard/users/new",
    "/panel/usuarios/:id": "/dashboard/users/:id",
} as const

export const ROUTE_LANG = Object.fromEntries(
    Object.entries(ROUTE_TRANSLATIONS).map(([es, en]) => {
        const key = en
            .replace(/^\//, "")
            .replace(/\/:.*$/, "")
            .replace(/\//g, "_")
            .replace(/-([a-z])/g, (_, c) => c.toUpperCase())

        return [
            key,
            {
                en,
                es,
            },
        ]
    })
) as Record<string, { en: string; es: string }>

export const PUBLIC_ROUTES = [
    "/",
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/otp",
    "/auth/callback",
    "/callback",
]

export const PROTECTED_BASE_ROUTES = [
    "/api",
    "/dashboard",
]

export const ROLE_ACCESS: Record<EUserRole, string[]> = {
    admin: PROTECTED_BASE_ROUTES,
    "real-estate": PROTECTED_BASE_ROUTES,
    client: PROTECTED_BASE_ROUTES,
}

export type Lang = "es" | "en"

export function translateRoute(pathname: string, lang: Lang = "es") {
  for (const key in ROUTE_LANG) {
    const routeLang = ROUTE_LANG[key as keyof typeof ROUTE_LANG][lang]
    const otherLang = ROUTE_LANG[key as keyof typeof ROUTE_LANG][
      lang === "es" ? "en" : "es"
    ]

    const regex = new RegExp(
      "^" + otherLang.replace(/:[^/]+/g, "([^/]+)").replace(/\//g, "\\/") + "$"
    )
    const match = pathname.match(regex)
    if (!match) continue

    // reemplazar params dinámicos
    let translated = routeLang
    const params = otherLang.match(/:[^/]+/g)
    if (params) {
      params.forEach((param, index) => {
        translated = translated.replace(param, match[index + 1])
      })
    }

    return translated
  }
  return pathname
}