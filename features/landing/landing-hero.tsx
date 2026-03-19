"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRoutes } from "@/i18n/client-router";
import { IconBed, IconBath } from "@tabler/icons-react";
import { LandingCity } from "@/domain/types/landing.types";

interface LandingHeroProps {
  cities?: LandingCity[];
}

const propertyTypes = [
  { value: "apartment", label: "Apartamento" },
  { value: "house", label: "Casa" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Lote" },
  { value: "commercial", label: "Comercial" },
  { value: "office", label: "Oficina" },
  { value: "warehouse", label: "Bodega" },
];

export function LandingHero({ cities = [] }: LandingHeroProps) {
  const { t } = useTranslation("landing");
  const router = useRouter();
  const routes = useRoutes();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const params = new URLSearchParams();
    const city = formData.get("city") as string;
    const type = formData.get("property_type") as string;
    const beds = formData.get("min_bedrooms") as string;
    const baths = formData.get("min_bathrooms") as string;
    const price = formData.get("max_price") as string;

    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (beds) params.set("min_bedrooms", beds);
    if (baths) params.set("min_bathrooms", baths);
    if (price) params.set("max_price", price);

    const qs = params.toString();
    router.push(`${routes.search()}${qs ? `?${qs}` : ""}`);
  };

  return (
    <section className="relative w-full min-h-screen pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=85"
          alt="Hero property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 min-h-[calc(100vh-64px)] flex items-center">
        <div className="flex items-center justify-between w-full gap-8">
          {/* Left - Title */}
          <div className="flex-1 max-w-lg">
            <h1
              className="text-white leading-none mb-8 animate-fade-in"
              style={{
                fontFamily: "'Fraunces', 'Georgia', serif",
                fontSize: "clamp(52px, 7vw, 80px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              {t("hero.title_1")},<br />
              {t("hero.title_2")}, &<br />
              {t("hero.title_3")}
            </h1>
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white hover:text-neutral-900 rounded-full px-6 h-11 text-[13px] font-semibold transition-all hover:scale-105"
              onClick={() => router.push(routes.search())}
            >
              {t("hero.explore")} ↗
            </Button>
          </div>

          {/* Right - Search Form */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden shrink-0">
            <div className="p-6 pb-0">
              <h2
                className="text-neutral-900 font-semibold text-[17px] leading-tight mb-5"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}
              >
                {t("hero.search_title")}
                <br />
                <span className="text-neutral-900 font-bold">
                  {t("hero.search_subtitle")}
                </span>
              </h2>
            </div>

            <form onSubmit={handleSearch} className="p-6 pt-4 flex flex-col gap-3">
              {/* Location */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">
                  {t("hero.location")}
                </label>
                <input
                  name="city"
                  className="w-full border border-neutral-200 rounded-xl px-3 h-11 text-[13px] text-neutral-700 outline-none focus:border-orange-400 transition-colors"
                  placeholder={t("hero.location_placeholder")}
                  list="cities-list"
                />
                <datalist id="cities-list">
                  {cities.map((c) => (
                    <option key={c.slug} value={c.name} />
                  ))}
                </datalist>
              </div>

              {/* Property Type */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">
                  {t("hero.property_type")}
                </label>
                <select
                  name="property_type"
                  className="w-full border border-neutral-200 rounded-xl px-3 h-11 text-[13px] text-neutral-700 outline-none focus:border-orange-400 transition-colors bg-white"
                >
                  <option value="">{t("hero.property_placeholder")}</option>
                  {propertyTypes.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Beds & Baths */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <IconBed className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    name="min_bedrooms"
                    type="number"
                    placeholder={t("hero.beds")}
                    min={0}
                    className="w-full border border-neutral-200 rounded-xl pl-10 pr-3 h-11 text-[13px] text-neutral-700 outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
                <IconBath className="text-neutral-300 shrink-0" />
                <div className="flex-1">
                  <input
                    name="min_bathrooms"
                    type="number"
                    placeholder={t("hero.baths")}
                    min={0}
                    className="w-full border border-neutral-200 rounded-xl px-3 h-11 text-[13px] text-neutral-700 outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">
                  {t("hero.max_price")}
                </label>
                <input
                  name="max_price"
                  type="number"
                  placeholder="590.00 max"
                  min={0}
                  className="w-full border border-neutral-200 rounded-xl px-3 h-11 text-[13px] text-neutral-700 outline-none focus:border-orange-400 transition-colors"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-12 text-[14px] mt-1 transition-all hover:shadow-lg hover:shadow-orange-200"
              >
                {t("hero.search_btn")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
