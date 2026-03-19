"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LandingCity } from "@/domain/types/landing.types";

interface LandingCitiesProps {
  cities: LandingCity[];
}

export function LandingCities({ cities }: LandingCitiesProps) {
  const { t } = useTranslation("landing");
  const router = useRouter();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2
              className="text-neutral-900"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 400,
              }}
            >
              {t("cities.title")}
            </h2>
            <p className="text-[13px] text-neutral-400 mt-1">
              {t("cities.subtitle")}
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-neutral-200 text-neutral-700 hover:bg-white text-[13px] font-semibold px-5 h-9 transition-all duration-200 hover:scale-105 cursor-pointer"
            onClick={() => router.push("/colombia")}
          >
            {t("cities.explore")} →
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cities.slice(0, 4).map((city) => (
            <div
              key={city.slug}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => router.push(`/colombia?city=${city.slug}`)}
              onMouseEnter={() => setHoveredCity(city.slug)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <div
                className={`w-36 h-36 rounded-full overflow-hidden border-[3px] border-white shadow-md transition-all duration-300 mb-3 ${
                  hoveredCity === city.slug
                    ? "border-orange-400 scale-105 shadow-lg"
                    : "group-hover:border-orange-300"
                }`}
              >
                <img
                  src={
                    city.image?.startsWith("http")
                      ? city.image
                      : `https://images.unsplash.com/${city.image}?w=300&q=80`
                  }
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
              </div>
              <p className="text-[15px] font-bold text-neutral-800">
                {city.name}
              </p>
              <p className="text-[12px] text-neutral-400">
                {city.count} {t("cities.listings")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
