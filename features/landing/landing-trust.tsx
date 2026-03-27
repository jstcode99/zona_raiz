"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRoutes } from "@/i18n/client-router";
import { LandingStats, LandingAgent } from "@/domain/types/landing.types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface LandingTrustProps {
  stats: LandingStats;
  agentAvatars?: LandingAgent[];
}

// Hook para detectar cuando el elemento entra en el viewport
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// Hook para animar un número desde 0 hasta el valor final
function useCountUp(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [active, target, duration]);

  return value;
}

export function LandingTrust({ stats, agentAvatars = [] }: LandingTrustProps) {
  const { t } = useTranslation("landing");
  const routes = useRoutes();
  const { ref, inView } = useInView();
  const count = useCountUp(stats.totalListings ?? 0, inView);
  const displayAvatars = agentAvatars.slice(0, 3);

  console.log(displayAvatars);
  return (
    <section className="py-12" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Counter block */}
          <div
            className="shrink-0 transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="text-4xl leading-tight mb-4 font-bold">
              <span
                className="tabular-nums transition-all duration-300"
                style={{ opacity: inView ? 1 : 0 }}
              >
                {count}
              </span>
              +<br />
              <span className="text-primary">{t("trust.companies")}</span>
              <br />
              {t("trust.trust_us")}
            </p>

            {/* Avatars */}
            <div className="flex items-center gap-2">
              <div
                className={`flex ${!displayAvatars.length ? "hidden" : ""}`}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateX(0)" : "translateX(-12px)",
                  transition:
                    "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
                }}
              >
                {displayAvatars.map((agent, i) => (
                  <Image
                    key={agent.id}
                    src={
                      agent?.avatar_url ||
                      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=48&q=70"
                    }
                    className="size-8 rounded-full border-2 object-cover"
                    style={{
                      marginLeft: i > 0 ? "-8px" : 0,
                      opacity: inView ? 1 : 0,
                      transform: inView ? "scale(1)" : "scale(0.8)",
                      transition: `opacity 0.4s ease ${0.5 + i * 0.1}s, transform 0.4s ease ${0.5 + i * 0.1}s`,
                    }}
                    alt={agent?.full_name}
                    width={32}
                    height={32}
                  />
                ))}
              </div>
              <span
                className="ml-1 text-sm text-muted-foreground"
                style={{
                  opacity: inView ? 1 : 0,
                  transition: "opacity 0.6s ease 0.7s",
                }}
              >
                {t("trust.more")}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            className="hidden lg:block w-px bg-border shrink-0"
            style={{
              height: inView ? "80px" : "0px",
              transition: "height 0.6s ease 0.3s",
            }}
          />

          {/* Description block */}
          <div
            className="max-w-sm"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
            }}
          >
            <p className="leading-relaxed mb-4 text-muted-foreground">
              {t("trust.description")}
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={routes.search()}>
                {t("trust.cta")}
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
