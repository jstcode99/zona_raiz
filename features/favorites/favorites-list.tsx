"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useRoutes } from "@/i18n/client-router";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListingEntity } from "@/domain/entities/listing.entity";

export interface FavoriteWithListing {
  id: string;
  listing_id: string;
  created_at: string;
  listing?: ListingEntity;
}

interface FavoritesListProps {
  favorites: FavoriteWithListing[];
}

export function FavoritesList({ favorites }: FavoritesListProps) {
  const { t } = useTranslation();
  const routes = useRoutes();

  if (favorites.length === 0) {
    return (
      <div className="px-2 py-4 text-center">
        <Heart className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
        <p className="text-xs text-muted-foreground">
          {t("sections:no_favorites")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-2 py-2">
      <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">
        {t("sections:favorites")} ({favorites.length})
      </p>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {favorites.slice(0, 5).map((favorite) => {
          const listing = favorite.listing;
          const mainImage = listing?.property?.property_images?.[0]?.public_url;

          return (
            <Link
              key={favorite.id}
              href={`${routes.listings()}/${listing?.id}`}
              className="block"
            >
              <Card className="p-2 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={listing?.property?.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate capitalize">
                      {listing?.property?.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold">
                        {listing?.currency}{" "}
                        {listing?.price?.toLocaleString("es-ES")}
                      </span>
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        {listing?.listing_type === "rent" ? "Renta" : "Venta"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
