"use client"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { IconLock, IconMenu2, IconDashboard } from "@tabler/icons-react"
import { useRoutes } from "@/i18n/client-router"

interface LandingNavProps { 
  isLoggedIn: boolean
}

const navLinks = [
  { key: "nav.home", hrefKey: "home" },
  { key: "nav.listing", hrefKey: "listings" },
]

export function LandingNav({ isLoggedIn }: LandingNavProps) {
  const { t } = useTranslation("landing")
  const router = useRouter()
  const routes = useRoutes()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = (hrefKey: string) => {
    if (hrefKey === "listings") {
      router.push(routes.search())
    } else if (hrefKey === "home") {
      router.push(routes.home())
    }
  }

  const handleCtaClick = () => {
    router.push(routes.signup())
  }

  const loginPath = routes.signin()
  const dashboardPath = routes.dashboard()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={routes.home()} className="flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-[1.02]">
          <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">ZR</span>
          </div>
          <span className="font-semibold text-neutral-900 text-[15px] tracking-tight">
            {t("nav.brand")}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ key, hrefKey }) => (
            <button
              key={key}
              onClick={() => handleNavClick(hrefKey)}
              className="text-[13px] font-medium text-neutral-700 hover:text-neutral-900 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
            >
              {t(key)}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href={isLoggedIn ? dashboardPath : loginPath}
            className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-900 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
          >
            {isLoggedIn ? (
              <>
                <IconDashboard className="size-3.5" />
                {t("nav.dashboard")}
              </>
            ) : (
              <>
                <IconLock className="size-3.5" />
                {t("nav.login")}
              </>
            )}
          </Link>
          <Button
            className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full text-[13px] font-semibold px-5 h-9 flex items-center gap-1.5 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-neutral-900/20 cursor-pointer"
            onClick={handleCtaClick}
          >
            {t("nav.cta")}
            <span className="text-[11px]">↗</span>
          </Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
              <IconMenu2 className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                <Link href={routes.home()} className="flex items-center gap-2.5 cursor-pointer" onClick={() => setMobileOpen(false)}>
                  <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">ZR</span>
                  </div>
                  <span className="font-semibold text-neutral-900 text-[15px] tracking-tight">
                    {t("nav.brand")}
                  </span>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map(({ key, hrefKey }) => (
                  <button
                    key={key}
                    onClick={() => {
                      handleNavClick(hrefKey)
                      setMobileOpen(false)
                    }}
                    className="w-full text-left px-6 py-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-neutral-100 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-[13px] font-medium cursor-pointer"
                  onClick={() => {
                    router.push(isLoggedIn ? dashboardPath : loginPath)
                    setMobileOpen(false)
                  }}
                >
                  {isLoggedIn ? (
                    <>
                      <IconDashboard className="size-4 mr-2" />
                      {t("nav.dashboard")}
                    </>
                  ) : (
                    <>
                      <IconLock className="size-4 mr-2" />
                      {t("nav.login")}
                    </>
                  )}
                </Button>
                <Button
                  className="w-full bg-neutral-900 text-white hover:bg-neutral-800 text-[13px] font-semibold cursor-pointer"
                  onClick={() => {
                    handleCtaClick()
                    setMobileOpen(false)
                  }}
                >
                  {t("nav.cta")}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
