"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRoutes } from "@/i18n/client-router";
import { Form } from "@/components/ui/form";
import { LandingCity } from "@/domain/types/landing.types";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  landingSearchSchema,
  LandingSearchFormInput,
} from "@/application/validation/landing-search.schema";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import { searchListingsAction } from "@/application/actions/landing.actions";
import { toast } from "sonner";

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

  const { action, isPending } = useServerMutation({
    action: searchListingsAction,
    onSuccess: () => {
      toast.success(t("hero.searching"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<LandingSearchFormInput>({
    resolver: yupResolver(landingSearchSchema) as Resolver<LandingSearchFormInput>,
    defaultValues: {
      city: "",
      property_type: "",
      type: "",
      min_bedrooms: undefined,
      min_bathrooms: undefined,
      max_price: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = (data: LandingSearchFormInput) => {
    const formData = new FormData();
    
    if (data.city) formData.set("city", data.city);
    if (data.property_type) formData.set("type", data.property_type);
    else if (data.type) formData.set("type", data.type);
    if (data.min_bedrooms)
      formData.set("min_bedrooms", String(data.min_bedrooms));
    if (data.min_bathrooms)
      formData.set("min_bathrooms", String(data.min_bathrooms));
    if (data.max_price) formData.set("max_price", String(data.max_price));

    action(formData);
  };

  const cityOptions = cities.map((c) => ({
    label: c.name,
    value: c.name,
  }));

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

            <Form
              form={form}
              onSubmit={onSubmit}
              className="p-6 pt-4 flex flex-col gap-3"
            >
              {/* Location - Datalist input */}
              <Form.Input
                name="city"
                label={t("hero.location")}
                placeholder={t("hero.location_placeholder")}
                list="cities-list"
                className="border-neutral-200 rounded-xl px-3 h-11 text-[13px] text-neutral-700 outline-none focus:border-orange-400 transition-colors"
              />
              <datalist id="cities-list">
                {cityOptions.map((c) => (
                  <option key={c.value} value={c.value} />
                ))}
              </datalist>

              {/* Property Type */}
              <Form.Select
                name="property_type"
                label={t("hero.property_type")}
                placeholder={t("hero.property_placeholder")}
                options={propertyTypes.map((p) => ({
                  label: p.label,
                  value: p.value,
                }))}
              />

              {/* Beds & Baths */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Form.Input
                    name="min_bedrooms"
                    type="number"
                    placeholder={t("hero.beds")}
                    min={0}
                    className="border-neutral-200 rounded-xl px-3 h-11 text-[13px] text-neutral-700 outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <Form.Input
                    name="min_bathrooms"
                    type="number"
                    placeholder={t("hero.baths")}
                    min={0}
                    className="border-neutral-200 rounded-xl px-3 h-11 text-[13px] text-neutral-700 outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
              </div>

              {/* Max Price */}
              <Form.Input
                name="max_price"
                type="number"
                label={t("hero.max_price")}
                placeholder="590.00 max"
                min={0}
                className="border-neutral-200 rounded-xl px-3 h-11 text-[13px] text-neutral-700 outline-none focus:border-orange-400 transition-colors"
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-12 text-[14px] mt-1 transition-all hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50"
              >
                {isPending ? "Buscando..." : t("hero.search_btn")}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
