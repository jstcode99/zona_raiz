import { ROUTES } from "@/infrastructure/config/routes";
import { Lang } from "./settings";
import { LISTINS_SLUG, PROPERTIES_SLUG } from "@/lib/search-config";
import { ListingType } from "@/domain/entities/listing.enums";
import { PropertyType } from "@/domain/entities/property.enums";

export function createRouter(lang: Lang) {
  return Object.fromEntries(
    Object.entries(ROUTES).map(([key, value]) => [
      key,
      (...params: string[]) => {
        let path: string = value[lang];
        params.forEach((param) => {
          path = path.replace(/:[^/]+/, param);
        });
        return `/${lang}${path}`;
      },
    ]),
  ) as {
    [K in keyof typeof ROUTES]: (...params: string[]) => string;
  };
}

// ─────────────────────────────────────────────
// Build search URL con segmentos dinámicos
// ─────────────────────────────────────────────
type SearchUrlParams = {
  lang: Lang;
  listing_type?: ListingType | string;
  type?: PropertyType | string;
  city?: string;
  neighborhood?: string;
};

export function buildSearchUrl({
  lang,
  listing_type,
  type,
  city,
  neighborhood,
}: SearchUrlParams): string {
  const parts: string[] = [];

  if (listing_type) {
    parts.push(
      LISTINS_SLUG[listing_type as ListingType]?.[lang] ?? listing_type,
    );
  }
  if (type) {
    parts.push(PROPERTIES_SLUG[type as PropertyType]?.[lang] ?? type);
  }
  if (city) parts.push(city);
  if (neighborhood) parts.push(neighborhood);

  return `/${lang}${parts.length ? `/${parts.join("/")}` : ""}`;
}
