"use client"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconBed, IconBath, IconRuler } from "@tabler/icons-react"
import { Lang } from "@/i18n/settings"

interface LandingHeroProps { lang: Lang }

const propertyTypes = ["Apartamento", "Casa", "Oficina", "Local", "Lote"]

export function LandingHero({ lang }: LandingHeroProps) {
  const { t } = useTranslation("landing")
  const router = useRouter()
  const [city, setCity] = useState("")
  const [propType, setPropType] = useState("")
  const [beds, setBeds] = useState("")
  const [baths, setBaths] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (propType) params.set("type", propType)
    if (beds) params.set("min_bedrooms", beds)
    if (baths) params.set("min_bathrooms", baths)
    if (maxPrice) params.set("max_price", maxPrice)
    const qs = params.toString()
    const locationSlug = city ? `colombia/${city.toLowerCase().replace(/\s+/g, "-")}` : "colombia"
    router.push(`/${lang}/${locationSlug}${qs ? `?${qs}` : ""}`)
  }

  return (
    <section className="relative w-full min-h-screen pt-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=85"
          alt="Hero property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 min-h-[calc(100vh-64px)] flex items-center">
        <div className="flex items-center justify-between w-full gap-8">

          {/* Left: headline */}
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

          {/* Right: search card */}
          <div className="w-full max-w-85 bg-white rounded-2xl shadow-2xl overflow-hidden shrink-0">
            <div className="p-6 pb-0">
              <h2 className="text-neutral-900 font-semibold text-[17px] leading-tight mb-5"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
                {t("hero.search_title")}<br />
                <span className="text-neutral-900 font-bold">{t("hero.search_subtitle")}</span>
              </h2>
            </div>

            <div className="p-6 pt-4 flex flex-col gap-3">
              {/* Location */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">
                  {t("hero.location")}
                </label>
                <div className="flex items-center border border-neutral-200 rounded-xl px-3 h-11 gap-2 focus-within:border-orange-400 transition-colors">
                  <span className="text-orange-500">📍</span>
                  <input
                    className="flex-1 text-[13px] text-neutral-700 outline-none bg-transparent placeholder:text-neutral-400"
                    placeholder={t("hero.location_placeholder")}
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                  <span className="text-neutral-300 text-xs">▾</span>
                </div>
              </div>

              {/* Property type */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">
                  {t("hero.property_type")}
                </label>
                <div className="flex items-center border border-neutral-200 rounded-xl px-3 h-11 gap-2 focus-within:border-orange-400 transition-colors">
                  <span className="text-neutral-400">🏠</span>
                  <select
                    className="flex-1 text-[13px] text-neutral-700 outline-none bg-transparent"
                    value={propType}
                    onChange={e => setPropType(e.target.value)}
                  >
                    <option value="">{t("hero.property_placeholder")}</option>
                    {propertyTypes.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Beds / Baths / Size */}
              <div className="flex items-center gap-2 border border-neutral-200 rounded-xl px-3 h-11">
                <IconBed className="size-4 text-neutral-400 shrink-0" />
                <input
                  className="w-12 text-[12px] text-neutral-700 outline-none bg-transparent placeholder:text-neutral-400"
                  placeholder={t("hero.beds")}
                  value={beds}
                  onChange={e => setBeds(e.target.value)}
                />
                <span className="text-neutral-200">|</span>
                <IconBath className="size-4 text-neutral-400 shrink-0" />
                <input
                  className="w-16 text-[12px] text-neutral-700 outline-none bg-transparent placeholder:text-neutral-400"
                  placeholder={t("hero.baths")}
                  value={baths}
                  onChange={e => setBaths(e.target.value)}
                />
                <span className="text-neutral-200">|</span>
                <IconRuler className="size-4 text-neutral-400 shrink-0" />
                <span className="text-[12px] text-neutral-400">m²</span>
              </div>

              {/* Max price */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">
                  {t("hero.max_price")}
                </label>
                <div className="flex items-center border border-neutral-200 rounded-xl px-3 h-11 gap-2 focus-within:border-orange-400 transition-colors">
                  <span className="text-neutral-400 text-sm">💲</span>
                  <input
                    className="flex-1 text-[13px] text-neutral-700 outline-none bg-transparent placeholder:text-neutral-400"
                    placeholder="590.00 max"
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Search button */}
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-12 text-[14px] mt-1 transition-all hover:shadow-lg hover:shadow-orange-200"
                onClick={handleSearch}
              >
                {t("hero.search_btn")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}