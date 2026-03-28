"use client";
import { useTranslation } from "react-i18next";
import { useRoutes } from "@/i18n/client-router";
import { ListingCard } from "@/features/listing/listing-card";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { CtaButton } from "./button-cta";

interface LandingListingsProps {
  listings: ListingEntity[];
  favoriteIds: string[];
}

export function LandingListings({
  listings,
  favoriteIds,
}: LandingListingsProps) {
  const { t } = useTranslation("landing");
  const routes = useRoutes();

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="mb-1 line-clamp-3 font-bold">
              {t("listings.title")}
            </h2>
            <p className="text-normal">{t("listings.subtitle")}</p>
          </div>
          <CtaButton href={routes.search()} text={t("listings.explore")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.slice(0, 6).map((listing, i) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              index={i}
              isPublic={true}
              isFavInitial={favoriteIds?.includes(listing.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
