"use client";

import {
  ListingEntity,
  listingTypeLabels,
} from "@/domain/entities/listing.entity";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { useRoutes } from "@/i18n/client-router";
import { useTranslation } from "react-i18next";
import { FavoriteToggleButton } from "@/features/favorites/favorite-toggle-button";

interface ListingCardProps {
  listing: ListingEntity;
  isFavInitial?: boolean;
}

export function ListingCard({
  listing,
  isFavInitial = false,
}: ListingCardProps) {
  const { t } = useTranslation();

  const property = listing.property;
  const images = property.property_images || [];
  const mainImage = images.length > 0 ? images[0].public_url : null;
  const routes = useRoutes();

  return (
    <Link href={`${routes.listings()}/${listing.id}`}>
      <Card className="overflow-hidden pt-0 cursor-pointer hover:shadow-lg transition-all group h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <IconHome className="w-12 h-12 text-muted-foreground/50" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {listingTypeLabels[listing.listing_type]}
            </Badge>
            {listing.featured && (
              <Badge className="bg-amber-500 hover:bg-amber-600">
                {t("words:featured")}
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <FavoriteToggleButton
              listingId={listing.id}
              isFavInitial={isFavInitial}
            />
          </div>

          <div className="absolute bottom-3 right-3">
            <Badge
              variant="outline"
              className="bg-white/90 backdrop-blur-sm text-foreground capitalize"
            >
              {listing.currency} {listing.price.toLocaleString("es-ES")}
              {listing.price_negotiable && t("words:negotiable")}
            </Badge>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-foreground line-clamp-1 capitalize">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-sm truncate capitalize">
              {[property.neighborhood, property.city, property.state]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 flex-1">
            {property.bedrooms !== null && property.bedrooms > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms !== null && property.bathrooms > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.total_area && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Maximize className="w-4 h-4" />
                <span>{property.total_area} m²</span>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            {property.property_type}
          </div>
        </div>
      </Card>
    </Link>
  );
}
