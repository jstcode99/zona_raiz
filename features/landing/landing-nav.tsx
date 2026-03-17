"use client"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconLock, IconMenu2 } from "@tabler/icons-react"
import Link from "next/link"
import { Lang } from "@/i18n/settings"

interface LandingNavProps { lang: Lang }

export function LandingNav({ lang }: LandingNavProps) {
  const { t } = useTranslation("landing")
  const router = useRouter()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">ZR</span>
          </div>
          <span className="font-semibold text-neutral-900 text-[15px] tracking-tight">
            {t("nav.brand")}
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {["nav.home", "nav.listing", "nav.property", "nav.pages"].map((key, i) => (
            <Link href={''} key={key} className="text-[13px] font-medium text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-1">
              {t(key)}
              {i > 0 && <span className="text-neutral-400 text-[10px]">▾</span>}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
            <IconLock className="size-3.5" />
            {t("nav.login")}
          </button>
          <Button
            className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full text-[13px] font-semibold px-5 h-9 flex items-center gap-1.5"
            onClick={() => router.push(`/${lang}/colombia`)}
          >
            {t("nav.cta")}
            <span className="text-[11px]">↗</span>
          </Button>
          <button className="md:hidden p-2">
            <IconMenu2 className="size-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}