"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardBottomNavProps {
  items: {
    title: string;
    url: string;
    icon?: IconName | string;
  }[];
}

export function DashboardBottomNav({ items }: DashboardBottomNavProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 ${isMobile ? "block" : "hidden"}`}
    >
      <div className="absolute inset-0  backdrop-blur-xl border-t border-border" />
      <div className="relative pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/" && pathname.startsWith(item.url));

            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px]",
                  "active:scale-95",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "relative p-2 rounded-xl transition-all duration-300",
                    isActive && "bg-primary/10",
                  )}
                >
                  {item.icon && (
                    <DynamicIcon
                      name={item.icon as IconName}
                      size={20}
                      className={cn(
                        "transition-all duration-300",
                        isActive && "scale-110",
                      )}
                    />
                  )}

                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </div>

                <span
                  className={cn(
                    "text-[10px] font-medium transition-all duration-200",
                    isActive ? "opacity-100" : "opacity-70",
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
