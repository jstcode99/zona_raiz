import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { EUserRole } from "@/domain/entities/profile.entity";
import { COOKIE_NAMES } from "../config/constants";
import { getRoutes, ROUTES } from "../config/routes";
import { appModule } from "@/application/modules/app.module";
import { detectLang } from "@/i18n/detect-lang";
import { createRouter } from "@/i18n/router";
import { Lang } from "@/i18n/settings";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lang = detectLang(request);
  const routes = createRouter(lang);

  if (isPublicRoute(pathname, lang)) {
    return NextResponse.next();
  }

  let response = createMutableResponse(request);

  const supabase = SupabaseServerClient(request, response);

  const { sessionService, cookiesService } = await appModule(lang, {
    request,
    response,
  });

  const redirect = async (path: string) => {
    const res = redirectTo(path, request);
    const { cookiesService } = await appModule(lang, {
      request,
      response: res,
    });

    return { res, cookiesService };
  };

  // =========================
  // AUTH
  // =========================
  const isAuth = await sessionService.isAuth();

  if (!isAuth) {
    return redirectTo(routes.signin(), request);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return redirectTo(routes.signin(), request);
  }

  const role = await cookiesService.getProfileRole();

  if (!role) {
    return redirectTo(routes.signin(), request);
  }

  const realEstateId = await cookiesService.getRealEstateId();

  // =========================
  // CLIENT
  // =========================

  if (role === EUserRole.Client) {
    const { res, cookiesService } = await redirect(routes.home());

    cookiesService.setSession(COOKIE_NAMES.REAL_ESTATE_ROLE, "client");

    return res;
  }

  // =========================
  // ADMIN
  // =========================

  if (role === EUserRole.Admin) {
    cookiesService.setSession(COOKIE_NAMES.REAL_ESTATE_ROLE, "admin");

    if (isRoute(pathname, routes.dashboard())) {
      return response;
    }

    return redirectTo(routes.dashboard(), request);
  }

  // =========================
  // REAL ESTATE
  // =========================

  if (role !== EUserRole.RealEstate) {
    return redirectTo(routes.home(), request);
  }

  // 🔁 Sin contexto
  if (!realEstateId) {
    const realEstates = await sessionService.getRealEstatesForUser();

    if (realEstates.length === 1) {
      const current = realEstates[0];

      const { res, cookiesService } = await redirect(routes.dashboard());

      cookiesService.setSession(
        COOKIE_NAMES.REAL_ESTATE,
        current.real_estate.id,
      );

      cookiesService.setSession(COOKIE_NAMES.REAL_ESTATE_ROLE, current.role);

      return res;
    }

    if (!isRoute(pathname, routes.onboarding())) {
      return redirectTo(routes.onboarding(), request);
    }

    return response;
  }

  // =========================
  // CONTEXTO ACTIVO
  // =========================

  const realEstates = await sessionService.getRealEstatesForUser();

  const current = realEstates.find((r) => r.real_estate.id === realEstateId);

  if (current) {
    cookiesService.setSession(COOKIE_NAMES.REAL_ESTATE_ROLE, current.role);
  }

  if (isRoute(pathname, routes.onboarding())) {
    return redirectTo(routes.dashboard(), request);
  }

  return response;
}

// ==========================================
// HELPERS
// ==========================================

function createMutableResponse(request: NextRequest) {
  return NextResponse.next({
    request: { headers: request.headers },
  });
}

function SupabaseServerClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );
}

function isPublicRoute(pathname: string, lang: Lang) {
  // implement isPublicRoute with ROUTES
  return true;
}

function isRoute(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(base + "/");
}

function redirectTo(path: string, request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}
