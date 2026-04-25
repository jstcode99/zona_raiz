"use client";

import { MapPin, Bed, Bath, Maximize2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

import {
  PropertyEntity,
  propertyTypeLabels,
} from "@/domain/entities/property.entity";
import Image from "next/image";

interface PropertyCardProps {
  property: PropertyEntity;
  images?: string[];
}

export const PropertyCard = ({ property, images = [] }: PropertyCardProps) => {
  const { t } = useTranslation("properties");
  return (
    <Card className="overflow-hidden cursor-pointer pt-0 card-hover active:scale-[0.99] transition-all">
      {/* Image */}
      <div className="relative h-50 overflow-hidden">
        <Image
          src={images[0]}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {propertyTypeLabels[property.property_type]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="text-sm truncate">
            {property.neighborhood || property.city}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mt-3">
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
          {property.lot_area && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Maximize2 className="w-4 h-4" />
              <span>
                {property.lot_area} {t("properties:detail.labels.area_unit")}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
