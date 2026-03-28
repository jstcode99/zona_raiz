"use client";

import { MapPin, Bed, Bath, Maximize2, Car } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PropertyDetailDTO } from "@/application/mappers/property.mapper";

interface PropertyDetailProps {
  data: PropertyDetailDTO | null | undefined;
}

export const PropertyDetail = ({ data }: PropertyDetailProps) => {
  const { t } = useTranslation("properties");

  if (!data) return null;

  const { property, formattedState } = data;

  return (
    <div className="bg-background mx-auto">
      <div className="px-6 pb-6 space-y-8">
        <header className="space-y-2">
          <h2 className="text-3xl text-foreground">{property.title}</h2>
          <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>
              {property.city} · {formattedState}
            </span>
          </div>
        </header>

        {/* Features: Iconografía lineal sin fondos pesados */}
        <div className="flex flex-wrap gap-x-10 gap-y-6 border-y border-border/50 py-2">
          {property.bedrooms! > 0 && (
            <div className="flex items-center gap-3">
              <Bed className="w-5 h-5 stroke-[1.25] text-muted-foreground" />
              <span className="text-sm font-medium">
                {property.bedrooms} {t("properties:detail.labels.bedrooms")}
              </span>
            </div>
          )}
          {property.bathrooms! > 0 && (
            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 stroke-[1.25] text-muted-foreground" />
              <span className="text-sm font-medium">
                {property.bathrooms} {t("properties:detail.labels.bathrooms")}
              </span>
            </div>
          )}
          {property.total_area && (
            <div className="flex items-center gap-3">
              <Maximize2 className="w-5 h-5 stroke-[1.25] text-muted-foreground" />
              <span className="text-sm font-medium">
                {property.total_area} m²
              </span>
            </div>
          )}
          {property.parking_spots! > 0 && (
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 stroke-[1.25] text-muted-foreground" />
              <span className="text-sm font-medium">
                {property.parking_spots} {t("properties:detail.labels.parking")}
              </span>
            </div>
          )}
        </div>

        {/* Description: Enfoque en la lectura */}
        {property.description && (
          <section className="space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </section>
        )}

        {/* Amenities: Etiquetas ultra-discretas */}
        {property.amenities.length > 0 && (
          <section className="pt-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {property.amenities.map((amenity) => (
                <span
                  key={amenity.label}
                  className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-transparent hover:border-muted-foreground transition-all cursor-default"
                >
                  {amenity.label}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
