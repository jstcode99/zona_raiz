"use client"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Lang } from "@/i18n/settings"

interface LandingTrustProps { lang: Lang }

const logos = ["Grammarly", "Linear", "Coinbase", "Webflow", "Tinder", "Uber"]
const avatars = [
  "photo-1560250097-0b93528c311a",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1500648767791-00dcc994a43e",
]

export function LandingTrust({ lang }: LandingTrustProps) {
  const { t } = useTranslation("landing")
  const router = useRouter()

  return (
    <section className="border-b border-neutral-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left stat */}
          <div className="shrink-0">
            <p className="text-neutral-900 leading-tight mb-4"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 400 }}>
              {t("trust.count")}<br />
              <span className="text-orange-500">{t("trust.companies")}</span><br />
              {t("trust.trust_us")}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {avatars.map((id, i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/${id}?w=48&q=70`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    style={{ marginLeft: i > 0 ? "-8px" : 0 }}
                    alt=""
                  />
                ))}
              </div>
              <span className="text-[12px] text-neutral-500 ml-1">{t("trust.more")}</span>
            </div>
          </div>

          <div className="hidden lg:block w-px h-20 bg-neutral-200 shrink-0" />

          {/* Center description */}
          <div className="max-w-sm">
            <p className="text-[14px] text-neutral-500 leading-relaxed mb-4">
              {t("trust.description")}
            </p>
            <Button
              className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-6 h-9 text-[13px] font-semibold"
              onClick={() => router.push(`/${lang}/colombia`)}
            >
              {t("trust.cta")}
            </Button>
          </div>

          <div className="hidden lg:block w-px h-20 bg-neutral-200 shrink-0" />

          {/* Right logos */}
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              {t("trust.logos_label")} →
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {logos.map(l => (
                <span key={l} className="text-[14px] font-semibold text-neutral-300">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}