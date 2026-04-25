import { describe, it, expect, vi, beforeEach } from "vitest";

// Track the redirectTo passed to signInWithOAuth
let capturedRedirectTo: string | undefined;

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({ get: vi.fn() })),
}));

vi.mock("@/shared/hooks/with-server-action", () => ({
  withServerAction: (fn: Function) => fn,
}));

vi.mock("@/infrastructure/shared/utils/lang", () => ({
  getLangServerSide: vi.fn(() => Promise.resolve("es")),
}));

vi.mock("@/i18n/router", () => ({
  createRouter: vi.fn(() => ({
    callback: () => "/auth/callback",
  })),
}));

vi.mock("@/application/modules/app.module", () => ({
  appModule: vi.fn(() =>
    Promise.resolve({
      authService: {
        signInWithOAuth: vi.fn((_provider: string, redirectTo: string) => {
          capturedRedirectTo = redirectTo;
          return Promise.resolve(redirectTo);
        }),
      },
      cookiesService: {
        setSession: vi.fn(),
      },
    }),
  ),
}));

vi.mock("@/infrastructure/config/constants", () => ({
  COOKIE_NAMES: {
    ROLE: "user_role",
    REAL_ESTATE: "real_estate_id",
    REAL_ESTATE_ROLE: "real_estate_role",
    IP_CLIENT: "ip_client",
    OAUTH_USER_TYPE: "oauth_user_type",
  },
}));

// Import after mocks
import { signInWithGoogleAction } from "@/application/actions/auth.actions";
import { EUserRole } from "@/domain/entities/profile.entity";

describe("GoogleAuth - signInWithGoogleAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedRedirectTo = undefined;
  });

  it("debe enviar role=real-estate al action cuando se selecciona Inmobiliaria", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("user_type", "real-estate");

    // Act
    const result = await signInWithGoogleAction(formData);

    // Assert - verificar que redirectUrl contiene el role
    expect(result.success).toBe(true);
    expect(capturedRedirectTo).toContain("role=real-estate");
  });

  it("debe enviar role=client al action cuando se selecciona Cliente", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("user_type", "client");

    // Act
    const result = await signInWithGoogleAction(formData);

    // Assert
    expect(result.success).toBe(true);
    expect(capturedRedirectTo).toContain("role=client");
  });

  it("debe usar role por defecto client cuando no se envía nada", async () => {
    // Arrange
    const formData = new FormData();
    // No append user_type

    // Act
    const result = await signInWithGoogleAction(formData);

    // Assert - no contiene role param
    expect(result.success).toBe(true);
    expect(capturedRedirectTo).not.toContain("role=");
  });
});

describe("GoogleAuth - EUserRole", () => {
  it("debe tener valores correctos para los roles", () => {
    expect(EUserRole.Client).toBe("client");
    expect(EUserRole.RealEstate).toBe("real-estate");
    expect(EUserRole.Admin).toBe("admin");
  });
});