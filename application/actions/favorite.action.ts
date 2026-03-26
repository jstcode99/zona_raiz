"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { withServerAction } from "@/shared/hooks/with-server-action";
import { getLangServerSide } from "@/infrastructure/shared/utils/lang";
import { createRouter } from "@/i18n/router";
import { initI18n } from "@/i18n/server";
import { appModule } from "@/application/modules/app.module";

export const toggleFavoriteAction = withServerAction(
  async (listingId: string) => {
    const lang = await getLangServerSide();
    const cookieStore = await cookies();
    const routes = createRouter(lang);
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang);

    const { sessionService, favoriteService, listingService } = await appModule(
      lang,
      {
        cookies: cookieStore,
      },
    );

    const userId = await sessionService.getCurrentUserId();
    if (!userId) throw new Error(t("common:exceptions.unauthorized"));

    const listing = await listingService.findById(listingId);
    if (!listing) throw new Error(t("common:exceptions.data_not_found"));

    await favoriteService.toggle(userId, listingId);

    revalidatePath(routes.listings());
    revalidatePath(routes.dashboard());
  },
);

export async function checkFavoriteAction(
  listingId: string,
): Promise<{ isFavorited: boolean }> {
  const cookieStore = await cookies();
  const { sessionService, favoriteService } = await appModule("es", {
    cookies: cookieStore,
  });

  const userId = await sessionService.getCurrentUserId();
  if (!userId) return { isFavorited: false };

  const isFavorited = await favoriteService.exists(userId, listingId);
  return { isFavorited };
}

export async function getUserFavoritesAction() {
  const lang = await getLangServerSide();
  const cookieStore = await cookies();
  const i18n = await initI18n(lang);
  const t = i18n.getFixedT(lang);

  const { sessionService, favoriteService } = await appModule(lang, {
    cookies: cookieStore,
  });

  const userId = await sessionService.getCurrentUserId();
  if (!userId) throw new Error(t("common:exceptions.unauthorized"));

  const favorites = await favoriteService.findByProfileId(userId);
  return { favorites, listingIds: favorites.map((f) => f.listing_id) };
}
