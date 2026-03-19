import type { Metadata } from "next";
import { SearchPageClient } from "../search-page-client";
import { getTranslation } from "@/i18n/server";
import { Lang } from "@/i18n/settings";
import {
  parseLocation,
  parseSearchParams,
  buildCanonicalUrl,
} from "../_search/helpers";
import { getListings } from "../_search/server";
import { appModule } from "@/application/modules/app.module";
import { cookies } from "next/headers";

interface SearchPageProps {
  params: Promise<{ lang: Lang; location?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { lang, location } = await params;
  const { t } = await getTranslation(lang);
  const sp = await searchParams;
  const { country, state, city } = parseLocation(location);

  const parts = [];
  if (sp.listing_type)
    parts.push(sp.listing_type === "rent" ? t("for_rent") : t("for_sale"));
  if (sp.type) parts.push(String(sp.type));
  if (city) parts.push(city);
  else if (state) parts.push(state);
  else if (country) parts.push(country);

  const locationLabel =
    parts.length > 0 ? parts.join(" · ") : t("common:sections.all_properties");
  const title = `${locationLabel} | ${t("common:titles.app")}`;
  const description = t("properties:sections.search_meta_description", {
    location: locationLabel,
  });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const canonicalUrl = buildCanonicalUrl(baseUrl, lang, location ?? [], sp);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function page({ params, searchParams }: SearchPageProps) {
  const resolved = await params;
  console.log("🔍 [location] params:", JSON.stringify(resolved));
  const cookieStore = await cookies();
  const { lang, location } = await params;
  const { t } = await getTranslation(lang);
  const sp = await searchParams;

  const filters = parseSearchParams(sp, location);

  const { listings, total } = await getListings(filters, lang);

  let favoriteIds: string[] = [];
  try {
    const { sessionService, favoriteService } = await appModule(lang, {
      cookies: cookieStore,
    });
    const userId = await sessionService.getCurrentUserId();
    if (userId) {
      const favorites = await favoriteService.findByProfileId(userId);
      favoriteIds = favorites.map((f) => f.listing_id);
    }
  } catch {
    favoriteIds = [];
  }

  const totalPages = Math.ceil(total / (filters.limit || 12));
  const currentPage = filters.page || 1;

  const getBreadcrumb = () => {
    const { country, state, city } = parseLocation(location);
    const parts = [];
    if (country) parts.push(country);
    if (state) parts.push(state);
    if (city) parts.push(city);
    return parts.join(" > ") || t("common:sections.all_properties");
  };

  const locationPath = (location ?? []).join("/");
  const basePath = `/${lang}${locationPath ? `/${locationPath}` : ""}`;

  return (
    <SearchPageClient
      lang={lang}
      filters={filters}
      listings={listings}
      total={total}
      totalPages={totalPages}
      currentPage={currentPage}
      breadcrumb={getBreadcrumb()}
      basePath={basePath}
      favoriteIds={favoriteIds}
    />
  );
}
