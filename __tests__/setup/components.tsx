import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Heart: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="heart-icon" />
  ),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Return Spanish translations for common keys
      const translations: Record<string, string> = {
        "sections.no_favorites": "No tienes favoritos",
        "sections.favorites": "Favoritos",
        "listings.sale": "Venta",
        "listings.rent": "Renta",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({
    lang: "es",
  }),
}));

// Mock i18n/client-router to return paths with language prefix
vi.mock("@/i18n/client-router", () => ({
  useRoutes: () => ({
    listings: () => "/es/listings",
    dashboard: () => "/es/dashboard",
  }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock @/app/components/ui/button
vi.mock("@/app/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock @/app/components/ui/card
vi.mock("@/app/components/ui/card", () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock @/app/components/ui/badge
vi.mock("@/app/components/ui/badge", () => ({
  Badge: ({ children, className, ...props }: any) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
}));

// Mock @/lib/utils (cn function)
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock application actions
vi.mock("@/application/actions/favorite.action", () => ({
  toggleFavoriteAction: vi.fn(),
}));
