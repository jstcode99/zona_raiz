"use client"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Lang } from "@/i18n/settings"

interface LandingCitiesProps { lang: Lang }

const cities = [
  { name: "Bogotá", slug: "colombia/cundinamarca/bogota", count: "1,240", img: "photo-1599940824399-b87987ceb72a" },
  { name: "Medellín", slug: "colombia/antioquia/medellin", count: "890", img: "photo-1586500036706-41963de24d8b" },
  { name: "Cartagena", slug: "colombia/bolivar/cartagena", count: "430", img: "photo-1558618666-fcd25c85cd64" },
  { name: "Cali", slug: "colombia/valle-del-cauca/cali", count: "610", img: "photo-1545324418-cc1a3fa10c00" },
]

export function LandingCities({ lang }: LandingCitiesProps) {
  const { t } = useTranslation("landing")
  const router = useRouter()

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-neutral-900"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 400 }}>
              {t("cities.title")}
            </h2>
            <p className="text-[13px] text-neutral-400 mt-1">{t("cities.subtitle")}</p>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-neutral-200 text-neutral-700 hover:bg-white text-[13px] font-semibold px-5 h-9"
            onClick={() => router.push(`/${lang}/colombia`)}
          >
            {t("cities.explore")} →
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cities.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => router.push(`/${lang}/${c.slug}`)}
            >
              <div className="w-36 h-36 rounded-full overflow-hidden border-[3px] border-white shadow-md group-hover:border-orange-400 group-hover:scale-105 transition-all duration-300 mb-3">
                <img
                  src={`https://images.unsplash.com/${c.img}?w=300&q=80`}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[15px] font-bold text-neutral-800">{c.name}</p>
              <p className="text-[12px] text-neutral-400">{c.count} {t("cities.listings")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}