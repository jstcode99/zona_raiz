"use server";

import { redirect } from "next/navigation";
import { withServerAction } from "@/shared/hooks/with-server-action";
import { searchListingsSchema } from "@/application/validation/landing.validation";
import { appModule } from "@/application/modules/app.module";
import { getLangServerSide } from "@/shared/utils/lang";
import { cookies } from "next/headers";
import { createRouter } from "@/i18n/router";
import { Lang } from "@/i18n/settings";
import {
  LandingCity,
  LandingStats,
  LandingData,
  LandingAgent,
} from "@/domain/types/landing.types";

export type { LandingCity, LandingStats, LandingData, LandingAgent };

export async function getLandingData(): Promise<LandingData> {
  const lang = await getLangServerSide();
  const cookieStore = await cookies();

  const { listingService, agentService } = await appModule(lang, {
    cookies: cookieStore,
  });

  const [listings, cities, stats] = await Promise.all([
    listingService.getCachedSimplePublished(8),
    listingService.getCachedCitiesWithListings(),
    listingService.getCachedStats(),
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

    const params = new URLSearchParams();

    if (validated.q) params.set("q", validated.q);
    if (validated.listing_type)
      params.set("listing_type", validated.listing_type);
    if (validated.type) params.set("type", validated.type);
    if (validated.country) params.set("country", validated.country);
    if (validated.state) params.set("state", validated.state);
    if (validated.city) params.set("city", validated.city);
    if (validated.neighborhood)
      params.set("neighborhood", validated.neighborhood);
    if (validated.min_price && validated.min_price > 0) {
      params.set("min_price", String(validated.min_price));
    }
    if (validated.max_price && validated.max_price < 100000000) {
      params.set("max_price", String(validated.max_price));
    }
    if (validated.min_bedrooms)
      params.set("min_bedrooms", String(validated.min_bedrooms));
    if (validated.min_bathrooms)
      params.set("min_bathrooms", String(validated.min_bathrooms));
    if (validated.sort_by && validated.sort_by !== "created_at_desc") {
      params.set("sort_by", validated.sort_by);
    }

    const lang = (validated.country || "es") as Lang;
    const routes = createRouter(lang);
    const qs = params.toString();
    const searchPath = `${routes.search()}${qs ? `?${qs}` : ""}`;

    redirect(searchPath);
  },
);
