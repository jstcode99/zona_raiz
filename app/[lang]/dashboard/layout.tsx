import { SiteHeader } from "@/features/navigation/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CSSProperties, ReactNode, Suspense } from "react";
import { AppSidebar } from "@/features/navigation/app-sidebar";
import { PageLoader } from "@/features/loader/page-loader";
import { encodedRedirect } from "@/shared/redirect";
import { EUserRole } from "@/domain/entities/profile.entity";
import { DashboardBottomNav } from "@/features/navigation/dashboard-bottom-nav";
import { createRouter } from "@/i18n/router";
import { Lang } from "@/i18n/settings";
import { initI18n } from "@/i18n/server";
import { cookies } from "next/headers";
import { appModule } from "@/application/modules/app.module";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: Lang };
}) {
  const cookieStore = await cookies();
  const { lang } = await params;

  const routes = createRouter(lang);
  const i18n = await initI18n(lang);
  const t = i18n.getFixedT(lang);
  const { cookiesService, sessionService } = await appModule(lang, {
    cookies: cookieStore,
  });

  const real_estate_id = (await cookiesService.getRealEstateId()) as string;

  if (!real_estate_id) {
    return encodedRedirect(
      "error",
      routes.onboarding(),
      t("exceptions:data_not_found"),
    );
  }

  const profile = await sessionService.getCachedCurrentUser();
  const menu = await sessionService.getMenuByRol();

  if (!profile) {
    return encodedRedirect(
      "error",
      routes.signin(),
      t("exceptions:data_not_found"),
    );
  }

  if (profile.role == EUserRole.Admin) {
    return encodedRedirect(
      "error",
      routes.signin(),
      t("exceptions.not_have_access"),
    );
  }

  let favorites: {
    id: string;
    listing_id: string;
    created_at: string;
    listing?: any;
  }[] = [];
  try {
    const { favoriteService, listingService } = await appModule(lang, {
      cookies: cookieStore,
    });
    const userId = await sessionService.getCurrentUserId();
    if (userId) {
      const userFavorites = await favoriteService.findByProfileId(userId);
      if (userFavorites.length > 0) {
        const listingIds = userFavorites.map((f) => f.listing_id);
        const listings = await listingService.findByIds(listingIds);
        const listingsMap = new Map(listings.map((l) => [l.id, l]));
        favorites = userFavorites.map((fav) => ({
          ...fav,
          listing: listingsMap.get(fav.listing_id),
        }));
      }
    }
  } catch {
    favorites = [];
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        menu={menu}
        profile={profile}
        favorites={favorites}
      />
      <SidebarInset>
        <SiteHeader />
        <div
          style={{ backgroundImage: `url('/images/texture.png')` }}
          className="flex flex-1 flex-col"
        >
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6  h-full">
              <Suspense fallback={<PageLoader />}>{children}</Suspense>
            </div>
          </div>
        </div>
        <DashboardBottomNav items={menu} />
      </SidebarInset>
    </SidebarProvider>
  );
}
