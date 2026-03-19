"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Lang } from "@/i18n/settings"
import { Button } from "@/components/ui/button"
import { IconBed, IconBath } from "@tabler/icons-react"
import { defaultLandingSearchValues, LandingSearchFormInput, landingSearchSchema } from "@/application/validation/landing-search.schema"
import { searchListingsAction } from "@/application/actions/landing.actions"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"

interface LandingHeroProps {
  lang: Lang
  cities?: { name: string; slug: string }[]
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
]

export function LandingHero({ lang, cities = [] }: LandingHeroProps) {
  const { t } = useTranslation("landing")
  const router = useRouter()

  const form = useForm<LandingSearchFormInput, any, LandingSearchFormInput>({
    resolver: yupResolver(landingSearchSchema) as any,
    defaultValues: defaultLandingSearchValues,
    mode: "onBlur",
  })

  const { setError, formState: { errors } } = form

  const mutation = useServerMutation({
    action: searchListingsAction,
    setError,
    onError: (error) => {
      console.error("Search error:", error)
    }
  })

  const onSubmit = (values: LandingSearchFormInput) => {
    const formData = new FormData()

    if (values.city) formData.set("city", values.city)
    if (values.property_type) formData.set("type", values.property_type)
    if (values.min_bedrooms) formData.set("min_bedrooms", String(values.min_bedrooms))
    if (values.min_bathrooms) formData.set("min_bathrooms", String(values.min_bathrooms))
    if (values.max_price) formData.set("max_price", String(values.max_price))
    formData.set("country", "es")

    mutation.action(formData)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      form.handleSubmit(onSubmit)()
    }
  }

  return (
    <section className="relative w-full min-h-screen pt-16 overflow-hidden animate-fade-in-up">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=85"
          alt="Hero property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 min-h-[calc(100vh-64px)] flex items-center">
        <div className="flex items-center justify-between w-full gap-8">

          <div className="flex-1 max-w-lg">
            <h1
              className="text-white leading-none mb-8"
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
              className="bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white hover:text-neutral-900 rounded-full px-6 h-11 text-[13px] font-semibold transition-all"
              onClick={() => router.push(`/${lang}/colombia`)}
            >
              {t("hero.explore")} ↗
            </Button>
          </div>

          <div className="w-full max-w-85 bg-white rounded-2xl shadow-2xl overflow-hidden shrink-0">
            <div className="p-6 pb-0">
              <h2 className="text-neutral-900 font-semibold text-[17px] leading-tight mb-5"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
                {t("hero.search_title")}<br />
                <span className="text-neutral-900 font-bold">{t("hero.search_subtitle")}</span>
              </h2>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 pt-4 flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">
                  {t("hero.location")}
                </label>
                <div className={`flex items-center border rounded-xl px-3 h-11 gap-2 transition-colors focus-within:border-orange-400 ${errors.city ? 'border-red-400' : 'border-neutral-200'}`}>
                  <span className="text-orange-500">📍</span>
                  <input
                    className="flex-1 text-[13px] text-neutral-700 outline-none bg-transparent placeholder:text-neutral-400"
                    placeholder={t("hero.location_placeholder")}
                    {...form.register("city")}
                    onKeyDown={handleKeyDown}
                    list="cities-list"
                  />
                  {cities.length > 0 && (
                    <datalist id="cities-list">
                      {cities.map(c => (
                        <option key={c.slug} value={c.name} />
                      ))}
                    </datalist>
                  )}
                  <span className="text-neutral-300 text-xs">▾</span>
                </div>
                {errors.city && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">
                  {t("hero.property_type")}
                </label>
                <div className={`flex items-center border rounded-xl px-3 h-11 gap-2 transition-colors focus-within:border-orange-400 ${errors.property_type ? 'border-red-400' : 'border-neutral-200'}`}>
                  <span className="text-neutral-400">🏠</span>
                  <select
                    className="flex-1 text-[13px] text-neutral-700 outline-none bg-transparent"
                    {...form.register("property_type")}
                  >
                    <option value="">{t("hero.property_placeholder")}</option>
                    {propertyTypes.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                {errors.property_type && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.property_type.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2 border border-neutral-200 rounded-xl px-3 h-11 focus-within:border-orange-400 transition-colors">
                <IconBed className="size-4 text-neutral-400 shrink-0" />
                <input
                  className="w-12 text-[12px] text-neutral-700 outline-none bg-transparent placeholder:text-neutral-400"
                  placeholder={t("hero.beds")}
                  {...form.register("min_bedrooms", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  onKeyDown={handleKeyDown}
                />
                <span className="text-neutral-200">|</span>
                <IconBath className="size-4 text-neutral-400 shrink-0" />
                <input
                  className="w-16 text-[12px] text-neutral-700 outline-none bg-transparent placeholder:text-neutral-400"
                  placeholder={t("hero.baths")}
                  {...form.register("min_bathrooms", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  onKeyDown={handleKeyDown}
                />
                <span className="text-neutral-200">|</span>
                <span className="text-[12px] text-neutral-400">m²</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">
                  {t("hero.max_price")}
                </label>
                <div className={`flex items-center border rounded-xl px-3 h-11 gap-2 transition-colors focus-within:border-orange-400 ${errors.max_price ? 'border-red-400' : 'border-neutral-200'}`}>
                  <span className="text-neutral-400 text-sm">💲</span>
                  <input
                    className="flex-1 text-[13px] text-neutral-700 outline-none bg-transparent placeholder:text-neutral-400"
                    placeholder="590.00 max"
                    type="number"
                    {...form.register("max_price", { valueAsNumber: true })}
                    min="0"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {errors.max_price && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.max_price.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-12 text-[14px] mt-1 transition-all hover:shadow-lg hover:shadow-orange-200"
                disabled={mutation.isPending}
              >
                {t("hero.search_btn")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </section>
  )
}
