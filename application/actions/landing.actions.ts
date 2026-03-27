"use server";

import { redirect, RedirectType } from "next/navigation";
import { withServerAction } from "@/shared/hooks/with-server-action";
import { searchListingsSchema } from "@/application/validation/landing.validation";
import { appModule } from "@/application/modules/app.module";
import { getLangServerSide } from "@/infrastructure/shared/utils/lang";
import { cookies } from "next/headers";
import { buildSearchUrl } from "@/i18n/router";
import { Lang } from "@/i18n/settings";
import {
  LandingCity,
  LandingStats,
  LandingData,
  LandingAgent,
} from "@/domain/types/landing.types";
import { ListingType } from "@/domain/entities/listing.enums";
import { PropertyType } from "@/domain/entities/property.enums";

export type { LandingCity, LandingStats, LandingData, LandingAgent };

export async function getLandingData(): Promise<LandingData> {
  const lang = await getLangServerSide();
  const cookieStore = await cookies();

  const { listingService, agentService } = await appModule(lang, {
    cookies: cookieStore,
  });

  const [listings, cities, stats] = await Promise.all([
    listingService.getCachedSimplePublished(8),
    listingService.getCachedCitiesWithActiveListings(),
    listingService.getCachedLandingStats(),
  ]);

  // Get top agents with avatars using agentService
  let agents: LandingAgent[] = [];
  try {
    agents = await agentService.getTopAgents(6);
  } catch {
    // Ignore agent fetch errors - will show empty avatars
  }

  return { listings, cities, stats, agents };
}

export const searchListingsAction = withServerAction(
  async (formData: FormData) => {
    const raw = Object.fromEntries(formData);
    const validated = await searchListingsSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    });

    const lang = (await getLangServerSide()) as Lang;

    // Construir URL con el nuevo sistema de rutas
    const url = buildSearchUrl({
      lang,
      listing_type: validated.listing_type as ListingType | undefined,
      type: validated.type as PropertyType | undefined,
      city: validated.city,
      neighborhood: validated.neighborhood,
    });

    // Solo filtros extras en searchParams
    const sp = new URLSearchParams();
    if (validated.min_price && validated.min_price > 0)
      sp.set("min_price", String(validated.min_price));
    if (validated.max_price && validated.max_price < 100000000)
      sp.set("max_price", String(validated.max_price));
    if (validated.min_bedrooms)
      sp.set("min_bedrooms", String(validated.min_bedrooms));
    if (validated.min_bathrooms)
      sp.set("min_bathrooms", String(validated.min_bathrooms));
    if (validated.q) sp.set("q", validated.q);

    const qs = sp.toString();
    const searchPath = `${url}${qs ? `?${qs}` : ""}`;

    redirect(searchPath, RedirectType.replace);
  },
);
