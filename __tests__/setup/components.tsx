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
    t: (key: string) => key,
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

// Mock @/components/ui/button
vi.mock("@/components/ui/button", () => ({
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

// Mock @/components/ui/card
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock @/components/ui/badge
vi.mock("@/components/ui/badge", () => ({
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
